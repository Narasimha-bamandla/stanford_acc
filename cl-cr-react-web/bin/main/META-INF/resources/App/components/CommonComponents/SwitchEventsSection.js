import React, { useCallback, useState, useEffect, useRef } from "react";
import SwitchEventsFilters from "./SwitchEventsFilters";
import OvalLoader from "./OvalLoader";
import NoDataFound from "../CommonComponents/NoDataFound";
import { POST } from "../HttpServices/index";
import SwitchEventSubmitModal from "./SwitchEventSubmitModal";
import SwitchEventDeleteModal from "./SwitchEventDeleteModal";
import CustomToolTip from "./CustomToolTip";

function SwitchEventsSection({
  initalSwitchData,
  type,
  selectedItems,
  setSelectedItems,
  selectedCalendar,
  setSelectedCalndars,
  openCards,
  switchContent,
  isContentLoading,
  onHandleCards,
  callSectionDataResponse,
  eventId,
  eventType,
  initialFilterState,
  setInitialFilterState,
  handleClickCalendarIcon,
  callApiAfterSwitching,
  dropdownActive,
  setDropdownActive,
  setTempSelectedSection,
  disableActions,
  isCalendarEnabled,
}) {
  const labels = {
    levelOptions: "Level",
    timingOptionsMap: "Timing",
    areaOptions: "Area",
    quarterOptions: "Quarter",
  };
  const [selectedSectionData, setSelectedSectonData] = useState(null);
  const [selectedTitleName, setSelectedTitleName] = useState(null);
  const [submitSelectedItem, setSubmitSelectedItem] = useState([]);
  const [submitModalData, setSubmitModalData] = useState([]);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionsDisable, setActionsDisable] = useState(false);
  const [isDeleteRequest, setIsDeleteRequest] = useState(false);
  const tooltipRef = useRef(null);
  const [deleteCourse, setDeleteCourse] = useState("");

  const tooltipHandleMouseOut = () => {
    if (tooltipRef.current) {
      tooltipRef.current.blur();
    }
  };

  const [filterData, setFilterData] = useState({
    timing: null,
    level: null,
    area: null,
    quarter: null,
    action: false,
  });

  const onSelectItems = (title, value, selectedItem) => {
    Liferay?.Session?.extend();
    setTempSelectedSection(selectedItem.sectionId);
    setSelectedItems({
      [title]: value,
    });
    setSubmitSelectedItem(selectedItem);
  };

  const handleSectionData = (title, data) => {
    setSelectedTitleName(title);
    setSelectedSectonData(data);
    setFilterData({
      timing: null,
      level: null,
      area: null,
      quarter: null,
      action: false,
    });
  };

  const getColorCode = (type) => {
    if (type == "Preference") {
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
    } else if (type == "PreferenceConflict") {
      return {
        background:
          "repeating-linear-gradient(45deg, #005b94 0, #005b94 10%, transparent 0, transparent 50%) 0% 0% / 1.5em 1.5em #019CBA",
        padding: "0px",
      }; //stripes
    }
  };

  const handleFilterList = (filter) => {
    if (filter?.label == "Timing") {
      setFilterData((prev) => ({
        ...prev,
        timing:
          filter?.value && Object.keys(filter?.value).length > 0
            ? filter.value
            : null,
        action: true,
      }));
    }

    if (filter?.label == "Level") {
      setFilterData((prev) => ({
        ...prev,
        level: filter?.value && filter?.value.length > 0 ? filter.value : null,
        action: true,
      }));
    }

    if (filter?.label == "Area") {
      setFilterData((prev) => ({
        ...prev,
        area: filter?.value && filter?.value.length > 0 ? filter.value : null,
        action: true,
      }));
    }

    if (filter?.label == "Quarter") {
      setFilterData((prev) => ({
        ...prev,
        quarter:
          filter?.value && filter?.value.length > 0 ? filter.value : null,
        action: true,
      }));
    }
  };

  const handleSwitchRequest = async (isDeleteRequest) => {
    Liferay?.Session?.extend();
    setActionsDisable(true);
    setIsDeleteRequest(isDeleteRequest);
    var switchPreferencesList = [];
    if (submitSelectedItem?.switchRequestType === "SWITCH") {
      switchPreferencesList.push({
        classId: submitSelectedItem?.classId,
        classNumber: submitSelectedItem?.classNumber,
        academicYear: submitSelectedItem?.academicYear,
        categoryName: submitSelectedItem?.mfCategoryName,
        sectionName: submitSelectedItem?.sectionName,
        groupName: submitSelectedItem?.switchGroupName,
        mfLevelName: submitSelectedItem?.mfLevelName,
        quarter: submitSelectedItem?.quarterName,
        units: submitSelectedItem?.unitsMaximum,
        gradingBasis: submitSelectedItem?.grading_basis,
        switchRequestType: isDeleteRequest
          ? "DELETE"
          : submitSelectedItem?.switchRequestType,
        fromCategoryName:
          switchContent?.switchFromSectionResponse?.mfCategoryName,
        fromSectionName: switchContent?.switchFromSectionResponse?.sectionName,
        fromGroupName:
          switchContent?.switchFromSectionResponse?.switchGroupName,
        fromMfLevelName: switchContent?.switchFromSectionResponse?.mfLevelName,
        fromQuarter: switchContent?.switchFromSectionResponse?.quarterName,
        switchPreferenceId: switchContent?.b2bPreferenceId,
        isDeleteRequest: isDeleteRequest ? isDeleteRequest : false,
      });
    } else if (submitSelectedItem?.switchRequestType === "DROP") {
      switchPreferencesList.push({
        classId: submitSelectedItem?.classId,
        classNumber: submitSelectedItem?.classNumber,
        academicYear: submitSelectedItem?.academicYear,
        categoryName: null,
        sectionName: null,
        groupName: null,
        mfLevelName: null,
        quarter: null,
        units: submitSelectedItem?.unitsMaximum,
        gradingBasis: submitSelectedItem?.grading_basis,
        switchRequestType: isDeleteRequest
          ? "DELETE"
          : submitSelectedItem?.switchRequestType,
        fromCategoryName:
          switchContent?.switchFromSectionResponse?.mfCategoryName,
        fromSectionName: switchContent?.switchFromSectionResponse?.sectionName,
        fromGroupName:
          switchContent?.switchFromSectionResponse?.switchGroupName,
        fromMfLevelName: switchContent?.switchFromSectionResponse?.mfLevelName,
        fromQuarter: switchContent?.switchFromSectionResponse?.quarterName,
        switchPreferenceId: switchContent?.b2bPreferenceId,
        isDeleteRequest: isDeleteRequest ? isDeleteRequest : false,
      });
    } else if (submitSelectedItem?.switchRequestType === "ADD") {
      switchPreferencesList.push({
        classId: submitSelectedItem?.classId,
        classNumber: submitSelectedItem?.classNumber,
        academicYear: submitSelectedItem?.academicYear,
        categoryName: submitSelectedItem?.mfCategoryName,
        sectionName: submitSelectedItem?.sectionName,
        groupName: submitSelectedItem?.switchGroupName,
        mfLevelName: submitSelectedItem?.mfLevelName,
        quarter: submitSelectedItem?.quarterName,
        units: submitSelectedItem?.unitsMaximum,
        gradingBasis: submitSelectedItem?.grading_basis,
        switchRequestType: isDeleteRequest
          ? "DELETE"
          : submitSelectedItem?.switchRequestType,
        fromCategoryName:
          switchContent?.switchFromSectionResponse?.mfCategoryName,
        fromSectionName: null,
        fromGroupName:
          switchContent?.switchFromSectionResponse?.switchGroupName,
        fromMfLevelName: null,
        fromQuarter: null,
        switchPreferenceId: switchContent?.b2bPreferenceId,
        isDeleteRequest: isDeleteRequest ? isDeleteRequest : false,
      });
    }
    try {
      var requestUrl = "/o/clcr/submit/switch-request";
      var payload = {
        eventId: eventId,
        eventType: eventType,
        switchPreferencesList: switchPreferencesList,
      };
      var params = "";
      const result = await POST(requestUrl, params, payload);
      setActionsDisable(false);
      if (result.status === 200 || result.status === 422) {
        const data = await result.json();
        setSubmitModalData(data);
        onHandleCloseSubmitModal();
      } else {
        console.error("Error in submit");
      }
    } catch (error) {
      console.error("Error in submit");
    }
  };

  const onHandleCloseSubmitModal = async () => {
    setDeleteModalOpen(false);
    setSubmitModalOpen(!submitModalOpen);
    if (submitModalOpen) {
      await Promise.all([callApiAfterSwitching()]);
    }
  };

  const onHandleCloseDeleteModal = (course) => {
    setSubmitModalOpen(false);
    setDeleteModalOpen(!deleteModalOpen);
    setDeleteCourse(course);
  };

  const onHandleDelete = () => {
    handleSwitchRequest(true);
  };

  const conflictTooltip = (msg, text) => {
    const parts = msg.split(text);
    return (
      <>
        {parts[0]}
        <CustomToolTip
          title={`Time conflict.
                  Too few Distribution units.
                  Too many units in the quarter.
                  Account hold in Axess.`}
          childComponent={
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              {text}
            </span>
          }
          switchEvent={true}
        />
        {parts[1]}
      </>
    );
  };

  useEffect(() => {
    if (filterData.action) {
      Liferay?.Session?.extend();
      callSectionDataResponse(
        selectedTitleName,
        selectedSectionData,
        filterData,
        true
      );
    }
  }, [filterData]);

  useEffect(() => {
    if (switchContent?.switchToOptions?.length > 0) {
      const tempSectionData = switchContent?.switchToOptions?.filter(
        (data) => data.selectSection
      );
      setSubmitSelectedItem(tempSectionData[0]);
    }
  }, [switchContent]);

  return (
    <>
      <section className="cr_switch_event">
        <div className="head">
          {type === "Core" ? (
            <h4>Core Requirements</h4>
          ) : type === "Distribution" ? (
            <h4>Distribution Requirements</h4>
          ) : (
            <h4>Request Extra Distribution Course</h4>
          )}
        </div>
        {initalSwitchData?.map((switchData, coreIndex) => {
          return (
            <div
              key={switchData?.section}
              id={switchData?.section}
              className="content d-flex flex-column c-gap-2"
            >
              <div className="event ">
                {switchData?.enableGreenRadioButton && (
                  <div className="count">1</div>
                )}
                <div className="event_head">
                  <button
                   aria-label={
                		    switchData?.isGroupEditable
                		      ? openCards[switchData?.section]
                		        ? `Collapse ${switchData?.section}`
                		        : `Edit ${switchData?.section}`
                		      : openCards[switchData?.section]
                		      ? `Collapse ${switchData?.section}`
                		      : `Open ${switchData?.section}`
                		  }
                    className="p-0 toggle-btn btn btn-sm active"
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setInitialFilterState({
                        Timing: [],
                        Level: [],
                        Area: [],
                        Quarter: [],
                      });
                      setDropdownActive({
                        Timing: false,
                        Level: false,
                        Area: false,
                        Quarter: false,
                      });
                      onHandleCards(switchData?.section, switchData);
                      handleSectionData(switchData?.section, switchData);
                    }}
                  >
                    {" "}
                    {switchData?.isGroupEditable ? (
                      openCards[switchData?.section] ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          style={{
                            transform: "rotate(180deg)",
                            transition: "0.3s",
                          }}
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="#8C1515"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          style={{ transition: "0.3s" }}
                        >
                          <g clipPath="url(#clip0_589_73517)">
                            <path
                              d="M9.16602 3.33417H3.33268C2.89065 3.33417 2.46673 3.50977 2.15417 3.82233C1.84161 4.13489 1.66602 4.55881 1.66602 5.00084V16.6675C1.66602 17.1095 1.84161 17.5335 2.15417 17.846C2.46673 18.1586 2.89065 18.3342 3.33268 18.3342H14.9993C15.4414 18.3342 15.8653 18.1586 16.1779 17.846C16.4904 17.5335 16.666 17.1095 16.666 16.6675V10.8342M15.416 2.08417C15.7475 1.75265 16.1972 1.56641 16.666 1.56641C17.1349 1.56641 17.5845 1.75265 17.916 2.08417C18.2475 2.41569 18.4338 2.86533 18.4338 3.33417C18.4338 3.80301 18.2475 4.25265 17.916 4.58417L9.99935 12.5008L6.66602 13.3342L7.49935 10.0008L15.416 2.08417Z"
                              stroke="#8C1515"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_589_73517">
                              <rect width="20" height="20" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      )
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        style={{
                          transform: openCards[switchData?.section]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s",
                        }}
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="#8C1515"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    )}
                  </button>
                  <div className="d-flex flex-column c-gap-2 w-100">
                    <div className="font18b">{switchData?.section}</div>
                    {openCards[switchData?.section] && (
                      <div className="d-flex flex-column c-gap-1">
                        {switchContent?.switchFromSectionResponse?.meetingTimePatterns?.map(
                          (meetingTime) => {
                            return (
                              <ul className="line_list">
                                <li className="day_time">{meetingTime}</li>
                              </ul>
                            );
                          }
                        )}
                      </div>
                    )}
                    {switchData?.switchGroupStatusText && (
                      <div className="event_alert">
                        <div style={{ height: "18px" }}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg" 
                            role="img"
                            aria-label={'Alert Message'}
                          >
                            <path
                              d="M6.00314 7.6151C6.10964 7.6151 6.21179 7.57255 6.2871 7.49681C6.36241 7.42108 6.40471 7.31836 6.40471 7.21125V4.38432C6.40471 4.27721 6.36241 4.17449 6.2871 4.09875C6.21179 4.02302 6.10964 3.98047 6.00314 3.98047C5.89663 3.98047 5.79449 4.02302 5.71918 4.09875C5.64387 4.17449 5.60156 4.27721 5.60156 4.38432V7.21125C5.60156 7.31836 5.64387 7.42108 5.71918 7.49681C5.79449 7.57255 5.89663 7.6151 6.00314 7.6151Z"
                              fill="#BB2625"
                            ></path>
                            <path
                              d="M6.00314 9.23348C6.22492 9.23348 6.40471 9.05267 6.40471 8.82963C6.40471 8.60659 6.22492 8.42578 6.00314 8.42578C5.78135 8.42578 5.60156 8.60659 5.60156 8.82963C5.60156 9.05267 5.78135 9.23348 6.00314 9.23348Z"
                              fill="#BB2625"
                            ></path>
                            <path
                              d="M1.21161 11.25H10.7884C11.0026 11.2502 11.2129 11.1932 11.398 11.0849C11.5832 10.9766 11.7364 10.8208 11.8421 10.6335C11.9479 10.4463 12.0023 10.2341 11.9999 10.0187C11.9975 9.80338 11.9384 9.59251 11.8285 9.40765L7.03968 1.34362C6.93228 1.16265 6.78002 1.01281 6.59778 0.908754C6.41554 0.804702 6.20956 0.75 6 0.75C5.79044 0.75 5.58446 0.804702 5.40222 0.908754C5.21998 1.01281 5.06771 1.16265 4.96032 1.34362L0.171529 9.40765C0.0616416 9.59251 0.00247888 9.80338 7.62161e-05 10.0187C-0.00232645 10.2341 0.052117 10.4463 0.157853 10.6335C0.263589 10.8208 0.416833 10.9766 0.601954 11.0849C0.787075 11.1932 0.997447 11.2502 1.21161 11.25ZM0.85983 9.82159L5.64942 1.75958C5.68648 1.69965 5.73812 1.6502 5.79946 1.61592C5.8608 1.58164 5.92982 1.56364 6 1.56364C6.07018 1.56364 6.1392 1.58164 6.20054 1.61592C6.26188 1.6502 6.31352 1.69965 6.35057 1.75958L11.1402 9.82159C11.1761 9.88417 11.195 9.9551 11.1952 10.0273C11.1954 10.0996 11.1768 10.1706 11.1412 10.2334C11.1056 10.2961 11.0544 10.3484 10.9925 10.3851C10.9306 10.4217 10.8602 10.4415 10.7884 10.4423H1.21161C1.13978 10.4415 1.06943 10.4217 1.00753 10.3851C0.945636 10.3484 0.894356 10.2961 0.858788 10.2334C0.82322 10.1706 0.804603 10.0996 0.804785 10.0273C0.804968 9.9551 0.823945 9.88417 0.85983 9.82159Z"
                              fill="#BB2625"
                            ></path>
                          </svg>
                        </div>
                        <div className="font12">
                          {switchData?.switchGroupStatusText?.includes(
                            "conflict or issue"
                          )
                            ? conflictTooltip(
                                switchData?.switchGroupStatusText,
                                "conflict or issue"
                              )
                            : switchData?.switchGroupStatusText}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {openCards?.[switchData?.section] === switchData?.section ? (
                  isContentLoading ? (
                    <OvalLoader />
                  ) : (
                    <>
                      {switchContent ? (
                        <div className="event_content ">
                          {switchContent?.isGroupEditable && (
                            <div className="filters">
                              {Object.keys(
                                switchContent?.switchToFilterOptions
                              ).map((key) => {
                                return (
                                  <>
                                    {switchContent?.switchToFilterOptions?.[
                                      key
                                    ] && (
                                      <SwitchEventsFilters
                                        key={key}
                                        dropDownList={
                                          switchContent
                                            ?.switchToFilterOptions?.[key]
                                        }
                                        label={labels?.[key]}
                                        filterList={handleFilterList}
                                        initialFilterState={initialFilterState}
                                        setInitialFilterState={
                                          setInitialFilterState
                                        }
                                        dropdownActive={dropdownActive}
                                        setDropdownActive={setDropdownActive}
                                      />
                                    )}
                                  </>
                                );
                              })}
                            </div>
                          )}
                          <div>
                            <div className="py-3 px-2 frm-list">
                              {switchContent?.switchToOptions?.map(
                                (content, contentIndex) => {
                                  return (
                                    <>
                                      <section
                                        className={`d-flex c-gap-2 align-items-start  pt-2  pr-0 frm-item ${
                                          content?.isSectionEditable &&
                                          switchContent.isGroupEditable
                                            ? ""
                                            : "disabled"
                                        }`}
                                        key={content?.sectionName}
                                      >
                                        {content?.conflictStatus && (
                                          <div
                                            className="tag-line"
                                            style={getColorCode(
                                              content?.conflictStatus
                                            )}
                                          />
                                        )}
                                        <div className="custom-control custom-radio custom-control-outside">
                                          <label>
                                            <input
                                              aria-label="Collapse Listings"
                                              role="checkbox"
                                              aria-checked="false"
                                              tabIndex="0"
                                              className="custom-control-input sm"
                                              type="radio"
                                              checked={
                                                selectedItems[
                                                  switchData?.section
                                                ] === content?.sectionName
                                              }
                                              disabled={
                                                disableActions ||
                                                content?.selectSection
                                                  ? false
                                                  : !switchContent?.isGroupEditable
                                                  ? true
                                                  : content?.sectionName ===
                                                    switchContent?.selectedSection
                                                  ? false
                                                  : !content?.isSectionEditable
                                              }
                                              onClick={(event) => {
                                                if (!disableActions) {
                                                  onSelectItems(
                                                    switchData?.section,
                                                    content?.sectionName,
                                                    content
                                                  );
                                                }
                                              }}
                                            ></input>
                                            <span className="custom-control-label"></span>
                                          </label>
                                        </div>
                                        <div
                                          className={`d-flex   c-gap-2 w-100 ${
                                            content?.switchRequestType == "DROP"
                                              ? ""
                                              : "pb-3"
                                          } ${
                                            contentIndex <
                                            switchContent?.switchToOptions
                                              ?.length -
                                              1
                                              ? "border-bottom"
                                              : ""
                                          }`}
                                        >
                                          <div className="d-flex flex-column c-gap-2 w-100">
                                            <div
                                              className={
                                                content?.switchRequestType ==
                                                "DROP"
                                                  ? ""
                                                  : "coursedetail-tooltip-containter"
                                              }
                                              ref={tooltipRef}
                                              onMouseLeave={
                                                tooltipHandleMouseOut
                                              }
                                              onMouseOut={tooltipHandleMouseOut}
                                              tabIndex="0"
                                            >
                                              {content?.isSectionEditable &&
                                                switchContent.isGroupEditable && (
                                                  <div className="coursedetail-tooltip">
                                                    <strong>
                                                      {content?.sectionTitle}
                                                    </strong>
                                                    <div className="names">
                                                      {content?.instructors?.join(
                                                        ", "
                                                      )}
                                                    </div>
                                                    <div className="switchcount">
                                                      Number of requests
                                                      awaiting switch:{" "}
                                                      {
                                                        content?.numberOfRequestsAwaitingSwitch
                                                      }
                                                    </div>
                                                  </div>
                                                )}{" "}
                                              <strong>
                                                {`${
                                                  content?.switchRequestType ==
                                                  "DROP"
                                                    ? "Drop Enrollment"
                                                    : `${
                                                        content?.switchGroupName ||
                                                        ""
                                                      }${
                                                        content?.switchGroupName
                                                          ? " - "
                                                          : ""
                                                      }${
                                                        content?.sectionDisplayName ||
                                                        ""
                                                      }${
                                                        content?.mfLevelName
                                                          ? `, ${content?.mfLevelName}`
                                                          : ""
                                                      }${
                                                        content?.quarterName
                                                          ? `, ${content?.quarterName}`
                                                          : ""
                                                      }`
                                                }`}
                                              </strong>
                                            </div>
                                            <div class="d-flex flex-column c-gap-1">
                                              {content?.switchRequestType !=
                                                "DROP" && (
                                                <>
                                                  {content?.meetingTimePatterns?.map(
                                                    (
                                                      timePattern,
                                                      timeIndex
                                                    ) => {
                                                      return (
                                                        <ul className="line_list">
                                                          <li
                                                            className="day_time"
                                                            key={
                                                              timePattern +
                                                              timeIndex
                                                            }
                                                          >
                                                            {timePattern}
                                                          </li>
                                                        </ul>
                                                      );
                                                    }
                                                  )}
                                                </>
                                              )}
                                            </div>
                                            <ul className="tag_list">
                                              {content?.isLimitedCapacity && (
                                                <li>
                                                  <span
                                                    className="tag sm yellow "
                                                    style={
                                                      content?.switchRequestType ===
                                                      "DROP"
                                                        ? {
                                                            marginBottom:
                                                              "15px",
                                                          }
                                                        : undefined
                                                    }
                                                  >
                                                    <strong>
                                                      LIMITED SEATS
                                                    </strong>
                                                  </span>
                                                </li>
                                              )}
                                              {content?.enableTimeConflictTag && (
                                                <li>
                                                  <div
                                                    className="timeconflict-tooltip-containter"
                                                    tabIndex="0"
                                                  >
                                                    {content?.enableTimeConflictTag &&
                                                      content?.isSectionEditable &&
                                                      switchContent?.isGroupEditable && (
                                                        <div className="timeconflict-tooltip">
                                                          {content?.conflictedSections?.map(
                                                            (
                                                              conflictData,
                                                              index
                                                            ) => {
                                                              return (
                                                                <div
                                                                  className="item"
                                                                  key={index}
                                                                >
                                                                  <strong>
                                                                    <p
                                                                      style={{
                                                                        marginBottom:
                                                                          "3px",
                                                                      }}
                                                                    >
                                                                      Conflict
                                                                      with{" "}
                                                                      {
                                                                        conflictData?.conflictSection
                                                                      }
                                                                    </p>
                                                                  </strong>
                                                                  {conflictData?.meetingTimePattern?.map(
                                                                    (
                                                                      timePattern,
                                                                      timpatIndex
                                                                    ) => {
                                                                      const [
                                                                        dayTime,
                                                                        dateRange,
                                                                      ] =
                                                                        timePattern.split(
                                                                          "|"
                                                                        );
                                                                      return (
                                                                        <ul className="line_list">
                                                                          <li
                                                                            className="day_time"
                                                                            key={
                                                                              timePattern +
                                                                              timpatIndex
                                                                            }
                                                                          >
                                                                            <div>
                                                                              {dayTime.trim()}
                                                                              {
                                                                                " |"
                                                                              }
                                                                            </div>{" "}
                                                                            <div>
                                                                              {dateRange.trim()}
                                                                            </div>{" "}
                                                                          </li>
                                                                        </ul>
                                                                      );
                                                                    }
                                                                  )}
                                                                </div>
                                                              );
                                                            }
                                                          )}
                                                        </div>
                                                      )}{" "}
                                                    <span
                                                      className="tag sm "
                                                      style={
                                                        content?.switchRequestType ===
                                                        "DROP"
                                                          ? {
                                                              marginBottom:
                                                                "15px",
                                                            }
                                                          : undefined
                                                      }
                                                    >
                                                      <strong>
                                                        TIME CONFLICT
                                                      </strong>
                                                    </span>
                                                  </div>
                                                </li>
                                              )}
                                              {content?.enableUnitConflictTag && (
                                                <li>
                                                  {" "}
                                                  <span
                                                    className="tag sm "
                                                    style={
                                                      content?.switchRequestType ===
                                                      "DROP"
                                                        ? {
                                                            marginBottom:
                                                              "15px",
                                                          }
                                                        : undefined
                                                    }
                                                  >
                                                    <strong>
                                                      UNIT CONFLICT
                                                    </strong>
                                                  </span>
                                                </li>
                                              )}
                                            </ul>
                                            {!content?.isSectionEditable &&
                                              switchContent.isGroupEditable && (
                                                <div className="event_alert ">
                                                  <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                  >
                                                    <path
                                                      d="M6.00314 7.6151C6.10964 7.6151 6.21179 7.57255 6.2871 7.49681C6.36241 7.42108 6.40471 7.31836 6.40471 7.21125V4.38432C6.40471 4.27721 6.36241 4.17449 6.2871 4.09875C6.21179 4.02302 6.10964 3.98047 6.00314 3.98047C5.89663 3.98047 5.79449 4.02302 5.71918 4.09875C5.64387 4.17449 5.60156 4.27721 5.60156 4.38432V7.21125C5.60156 7.31836 5.64387 7.42108 5.71918 7.49681C5.79449 7.57255 5.89663 7.6151 6.00314 7.6151Z"
                                                      fill="#BB2625"
                                                    ></path>
                                                    <path
                                                      d="M6.00314 9.23348C6.22492 9.23348 6.40471 9.05267 6.40471 8.82963C6.40471 8.60659 6.22492 8.42578 6.00314 8.42578C5.78135 8.42578 5.60156 8.60659 5.60156 8.82963C5.60156 9.05267 5.78135 9.23348 6.00314 9.23348Z"
                                                      fill="#BB2625"
                                                    ></path>
                                                    <path
                                                      d="M1.21161 11.25H10.7884C11.0026 11.2502 11.2129 11.1932 11.398 11.0849C11.5832 10.9766 11.7364 10.8208 11.8421 10.6335C11.9479 10.4463 12.0023 10.2341 11.9999 10.0187C11.9975 9.80338 11.9384 9.59251 11.8285 9.40765L7.03968 1.34362C6.93228 1.16265 6.78002 1.01281 6.59778 0.908754C6.41554 0.804702 6.20956 0.75 6 0.75C5.79044 0.75 5.58446 0.804702 5.40222 0.908754C5.21998 1.01281 5.06771 1.16265 4.96032 1.34362L0.171529 9.40765C0.0616416 9.59251 0.00247888 9.80338 7.62161e-05 10.0187C-0.00232645 10.2341 0.052117 10.4463 0.157853 10.6335C0.263589 10.8208 0.416833 10.9766 0.601954 11.0849C0.787075 11.1932 0.997447 11.2502 1.21161 11.25ZM0.85983 9.82159L5.64942 1.75958C5.68648 1.69965 5.73812 1.6502 5.79946 1.61592C5.8608 1.58164 5.92982 1.56364 6 1.56364C6.07018 1.56364 6.1392 1.58164 6.20054 1.61592C6.26188 1.6502 6.31352 1.69965 6.35057 1.75958L11.1402 9.82159C11.1761 9.88417 11.195 9.9551 11.1952 10.0273C11.1954 10.0996 11.1768 10.1706 11.1412 10.2334C11.1056 10.2961 11.0544 10.3484 10.9925 10.3851C10.9306 10.4217 10.8602 10.4415 10.7884 10.4423H1.21161C1.13978 10.4415 1.06943 10.4217 1.00753 10.3851C0.945636 10.3484 0.894356 10.2961 0.858788 10.2334C0.82322 10.1706 0.804603 10.0996 0.804785 10.0273C0.804968 9.9551 0.823945 9.88417 0.85983 9.82159Z"
                                                      fill="#BB2625"
                                                    ></path>
                                                  </svg>
                                                  {
                                                    content?.switchToSectionStatusText
                                                  }
                                                </div>
                                              )}
                                          </div>
                                          {content?.isSectionEditable &&
                                            switchContent.isGroupEditable &&
                                            content?.switchRequestType !==
                                              "DROP" && (
                                              <div className="btn-group w-auto">
                                                {" "}
                                                <button
                                                  aria-label={`${
                                                    content?.calendar
                                                      ? "Remove"
                                                      : "Add"
                                                  } ${content?.sectionTitle} ${
                                                    content?.calendar
                                                      ? "from"
                                                      : "to"
                                                  } the calendar`}
                                                  className={`btn sm-btn secondary-btn calendar-btn ${
                                                    content?.calendar
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  type="button"
                                                  onClick={() =>
                                                    handleClickCalendarIcon(
                                                      content,
                                                      switchContent.switchFromSectionResponse,
                                                      content?.calendar
                                                    )
                                                  }
                                                  disabled={!isCalendarEnabled}
                                                >
                                                  <svg
                                                    fill="none"
                                                    height="14"
                                                    viewBox="0 0 14 14"
                                                    width="14"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                  >
                                                    <path
                                                      clipRule="evenodd"
                                                      d="M4.4 0C4.75898 0 5.05 0.28491 5.05 0.636364V1.27273H8.95V0.636364C8.95 0.28491 9.24101 0 9.6 0C9.95899 0 10.25 0.28491 10.25 0.636364V1.27273H11.55C12.627 1.27273 13.5 2.12746 13.5 3.18182V12.0909C13.5 13.1453 12.627 14 11.55 14H2.45C1.37304 14 0.5 13.1453 0.5 12.0909V3.18182C0.5 2.12746 1.37304 1.27273 2.45 1.27273H3.75V0.636364C3.75 0.28491 4.04101 0 4.4 0ZM3.75 2.54545H2.45C2.09101 2.54545 1.8 2.83036 1.8 3.18182V5.09091H12.2V3.18182C12.2 2.83036 11.909 2.54545 11.55 2.54545H10.25V3.18182C10.25 3.53327 9.95899 3.81818 9.6 3.81818C9.24101 3.81818 8.95 3.53327 8.95 3.18182V2.54545H5.05V3.18182C5.05 3.53327 4.75898 3.81818 4.4 3.81818C4.04101 3.81818 3.75 3.53327 3.75 3.18182V2.54545ZM12.2 6.36364H1.8V12.0909C1.8 12.4424 2.09101 12.7273 2.45 12.7273H11.55C11.909 12.7273 12.2 12.4424 12.2 12.0909V6.36364Z"
                                                      fill="currentColor"
                                                      fillRule="evenodd"
                                                    ></path>
                                                  </svg>
                                                </button>
                                              </div>
                                            )}
                                        </div>
                                      </section>
                                    </>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <NoDataFound />
                      )}
                      
                      {openCards[switchData?.section] &&
                        switchContent?.isGroupEditable && (
                          <div className="btn-group push-right w-auto " style={{ position: "absolute", right: 20, top: 12 }}>
                            {switchContent?.displayDeleteRequest && (
                              <button
                                className="sdfd-btn sm-btn secondary-btn"
                                onClick={() =>
                                  onHandleCloseDeleteModal(switchData?.section)
                                }
                                disabled={actionsDisable || disableActions}
                              >
                                Delete Request
                              </button>
                            )}
                            {switchContent?.textInSubmitButton && (
                              <button
                                className="sdfd-btn sm-btn primary-btn"
                                disabled={
                                  disableActions ||
                                  actionsDisable ||
                                  (selectedItems?.[switchData?.section] ===
                                  switchContent?.selectedSection
                                    ? true
                                    : Object.keys(selectedItems)?.length === 0)
                                }
                                onClick={() => handleSwitchRequest(false)}
                              >
                                {switchContent?.textInSubmitButton}
                              </button>
                            )}
                          </div>
                        )}
                    </>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
      </section>
      <SwitchEventSubmitModal
        data={submitModalData}
        onHandleClose={onHandleCloseSubmitModal}
        open={submitModalOpen}
        submitType={switchContent?.textInSubmitButton}
        submitSelectedItemType={submitSelectedItem?.switchRequestType}
        isDeleteRequest={isDeleteRequest}
      />
      <SwitchEventDeleteModal
        onHandleClose={onHandleCloseDeleteModal}
        open={deleteModalOpen}
        onHandleDelete={onHandleDelete}
        submitSelectedItem={submitSelectedItem}
        actionsDisable={actionsDisable}
        deleteCourse={deleteCourse}
      />
    </>
  );
}

export default SwitchEventsSection;
