import React, { useEffect, useState } from "react";
import InfoBanner from "../../CommonComponents/InfoBanner";
import ViewPARCard from "./ViewPARCard/index";
import { SortByList } from "../../CommonComponents/DropdownList";
import { GET } from "../../HttpServices/index";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";
import SelectCombobox from "../../CommonComponents/SelectCombobox";
import { useLocation } from "react-router-dom";

const ViewPersonalAllocationResults = ({ adminMessages }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewPARError, setViewPARError] = useState(false);
  const [viewPAREvents, setViewPAREvents] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get("id");
  const eventName = searchParams.get("event");

  const sortbyitems = [
    {
      id: 1,
      name: "Enrollments/Waitlists Only",
    },
    {
      id: 2,
      name: "All Preferences",
    },
  ];

  const [sortByValue, setSortByValue] = useState(
    sortbyitems.find((item) => item.id === 1)?.name ?? undefined
  );

  //  const handleSortCheckList = (item) => {
  //    Liferay?.Session?.extend();
  //    setSortByValue(item);
  //  };
  const handleSortCheckList = (selectedOption) => {
    Liferay?.Session?.extend();
    setSortByValue(selectedOption.name); // Update with the selected option's name
  };
  const callViewPersonalAllocationResult = async () => {
    setIsLoading(true);
    setViewPARError(false);
    try {
      var requestUrl = "/o/clcr/personal-allocation-results/details";
      const result = await GET(
        requestUrl,
        `&eventId=${eventId}&sort=${
          sortByValue == "Enrollments/Waitlists Only" ? "enrolled" : sortByValue
        }`
      );
      if (result.status === 200) {
        const data = await result.json();
        setViewPAREvents(data);
        if (
          data?.allocations?.length == 0 ||
          data?.allocations?.length == undefined ||
          data?.allocations == null
        ) {
          setViewPARError(true);
        } else {
          setViewPARError(false);
        }
      } else {
        setViewPARError(true);
      }
    } catch (error) {
      setViewPARError(true);
    }
  };

  const makeAPIRequest = async () => {
    await Promise.all([callViewPersonalAllocationResult()]);
    setIsLoading(false);
  };

  useEffect(() => {
    makeAPIRequest();
  }, [sortByValue]);

  return (
    <div className="course_registration   container-fluid">
      <InfoBanner
        type={viewPAREvents?.event_type?.includes("MF") ? "Core" : "Elective"}
        data={viewPAREvents}
        eventName={eventName}
        adminMessages={adminMessages}
      />
      <section className="cr_sort-option align-self-end">
        <div className="row">
          <div className="col-md-12">
            <SelectCombobox
              options={sortbyitems}
              label="Sort by:"
              onSelect={handleSortCheckList}
              cssStyle="width: 210px, float: right"
              cssClass={"nolabel"}
            />
          </div>
        </div>
      </section>
      {isLoading && !viewPARError && <OvalLoader />}
      {viewPARError && !isLoading && (
        <NoDataFound message={viewPAREvents?.status} />
      )}
      {!isLoading && !viewPARError && (
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div
                className="col-md-12"
                role="list"
                id="PARInfo"
                aria-live="polite"
              >
                {viewPAREvents?.allocations?.map((VPARData, VPARDataIndex) => (
                  <ViewPARCard
                    data={VPARData}
                    type={
                      viewPAREvents?.event_type?.includes("MF")
                        ? "Core"
                        : "Elective"
                    }
                    key={VPARDataIndex}
                    hideQuarter={viewPAREvents.hideQuarter}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPersonalAllocationResults;
