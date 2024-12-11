import React from "react";
import CustomToolTip from "./CustomToolTip";

export default function SwitchEventSubmitModal({
  data,
  open,
  onHandleClose,
  submitType,
  submitSelectedItemType,
  isDeleteRequest,
}) {
  const conflictTooltip = (msg, text) => {
    const parts = msg.split(text);
    return (
      <>
        {parts[0]}
        <CustomToolTip
          title={`Time conflict.
                  Too few Distribution units.
                  Too many units in the quarter.
                  Account hold in Axess.`}
          childComponent={
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              {text}
            </span>
          }
          switchEvent={true}
        />
        {parts[1]}
        {parts[2] ? `${text}${parts[2]}` : ""}
      </>
    );
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
            <div
              className="modal-dialog modal modal-info modal-dialog-centered"
              style={{ width: "431px", height: "394px" }}
            >
              <div
                aria-label="Course Details Wishlist Import Message Popup"
                aria-labelledby="clay-modal-label-1"
                aria-modal="true"
                className="modal-content"
                role="dialog"
                tabIndex={"-1"}
              >
                <div className="modal-body">
                  {data?.code == 200 ? (
                    <>
                      {isDeleteRequest ? (
                        <>
                          <p style={{ fontSize: "18px" }}>
                            Your request has been deleted. If you wish to submit
                            a new request, you may do so now.
                          </p>
                          <p>
                            The unique confirmation code identifying your most
                            recent submission is displayed below and has been
                            sent to your email inbox. When communicating with
                            the GSB Academic Operations office regarding this
                            request, please refer to this confirmation code.
                          </p>
                          <p>
                            <b>{data?.confirmationCode}</b>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              gap: "10px",
                              background: "#FCF8E5",
                              padding: "10px",
                            }}
                          >
                            <div>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8 16C9.58225 16 11.129 15.5308 12.4446 14.6518C13.7602 13.7727 14.7855 12.5233 15.391 11.0615C15.9965 9.59966 16.155 7.99113 15.8463 6.43928C15.5376 4.88743 14.7757 3.46197 13.6569 2.34315C12.538 1.22433 11.1126 0.462403 9.56072 0.153721C8.00887 -0.15496 6.40034 0.00346629 4.93853 0.608967C3.47672 1.21447 2.22729 2.23985 1.34824 3.55544C0.469192 4.87104 0 6.41775 0 8C0.00229405 10.121 0.845886 12.1545 2.34568 13.6543C3.84547 15.1541 5.87897 15.9977 8 16ZM8 3.33334C8.19778 3.33334 8.39112 3.39199 8.55557 3.50187C8.72002 3.61175 8.84819 3.76793 8.92388 3.95065C8.99957 4.13338 9.01937 4.33445 8.98079 4.52843C8.9422 4.72241 8.84696 4.90059 8.70711 5.04044C8.56726 5.1803 8.38907 5.27554 8.19509 5.31412C8.00111 5.35271 7.80004 5.3329 7.61732 5.25722C7.43459 5.18153 7.27841 5.05336 7.16853 4.88891C7.05865 4.72446 7 4.53112 7 4.33334C7 4.06812 7.10536 3.81377 7.29289 3.62623C7.48043 3.43869 7.73478 3.33334 8 3.33334ZM7.33333 6.66667H8C8.35362 6.66667 8.69276 6.80715 8.94281 7.0572C9.19286 7.30724 9.33333 7.64638 9.33333 8V12C9.33333 12.1768 9.2631 12.3464 9.13807 12.4714C9.01305 12.5964 8.84348 12.6667 8.66667 12.6667C8.48986 12.6667 8.32029 12.5964 8.19526 12.4714C8.07024 12.3464 8 12.1768 8 12V8H7.33333C7.15652 8 6.98695 7.92977 6.86193 7.80474C6.73691 7.67972 6.66667 7.51015 6.66667 7.33334C6.66667 7.15653 6.73691 6.98696 6.86193 6.86193C6.98695 6.73691 7.15652 6.66667 7.33333 6.66667Z"
                                  fill="#F4B177"
                                />
                              </svg>
                            </div>
                            <div>
                              <p>
                                Please note that switch requests will be
                                processed if the class section has capacity and
                                does not have a time or unit conflict with your
                                current enrollments.
                              </p>
                            </div>
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: "18px" }}>
                            <b>
                              {submitSelectedItemType == "SWITCH" && `Switch `}
                              {submitSelectedItemType == "DROP" &&
                                `Drop enrollment `}
                              {submitSelectedItemType == "ADD" && `Enrolment `}
                              {`request successfully ${
                                submitType == "Submit"
                                  ? "submitted"
                                  : "resubmitted"
                              }`}
                            </b>
                          </p>
                          <p>
                            Your
                            {submitSelectedItemType == "SWITCH" && ` switch `}
                            {submitSelectedItemType == "DROP" &&
                              ` drop enrollment `}
                            {submitSelectedItemType == "ADD" && ` enrolment `}
                            request has been received by the GSB Academic
                            Operations office.
                          </p>
                          <p>{data?.switchGroupTitle}</p>
                          <p>{data?.switchRequestTitle}</p>
                          <p>
                            The unique confirmation code identifying your most
                            recent submission is displayed below and has been
                            sent to your email inbox. When communicating with
                            the GSB Academic Operations office regarding this
                            request, please refer to this confirmation code.
                          </p>
                          <p>
                            <b>{data?.confirmationCode}</b>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              gap: "10px",
                              background: "#FCF8E5",
                              padding: "10px",
                            }}
                          >
                            <div>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 16C9.58225 16 11.129 15.5308 12.4446 14.6518C13.7602 13.7727 14.7855 12.5233 15.391 11.0615C15.9965 9.59966 16.155 7.99113 15.8463 6.43928C15.5376 4.88743 14.7757 3.46197 13.6569 2.34315C12.538 1.22433 11.1126 0.462403 9.56072 0.153721C8.00887 -0.15496 6.40034 0.00346629 4.93853 0.608967C3.47672 1.21447 2.22729 2.23985 1.34824 3.55544C0.469192 4.87104 0 6.41775 0 8C0.00229405 10.121 0.845886 12.1545 2.34568 13.6543C3.84547 15.1541 5.87897 15.9977 8 16ZM8 3.33334C8.19778 3.33334 8.39112 3.39199 8.55557 3.50187C8.72002 3.61175 8.84819 3.76793 8.92388 3.95065C8.99957 4.13338 9.01937 4.33445 8.98079 4.52843C8.9422 4.72241 8.84696 4.90059 8.70711 5.04044C8.56726 5.1803 8.38907 5.27554 8.19509 5.31412C8.00111 5.35271 7.80004 5.3329 7.61732 5.25722C7.43459 5.18153 7.27841 5.05336 7.16853 4.88891C7.05865 4.72446 7 4.53112 7 4.33334C7 4.06812 7.10536 3.81377 7.29289 3.62623C7.48043 3.43869 7.73478 3.33334 8 3.33334ZM7.33333 6.66667H8C8.35362 6.66667 8.69276 6.80715 8.94281 7.0572C9.19286 7.30724 9.33333 7.64638 9.33333 8V12C9.33333 12.1768 9.2631 12.3464 9.13807 12.4714C9.01305 12.5964 8.84348 12.6667 8.66667 12.6667C8.48986 12.6667 8.32029 12.5964 8.19526 12.4714C8.07024 12.3464 8 12.1768 8 12V8H7.33333C7.15652 8 6.98695 7.92977 6.86193 7.80474C6.73691 7.67972 6.66667 7.51015 6.66667 7.33334C6.66667 7.15653 6.73691 6.98696 6.86193 6.86193C6.98695 6.73691 7.15652 6.66667 7.33333 6.66667Z"
                                  fill="#F4B177"
                                />
                              </svg>
                            </div>
                            <div>
                              <p>
                                Please note that switch requests will be
                                processed if the class section has capacity and
                                does not have a time or unit conflict with your
                                current enrollments.
                              </p>
                            </div>
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <p>
                      <b style={{ lineHeight: "19px" }}>
                        {data?.message?.includes("conflict")
                          ? conflictTooltip(data?.message, "conflict")
                          : data?.message}
                      </b>
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      type="button"
                      tabindex="0"
                      onClick={onHandleClose}
                    >
                      Done
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
}
