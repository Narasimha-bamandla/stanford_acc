import React, { useEffect, useState } from "react";
import { Row, Col, ContainerFluid } from "@clayui/layout";
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
            <ContainerFluid className="wcc-container" key={dataIndex}>
              <Row>
                <Col size={3}>
                  <strong
                    style={{ fontSize: "16px" }}
                    title={`${data.groupName}`}
                  >
                    {data.groupName}
                  </strong>
                </Col>
                {data.recommended ? (
                  <Col>
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
                  </Col>
                ) : (
                  <Col>
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
                  </Col>
                )}
                {data.recommended ? (
                  <Col size={2}>
                    <RecommendedToolTip onCloseWishlist={onCloseWishlist} />
                  </Col>
                ) : (
                  <></>
                )}
                <Col size={2} style={{ textAlign: "right" }}>
                  <strong>Type:</strong> {data.mfLevelName}
                </Col>
              </Row>
              <hr />
              {data.sections?.length > 0 ? (
                data.sections.map((section, index) => {
                  return (
                    <Row
                      key={index}
                      justify="between"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    >
                      <Col size={"2"}>Section {section.class_section}</Col>
                      <Col size={"4"}>
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
                      </Col>
                      <Col size={"2"}>{section.units} Units</Col>
                      <Col size={"4"}>
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
                                        section?.meetingDaysDateMap[dateRange]
                                      ).map((days) => {
                                        return <>{days}</>;
                                      })}{" "}
                                      {Object.values(
                                        section?.meetingDaysDateMap[dateRange]
                                      ).map((time) => {
                                        return <>{time}</>;
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </Col>
                    </Row>
                  );
                })
              ) : (
                <></>
              )}
              {!data.export && (
                <div
                  className="disclaimer"
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    border: "1px solid #D5D5D4",
                    padding: "5px 10px",
                    background: "#f7f7f7",
                    color: "#BB2625",
                    marginTop: "10px",
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
            </ContainerFluid>
          );
        })}
    </>
  );
};

export default CoreCourseCard;
