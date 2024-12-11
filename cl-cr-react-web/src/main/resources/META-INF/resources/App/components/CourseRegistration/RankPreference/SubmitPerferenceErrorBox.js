import React from "react";

export default function SubmitPerferenceErrorBox({
  msg,
  handleSPErrorBoxChange,
}) {
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
          <div className="modal-content">
            <div className="modal-body border-0">
              <div className="container-fluid">
                <div className="row justify-content-between"></div>
                <div className="row justify-content-between">
                  <div className="col-12">
                    <div className="d-flex flex-column c-gap-4  mt-3 mb-3 justify-content-center">
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: "normal",
                          textAlign: "center",
                        }}
                      >
                        {msg}
                      </h4>

                      <div className="btn-group justify-content-center">
                        <div className="btn-group-item">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleSPErrorBoxChange}
                          >
                            OK
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
