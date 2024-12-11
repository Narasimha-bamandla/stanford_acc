import React from "react";

export default function SwitchEventDeleteModal({
  open,
  submitSelectedItem,
  actionsDisable,
  onHandleClose,
  onHandleDelete,
  deleteCourse = "",
}) {
  return (
    <>
      {open && (
        <div>
          <div
            aria-hidden="true"
            className={`modal-backdrop fade ${open ? "show" : ""}`}
            data-suppressed="true"
            inert="true"
            tabIndex={"-1"}
          ></div>
          <div
            className={`fade modal d-block success-message-modal ${
              open ? "show" : ""
            }`}
          >
            <div
              className="modal-dialog modal modal-info modal-dialog-centered"
              style={{ width: "431px", height: "220px" }}
            >
              <div
                aria-label="Course Details Wishlist Import Message Popup"
                aria-labelledby="DeleteErrorMsg"
                aria-modal="true"
                className="modal-content"
                role="dialog"
                tabIndex={"-1"}
              >
                <div className="modal-body">
                  <div>
                    <h2 id="SwitchEventDeleteModal" style={{ fontSize: "18px" }}>
                      <b>Are you sure you want to cancel your request ?</b>
                    </h2>
                    <p style={{ lineHeight: "18px", wordSpacing: "5px" }}>
                      Canceling your request will stop any ongoing processes for
                      course {deleteCourse} and cannot be undone. If you’re sure
                      you want to proceed, please confirm below..
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        className="btn btn-secondary"
                        type="button"
                        tabindex="0"
                        onClick={() => onHandleClose("")}
                        style={{ marginRight: "10px" }}
                        disabled={actionsDisable}
                      >
                        No, Keep Request
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        tabindex="0"
                        onClick={onHandleDelete}
                        disabled={actionsDisable}
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
      )}
    </>
  );
}
