import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OARBox = ({ oarEventData, searchData }) => {
  const [oarEventListData, setOAREventListData] = useState(oarEventData);

  const handleShowMore = (id) => {
    setOAREventListData((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, showMore: !item.showMore } : item
      )
    );
  };

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const highlightWord = (text, word) => {
    const escapedWord = escapeRegExp(word);
    const regex = new RegExp(`(${escapedWord})`, "gi");
    return String(text)
      .split(regex)
      .map((part, index) =>
        regex.test(part) ? (
          <span key={index} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        ) : (
          part
        )
      );
  };

  const highlightNameAndSearchValue = (text) => {
    let highlightedText = text;
    highlightedText = highlightWord(highlightedText, searchData);
    return highlightedText;
  };

  return (
    <div
      className="row"
      id="oarSearchResultsContainer"
      role="region"
      aria-live="polite"
    >
      {oarEventListData &&
        oarEventListData?.map((data, index) => (
          <div className="col-md-4" key={index}>
            <section
              aria-label={`Overall Allocation ${data.event} Results List`}
              className="cr_home_overall_allocation_results_cards cr_home_card"
            >
              <div className="content-head">
                <h3>{data.event}</h3>
              </div>
              <div className="content-body">
                <ul className="eventItemList">
                  {data.links
                    .slice(0, data.showMore ? data.links.length : 8)
                    .map((link, key) => (
                      <li key={key}>
                        <Link
                          to={{
                            pathname: "/overall-allocation-results",
                            search: `?type=${link.type}&id=${link.event_id}&event=${link.event_name}`,
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {searchData.length > 0 ? (
                            <>{highlightNameAndSearchValue(link.event_name)}</>
                          ) : (
                            <>{link.event_name}</>
                          )}
                        </Link>
                      </li>
                    ))}
                </ul>
                {data.links.length > 8 && (
                  <button
                    className="sdfd-btn md-btn ghost-btn eventItemListToggleBtn"
                    onClick={() => handleShowMore(data.id)}
                  >
                    {data.showMore
                      ? "Show less"
                      : `+ ${data.links.length - 8} more`}
                  </button>
                )}
              </div>
            </section>
          </div>
        ))}
    </div>
  );
};

export default OARBox;
