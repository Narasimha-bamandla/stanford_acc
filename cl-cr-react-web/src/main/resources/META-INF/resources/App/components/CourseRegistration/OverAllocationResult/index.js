import React, { useState, useEffect, useCallback, useRef } from "react";
import OARBox from "../../CommonComponents/OARBox";
import SearchBar from "../../CommonComponents/SearchBar";
import { SortByList } from "../../CommonComponents/DropdownList";
import { POST } from "../../HttpServices/index";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";
import SelectCombobox from "../../CommonComponents/SelectCombobox";

const OverAllocationResult = () => {
  const [oarErrorMsg, setOARErrorMsg] = useState(false);
  const [oarEventData, setOAREventData] = useState([]);
  const [dropDownList, setDropDownList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState("");

  const sortbyitems = [
    {
      id: 1,
      name: "Year",
    },
    {
      id: 2,
      name: "Quarter",
    },
  ];

  const [sortByValue, setSortByValue] = useState("Year");

  const handleSearchValue = (value) => {
    setSearchValue(value);
    if (value?.length > 1) {
      setSearchData(value);
      debouncedFetchResults(value);
    } else {
      setSearchData("");
      debouncedFetchResults("");
    }
  };

  //  const handleSortCheckList = (item) => {
  //    Liferay?.Session?.extend();
  //    setSortByValue(item);
  //  };

  const handleSortCheckList = (selectedOption) => {
    Liferay?.Session?.extend();
    setSortByValue(selectedOption.name); // Update with the selected option's name
  };

  const getOARData = (data) => {
    var OARListData = data.oarSortedMap;
    const OARdata = Object.keys(OARListData).map((year, index) => ({
      id: index + 1,
      event: OARListData[year].sortParameter,
      links: OARListData[year].overallAllocationResponseList,
      showMore: false,
    }));
    setOAREventData(OARdata);
    if (data.oarSearchResponse) {
      setDropDownList(data.oarSearchResponse);
    } else {
      setDropDownList([]);
    }
  };

  const callOAR = async (value) => {
    try {
      var requestUrl = "/o/clcr/overall-allocation-results";
      var payload = {
        searchQuery: value,
        sortParameter: sortByValue,
      };
      var params = "";
      const result = await POST(requestUrl, params, payload);
      if (result.status === 200) {
        const data = await result.json();
        setOARErrorMsg(false);
        getOARData(data);
      } else {
        setOARErrorMsg(true);
      }
    } catch (error) {
      console.error("Error in callOAR:", error);
      setOARErrorMsg(true);
    }
  };

  const makeAPIRequest = async (value) => {
    await Promise.all([callOAR(value)]);
  };

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const debouncedFetchResults = useCallback(
    debounce(async (value) => {
      Liferay?.Session?.extend();
      setOAREventData(null);
      makeAPIRequest(value);
    }, 500),
    []
  );

  useEffect(() => {
    setOAREventData([]);
    setDropDownList([]);
    makeAPIRequest(searchData);
  }, [sortByValue]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h2>Overall Allocation Results</h2>
        </div>
      </div>
      <div className="row">
        <SearchBar
          handleSearchValue={handleSearchValue}
          searchValue={searchValue}
          dropDownList={dropDownList}
        />
        <div className="col-md-8">
          <SelectCombobox
            options={sortbyitems}
            label="Display by:"
            onSelect={handleSortCheckList}
            cssStyle="width: 180px, float: right"
            cssClass={"displayBy"}
          />
        </div>
      </div>
      <div style={{ minHeight: "400px", marginTop: "10px" }}>
        {oarEventData?.length > 0 && (
          <>
            <OARBox oarEventData={oarEventData} searchData={searchData} />
          </>
        )}
        {oarErrorMsg && (
          <>
            <NoDataFound />
          </>
        )}
      </div>
    </>
  );
};

export default OverAllocationResult;
