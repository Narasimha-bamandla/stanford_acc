import React from "react";

export default function VLSErrorMsg({ handleConflictClose }) {
  return (
    <div>
      <div className="cr-course-conflict">
        <div
          aria-hidden="true"
          className="modal-backdrop fade show"
          data-suppressed="true"
          inert="true"
          tabIndex={-1}
        >
          &nbsp;
        </div>
        <div
          aria-labelledby="courseConflictModalLabel"
          className="fade modal modal_popup  show"
          id="courseConflictModal"
          role="dialog"
          tabIndex={-1}
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-body border-0">
                <div className="container-fluid">
                  <div className="row justify-content-between">
                    <div className="col-auto"></div>
                    <div className="col-auto p-0">
                      <button
                        onClick={handleConflictClose}
                        aria-label="Close"
                        className="btn-flex textbook-btn btn-unstyled"
                        tabIndex={0}
                      >
                        Close
                        <svg
                          fill="none"
                          height={24}
                          viewBox="0 0 24 24"
                          width={24}
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="#43423E"
                            strokeLinecap="square"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      <div className="d-flex flex-column c-gap-4  mt-3 mb-3 justify-content-center">
                        <h4 className="text-center">
                          {" "}
                          “You have made changes to your Preference Ranking
                          since you last submitted.”
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
