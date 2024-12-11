import React from "react";

export default function SEFlyoutBanner({
  onOpenChange,
  ViewYourRequestData = null,
  reSetState,
}) {
  return (
    <div className="container-fluid">
      <div className="row justify-content-between mb-5">
        <div className="col-10">
          <h3>
            {`Hi ${userName}, you are viewing a list of your switch requests for
            ${ViewYourRequestData?.eventName}`}
            .
          </h3>
        </div>
        <div className="col-auto">
          <button
            aria-label="Close"
            className="btn-flex textbook-btn btn-unstyled"
            tabIndex={0}
            onClick={() => {
              onOpenChange(false);
              reSetState();
            }}
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
    </div>
  );
}
