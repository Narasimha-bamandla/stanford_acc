import React from "react";
import RecommendedToolTip from "../../../CommonComponents/RecommendedToolTip";
import LockIconTooltip from "../../../CommonComponents/LockIconTooltip";

const VLSCourseCard = ({ data, type, enableQuarter }) => {
  return (
    <section className="cr_course_item border-0" role="listitem">
      <h3 className="visuallyHidden">{data?.title}</h3>
      <table>
        <colgroup>
          <col width="4%" />
          <col width="30%" />
          <col width="46%" />
          <col width="20%" />
        </colgroup>
        <thead>
          <tr>
            <th style={{ position: "absolute" }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ height: "20px", padding: "0" }}>
              <div className="input-dragicon">{data?.rank}</div>
            </td>
            <td>
              <div className="d-flex flex-column c-gap-2">
                <div className="d-flex flex-row c-gap-2">
                  <span
                    className="font16b lfr-portal-tooltip"
                    data-tooltip-align="top"
                    role="tooltip"
                    tabIndex={type === "MF" ? 0 : -1}
                    aria-label={type === "MF" ? data?.title : ""}
                    {...(type === "MF" && {
                      "data-title": `${data?.title}`,
                    })}
                  >
                    {data?.section_name}
                  </span>
                  {type == "MF" ? (
                    <>{data?.recommended && <RecommendedToolTip />}</>
                  ) : (
                    <>
                      {data?.permissionRequired != null && (
                        <LockIconTooltip message={data?.permissionRequired} />
                      )}
                    </>
                  )}
                </div>
                <div className="wrap2lines">
                  {type == "Elective" ? (
                    <>{data?.title}</>
                  ) : (
                    <>
                      {data?.category_name !== null &&
                        `${data?.category_name} - ${data?.group_name}`}
                    </>
                  )}
                </div>
              </div>
            </td>
            <td className="font12">
              <div className="grid-cell c-gap-2 left-border">
                <strong>Timing:</strong>
                <div className=" d-flex flex-column c-gap-2">
                  {data?.meetingTimePattern?.map((timeData, key) => (
                    <ul key={key} className="line_list">
                      <li className="day_time">{timeData}</li>
                    </ul>
                  ))}
                </div>
                <strong>Instructors:</strong>{" "}
                <span>{data?.instructors.join(", ")}</span>
              </div>
            </td>
            <td className="font12 pr-3">
              <div className="grid-cell c-gap-2 left-border">
                <strong>Units:</strong>
                <span>{data?.units}</span>
                {enableQuarter && (
                  <>
                    <strong>Quarter:</strong> <span>{data?.quarter}</span>
                  </>
                )}
                {type == "MF" && (
                  <>
                    <strong>Level:</strong>
                    <span>{data?.level}</span>
                  </>
                )}
                {type == "Elective" && (
                  <>
                    <strong>Grading Basis:</strong>{" "}
                    <span>{data?.apfa_desc_short}</span>
                  </>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default VLSCourseCard;
