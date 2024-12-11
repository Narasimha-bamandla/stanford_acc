import React, { useState, useEffect } from "react";
import OARSectionComponent from "./OARSectionComponent";
import { SortByList } from "../../CommonComponents/DropdownList";
import { useLocation } from "react-router-dom";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";
import NotificationAlert from "../../CommonComponents/NotificationAlert";
import SelectCombobox from "../../CommonComponents/SelectCombobox";
import { GET } from "../../HttpServices/index";

const ViewOARPage = ({ adminMessages }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [oarData, setOarData] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const eventType = searchParams.get("type");
  const eventId = searchParams.get("id");
  const eventName = searchParams.get("event");
  const [enableQuarterInSort, setEnableQuarterInSort] = useState("false");

  const sortbyitems = [
    {
      id: 1,
      name: "Round Closed",
    },
    {
      id: 2,
      name: "Open Seats",
    },
    {
      id: 3,
      name: "Quarter",
    },
    {
      id: 4,
      name: "Course",
    },
    {
      id: 5,
      name: "Core/Distribution Area",
    },
  ];

  const [sortByValue, setSortByValue] = useState("Round Closed");

  const sortMapping = {
    "Round Closed": "roundClosed",
    "Open Seats": "openSeats",
    Quarter: "quarter",
    Course: "course",
    "Core/Distribution Area": "Core/DistributionArea",
  };

  function filterSortByItems(sortbyitems, eventType, enableQuarterInSort) {
    let filteredItems = sortbyitems;

    if (!enableQuarterInSort) {
      filteredItems = filteredItems.filter((item) => item.name !== "Quarter");
    }
    if (eventType === "Core") {
      return filteredItems.filter((item) => item.name !== "Course");
    } else if (eventType === "Elective") {
      return filteredItems.filter(
        (item) => item.name !== "Core/Distribution Area"
      );
    } else {
      return filteredItems;
    }
  }

  //  const handleSortCheckList = (item) => {
  //    Liferay?.Session?.extend();
  //    setSortByValue(item);
  //  };

  const handleSortCheckList = (selectedOption) => {
    Liferay?.Session?.extend();
    setSortByValue(selectedOption.name); // Update with the selected option's name
  };
  const callOAREvents = async () => {
    try {
      const sortData = sortMapping[sortByValue];

      const params = `&eventid=${eventId}&sort=${sortData}`;

      var requestUrl = `/o/clcr/overall-allocation-results/details`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        setOarData(data);
        setIsLoading(false);
        setEnableQuarterInSort(data.enableQuarterInSort);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const makeAPIRequest = async () => {
    await Promise.all([callOAREvents()]);
  };

  useEffect(() => {
    setIsLoading(true);
    setOarData([]);
    makeAPIRequest();
  }, [sortByValue]);

  return (
    <div className="course_registration   container-fluid">
      <div className="cr_info-banner">
        <section className="info-banner-area">
          <div className="row">
            <div className="col-md-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a
                      className="breadcrumb-text-truncate"
                      href={
                        window.doAsUserId
                          ? window.location.pathname +
                            "?doAsUserId=" +
                            window.doAsUserId
                          : window.location.pathname
                      }
                    >
                      Course Registration
                    </a>
                  </li>
                  <li className="active breadcrumb-item">
                    <span className="breadcrumb-text-truncate" title="Active">
                      Allocation Results for {eventName}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ fontSize: "24px" }}>
              Hi {userName}, You are viewing allocation results for {eventName}
            </h2>
          </div>
        </div>
        <div className="row">
          <div
            style={{
              width: "1220px",
              marginLeft: "12px",
            }}
          >
            <NotificationAlert
              content={
                adminMessages?.OARInstructionUserMsg
                  ? adminMessages?.OARInstructionUserMsg
                  : ``
              }
            />
          </div>
        </div>
      </div>

      <>
        <section className="cr_sort-option">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="font16">
                (Showing {oarData?.allocations?.length} Results)
              </div>
            </div>
            <div className="col-md-6">
              <SelectCombobox
                options={filterSortByItems(
                  sortbyitems,
                  eventType,
                  enableQuarterInSort
                )}
                label="Sort by:"
                onSelect={handleSortCheckList}
                cssStyle="width: 240px, float: right"
                cssClass={"sortBy"}
              />
            </div>
          </div>
        </section>
        <div className="row">
          {isLoading ? (
            <OvalLoader />
          ) : oarData?.allocations?.length > 0 ? (
            <div
              className="col-md-12"
              role="list"
              id="OARInfo"
              aria-live="polite"
            >
              <OARSectionComponent OarData={oarData} urlId={eventType} />
            </div>
          ) : (
            <NoDataFound />
          )}
        </div>
      </>
    </div>
  );
};

export default ViewOARPage;
