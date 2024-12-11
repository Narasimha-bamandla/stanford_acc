import React, { useState } from "react";
import NotificationAlert from "../../../CommonComponents/NotificationAlert";

const VLSBanner = ({
  handleCloseModal,
  data,
  enableViewFlyOutSubmittMsg,
  adminMessages,
}) => {
  const [copyStatus, setCopyStatus] = useState(false);

  return (
    <div className="container-fluid">
      <div className="row justify-content-between" style={{}}>
        <div className="col-10">
          <div className="d-flex flex-column c-gap-3 mb-3">
            <h2 className="h3">
              {enableViewFlyOutSubmittMsg
                ? `Your Course Preferences were successfully submitted for ${data.event_name}. You will receive an email confirmation shortly.`
                : `Hello ${userName}, you are viewing your last submission for ${data.event_name}.`}
            </h2>
            <div style={{ width: "900px" }}>
              <NotificationAlert
                content={
                  enableViewFlyOutSubmittMsg
                    ? adminMessages?.submissionConfirmationUserMsg
                      ? adminMessages?.submissionConfirmationUserMsg
                      : ``
                    : adminMessages?.viewLastSubUserMsg
                    ? adminMessages?.viewLastSubUserMsg
                    : ``
                }
              />
            </div>
            {data?.conflictMsg && (
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  textAlign: "center",
                  color: "rgb(187, 38, 37)",
                }}
              >
                You have made changes to your preferences since the last submission.
              </h3>
            )}
          </div>
        </div>
        <div className="col-auto" style={{ marginRight: 10 }}>
          <button
            aria-label="Close"
            className="btn-flex textbook-btn btn-unstyled"
            tabIndex={0}
            onClick={handleCloseModal}
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
      <div className="row justify-content-between" style={{}}>
        <div className="col-12">
          <div className="d-flex flex-column c-gap-3 mb-3">
            <hr className="hline" />
          </div>
        </div>
      </div>
      <div className="row justify-content-between" style={{}}>
        <div className="col-12">
          <div className="d-flex flex-column c-gap-3 mb-3">
            <section className="submission-confirmation-area">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex   c-gap-3 ">
                    <div className="h4">Submission Confirmation Number:</div>
                    <div className="h2"style={{ position: "relative", bottom: "3px" }}>
                      {data.confirmation_code}
                      <button
                        aria-label="Copy Submission Confirmation Number"
                        className="btn btn-unstyled"
                        type="button"
                        onClick={() => {
                          setCopyStatus(true);
                          setTimeout(() => setCopyStatus(false), 2000);
                          navigator.clipboard.writeText(data.confirmation_code);
                        }}
                        title={
                          copyStatus
                            ? "Text copied to clipboard!"
                            : "Click here to copy the text"
                        }
                      >
                        <svg
                          fill="none"
                          height={20}
                          viewBox="0 0 21 20"
                          width={21}
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M7.56206 0C6.58662 0 5.73342 0.569491 5.31666 1.39039C5.05569 1.83037 5.20912 2.39833 5.65582 2.64761C6.09345 2.89174 6.64627 2.73645 6.89173 2.29957C6.97612 2.01012 7.23477 1.81568 7.56206 1.81568H17.9847C18.3871 1.81568 18.6825 2.1111 18.6825 2.51354V12.9397C18.6825 13.255 18.5009 13.5025 18.2288 13.5958C17.792 13.8413 17.6367 14.395 17.8808 14.8326C18.1301 15.2793 18.698 15.4328 19.138 15.1718C19.9449 14.751 20.5018 13.904 20.5018 12.9397V2.51354C20.5018 1.13519 19.363 0 17.9847 0H7.56206ZM3.01709 4.54763C1.63875 4.54763 0.5 5.68194 0.5 7.06029V17.4865C0.5 18.8648 1.63875 20 3.01709 20H13.4397C14.8181 20 15.9568 18.8648 15.9568 17.4865V7.06029C15.9568 5.68194 14.8181 4.54763 13.4397 4.54763H3.01709ZM3.01709 6.36243H13.4397C13.8422 6.36243 14.1376 6.65785 14.1376 7.06029V17.4865C14.1376 17.8889 13.8422 18.1852 13.4397 18.1852H3.01709C2.61466 18.1852 2.31923 17.8889 2.31923 17.4865V7.06029C2.31923 6.65785 2.61466 6.36243 3.01709 6.36243V6.36243Z"
                            fill="#585754"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="font12">
                    Submitted on {data.submittedDate}{" "}
                    <span style={{ paddingLeft: "30px" }}>
                      {" "}
                      <svg
                        fill="none"
                        height={10}
                        viewBox="0 0 10 10"
                        width={10}
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 0C2.243 0 0 2.243 0 5C0 7.757 2.243 10 5 10C7.757 10 10 7.757 10 5C10 2.243 7.757 0 5 0ZM5 9C2.7945 9 1 7.2055 1 5C1 2.7945 2.7945 1 5 1C7.2055 1 9 2.7945 9 5C9 7.2055 7.2055 9 5 9Z"
                          fill="#585754"
                        />
                        <path
                          d="M5.49609 2.5H4.49609V5.5H7.49609V4.5H5.49609V2.5Z"
                          fill="#585754"
                        />
                      </svg>{" "}
                      {data.submittedTime}
                    </span>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VLSBanner;
