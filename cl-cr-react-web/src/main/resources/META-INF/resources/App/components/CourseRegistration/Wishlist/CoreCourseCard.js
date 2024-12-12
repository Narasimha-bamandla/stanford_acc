import React from "react";
import RecommendedToolTip from "../../CommonComponents/RecommendedToolTip";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";
import { Link } from "react-router-dom";

const CoreCourseCard = ({
  data,
  showLoader,
  noDataFound,
  adminMessages,
  sectionType,
  onCloseWishlist,
}) => {
  return (
    <>
      {showLoader && !noDataFound && <OvalLoader />}
      {(noDataFound ||
        data?.coreCourses === null ||
        data?.coreCourses?.length < 1) &&
        !showLoader && (
          <NoDataFound message={`No items added for ${sectionType}.`} />
        )}

      {!noDataFound &&
        !showLoader &&
        Object?.keys(data)?.length > 0 &&
        data?.coreCourses?.map((data, dataIndex) => {
          return (
            <div className="wcc-container" style={{ width: "100%" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ position: "absolute" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width={"25%"}>
                      <strong
                        style={{ fontSize: "16px" }}
                        title={`${data.groupName}`}
                      >
                        {data.groupName}
                      </strong>
                    </td>
                    <td width={"43%"}>
                      {data.recommended ? (
                        <div
                          style={{
                            width: "298px",
                            textOverflow: "ellipsis",
                            overflow: " hidden",
                            whiteSpace: "nowrap",
                          }}
                          title={`${data.subject_code} ${data.catalog_number_code} - ${data.title}`}
                        >
                          {data.subject_code} {data.catalog_number_code} -{" "}
                          {data.title}
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "400px",
                            textOverflow: "ellipsis",
                            overflow: " hidden",
                            whiteSpace: "nowrap",
                          }}
                          title={`${data.subject_code} ${data.catalog_number_code} - ${data.title}`}
                        >
                          {data.subject_code} {data.catalog_number_code} -{" "}
                          {data.title}
                        </div>
                      )}
                    </td>
                    <td width={"auto"}>
                      {data.recommended ? (
                        <RecommendedToolTip onCloseWishlist={onCloseWishlist} />
                      ) : (
                        <></>
                      )}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        width: "auto",
                        gap: "5px",
                      }}
                    >
                      <strong>Type: </strong> {data.mfLevelName}
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr />
              <table style={{ width: "100%" }}>
                <colgroup>
                  <col width="17%" />
                  <col width="33%" />
                  <col width="18%" />
                </colgroup>
                <thead>
                  <tr>
                    <th style={{ position: "absolute" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.sections?.length > 0 ? (
                    data.sections.map((section, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ paddingBottom: "10px" }}>
                            Section {section.class_section}
                          </td>
                          <td style={{ paddingBottom: "10px" }}>
                            {section?.instructorsResponse?.map(
                              (instructorsResponseArray, dayIndex) => (
                                <>
                                  <Link
                                    className="instructors-name"
                                    to={instructorsResponseArray.instructorUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={dayIndex}
                                  >
                                    {instructorsResponseArray.instructorName}
                                  </Link>
                                  {dayIndex !==
                                  section?.instructorsResponse?.length - 1
                                    ? ", "
                                    : ""}
                                </>
                              )
                            )}
                          </td>
                          <td style={{ paddingBottom: "10px" }}>
                            {section.units} Units
                          </td>
                          <td style={{ paddingBottom: "10px" }}>
                            {section?.meetingDaysDateMap &&
                              Object.keys(section?.meetingDaysDateMap).map(
                                (dateRange, dateRangeIndex) => {
                                  return (
                                    <div
                                      style={{ display: "flex", gap: "5px" }}
                                      key={dateRangeIndex}
                                    >
                                      {dateRange}{" "}
                                      <div>
                                        <div>
                                          {Object.keys(
                                            section?.meetingDaysDateMap[
                                              dateRange
                                            ]
                                          ).map((days) => {
                                            return <>{days}</>;
                                          })}{" "}
                                          {Object.values(
                                            section?.meetingDaysDateMap[
                                              dateRange
                                            ]
                                          ).map((time) => {
                                            return <>{time}</>;
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </tbody>
              </table>
              {!data.export && (
                <div
                  className="disclaimer"
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-end",
                    border: "1px solid #D5D5D4",
                    padding: "5px 10px",
                    background: "#f7f7f7",
                    color: "#BB2625",
                  }}
                >
                  <div>
                    <img
                      alt="Alert"
                      src={
                        "/o/stanford-clce-theme/images/icons/alert_triangle_red_icon.svg"
                      }
                    />
                  </div>
                  <div>
                    {data?.eventName !== null && data?.eventName?.length > 0 ? (
                      <>
                        {adminMessages?.wishListUserMessage
                          ? adminMessages?.wishListUserMessage?.replace(
                              "{eventName}",
                              data?.eventName?.length > 0
                                ? data?.eventName
                                    .map((event, eventIndex) => {
                                      return eventIndex !==
                                        data?.eventName?.length - 1
                                        ? `${event}, `
                                        : event;
                                    })
                                    .join("")
                                : ""
                            )
                          : `This course is not available to rank in ${
                              data?.eventName?.length > 0
                                ? data?.eventName
                                    .map((event, eventIndex) => {
                                      return eventIndex !==
                                        data?.eventName?.length - 1
                                        ? `${event}, `
                                        : event;
                                    })
                                    .join("")
                                : ""
                            }`}
                      </>
                    ) : (
                      "This course is not available in any open event."
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
};

export default CoreCourseCard;
