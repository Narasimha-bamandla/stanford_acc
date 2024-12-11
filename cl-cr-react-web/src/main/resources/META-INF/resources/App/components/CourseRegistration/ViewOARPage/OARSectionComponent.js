import React from "react";
import CustomToolTips from "../../CommonComponents/CustomTooltips";

const OARSectionComponent = ({ OarData, urlId }) => {
  return (
    <>
      {OarData?.allocations?.map((data, key) => (
        <section key={key} className="cr_course_item" role="listitem">
        <h3 className="visuallyHidden">{data?.title}</h3>
          <table>
            <colgroup>
              <col width="25%" />
              <col width="20%" />
              <col width="40%" />
              <col width="15%" />
            </colgroup>
              <thead>
              <tr>
                <th style={{ position: "absolute" }}></th> 
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="pl-3 align-content-start"
                  style={{ paddingTop: "3px" }}
                >
                  <div className="d-flex flex-column py-2 c-gap-2">
                    <div className="d-flex flex-row c-gap-2">
                      <span className="font18b">
                        <CustomToolTips
                          tooltipText={data?.section_name}
                          tooltipTitle={urlId === "Core" && data?.title}
                          onTooltipClick={() => {}}
                        />
                      </span>
                    </div>
                    <div className="wrap2lines">
                      {urlId == "Core" ? (
                        <>
                          {data.category_name !== null &&
                            `${data?.category_name} - ${data?.group_name}`}
                        </>
                      ) : (
                        <>{data?.title}</>
                      )}
                    </div>
                  </div>
                </td>
                <td className="font12 pr-3">
                  <div className="grid-cell c-gap-2 left-border">
                    <strong>Units:</strong> <span>{data?.units}</span>
                    {OarData?.enableQuarterInSort && (
                      <>
                        <strong>Quarter:</strong>
                        <span>{data?.quarter}</span>
                      </>
                    )}
                    {urlId == "Core" && (
                      <>
                        <strong>Level:</strong>
                        <span>{data?.level}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="font12">
                  <div className="grid-cell c-gap-2 left-border">
                    <strong>Timing:</strong>
                    <div>
                      {data?.meetingTimeList?.map((timeData, key) => (
                        <ul key={key} className="line_list">
                          <li className="day_time">{timeData}</li>
                        </ul>
                      ))}
                    </div>
                    <strong>Instructors:</strong>{" "}
                    <span>{data?.instructors?.join(", ")}</span>
                  </div>
                </td>
                <td className="font12 pr-3">
                  <div className="grid-cell c-gap-2 left-border">
                    <strong>Round Closed:</strong>
                    <span>{data?.round_closed || "--"} </span>
                    <strong>Open Seats:</strong>{" "}
                    <span>{data?.open_seats || 0}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      ))}
    </>
  );
};

export default OARSectionComponent;
