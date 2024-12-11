import React, { useEffect, useRef } from "react";

export default function SwitchEventDeleteModal({
  open,
  submitSelectedItem,
  actionsDisable,
  onHandleClose,
  onHandleDelete,
  deleteCourse = "",
}) {
  const modalRef = useRef(null); // Ref for the modal container
  const lastFocusedElement = useRef(null); // Keep track of the last focused element before modal opens

  useEffect(() => {
    if (open) {
      // Save the last focused element before modal opens
      lastFocusedElement.current = document.activeElement;

      // Remove aria-hidden from the modal
      if (modalRef.current) {
        modalRef.current.removeAttribute("aria-hidden");
      }

      // Apply aria-hidden="true" to the entire body except the modal
      const body = document.body;
      body.setAttribute("aria-hidden", "true");

      // Disable body scrolling
      body.style.overflow = "hidden";

      // Focus the modal
      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      // Add event listeners for focus trapping and Escape key
      document.addEventListener("keydown", handleKeyDown);
    } else {
      // Restore aria-hidden and scrolling
      const body = document.body;
      body.removeAttribute("aria-hidden");
      body.style.overflow = "";

      // Restore focus to the last focused element when modal closes
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
      // Remove event listeners
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      // Cleanup
      const body = document.body;
      body.removeAttribute("aria-hidden");
      body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Get all focusable elements inside the modal
  const getFocusableElements = (element) =>
    element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
  // Handle keyboard interactions
  const handleKeyDown = (event) => {
    const focusableElements = getFocusableElements(modalRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    } else if (event.key === "Escape") {
      onHandleClose(); // Close modal on Escape key
    }
  };

  if (!open) return null;

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
              aria-labelledby="DeleteErrorMsgTitle"
              aria-describedby="DeleteErrorMsgDescription"
              aria-modal="true"
              role="dialog"
              ref={modalRef}
            >
              <div className="modal-content">
                <div className="modal-body">
                  <div>
                    <h2 id="DeleteErrorMsgTitle" style={{ fontSize: "18px" }}>
                      Are you sure you want to cancel your request ?
                    </h2>
                    <p
                      id="DeleteErrorMsgDescription"
                      style={{ lineHeight: "18px", wordSpacing: "5px" }}
                    >
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
                        className="sdfd-btn btn secondary-btn"
                        type="button"
                        tabindex="0"
                        onClick={() => onHandleClose("")}
                        style={{ marginRight: "10px" }}
                        disabled={actionsDisable}
                      >
                        No, Keep Request
                      </button>
                      <button
                        className="sdfd-btn btn primary-btn"
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
