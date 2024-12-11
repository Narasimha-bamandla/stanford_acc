import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchBar = ({ handleSearchValue, searchValue, dropDownList }) => {
  const [searchDropDownVisible, setSearchDropDownVisible] = useState(false);

  const handleSearchChange = (e) => {
    handleSearchValue(e.target.value);
    if (e.target.value.length > 0) {
      setSearchDropDownVisible(true);
    } else {
      setSearchDropDownVisible(false);
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".cr_home_oar_search")) {
      setSearchDropDownVisible(false);
    }
  };

  const handleClickEnter = (event) => {
    if (event?.key === "Enter" || event.keyCode === 13) {
      setSearchDropDownVisible(false);
    }
  };

  const handleClickIcon = (event) => {
    setSearchDropDownVisible(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="col-md-4">
      <section className="cr_home_oar_search" role="search">
        <div className="search-input">
          <input
            className="form-control sdtd-input"
            type="text"
            id="oarSearch"
            aria-controls="oarSearchResultsStatus"
            autoComplete="off"
            placeholder="Search Course, Title, Instructor or Keyword"
            aria-label="Search Course, Title, Instructor or Keyword"
            onChange={handleSearchChange}
            value={searchValue}
            onKeyDown={handleClickEnter}
          />
          <button
            type="button"
            id="oarSearchBtn"
            title="Search"
            className="sdfd-btn sm-btn ghost-btn i-btn"
            onClick={handleClickIcon}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={13}
              height={12}
              viewBox="0 0 13 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12.2708 10.6723L9.9824 8.38356C10.6272 7.51106 11.0191 6.43625 11.0191 5.26027C11.0191 2.35195 8.65486 0 5.75957 0C2.85163 0 0.5 2.36459 0.5 5.26027C0.5 8.1686 2.86428 10.5205 5.75957 10.5205C6.92274 10.5205 8.01006 10.1286 8.88244 9.48367L11.1709 11.7724C11.3226 11.9241 11.5249 12 11.7272 12C11.9295 12 12.1317 11.9241 12.2835 11.7724C12.5743 11.4816 12.5743 10.9758 12.2708 10.6723ZM2.05511 5.26027C2.05511 3.22445 3.71137 1.56797 5.74693 1.56797C7.78248 1.56797 9.43874 3.22445 9.43874 5.26027C9.43874 7.2961 7.78248 8.95258 5.74693 8.95258C3.71137 8.96523 2.05511 7.30875 2.05511 5.26027Z"
                fill="#585754"
              ></path>
            </svg>
          </button>
        </div>
        <div
          aria-live="polite"
          style={{ position: "absolute", left: "-9999px" }}
          id="oarSearchResultsStatus"
        >
          {dropDownList?.length === 0
            ? "No matched data"
            : `${dropDownList?.length} search results available below `}
        </div>
        {searchDropDownVisible && dropDownList.length > 0 && (
          <div
            className="search-results-popup"
            style={{
              display: "block",
              maxHeight: "17vh",
              overflowY: "auto",
              width: "320px",
            }}
          >
            <ul id="results-list" style={{ backgroundColor: "#f2f2f2" }}>
              {dropDownList.map((list, index) => (
                <li key={index}>
                  <Link
                    to={{
                      pathname: "/overall-allocation-results",
                      search: `?type=${list.type}&id=${list.event_id}&event=${list.event_name}`,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {list.event_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};
export default SearchBar;
