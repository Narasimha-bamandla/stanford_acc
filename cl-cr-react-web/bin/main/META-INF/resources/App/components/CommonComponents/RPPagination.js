import React, { useEffect, useState } from "react";
import ClayButton from "@clayui/button";
import ClayLayout from "@clayui/layout";

const RPPagination = ({ totalPages, pageNumber, handlePageNumber }) => {
  const [paginationActiveIndex, setPaginationActiveIndex] = useState(1);

  const handleClick = (index) => {
    setPaginationActiveIndex(index);
    handlePageNumber(index);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    let startPage = 1;
    if (paginationActiveIndex > 4 && totalPages > 5) {
      startPage = paginationActiveIndex - 1;
      buttons.push(
        <li>
          <ClayButton
            key={1}
            className="customButton"
            aria-label={"Page 1"}
            onClick={() => handleClick(1)}
          >
            1
          </ClayButton>
        </li>
      );
      buttons.push(<ClayButton className={"customButton"}>...</ClayButton>);
    } else {
      startPage = 1;
    }
    for (let i = startPage; i <= totalPages && buttons.length < 5; i++) {
      buttons.push(
        <li>
          <ClayButton
            key={i}
            className={
              paginationActiveIndex === i ? "activeButton" : "customButton"
            }
            aria-label={"Page " + i}
            aria-current={paginationActiveIndex === i ? "page" : ""}
            onClick={() => handleClick(i)}
          >
            {i}
          </ClayButton>
        </li>
      );
    }
    if (totalPages > 5 && paginationActiveIndex < totalPages - 2) {
      buttons.push(<ClayButton className={"customButton"}>...</ClayButton>);
      buttons.push(
        <li>
          <ClayButton
            key={totalPages}
            className="customButton"
            aria-label={"Total Pages" + totalPages}
            onClick={() => handleClick(totalPages)}
          >
            {totalPages}
          </ClayButton>
        </li>
      );
    } else if (totalPages > 5 && totalPages - paginationActiveIndex === 2) {
      buttons.push(
        <li>
          <ClayButton
            key={totalPages}
            className="customButton"
            aria-label={"Total Pages" + totalPages}
            onClick={() => handleClick(totalPages)}
          >
            {totalPages}
          </ClayButton>
        </li>
      );
    }
    return buttons;
  };

  useEffect(() => {
    setPaginationActiveIndex(pageNumber);
  }, [pageNumber]);

  return (
    <div>
      {totalPages > 1 && (
        <ClayLayout.Row style={{ paddingTop: "15px" }}>
          <ClayLayout.Col size={12}>
            <nav aria-label="Pagination Navigation">
              <ul className="pagination Pagination">
                <li>
                  <ClayButton
                    style={{
                      marginRight: "10px",
                      backgroundColor: "white",
                      color: "black",
                    }}
                    className="customButton"
                    aria-label={"previous page"}
                    disabled={paginationActiveIndex === 1}
                    onClick={() => handleClick(paginationActiveIndex - 1)}
                  >
                    <svg
                      width="9"
                      height="12"
                      viewBox="0 0 9 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M0.744812 6.33728L6.71121 11.8403L8.25781 10.4135L3.83802 6.33728L8.25781 2.26102L6.71121 0.834227L0.744812 6.33728Z"
                        fill="currentColor"
                      />
                    </svg>
                  </ClayButton>
                </li>
                {renderPaginationButtons()}
                <li>
                  {" "}
                  <ClayButton
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "white !important",
                      color: "black",
                    }}
                    aria-label="next page"
                    className="customButton"
                    disabled={paginationActiveIndex === totalPages}
                    onClick={() => handleClick(paginationActiveIndex + 1)}
                  >
                    <svg
                      width="9"
                      height="12"
                      viewBox="0 0 9 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M8.25519 6.33728L2.28879 11.8403L0.742187 10.4135L5.16198 6.33728L0.742187 2.26102L2.28879 0.834227L8.25519 6.33728Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </ClayButton>
                </li>
              </ul>
            </nav>
          </ClayLayout.Col>
        </ClayLayout.Row>
      )}
    </div>
  );
};

export default RPPagination;
