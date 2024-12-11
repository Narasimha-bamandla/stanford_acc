import React, { useEffect, useState } from "react";
import ClayButton from "@clayui/button";
import ClayModal from "@clayui/modal";

const Modal = ({ onOpenChange, open, message, onHandleClosePopup }) => {
  const [isModalFocused, setIsModalFocused] = useState(false);

  const onHandleClose = () => {
    onOpenChange(false);
    onHandleClosePopup();
  };

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
            <div className="modal-dialog modal-lg modal-info modal-dialog-centered">
              <div
                aria-label="Course Details Wishlist Import Message Popup"
                aria-labelledby="clay-modal-label-1"
                aria-modal="true"
                className="modal-content"
                role="dialog"
                tabIndex={isModalFocused ? "0" : "-1"}
              >
                <div className="modal-body">
                  <div>{message}</div>
                </div>
                <div className="modal-footer">
                  <div className="modal-item-last">
                    <button
                      className="btn btn-primary"
                      type="button"
                      tabindex="0"
                      onClick={onHandleClose}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
