import React from "react";

export default function DeleteErrorMsg({ handleKeep, handleDelete }) {
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
        aria-labelledby="DeleteErrorMsg"
        className="fade modal modal_popup  show"
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
                      <h2 id="DeleteErrorMsg" style={{ fontSize: "25px" }}>
                        Are you sure you want to delete your request ?
                      </h2>

                      <p
                        style={{
                          fontSize: "17px",
                          lineHeight: "21px",
                          wordSpacing: "5px",
                          marginBottom: "0px",
                        }}
                      >
                        {" "}
                        Deleting your request will remove it from the system
                        entirely and cannot be undone. Your current enrollment
                        will remain the same. If you are sure you want to
                        proceed, please confirm below with the buttons.
                      </p>

                      <div className="btn-group justify-content-center">
                        <div className="btn-group-item">
                          <button
                            className="sdfd-btn btn secondary-btn"
                            type="button"
                            onClick={handleKeep}
                            style={{
                              paddingLeft: "3.9375rem",
                              paddingRight: "2.9375rem",
                            }}
                          >
                            No, Keep Request
                          </button>
                        </div>
                        <div className="btn-group-item">
                          <button
                            className="sdfd-btn btn primary-btn"
                            type="button"
                            onClick={handleDelete}
                          >
                            Yes, Delete Request
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
