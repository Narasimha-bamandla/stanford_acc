import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useModal } from "@clayui/modal";
import CourseQuickViewFlyout from "../CourseRegistration/CourseQuickViewFlyout/index";

export default function RPSectionCard({
  id,
  sectionData,
  index,
  isChecked,
  onCheckboxChange,
  urlId,
  isQuarterEnabled,
  readAccessEnabled,
  searchValue,
  highlightNameAndSearchValue,
}) {
  const { observer, onOpenChange, open } = useModal();

  return (
    <>
      <Draggable
        draggableId={id?.toString()}
        index={index}
        isDragDisabled={readAccessEnabled}
      >
        {(provided) => (
          <div
            className={urlId == "Core" ? "" : "cr_course_item mb-3"}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            role={"listitem"}
            aria-controls="submitErrorMsg"
          >
            <h3 class="visuallyHidden">{sectionData?.title}</h3>
            <table>
              <colgroup>
                <col width="3%" />
                <col width={urlId == "Core" ? "35%" : "29%"} />
                <col width={urlId == "Core" ? "45%" : "47%"} />
                <col width={urlId == "Core" ? "17%" : "23%"} />
              </colgroup>
              <tbody>
                <tr id={sectionData.classNumber}>
                  <td
                    style={{
                      background: "#D5D5D4",
                      padding: "0",
                      height: "20px",
                    }}
                  >
                    <div className="checkbox-dragicon">
                      <div className="custom-checkbox">
                        <input
                          id={`courseitem${id}`}
                          type="checkbox"
                          name={sectionData?.section_name}
                          value={id}
                          checked={isChecked}
                          onChange={onCheckboxChange}
                          disabled={readAccessEnabled}
                          aria-hidden="true"
                          aria-label={`${
                            isChecked ? "Select" : "Unselect"
                          } checkbox for ${sectionData?.sectionTitle}`}
                        />
                        <label
                          // aria-label={`${
                          //   isChecked ? "Select" : "Unselect"
                          // } checkbox for ${sectionData?.sectionTitle}`}
                          htmlFor={`courseitem${id}`}
                        >
                          &nbsp;
                        </label>
                      </div>
                      <button
                        className="btn btn-unstyled drag-icon"
                        aria-label="Drag and Drop Course Item"
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
                  <td>
                    <div className="d-flex flex-column c-gap-1">
                      <div className="d-flex flex-row c-gap-2">
                        <span
                          style={{ flex: 2, width: "216px" }}
                          className="font16b"
                        >
                          <button
                            className="lfr-portal-tooltip btn-unstyled"
                            data-tooltip-align="top"
                            data-bs-toggle="tooltip"
                            role="tooltip"
                            tabIndex={0}
                            data-title={
                              urlId == "Core"
                                ? sectionData.category_name !== null &&
                                  `${sectionData?.category_name} - ${sectionData?.group_name}`
                                : undefined
                            }
                            aria-label={
                              urlId == "Core"
                                ? sectionData.category_name !== null &&
                                  `${sectionData?.category_name} - ${sectionData?.group_name}`
                                : undefined
                            }
                            onClick={() => onOpenChange(true)}
                          >
                            <span
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {searchValue.length > 0 ? (
                                <>
                                  {highlightNameAndSearchValue(
                                    sectionData?.sectionTitle
                                  )}
                                </>
                              ) : (
                                <>{sectionData?.sectionTitle}</>
                              )}
                            </span>
                          </button>
                        </span>
                        {urlId == "Core" ? (
                          <>
                            {sectionData?.recommended && (
                              <span
                                aria-label="This section is recommended for you as per your study plan."
                                className="tag sm lfr-portal-tooltip"
                                data-tooltip-align="top"
                                role="tooltip"
                                tabIndex={0}
                                title="This section is recommended for you as per your study plan."
                                style={{ flex: 1 }}
                              >
                                <strong>RECOMMENDED</strong>
                              </span>
                            )}
                            {sectionData?.permissionRequired && (
                              <div
                                className="lfr-portal-tooltip"
                                data-tooltip-align="top"
                                tabIndex={0}
                                aria-label="Permission Required"
                                title={sectionData?.permissionRequired}
                                style={{ flex: 1, marginLeft: "8px" }}
                              >
                                <img
                                  alt="Lock"
                                  src="/o/stanford-clce-theme/images/icons/lock-icon.svg"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {sectionData?.permissionRequired && (
                              <div
                                className="lfr-portal-tooltip"
                                data-tooltip-align="top"
                                tabIndex={0}
                                aria-label="Permission Required"
                                title={sectionData?.permissionRequired}
                                style={{ flex: 1 }}
                              >
                                <img
                                  alt="Lock"
                                  src="/o/stanford-clce-theme/images/icons/lock-icon.svg"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="wrap2lines">
                        {searchValue.length > 0 ? (
                          <>{highlightNameAndSearchValue(sectionData?.title)}</>
                        ) : (
                          <>{sectionData?.title}</>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="font12 px-3">
                    <div className="grid-cell c-gap-2">
                      {" "}
                      <strong>Timings:</strong>
                      <div className="d-flex flex-column c-gap-2">
                        {sectionData?.meetingTimeList?.map(
                          (timePattern, timeIndex) => (
                            <div key={timeIndex}>{timePattern}</div>
                          )
                        )}
                      </div>
                      <strong>Instructors:</strong>
                      <div>
                        {searchValue.length > 0 ? (
                          <>
                            {highlightNameAndSearchValue(
                              sectionData?.instructors?.join(", ")
                            )}
                          </>
                        ) : (
                          <>{sectionData?.instructors?.join(", ")}</>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="font12 pr-3">
                    <div className="grid-cell c-gap-2">
                      <strong>Units:</strong>
                      <span>{sectionData?.units}</span>
                      {isQuarterEnabled && (
                        <>
                          <strong>Quarter:</strong>
                          <span>{sectionData?.quarter}</span>
                        </>
                      )}
                      {urlId == "Core" ? (
                        <>
                          <strong>Level:</strong>{" "}
                          <span>{sectionData?.level}</span>
                        </>
                      ) : (
                        <>
                          <strong>Grading Basis:</strong>{" "}
                          <span>{sectionData?.apfa_desc_short}</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
