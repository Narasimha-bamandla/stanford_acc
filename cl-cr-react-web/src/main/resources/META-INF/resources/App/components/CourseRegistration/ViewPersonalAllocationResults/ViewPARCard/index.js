import React from "react";
import CustomToolTips from "../../../CommonComponents/CustomTooltips";

const ViewPARCard = ({ data, type, hideQuarter }) => {
  return (
    <>
      <div role="listitem">
        <section className="cr_course_item">
        <h3 className="visuallyHidden">{data?.title}</h3>
          <table>
            <colgroup>
              <col width="4%" />
              <col width="23%" />
              <col width="33%" />
              <col width="20%" />
              <col width="20%" />
            </colgroup>
              <thead>
              <tr>
                <th style={{ position: "absolute" }}></th> 
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ height: "20px", textAlign: "left", padding: "0px" }}
                >
                  <div className="input-dragicon">
                    {" "}
                    {data?.rank == 0 ? "" : data?.rank}
                  </div>
                </td>
                <td className="pl-0">
                  <div className="d-flex flex-column c-gap-1">
                    <div className="d-flex flex-row c-gap-2">
                      <span className="font18b">
                        <CustomToolTips
                          tooltipText={data?.section_name}
                          tooltipTitle={type === "Core" && data?.title}
                          onTooltipClick={() => {}}
                        />
                      </span>
                    </div>
                    <div className="wrap2lines" style={{ marginTop: "5px" }}>
                      {type == "Elective"
                        ? data?.title
                        : data?.category_name !== null &&
                          `${data?.category_name} - ${data?.group_name}`}
                    </div>
                  </div>
                </td>
                <td className="font12">
                  <div className="grid-cell c-gap-2 left-border">
                    <strong>Timing:</strong>
                    <div className=" d-flex flex-column c-gap-2">
                      {data?.meetingTimePattern?.map((timeFrame, timeIndex) => (
                        <div key={timeIndex}>{timeFrame}</div>
                      ))}
                    </div>
                    <strong>Instructors:</strong>{" "}
                    <span>{data?.instructors?.join(", ")}</span>
                  </div>
                </td>
                <td className="font12 pr-3">
                  <div className="grid-cell c-gap-2 left-border">
                    <strong>Round:</strong> <span>{data?.round}</span>
                    {type === "Core" ? (
                      <>
                        <strong>Level:</strong> <span>{data?.level}</span>
                      </>
                    ) : (
                      <>
                        <strong>Grading Basis:</strong>{" "}
                        <span>{data?.apfa_desc_short}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="font12 pr-3">
                  <div className="grid-cell c-gap-2 left-border">
                    <strong>Units:</strong> <span>{data?.units}</span>
                    {!hideQuarter && (
                      <>
                        <strong>Quarter:</strong>
                        <span>{data?.quarter}</span>
                      </>
                    )}
                    <strong>Status:</strong>
                    {data?.status === "Enrolled" ? (
                      <span className="d-flex flex-row c-gap-2">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <rect width={16} height={16} rx={8} fill="#7CDB06" />
                          <path
                            d="M12 6L7.1875 11L5 8.72727"
                            stroke="#2E2D29"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Enrolled
                      </span>
                    ) : data?.status == "Class Full" ? (
                      <span className="d-flex flex-row c-gap-2">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          // aria-hidden="true"
                        >
                          <rect width={16} height={16} rx={8} fill="#BB2625" />
                          <path
                            d="M11 5L5 11M5 5L11 11"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Class Full
                      </span>
                    ) : data?.status == "Group Requirement Met Conflict" ? (
                      <span className="d-flex flex-row c-gap-2">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          // aria-hidden="true"
                        >
                          <rect width={16} height={16} rx={8} fill="#BB2625" />
                          <path
                            d="M11 5L5 11M5 5L11 11"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Group Requirement Met Conflict
                      </span>
                    ) : data?.status == "Distribution Units Met Conflict" ? (
                      <span className="d-flex flex-row c-gap-2">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width={16} height={16} rx={8} fill="#BB2625" />
                          <path
                            d="M11 5L5 11M5 5L11 11"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Distribution Units Met Conflict
                      </span>
                    ) : data?.status == "Waitlisted" ? (
                      <span className="d-flex flex-row c-gap-2">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width={16} height={16} rx={8} fill="#F3A83B" />
                          <path
                            d="M8 12.8C8.66274 12.8 9.2 12.2534 9.2 11.5791C9.2 10.9048 8.66274 10.3581 8 10.3581C7.33726 10.3581 6.8 10.9048 6.8 11.5791C6.8 12.2534 7.33726 12.8 8 12.8Z"
                            fill="#2E2D29"
                          />
                          <path
                            d="M8.71813 3.93255C8.71813 3.52797 8.39577 3.2 7.99813 3.2C7.60048 3.2 7.27813 3.52797 7.27813 3.93255V8.81625C7.27813 9.22083 7.60048 9.54881 7.99813 9.54881C8.39577 9.54881 8.71813 9.22083 8.71813 8.81625V3.93255Z"
                            fill="#2E2D29"
                          />
                        </svg>
                        Waitlisted
                      </span>
                    ) : (
                      <span className="d-flex flex-row c-gap-2">
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width={16} height={16} rx={8} fill="#BB2625" />
                          <path
                            d="M11 5L5 11M5 5L11 11"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {data?.status}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default ViewPARCard;
