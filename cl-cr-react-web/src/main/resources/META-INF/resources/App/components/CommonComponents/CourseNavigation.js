import React from "react";

export default function CourseNavigation({ message, onContinue, onCancel }) {
  return (
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
          <div
            className="modal-content"
            style={{ overflow: "auto", maxHeight: "350px" }}
          >
            <div className="modal-body border-0">
              <div className="container-fluid">
                <div className="row justify-content-between">
                  <div className="col-auto"></div>
                </div>
                <div className="row justify-content-between">
                  <div className="col-12">
                    <div className="d-flex flex-column c-gap-4  mt-3 mb-3 justify-content-center">
                      <h4 className="text-center" style={{ fontSize: "14px" }}>
                        {message}
                      </h4>

                      <div className="btn-group justify-content-center">
                        <div className="btn-group-item">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={onContinue}
                          >
                            Continue
                          </button>
                        </div>
                        <div className="btn-group-item">
                          <button
                            className="sdfd-btn btn secondary-btn"
                            type="button"
                            onClick={onCancel}
                          >
                            Cancel
                          </button>
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
    </div>
  );
}
