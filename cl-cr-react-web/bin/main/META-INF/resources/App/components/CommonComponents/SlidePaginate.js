import React, { useState } from "react";

const SlidePaginate = ({ labelFor, startPage, endPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (buttonType) => {
    if (buttonType == "prev") {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    } else {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="pagination" aria-label={labelFor}>
      <ul>
        <li
          className={`nav-link prev ${startPage == currentPage ? "disabled" : ""}`}
        >
          <button
            type="button"
            aria-label="Previous Event Arrow"
            className="btn btn-unstyled"
            disabled={startPage == currentPage}
            onClick={() => handlePageChange("prev")}
          >
            <svg
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16 9H2M2 9L9 16M2 9L9 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </li>
        <li
          className="nav-link current-page body1"
          aria-label={`page ${currentPage}/${endPage}`}
        >
          {currentPage}/{endPage}
        </li>
        <li className={`nav-link next ${endPage == currentPage ? "disabled" : ""}`}>
          <button
            type="button"
            aria-label="Next Event Arrow"
            className="btn btn-unstyled"
            disabled={endPage == currentPage}
            onClick={() => handlePageChange("next")}
          >
            <svg
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 9H15M15 9L8 2M15 9L8 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SlidePaginate;
