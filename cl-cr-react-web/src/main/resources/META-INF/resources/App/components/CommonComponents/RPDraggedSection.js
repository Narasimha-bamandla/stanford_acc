import React, { useState, useCallback, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useModal } from "@clayui/modal";
import CourseQuickViewFlyout from "../CourseRegistration/CourseQuickViewFlyout/index";
import LockIconTooltip from "./LockIconTooltip";
import RecommendedToolTip from "./RecommendedToolTip";
import CustomToolTips from "./CustomTooltips";

export default function RPDraggedSection({
  id,
  data,
  index,
  handleDeleteSection,
  urlId,
  handleCalendar,
  handleRankChange,
  isQuarterEnabled,
  isCalendarEnabled,
  readAccessEnabled,
}) {
  const { observer, onOpenChange, open } = useModal();
  const [sectionData, setSectionData] = useState();
  const [newRank, setNewRank] = useState(data.rank);

  const onRowClick = (data) => {
    setSectionData(data);
    onOpenChange(true);
  };

  const getColorCode = (type) => {
    if (type == "Enrolled") {
      return {
        background: "#7cdb06",
        backgroundColor: "rgb(124, 219, 6)",
        backgroundSize: "10px 10px",
        padding: "0px",
      }; //green
    } else if (type == "Preference") {
      return {
        background: "#009CBA",
        backgroundColor: "rgb(0, 156, 186)",
        backgroundSize: "10px 10px",
        padding: "0px",
      }; //teal
    } else if (type == "Conflict") {
      return {
        background: "#bb2625",
        backgroundColor: "rgb(187, 38, 37)",
        backgroundSize: "10px 10px",
        padding: "0px",
      }; //red
    } else if (type == "NoConflict" || type == null) {
      return { borderLeft: "6px transparent", padding: "0px" };
    } else if (type == "PreferenceConflict") {
      return {
        background:
          "repeating-linear-gradient(45deg, #005b94 0, #005b94 10%, transparent 0, transparent 50%) 0% 0% / 1.5em 1.5em #019CBA",
        padding: "0px",
      }; //stripes
    }
  };

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const debouncedFetchResults = useCallback(
    debounce(async (value, index) => {
      await handleRankChange(value, index);
    }, 500),
    [handleRankChange]
  );

  useEffect(() => {
    setNewRank(data.rank);
  }, [data]);

  return (
    <>
      <Draggable
        draggableId={id?.toString()}
        index={index}
        isDragDisabled={readAccessEnabled}
      >
        {(provided) => (
          <section
            className="cr_course_item mb-3"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            key={data.classNumber}
            id={data.classNumber}
            role={"listitem"}
            aria-controls="submitErrorMsg"
          >
            <h3 class="visuallyHidden">{data?.title}</h3>
            <table>
              <colgroup>
                <col width="1%" />
                <col width="1%" style={{ width: "0.8%" }} />
                <col width="30%" />
                <col width="50%" />
                <col width="15%" />
                <col width="3%" />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ position: "absolute" }}></th>
                </tr>
              </thead>
              <tbody>
                <tr id={data.classNumber}>
                  <td
                    style={{
                      background: "#D5D5D4",
                      padding: "0",
                      height: "20px",
                    }}
                  >
                    <div className="input-dragicon">
                      <input
                        key={data.classNumber}
                        id={data.classNumber}
                        type="text"
                        defaultValue={newRank}
                        onChange={(event) => {
                          const value = event.target.value;
                          const validatedValue = value.replace(/[^0-9]/g, "");
                          setNewRank(validatedValue);
                          debouncedFetchResults(validatedValue, index);
                        }}
                        disabled={readAccessEnabled}
                        aria-label={`Rank of ${data.title} is ${newRank}`}
                      />
                      <button
                        className="btn btn-unstyled drag-icon"
                        aria-label={`Drag and Drop ${data.title}`}
                      >
                        {" "}
                        <svg
                          width={17}
                          height={16}
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M8.49691 2L6.27469 4.18182H10.7191L8.49691 2Z"
                            fill="#2E2D29"
                          />
                          <path
                            d="M1.83333 6.99232H15.1667V5.72917H1.83333V6.99232Z"
                            fill="#2E2D29"
                          />
                          <path
                            d="M1.83333 10.2684H15.1667V9.00521H1.83333V10.2684Z"
                            fill="#2E2D29"
                          />
                          <path
                            d="M6.27595 11.8182L8.49817 14L10.7204 11.8182H6.27595Z"
                            fill="#2E2D29"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td
                    style={getColorCode(data?.conflictStatus)}
                    aria-label={`${data.title} Calendar ${data?.conflictStatus}`}
                  >
                    <span
                      style={{
                        clip: "rect(0 0 0 0)",
                        clipPath: "inset(50%)",
                        height: "1px",
                        overflow: "hidden",
                        position: "absolute",
                        whiteSpace: "nowrap",
                        width: "1px",
                      }}
                    >
                      {`${data.title} Calendar ${data?.conflictStatus}`}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-column c-gap-1">
                      <div className="d-flex flex-row c-gap-2">
                        <span className="font16b" style={{ flex: 2 }}>
                          <CustomToolTips
                            tooltipText={data.section_name}
                            tooltipTitle={urlId === "Core" && data.title}
                            onTooltipClick={() => onRowClick(data)}
                          />
                        </span>
                        <span style={{ flex: 1 }}>
                          {urlId == "Core" ? (
                            <>{data.recommended && <RecommendedToolTip />}</>
                          ) : (
                            <>
                              {data.permissionRequired != null && (
                                <LockIconTooltip
                                  message={data.permissionRequired}
                                />
                              )}
                            </>
                          )}
                        </span>
                      </div>
                      {urlId == "Core" ? (
                        <div className="wrap2lines">
                          {data.category_name !== null &&
                            `${data.category_name} - ${data.group_name}`}
                        </div>
                      ) : (
                        <div className="wrap2lines">{data.title}</div>
                      )}
                    </div>
                  </td>
                  <td className="font12 px-3">
                    <div className="grid-cell c-gap-2">
                      <strong>Timing:</strong>
                      <div className="d-flex flex-column c-gap-2">
                        {data?.meetingTimePattern?.map(
                          (timePattern, timeIndex) => (
                            <div key={timeIndex}>{timePattern}</div>
                          )
                        )}
                      </div>{" "}
                      <strong>Instructors:</strong>
                      <div>{data?.instructors.join(", ")}</div>
                    </div>
                  </td>
                  <td className="font12" style={{ padding: "10px 0px" }}>
                    <div className="grid-cell c-gap-2">
                      <strong>Units:</strong>
                      <span>{data?.units}</span>
                      {isQuarterEnabled && (
                        <>
                          <strong>Quarter:</strong>
                          <span>{data?.quarter}</span>
                        </>
                      )}
                      {urlId == "Elective" ? (
                        <>
                          <strong>Grading Basis:</strong>{" "}
                          <span>{data?.apfa_desc_short}</span>
                        </>
                      ) : (
                        <>
                          <strong>Level:</strong> <span>{data?.level}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="font12 px-3">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn sm-btn ghost-btn delete-btn"
                        aria-label={`Delete ${data.title}`}
                        onClick={() => handleDeleteSection(data)}
                        disabled={readAccessEnabled}
                        aria-controls="VisuilizerInfo"
                      >
                        <svg
                          width={16}
                          height={18}
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.5 2.18214C6.30109 2.18214 6.11032 2.26196 5.96967 2.40403C5.82902 2.54611 5.75 2.7388 5.75 2.93972V3.6973H10.25V2.93972C10.25 2.7388 10.171 2.54611 10.0303 2.40403C9.88968 2.26196 9.69891 2.18214 9.5 2.18214H6.5ZM11.75 3.6973V2.93972C11.75 2.33695 11.5129 1.75888 11.091 1.33266C10.669 0.90644 10.0967 0.666992 9.5 0.666992H6.5C5.90326 0.666992 5.33097 0.90644 4.90901 1.33266C4.48705 1.75888 4.25 2.33695 4.25 2.93972V3.6973H0.5V5.21245H2V15.0609C2 15.6637 2.23705 16.2418 2.65901 16.668C3.08097 17.0942 3.65326 17.3337 4.25 17.3337H11.75C12.3467 17.3337 12.919 17.0942 13.341 16.668C13.7629 16.2418 14 15.6637 14 15.0609V5.21245H15.5V3.6973H11.75ZM3.5 5.21245V15.0609C3.5 15.2619 3.57902 15.4545 3.71967 15.5966C3.86032 15.7387 4.05109 15.8185 4.25 15.8185H11.75C11.9489 15.8185 12.1397 15.7387 12.2803 15.5966C12.421 15.4545 12.5 15.2619 12.5 15.0609V5.21245H3.5ZM7.25 7.48517V13.5458H5.75V7.48517H7.25ZM10.25 7.48517V13.5458H8.75V7.48517H10.25Z"
                            fill="#585754"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn sm-btn secondary-btn calendar-btn"
                        aria-label={`${data?.calendar ? "Remove" : "Add"} ${
                          data.title
                        } ${data?.calendar ? "from" : "to"} the calendar`}
                        onClick={() => handleCalendar(data, data?.calendar)}
                        disabled={!isCalendarEnabled}
                        aria-controls="VisuilizerInfo"
                      >
                        {data?.calendar ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              width="24"
                              height="24"
                              rx="12"
                              fill="#8C1515"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.4 5C9.75899 5 10.05 5.28491 10.05 5.63636V6.27273H13.95V5.63636C13.95 5.28491 14.241 5 14.6 5C14.959 5 15.25 5.28491 15.25 5.63636V6.27273H16.55C17.627 6.27273 18.5 7.12746 18.5 8.18182V17.0909C18.5 18.1453 17.627 19 16.55 19H7.45C6.37304 19 5.5 18.1453 5.5 17.0909V8.18182C5.5 7.12746 6.37304 6.27273 7.45 6.27273H8.75V5.63636C8.75 5.28491 9.04101 5 9.4 5ZM8.75 7.54545H7.45C7.09101 7.54545 6.8 7.83036 6.8 8.18182V10.0909H17.2V8.18182C17.2 7.83036 16.909 7.54545 16.55 7.54545H15.25V8.18182C15.25 8.53327 14.959 8.81818 14.6 8.81818C14.241 8.81818 13.95 8.53327 13.95 8.18182V7.54545H10.05V8.18182C10.05 8.53327 9.75899 8.81818 9.4 8.81818C9.04101 8.81818 8.75 8.53327 8.75 8.18182V7.54545ZM17.2 11.3636H6.8V17.0909C6.8 17.4424 7.09101 17.7273 7.45 17.7273H16.55C16.909 17.7273 17.2 17.4424 17.2 17.0909V11.3636Z"
                              fill="white"
                            />
                          </svg>
                        ) : (
                          <svg
                            width={14}
                            height={14}
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.4 0C4.75898 0 5.05 0.28491 5.05 0.636364V1.27273H8.95V0.636364C8.95 0.28491 9.24101 0 9.6 0C9.95899 0 10.25 0.28491 10.25 0.636364V1.27273H11.55C12.627 1.27273 13.5 2.12746 13.5 3.18182V12.0909C13.5 13.1453 12.627 14 11.55 14H2.45C1.37304 14 0.5 13.1453 0.5 12.0909V3.18182C0.5 2.12746 1.37304 1.27273 2.45 1.27273H3.75V0.636364C3.75 0.28491 4.04101 0 4.4 0ZM3.75 2.54545H2.45C2.09101 2.54545 1.8 2.83036 1.8 3.18182V5.09091H12.2V3.18182C12.2 2.83036 11.909 2.54545 11.55 2.54545H10.25V3.18182C10.25 3.53327 9.95899 3.81818 9.6 3.81818C9.24101 3.81818 8.95 3.53327 8.95 3.18182V2.54545H5.05V3.18182C5.05 3.53327 4.75898 3.81818 4.4 3.81818C4.04101 3.81818 3.75 3.53327 3.75 3.18182V2.54545ZM12.2 6.36364H1.8V12.0909C1.8 12.4424 2.09101 12.7273 2.45 12.7273H11.55C11.909 12.7273 12.2 12.4424 12.2 12.0909V6.36364Z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </Draggable>
      {open && (
        <CourseQuickViewFlyout
          observer={observer}
          onOpenChange={onOpenChange}
          open={open}
          type={urlId}
          sectionData={sectionData}
        />
      )}
    </>
  );
}
