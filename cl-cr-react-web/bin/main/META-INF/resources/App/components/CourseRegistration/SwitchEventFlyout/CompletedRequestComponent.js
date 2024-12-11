import React from "react";

export default function CompletedRequestComponent({
  completedRequestData = null,
  handleDelete,
  openCards,
  handleCardChange,
  handleEdit,
  courseDisable,
  showMore,
  setShowMoreStatus,
}) {
  const handleToggle = () => {
    setShowMoreStatus(!showMore);
  };
  const handleEditButton = (courseID) => {
    handleEdit(courseID);
  };
  return (
    <section className="d-flex flex-column c-gap-4  justify-content-between p-0 mt-4">
      {completedRequestData && completedRequestData?.length > 0 && (
        <div
          style={{
            display: "flex",
            padding: "12px 0px",
            border: "1px solid #D5D5D4",
          }}
        >
          <div
            style={{
              background: "#417865",
              color: "#FFF",
              width: "26px",
              height: "26px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              left: "-19px",
              bottom: "26px",
            }}
          >
            {completedRequestData?.length}
          </div>
          <h4>Completed Request(s)</h4>
          <button
            className={`toggle-btn btn btn-sm ${showMore ? "" : "active"}`}
            type="button"
            aria-label="Hide ACCT 210 sections"
            onClick={() => handleToggle()}
            style={
              courseDisable
                ? { marginTop: "0px" }
                : { position: "relative", bottom: "3px" }
            }
          >
            <img
              alt=""
              src="/o/stanford-clce-theme/images/icons/angle_down_icon.svg"
            />
          </button>
        </div>
      )}
      {showMore && (
        <>
          {completedRequestData?.map((data, index) => (
            <section
              className="cr-se-card d-flex flex-column c-gap-3  disabled completed   "
              key={index}
            >
              <svg
                className="checkmark"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width={24} height={24} rx={12} fill="currentColor" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.5117 6.95171C18.8146 7.23434 18.8309 7.70893 18.5483 8.01174L10.5483 16.5832C10.4095 16.7319 10.2163 16.8178 10.0129 16.8213C9.80956 16.8248 9.61349 16.7456 9.46967 16.6018L5.46967 12.6018C5.17678 12.3089 5.17678 11.834 5.46967 11.5411C5.76256 11.2482 6.23744 11.2482 6.53033 11.5411L9.9814 14.9922L17.4517 6.98826C17.7343 6.68545 18.2089 6.66909 18.5117 6.95171Z"
                  fill="white"
                />
              </svg>
              <div className="head d-flex c-gap-3">
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="font18b">{data?.fromGroupName}</div>

                  <div className="rsdt">{data?.timeStamp}</div>
                </div>
                {data.alertMessage && (
                  <SwitchFlyoutAlertMsg msg={data?.alertMessage} />
                )}
              </div>

              <div className="content d-flex flex-column c-gap-3   ">
                {data?.requestType == "DROP" && (
                  <ul className="se-list">
                    <li className="lbl">Request to Drop</li>
                    <li className="val" style={{ cursor: "pointer" }}>
                      <div
                        className="coursedetail-tooltip-containter"
                        tabIndex="0"
                      >
                        <div
                          className="coursedetail-tooltip"
                          style={{ minHeight: "54px" }}
                        >
                          <strong>{data?.fromTitle}</strong>
                          {data?.fromInstructors?.length > 0 && (
                            <div className="names">
                              {data?.fromInstructors?.join(", ")}
                            </div>
                          )}
                          {data?.fromMeetingTimePattern?.map((meetingTime) => {
                            return (
                              <ul className="line_list">
                                <li className="day_time">{meetingTime}</li>
                              </ul>
                            );
                          })}
                        </div>
                        {data?.fromSection}
                      </div>
                    </li>
                    {data?.fromAlertMessage && (
                      <SwitchFlyoutAlertMsg msg={data?.fromAlertMessage} />
                    )}
                  </ul>
                )}
                {data?.requestType == "ADD" && (
                  <ul className="se-list">
                    <li className="lbl">Request to add</li>
                    <li className="val" style={{ cursor: "pointer" }}>
                      <div
                        className="coursedetail-tooltip-containter"
                        tabIndex="0"
                      >
                        <div
                          className="coursedetail-tooltip"
                          style={{ minHeight: "54px" }}
                        >
                          <strong>{data?.toTitle}</strong>
                          {data?.toInstructors?.length > 0 && (
                            <div className="names">
                              {data?.toInstructors?.join(", ")}
                            </div>
                          )}
                          {data?.toMeetingTimePattern?.map((meetingTime) => {
                            return (
                              <ul className="line_list">
                                <li className="day_time">{meetingTime}</li>
                              </ul>
                            );
                          })}
                        </div>
                        {data?.toSection}
                      </div>
                    </li>
                    {data?.toAlertMessage && (
                      <SwitchFlyoutAlertMsg msg={data?.toAlertMessage} />
                    )}
                  </ul>
                )}
                {data?.requestType == "SWITCH" && (
                  <>
                    <ul className="se-list">
                      <li className="lbl">Switch From</li>
                      <li className="val" style={{ cursor: "pointer" }}>
                        <div
                          className="coursedetail-tooltip-containter"
                          tabIndex="0"
                        >
                          <div
                            className="coursedetail-tooltip"
                            style={{ minHeight: "54px" }}
                          >
                            <strong>{data?.fromTitle}</strong>
                            {data?.fromInstructors?.length > 0 && (
                              <div className="names">
                                {data?.fromInstructors?.join(", ")}
                              </div>
                            )}
                            {data?.fromMeetingTimePattern?.map(
                              (meetingTime) => {
                                return (
                                  <ul className="line_list">
                                    <li className="day_time">{meetingTime}</li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                          {data?.fromSection}
                        </div>
                      </li>
                      {data?.fromAlertMessage && (
                        <SwitchFlyoutAlertMsg msg={data?.fromAlertMessage} />
                      )}
                    </ul>
                    <ul className="se-list">
                      <li className="lbl">Switch To</li>
                      <li className="val" style={{ cursor: "pointer" }}>
                        <div
                          className="coursedetail-tooltip-containter"
                          tabIndex="0"
                        >
                          <div
                            className="coursedetail-tooltip"
                            style={{ minHeight: "54px" }}
                          >
                            <strong>{data?.toTitle}</strong>
                            {data?.toInstructors?.length > 0 && (
                              <div className="names">
                                {data?.toInstructors?.join(", ")}
                              </div>
                            )}
                            {data?.toMeetingTimePattern?.map((meetingTime) => {
                              return (
                                <ul className="line_list">
                                  <li className="day_time">{meetingTime}</li>
                                </ul>
                              );
                            })}
                          </div>
                          {data?.toSection}
                          {data?.fromGroupName !== data?.toGroupName && (
                            <>
                              , <b>{data?.toGroupName}</b>
                            </>
                          )}
                        </div>
                      </li>
                      {data?.toAlertMessage && (
                        <SwitchFlyoutAlertMsg msg={data?.toAlertMessage} />
                      )}
                    </ul>
                  </>
                )}
              </div>
            </section>
          ))}
        </>
      )}
    </section>
  );
}
