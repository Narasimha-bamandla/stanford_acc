import React from "react";
import SwitchFlyoutAlertMsg from "./SwitchFlyoutAlertMsg";
export default function SubmitRequestComponent({
  submitRequestData,
  handleDelete,
  handleEdit,
  courseDisable,
  groupTitle,
  disableActions,
  showMore,
  setShowMoreStatus,
}) {
  const handleToggle = () => {
    setShowMoreStatus(!showMore);
  };

  const handleEditButton = (courseID) => {
    if (courseID.requestType == "ADD") {
      handleEdit(null, courseID.toGroupName);
    } else {
      handleEdit(courseID.fromSectionName, courseID.fromGroupName);
    }
  };

  return (
    <>
      <section
        className="d-flex flex-column c-gap-4  justify-content-between p-0"
        style={{ marginBottom: "25px" }}
      >
        {submitRequestData && submitRequestData?.length > 0 && (
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
              {submitRequestData?.length}
            </div>

            <h4 style={courseDisable ? { marginTop: "0px" } : {}}>
              {groupTitle}
            </h4>
            <button
              className={`toggle-btn btn btn-sm ${showMore ? "" : "active"}`}
              type="button"
              aria-label="Hide ACCT 210 sections"
              onClick={() => handleToggle()}
              style={
                courseDisable
                  ? { marginTop: "-4px" }
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
            {submitRequestData?.map((data, index) => (
              <section
                className={`cr-se-card d-flex flex-column c-gap-3 ${
                  courseDisable ? "disabled" : ""
                }`}
                key={index}
              >
                <div className="head">
                  <div className="d-flex c-gap-3">
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="font18b">{data?.fromGroupName}</div>
                      <div className="rsdt">{data?.timeStamp}</div>
                    </div>
                    {(data?.edit || data?.delete) && (
                      <div className="btn-group w-auto">
                        {data?.edit && (
                          <button
                            aria-label="Edit"
                            className="btn sm-btn secondary-btn"
                            type="button"
                            onClick={() => handleEditButton(data)}
                          >
                            <svg
                              fill="none"
                              height={16}
                              viewBox="0 0 16 16"
                              width={16}
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M7.33398 2.66617H2.66732C2.3137 2.66617 1.97456 2.80664 1.72451 3.05669C1.47446 3.30674 1.33398 3.64588 1.33398 3.9995V13.3328C1.33398 13.6865 1.47446 14.0256 1.72451 14.2756C1.97456 14.5257 2.3137 14.6662 2.66732 14.6662H12.0007C12.3543 14.6662 12.6934 14.5257 12.9435 14.2756C13.1935 14.0256 13.334 13.6865 13.334 13.3328V8.66617M12.334 1.66617C12.5992 1.40095 12.9589 1.25195 13.334 1.25195C13.7091 1.25195 14.0688 1.40095 14.334 1.66617C14.5992 1.93138 14.7482 2.29109 14.7482 2.66617C14.7482 3.04124 14.5992 3.40095 14.334 3.66617L8.00065 9.9995L5.33398 10.6662L6.00065 7.9995L12.334 1.66617Z"
                                stroke="#8C1515"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.4"
                              />
                            </svg>
                          </button>
                        )}
                        {data?.delete && (
                          <button
                            aria-label="Delete"
                            className="btn sm-btn secondary-btn"
                            type="button"
                            onClick={() => handleDelete(data)}
                            disabled={disableActions}
                          >
                            <svg
                              fill="none"
                              height={18}
                              viewBox="0 0 16 18"
                              width={16}
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                clipRule="evenodd"
                                d="M6.5 2.18117C6.30109 2.18117 6.11032 2.26098 5.96967 2.40306C5.82902 2.54513 5.75 2.73782 5.75 2.93874V3.69632H10.25V2.93874C10.25 2.73782 10.171 2.54513 10.0303 2.40306C9.88968 2.26098 9.69891 2.18117 9.5 2.18117H6.5ZM11.75 3.69632V2.93874C11.75 2.33598 11.5129 1.7579 11.091 1.33168C10.669 0.905463 10.0967 0.666016 9.5 0.666016H6.5C5.90326 0.666016 5.33097 0.905463 4.90901 1.33168C4.48705 1.7579 4.25 2.33598 4.25 2.93874V3.69632H0.5V5.21147H2V15.06C2 15.6627 2.23705 16.2408 2.65901 16.667C3.08097 17.0932 3.65326 17.3327 4.25 17.3327H11.75C12.3467 17.3327 12.919 17.0932 13.341 16.667C13.7629 16.2408 14 15.6627 14 15.06V5.21147H15.5V3.69632H11.75ZM3.5 5.21147V15.06C3.5 15.2609 3.57902 15.4536 3.71967 15.5956C3.86032 15.7377 4.05109 15.8175 4.25 15.8175H11.75C11.9489 15.8175 12.1397 15.7377 12.2803 15.5956C12.421 15.4536 12.5 15.2609 12.5 15.06V5.21147H3.5ZM7.25 7.4842V13.5448H5.75V7.4842H7.25ZM10.25 7.4842V13.5448H8.75V7.4842H10.25Z"
                                fill="#8C1515"
                                fillRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {data?.alertMessage && (
                    <div style={{ marginTop: "15px" }}>
                      <SwitchFlyoutAlertMsg msg={data?.alertMessage} />
                    </div>
                  )}
                </div>
                <div className="content d-flex flex-column c-gap-3">
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
                                      <li className="day_time">
                                        {meetingTime}
                                      </li>
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
                              {data?.toMeetingTimePattern?.map(
                                (meetingTime) => {
                                  return (
                                    <ul className="line_list">
                                      <li className="day_time">
                                        {meetingTime}
                                      </li>
                                    </ul>
                                  );
                                }
                              )}
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
    </>
  );
}
