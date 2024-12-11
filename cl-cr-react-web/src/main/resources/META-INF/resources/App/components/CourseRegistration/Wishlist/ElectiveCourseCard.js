import React, { useEffect, useState } from "react";
import { Row, Col, ContainerFluid } from "@clayui/layout";
import LockIconTooltip from "../../CommonComponents/LockIconTooltip";
import { Link } from "react-router-dom";

const ElectiveCourseCard = ({
  details,
  index,
  sectionType,
  getdefaultElectivesData,
  type,
  adminMessages,
  isAllowDelete,
  handleExportBtn,
  handleCheckedCourses,
  onCloseWishlist,
}) => {
  const [data, setData] = useState([]);
  const [isCheckboxEditable, setIsCheckboxEditable] = useState(true);

  const handleSelectedCourseCheckbox = async () => {
    Liferay?.Session?.extend();
    setData({
      ...data,
      checked: !data.checked,
    });
    var requestUrl =
      `/o/mygsb/gsb/clce/remove-wishlist-section?course_id=${
        data.class_id
      }&section_type=${
        type?.includes("Electives") ? "Elective" : type
      }&class_number=${
        data.class_number
      }&value=${!data.checked}&catalog_number_code=${
        data.catalog_number_code
      }&subject_code=${data.subject_code}&from=CLCR&p_auth=` +
      Liferay.authToken;
    var requestHeaders = new Headers({
      Accept: "application/json",
    });
    await fetch(requestUrl, {
      method: "GET",
      headers: requestHeaders,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((userData) => {
        handleExportBtn(userData?.isExport);
      })
      .catch((error) => {
        console.log(error);
      });
    handleCheckedCourses(index);
  };

  useEffect(() => {
    setData(details);
  }, [details]);

  useEffect(() => {
    if (isStudentView && !isAdmin) {
      setIsCheckboxEditable(false);
    } else if (isStudentView && isAdmin) {
      setIsCheckboxEditable(isAdmin);
    } else if (
      role.toUpperCase() != "STAFF" &&
      role.toUpperCase() != "FACULTY" &&
      role.toUpperCase() != "ADVISOR" &&
      role.toUpperCase() != "ADMIN" &&
      role.toUpperCase() != "AO"
    ) {
      setIsCheckboxEditable(true);
    } else {
      setIsCheckboxEditable(false);
    }
  }, []);

  return (
    <ContainerFluid
      className={
        data.checked ? "wec-container selected-elective" : "wec-container"
      }
      key={index}
    >
      {data.export && sectionType === "planned" && (
        <div style={{ height: "0px" }}>
          <label
            className="elective-checkbox-btn"
            style={{
              position: "relative",
              bottom: "22px",
              right: "22px",
            }}
          >
            <input
              type="checkbox"
              defaultChecked={data.checked}
              onChange={
                isCheckboxEditable
                  ? () => handleSelectedCourseCheckbox()
                  : undefined
              }
              disabled={!isCheckboxEditable}
            />
            <span></span>
          </label>
        </div>
      )}
      <Row justify="between">
        <Col size={2}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div>
              <strong>
                {data.subject_code} {data.catalog_number_code} -{" "}
                {data.class_section}
              </strong>
            </div>
            {data.isPermissionRequired != null && (
              <div>
                <LockIconTooltip
                  message={data.isPermissionRequired}
                  onCloseWishlist={onCloseWishlist}
                />
              </div>
            )}
          </div>
        </Col>
        <Col size={4}>
          <div>{data.title}</div>
        </Col>
        <Col size={"auto"}>
          <strong>Units: </strong> {data.units}
        </Col>
        <Col size={2}>
          <strong>Quarter:</strong> {data.quarter}
        </Col>
        <Col size={"auto"}>
          <strong>Grading Basis:</strong> {data.gradingBasis}
        </Col>
      </Row>
      <hr />
      <Row key={index} justify="between" style={{ marginRight: "10px" }}>
        <Col size={"auto"}>
          {data?.instructorsResponse?.map(
            (instructorsResponseArray, dayIndex) => (
              <span key={dayIndex}>
                <Link
                  className="instructors-name"
                  to={instructorsResponseArray.instructorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {instructorsResponseArray.instructorName}
                </Link>
                {dayIndex !== data?.instructorsResponse?.length - 1
                  ? " | "
                  : ""}
              </span>
            )
          )}
        </Col>
        <Col size={"auto"}>
          {data?.meetingDaysDateMap &&
            Object.keys(data?.meetingDaysDateMap).map((dateRange) => {
              const meetingTimes = data?.meetingDaysDateMap[dateRange];
              return (
                <div key={dateRange} style={{ display: "flex", gap: "10px" }}>
                  <div>{dateRange} </div>
                  <div>
                    {Object.keys(meetingTimes).map((day) => (
                      <div key={day}>
                        {day} {meetingTimes[day]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </Col>
      </Row>
      {!data.export && sectionType == "planned" && (
        <div className="wec-disclaimer">
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
                              return eventIndex !== data?.eventName?.length - 1
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
                              return eventIndex !== data?.eventName?.length - 1
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
};

export default ElectiveCourseCard;
