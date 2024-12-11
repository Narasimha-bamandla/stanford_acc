import React, { useState, useEffect } from "react";
import { Text, Heading } from "@clayui/core";
import ClayButton from "@clayui/button";
import ClayLayout from "@clayui/layout";
import { VisualizerCal } from "./VisualizerCal";
import { VisualizerDataArrange } from "./VisualizerDataArrange";
import { scheduleData } from "./VisualizerData";
import { SampleVisuilizerData } from "./VisualizerData";

export default function Visualizer({
  handleExpandVisulizer,
  expandStyle,
  VisualizerData,
  callVisualizerApi,
  eventType,
  eventId,
  handleDelete,
  adminMessages,
  visualizerWeekIndex,
  isDeleteEnabled,
}) {
  const [quaterArrayList, setQuaterArrayList] = useState([]);
  const [quaterName, setQuaterName] = useState(null);
  const [marginleft, setmarginLeft] = useState("");
  const [toolTipDataArray, setToolTipDataArray] = useState([]);
  const [isHidden, setIsHidden] = useState(true);

  // Function to hide aria-controls when not hovered or blurred
  const handleHide = () => {
    setIsHidden(true);
  };
  const time = [
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
  ];

  const [weekArray, setWeekArray] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [displayedWeeks, setDisplayedWeeks] = useState([]);

  const [yearData, setYear] = useState("");
  const [seasonData, setSeasonData] = useState("");
  const [hoveredInfo, setHoveredInfo] = useState(false);
  const [toolTipData, setToolTipData] = useState([]);
  const [marginBottom, setMarginBottom] = useState("");
  const [marginTop, setMarginTop] = useState("");
  const [WeekActiveIndex, setWeekActiveIndex] = useState(0);

  const numRows = time.length;
  const numCols = 6;
  const [newVisualizerData, setNewVisualizerData] = useState([]);
  const EmptytableRows = [];
  for (let i = 0; i < numRows; i++) {
    const cells = [];
    for (let j = 0; j < numCols; j++) {
      if (j === 0) {
        cells.push(
          <td style={{ height: "21.5px" }} key={`cell-${i}-${j}`}>
            {time[i]}
          </td>
        );
      } else {
        cells.push(
          <td style={{ height: "21.5px" }} key={`cell-${i}-${j}`}></td>
        );
      }
    }
    EmptytableRows.push(<tr key={`row-${i}`}>{cells}</tr>);
  }

  const handleSeasonYearDataChange = (season, year, quarter) => {
    setDisplayedWeeks([]);
    setWeekArray([]);
    setSeasonData(season);
    setQuaterName(quarter);
    setYear(year);
    const tempWeek = null;
    getWeeKActiveData(tempWeek, 0, quarter);
  };
  const extractValueFromCalc = (expression) => {
    const cleanedExpression = expression.replace("calc(", "").replace(")", "");
    const result = eval(cleanedExpression.replace(/px/g, ""));
    return result;
  };

  const getWeeKActiveData = (week, index, quarter) => {
    setNewVisualizerData([]);
    callVisualizerApi(week, quarter, index);
    setWeekActiveIndex(index);
  };

  const getTooltipContent = (position, event) => {
    let marginData =
      expandStyle == "12" ? event.expandMarginLeft : event.marginLeft;

    setmarginLeft(marginData);
    setToolTipData(event);
    setHoveredInfo(true);
    const result = `calc(326px - ${position} - ${event.CalbottomPosition} )`;
    const extractedValue = extractValueFromCalc(result);
    const finalResultValue = `${extractedValue - event.extraHeight}px`;

    if (extractedValue > 283) {
      const finalResult = Math.abs(extractedValue - 388);
      const modifiedFinalValue = event.extraHeight + finalResult;
      setMarginTop(`${modifiedFinalValue}px`);
      setMarginBottom(`0px`);
    } else {
      setMarginBottom(finalResultValue);
      setMarginTop(`0px`);
    }
  };

  const closeTooltipContent = () => {
    setHoveredInfo(false);
    setIsHidden(true);
  };

  const formatConflictSections = (sections) => {
    if (sections.length === 2) {
      return sections.join(" and ");
    } else if (sections.length > 2) {
      return `${sections.slice(0, -1).join(", ")} and ${
        sections[sections.length - 1]
      }`;
    } else {
      return sections[0];
    }
  };

  const handleLeftArrow = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 5);
      getWeekPattern(startIndex - 5);
      const weekid = startIndex - 5;
      const weekValue = weekArray[weekid];
      getWeeKActiveData(weekValue, 0, quaterName);
    }
  };

  const handleRightArrow = () => {
    if (startIndex + 5 < weekArray.length) {
      setStartIndex(startIndex + 5);
      getWeekPattern(startIndex + 5);
      const weekid = startIndex + 5;
      const weekValue = weekArray[weekid];
      getWeeKActiveData(weekValue, 0, quaterName);
    }
  };

  const getWeekPattern = (Index) => {
    const weekPatternsArray = VisualizerData?.weekPatterns;
    const ModifiedWeeksList = weekPatternsArray.slice(Index, Index + 5);
    setDisplayedWeeks(ModifiedWeeksList);
  };

  const getData = () => {
    setToolTipDataArray([]);
    const weekPatternsArray = VisualizerData?.weekPatterns;
    const QuaterList = VisualizerData?.quartersDropDown;
    const modifiedData = VisualizerDataArrange({ data: VisualizerData });
    const updatedVisualizerData = VisualizerCal({ data: modifiedData });
    setNewVisualizerData(updatedVisualizerData);
    if (weekPatternsArray && weekPatternsArray.length > 0) {
      setWeekArray(weekPatternsArray);
      getWeekPattern(startIndex);
    } else {
      setWeekArray([]);
      setDisplayedWeeks([]);
    }
    if (QuaterList?.length > 0) {
      const ModifiedQuaterList = QuaterList.map((item, index) => {
        const [season, year] = item.split(" ");
        return {
          id: index + 1,
          season: season.charAt(0).toUpperCase() + season.slice(1),
          year: year.includes("-")
            ? year
            : year.replace(/(\d{4})(\d{4})/, "$1-$2"),
          quater: item,
        };
      });
      var year = ModifiedQuaterList[0].year;
      var quater = ModifiedQuaterList[0].season;
      var QuaterName = ModifiedQuaterList[0].quater;
      if (quaterArrayList.length == 0) {
        setQuaterArrayList(ModifiedQuaterList);
        setQuaterName(QuaterName);
        setYear(year);
        setSeasonData(quater);
      }
    }
  };

  const getBackgroundStyleForConflict = (event) => {
    var conflictValue = event?.conflictStatus;
    if (conflictValue.toUpperCase() == "NOCONFLICT") {
      return {
        background: "#009CBA",
        color: "#fff",
      };
    }
    if (conflictValue.toUpperCase() == "CONFLICT") {
      return {
        background: "#bb2625",
        color: "#fff",
      };
    }
    if (conflictValue.toUpperCase() == "PREFERENCECONFLICT") {
      return {
        background:
          "repeating-linear-gradient(45deg, #005b94 0, #005b94 10%, transparent 0, transparent 50%) 0% 0% / 1.5em 1.5em #019CBA",
        color: "#fff",
      };
    }
    if (conflictValue.toUpperCase() == "ENROLLED") {
      return {
        background: "#7cdb06",
        color: "#2E2D29",
      };
    }
  };

  const getBackgroundStyle = (event) => {
    if (event?.enrolled) {
      return {
        background: "#7cdb06",
        color: "#2E2D29", //green
      };
    } else if (event?.preference) {
      if (event?.conflictStatus == "NoConflict") {
        return {
          background: "#009CBA",
          color: "#fff",
        }; //teal
      }

      if (event?.conflictStatus == "Conflict") {
        return {
          background: "#bb2625",
          color: "#fff",
        }; //red
      }

      if (event?.conflictStatus == "PreferenceConflict") {
        return {
          background:
            "repeating-linear-gradient(45deg, #005b94 0, #005b94 10%, transparent 0, transparent 50%) 0% 0% / 1.5em 1.5em #019CBA",
          color: "#fff",
        };
      }
    }
  };

  const handleMoreSection = (Data) => {
    const sectionId = Data.classNumber;
    // window.visualizerScroll(sectionId);
    window.visualizerScrollForCR(sectionId);
  };

  const handleScroll = (payload) => {
    const targetSection = document.getElementById(payload);
    window.scrollTo({
      top: targetSection?.offsetTop,
      behavior: "smooth",
    });
  };

  const handleToolTipIndex = (position, event, eventIndex, sectionId) => {
    const result = `calc(326px - ${position} - ${event.CalbottomPosition})`;
    const extractedValue = extractValueFromCalc(result);
    const finalResultValue = `${extractedValue - event.extraHeight}px`;
    var matched = false;
    for (const toolTipData of toolTipDataArray) {
      if (toolTipData.id == event.uniqueID) {
        matched = true;
        break;
      } else {
        matched = false;
      }
    }
    if (matched) {
      const updatedToolTipDataArray = toolTipDataArray.filter(
        (item) => item.id !== event.uniqueID
      );
      setToolTipDataArray(updatedToolTipDataArray);
    } else {
      let marginData =
        expandStyle == "12" ? event.expandMarginLeft : event.marginLeft;
      var tempBottomData;
      var tempTopData;
      if (extractedValue > 283) {
        var finalResult = Math.abs(extractedValue - 388);
        const modifiedFinalValue = event.extraHeight + finalResult;
        tempTopData = `${modifiedFinalValue}px`;
        tempBottomData = `0px`;
      } else {
        tempBottomData = finalResultValue;
        tempTopData = `0px`;
      }
      var tooltipDatas = {
        id: event.uniqueID,
        marginBottom: tempBottomData,
        marginTop: tempTopData,
        events: event,
        marginleft: marginData,
        sectionIds: sectionId,
      };
      setToolTipDataArray([tooltipDatas]);
    }
  };

  const getTooltipIcon = (event) => {
    if (event?.enrolled) {
      return "/o/stanford-clce-theme/images/icons/check_circle_icon.svg";
    } else if (event?.preference) {
      if (event?.conflictStatus == "NoConflict") {
        return "/o/stanford-clce-theme/images/icons/visulizer-preference-calender-icon.svg";
      }
      if (event?.conflictStatus == "Conflict") {
        return "/o/stanford-clce-theme/images/icons/alert_triangle_white_icon.svg";
      }
      if (event?.conflictStatus == "PreferenceConflict") {
        return "/o/stanford-clce-theme/images/icons/alert_triangle_white_icon.svg";
      }
    }
  };

  useEffect(() => {
    if (VisualizerData) {
      getData();
    }
  }, [VisualizerData]);

  useEffect(() => {
    setWeekActiveIndex(visualizerWeekIndex);
  }, [visualizerWeekIndex]);

  return (
    <div className={`col-md-${expandStyle}`}>
      <div className="Visualizer" tabindex="0">
        <ClayLayout.ContainerFluid>
          <ClayLayout.Row
            justify="center"
            style={{ padding: "11px", borderBottom: "1px solid #D5D5D4" }}
          >
            <ClayLayout.Col
              size={12}
              align={"center"}
              className="visualizer-header"
              style={{ padding: "0px", border: "none" }}
            >
              <Text size={3} className weight="semi-bold">
                VISUALIZER
              </Text>
              <img
                alt={expandStyle == "12" ? "Collapse" : "Expand"}
                src={
                  expandStyle == "12"
                    ? "/o/stanford-clce-theme/images/icons/collapseIcon.svg"
                    : "/o/stanford-clce-theme/images/icons/expand_icon.svg"
                }
                style={{
                  position: "relative",
                  left: expandStyle == "12" ? "45%" : "35%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleExpandVisulizer();
                  setToolTipDataArray([]);
                }}
              />
            </ClayLayout.Col>
          </ClayLayout.Row>
          {VisualizerData && (
            <>
              <ClayLayout.Row>
                <div className="search-filter" style={{ height: "30px" }}>
                  <div
                    className="DropdownList checkmark dropdown  dropdown-btn  "
                    style={{ width: "auto" }}
                  >
                    <button
                      className={"dropdown-toggle btn  "}
                      type="button"
                      aria-controls="Visualizer-dropdown-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                      modern
                      style={{
                        marginLeft: "0px",
                        padding: "10px 20px",
                        top: "35px",
                        minWidth: "170px",
                        left: "10px",
                      }}
                    >
                      <span className="inline-item inline-item-text">
                        <Heading
                          level={6}
                          weight="semi-bold"
                          marginBottom={0}
                          size={4}
                        >
                          {seasonData}
                          <Text
                            size={4}
                            className
                            weight="normal"
                            marginLeft={5}
                          >
                            &nbsp; {yearData}
                          </Text>
                        </Heading>
                      </span>
                      <svg
                        className="arrow"
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        alt="QuatersDropdown"
                      >
                        <path
                          d="M3.19995 6.40039L7.99995 11.2004L12.8 6.40039"
                          stroke="#2E2D29"
                          strokeWidth="1.5"
                          strokeLinecap="square"
                          strokeLinejoin="bevel"
                        />
                      </svg>
                    </button>
                    <div
                      id="Visualizer-dropdown-menu"
                      className="dropdown-menu"
                      role="presentation"
                      style={{ top: "35px", minWidth: "170px", left: "10px" }}
                    >
                      {quaterArrayList?.map((item) => (
                        <div role="presentation" key={item.id}>
                          <button
                            className="dropdown-item"
                            role="menuitem"
                            tabindex="-1"
                            onClick={() => {
                              handleSeasonYearDataChange(
                                item.season,
                                item.year,
                                item.quater
                              );
                            }}
                          >
                            {item.season} {item.year}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ClayLayout.Row>
              <ClayLayout.Row style={{ paddingTop: 5 }}>
                <ClayLayout.Col size={12} align={"left"}>
                  <div className="weeks">
                    {VisualizerData?.weekPatterns?.length > 5 && (
                      <ClayButton
                        style={{ minWidth: "30px" }}
                        onClick={handleLeftArrow}
                      >
                        <svg
                          width="9"
                          height="12"
                          viewBox="0 0 9 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.744812 6.33728L6.71121 11.8403L8.25781 10.4135L3.83802 6.33728L8.25781 2.26102L6.71121 0.834227L0.744812 6.33728Z"
                            fill="currentColor"
                          />
                        </svg>
                      </ClayButton>
                    )}
                    {displayedWeeks.map((week, index) => (
                      <ClayButton
                        key={index}
                        className={index === WeekActiveIndex ? "active" : ""}
                        aria-pressed={index === WeekActiveIndex ? true : false}
                        size={4}
                        aria-controls="VisuilizerInfo"
                        onClick={() =>
                          getWeeKActiveData(week, index, quaterName)
                        }
                      >
                        {" "}
                        {week}{" "}
                      </ClayButton>
                    ))}
                    {VisualizerData?.weekPatterns?.length > 5 && (
                      <ClayButton
                        style={{ minWidth: "30px" }}
                        onClick={handleRightArrow}
                      >
                        <svg
                          width="9"
                          height="12"
                          viewBox="0 0 9 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.25519 6.33728L2.28879 11.8403L0.742187 10.4135L5.16198 6.33728L0.742187 2.26102L2.28879 0.834227L8.25519 6.33728Z"
                            fill="currentColor"
                          />
                        </svg>
                      </ClayButton>
                    )}
                  </div>
                </ClayLayout.Col>
              </ClayLayout.Row>
            </>
          )}
          <ClayLayout.Row className="custom-gap">
            <ClayLayout.Col size={12} style={{ paddingTop: 6 }}>
              <div className="viz_cal">
                <div
                  className="colgrp"
                  id="VisuilizerInfo"
                  aria-live="polite"
                  style={{
                    width: "calc(100% - 50px)",
                    top: "26px",
                    right: "12px",
                    height: "350px",
                  }}
                >
                  {newVisualizerData?.map((dayData, index) => (
                    <div
                      key={index}
                      className="col"
                      style={{ paddingRight: "0px", paddingLeft: "0px" }}
                    >
                      {/* {Object?.values(dayData)[0]?.map(
                        (timeSlot, slotIndex) => (
                          <>
                            <h3 className="hidden">{timeSlot.day}</h3>
                            <ul style={{ listStyleType: "none" }}>
                              <li>
                                <div
                                  key={slotIndex}
                                  style={{
                                    display: "flex",
                                    position: "absolute",
                                    width: "98%",
                                    top: timeSlot.position,
                                    right: "0px",
                                  }}
                                >
                                  {timeSlot?.events?.map(
                                    (event, eventIndex) => (
                                      <button
                                        key={eventIndex}
                                        className="event"
                                        style={{
                                          height: event.height,
                                          top: event.topPosition,
                                          left: "0px",
                                          fontSize: "9px",
                                          fontWeight: "600",
                                          lineHeight: "12px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          display: "flex",
                                          flexDirection: "column",
                                          padding:
                                            timeSlot?.events.length > 5
                                              ? "1px 0px"
                                              : "1px 5px",
                                          ...getBackgroundStyle(event),
                                        }}
                                        tabIndex={"0"}
                                        onMouseEnter={() => {
                                          getTooltipContent(
                                            timeSlot.bottom,
                                            event
                                          );
                                          setIsHidden(false);
                                        }}
                                        onMouseLeave={closeTooltipContent}
                                        onFocus={() => {
                                          getTooltipContent(
                                            timeSlot.bottom,
                                            event
                                          );
                                          setIsHidden(false);
                                        }}
                                        onBlur={closeTooltipContent}
                                        aria-control={
                                          isHidden
                                            ? undefined
                                            : `viSualizerTooltip${event?.uniqueID}`
                                        }
                                        onClick={(e) => {
                                          if (
                                            (e.ctrlKey && e.button === 0) ||
                                            e.button === 0
                                          ) {
                                            handleToolTipIndex(
                                              timeSlot.bottom,
                                              event,
                                              eventIndex.uniqueID,
                                              event.classId
                                            );
                                          }
                                        }}
                                      >
                                        <span
                                          style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                          }}
                                        >
                                          {event?.subjectCode}{" "}
                                          {event?.catalogNumberCode}.
                                          {event?.classSection}
                                        </span>

                                        <img
                                          style={{ width: "10px" }}
                                          alt="Enrolled Legend"
                                          src={getTooltipIcon(event)}
                                        />
                                      </button>
                                    )
                                  )}
                                </div>
                              </li>
                            </ul>
                          </>
                        )
                      )} */}
                      {Object?.values(dayData)[0]?.map(
                        (timeSlot, slotIndex) => (
                          <>
                            <h3 className="hidden">{timeSlot.day}</h3>
                            <ul
                              key={slotIndex}
                              style={{
                                display: "flex",
                                position: "absolute",
                                width: "98%",
                                top: timeSlot.position,
                                right: "0px",
                                listStyleType: "none",
                                padding: 0,
                                height: "inherit",
                              }}
                            >
                              {timeSlot?.events?.map((event, eventIndex) => (
                                <li style={{ overflow: "hidden" }}>
                                  <button
                                    key={eventIndex}
                                    className="event"
                                    style={{
                                      height: event.height,
                                      top: event.topPosition,
                                      left: "0px",
                                      fontSize: "9px",
                                      fontWeight: "600",
                                      lineHeight: "12px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "flex",
                                      flexDirection: "column",
                                      padding:
                                        timeSlot?.events.length > 5
                                          ? "1px 0px"
                                          : "1px 5px",
                                      ...getBackgroundStyle(event),
                                    }}
                                    tabIndex={"0"}
                                    onMouseEnter={() => {
                                      getTooltipContent(timeSlot.bottom, event);
                                      setIsHidden(false);
                                    }}
                                    onMouseLeave={closeTooltipContent}
                                    onFocus={() => {
                                      getTooltipContent(timeSlot.bottom, event);
                                      setIsHidden(false);
                                    }}
                                    onBlur={closeTooltipContent}
                                    aria-control={
                                      isHidden
                                        ? undefined
                                        : `viSualizerTooltip${event?.uniqueID}`
                                    }
                                    onClick={(e) => {
                                      if (
                                        (e.ctrlKey && e.button === 0) ||
                                        e.button === 0
                                      ) {
                                        handleToolTipIndex(
                                          timeSlot.bottom,
                                          event,
                                          eventIndex.uniqueID,
                                          event.classId
                                        );
                                      }
                                    }}
                                  >
                                    <span
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        width: "100%",
                                      }}
                                    >
                                      {event?.subjectCode}{" "}
                                      {event?.catalogNumberCode}.
                                      {event?.classSection}
                                    </span>

                                    <img
                                      style={{ width: "10px" }}
                                      alt="Enrolled Legend"
                                      src={getTooltipIcon(event)}
                                      aria-hidden="true"
                                    />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    width: "195px",
                    border: "1px solid #afa3a3",
                    position: "absolute",
                    backgroundColor: "white",
                    padding: "10px",
                    lineHeight: "15px",
                    fontSize: "12px",
                    borderRadius: "10px",
                    zIndex: 9999,
                    left: marginleft,
                    top: marginTop == `0px` ? "" : marginTop,
                    bottom: marginBottom,
                    zIndex: 99999,
                    maxHeight: "165px",
                    overflow: "auto",
                    display: hoveredInfo ? "block" : "none",
                  }}
                  role="region"
                  aria-live="polite"
                  id={`viSualizerTooltip${toolTipData?.uniqueID}`}
                  className="tooltip-popup"
                >
                  <p
                    className="tooltip-para"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>
                      {toolTipData?.subjectCode}{" "}
                      {toolTipData?.catalogNumberCode}.
                      {toolTipData?.classSection}
                    </b>
                    <img
                      alt="Delete"
                      style={{
                        cursor: isDeleteEnabled ? "pointer" : "not-allowed",
                        display: toolTipData?.preference ? "block" : "none",
                        width: "13px",
                      }}
                      src={
                        "/o/stanford-clce-theme/images/icons/tooltip-calendar.svg"
                      }
                      onClick={() => {
                        if (isDeleteEnabled) {
                          handleDelete(toolTipData, true);
                        }
                      }}
                    />
                  </p>
                  <p className="tooltip-para">{toolTipData?.title}</p>
                  <div className="tooltip-para-contanier">
                    <img
                      alt="Time of day"
                      aria-label="Time of day"
                      src={
                        "/o/stanford-clce-theme/images/icons/visulizer-tooltip-clock-icon.svg"
                      }
                    />
                    <p
                      className="tooltip-para"
                      style={{
                        lineHeight: "17px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        color: "#585754",
                      }}
                    >
                      {toolTipData?.meetingDayTimePatterns?.map(
                        (Days, daysIndex) => (
                          <b key={daysIndex}>{Days}</b>
                        )
                      )}
                    </p>
                  </div>
                  <div
                    className="tooltip-para-contanier"
                    style={{ lineHeight: "17px" }}
                  >
                    <img
                      alt="Days of the week"
                      aria-label="Days of the week"
                      src={
                        "/o/stanford-clce-theme/images/icons/visulizer-tooltip-calender.svg"
                      }
                    />
                    <p
                      className="tooltip-para"
                      style={{
                        lineHeight: "17px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        color: "#585754",
                      }}
                    >
                      {toolTipData?.dateRange?.map((Days, daysIndex) => (
                        <b key={daysIndex}>{Days}</b>
                      ))}
                    </p>
                  </div>

                  <div
                    className="tooltip-para-contanier"
                    style={{ color: "#585754" }}
                  >
                    <img
                      alt="Instructor"
                      aria-label="Instructor"
                      src={
                        "/o/stanford-clce-theme/images/icons/visulizer-tooltip-instructor-icon.svg"
                      }
                    />
                    <b>{toolTipData?.instructorName}</b>
                  </div>
                  {toolTipData?.conflictedSections &&
                    toolTipData?.conflictedSections.length > 0 && (
                      <>
                        <div className="conflict-container">
                          <p
                            className="conflict-subject"
                            style={{
                              marginTop: "0.5rem",
                              marginBottom: "0.5rem",
                              color: "#c74949",
                            }}
                          >
                            {" "}
                            {toolTipData?.subjectCode}{" "}
                            {toolTipData?.catalogNumberCode}.
                            {toolTipData?.classSection} conflicts with{" "}
                            {formatConflictSections(
                              toolTipData?.conflictedSections
                            )}
                          </p>
                        </div>
                      </>
                    )}
                </div>
                {toolTipDataArray.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    style={{
                      width: "195px",
                      border: "1px solid #afa3a3",
                      position: "absolute",
                      backgroundColor: "white",
                      padding: "10px",
                      lineHeight: "15px",
                      fontSize: "12px",
                      borderRadius: "10px",
                      left: event.marginleft,
                      bottom: event.marginBottom,
                      top: event.marginTop == `0px` ? "" : event.marginTop,
                      maxHeight: "165px",
                      overflow: "auto",
                    }}
                    className="tooltip-popup"
                    role="region"
                    aria-live="polite"
                    id={`viSualizerTooltip${event.events?.uniqueID}`}
                  >
                    <p
                      className="tooltip-para"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <b>
                        {event.events?.subjectCode}{" "}
                        {event.events?.catalogNumberCode}.
                        {event.events?.classSection}
                      </b>
                      <img
                        alt="Delete"
                        style={{
                          cursor: isDeleteEnabled ? "pointer" : "not-allowed",
                          display: event.events?.preference ? "block" : "none",
                          width: "13px",
                        }}
                        src={
                          "/o/stanford-clce-theme/images/icons/tooltip-calendar.svg"
                        }
                        onClick={() => {
                          if (isDeleteEnabled) {
                            handleDelete(event.events, true);
                          }
                        }}
                      />
                    </p>
                    <p className="tooltip-para">{event.events?.title}</p>
                    <div className="tooltip-para-contanier">
                      <img
                        alt="Clock"
                        src={
                          "/o/stanford-clce-theme/images/icons/visulizer-tooltip-clock-icon.svg"
                        }
                      />
                      <p
                        className="tooltip-para"
                        style={{
                          lineHeight: "17px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          color: "#585754",
                        }}
                      >
                        {event.events?.meetingDayTimePatterns?.map(
                          (Days, daysIndex) => (
                            <b key={daysIndex}>{Days}</b>
                          )
                        )}
                      </p>
                    </div>
                    <div className="tooltip-para-contanier">
                      <img
                        alt="Calender"
                        src={
                          "/o/stanford-clce-theme/images/icons/visulizer-tooltip-calender.svg"
                        }
                      />
                      <p
                        className="tooltip-para"
                        style={{
                          lineHeight: "17px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          color: "#585754",
                        }}
                      >
                        {event.events?.dateRange?.map((Days, daysIndex) => (
                          <b key={daysIndex}>{Days}</b>
                        ))}
                      </p>
                    </div>

                    <div
                      className="tooltip-para-contanier"
                      style={{ color: "#585754" }}
                    >
                      <img
                        alt="Instructor"
                        src={
                          "/o/stanford-clce-theme/images/icons/visulizer-tooltip-instructor-icon.svg"
                        }
                      />
                      <b>{event.events?.instructorName}</b>
                    </div>
                    {event.events?.conflictedSections &&
                      event.events?.conflictedSections.length > 0 && (
                        <div className="conflict-container">
                          <p
                            className="conflict-subject"
                            style={{
                              marginTop: "0.5rem",
                              marginBottom: "0.5rem",
                              color: "#c74949",
                            }}
                          >
                            {" "}
                            {event.events?.subjectCode}{" "}
                            {event.events?.catalogNumberCode}.
                            {event.events?.classSection} conflicts with{" "}
                            {formatConflictSections(
                              event.events?.conflictedSections
                            )}
                          </p>
                        </div>
                      )}
                  </div>
                ))}
                <table className="cal">
                  <tr>
                    <td> </td>
                    <td>Mon</td>
                    <td>Tue</td>
                    <td>Wed</td>
                    <td>Thu</td>
                    <td>Fri</td>
                  </tr>
                  {EmptytableRows}
                </table>
              </div>
            </ClayLayout.Col>
          </ClayLayout.Row>
          <ClayLayout.Row>
            <ClayLayout.Col size={3} align={"left"}>
              <div className="Legends col">
                <div className="Enrolled LegendIcons">
                  <img
                    alt="Enrolled Legend"
                    src={
                      "/o/stanford-clce-theme/images/icons/check_circle_icon.svg"
                    }
                    aria-hidden="true"
                  />
                </div>
                <span className="fs-11 ">Current Enrollments</span>
              </div>
            </ClayLayout.Col>
            <ClayLayout.Col size={3} align={"left"}>
              <div className="Legends col">
                <div
                  className="Conflict LegendIcons"
                  style={{ backgroundColor: "#009CBA" }}
                >
                  <img
                    alt="Conflict Legend"
                    src={
                      "/o/stanford-clce-theme/images/icons/visulizer-preference-calender-icon.svg"
                    }
                    aria-hidden="true"
                  />
                </div>
                <span className="fs-11 ">Preferenced Courses</span>
              </div>
            </ClayLayout.Col>
            <ClayLayout.Col size={3} align={"left"}>
              <div className="Legends col">
                <div className="Conflict LegendIcons">
                  <img
                    alt="Conflict Legend"
                    src={
                      "/o/stanford-clce-theme/images/icons/alert_triangle_white_icon.svg"
                    }
                    aria-hidden="true"
                  />
                </div>
                <span className="fs-11 ">Time Conflict</span>
              </div>
            </ClayLayout.Col>
            <ClayLayout.Col size={3} align={"left"}>
              <div className="Legends col">
                <div
                  className="Conflict LegendIcons"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, #005b94 0, #005b94 10%, transparent 0, transparent 50%) 0% 0% / 1.5em 1.5em #019CBA",
                  }}
                >
                  <img
                    alt="Conflict Legend"
                    src={
                      "/o/stanford-clce-theme/images/icons/alert_triangle_white_icon.svg"
                    }
                    aria-hidden="true"
                  />
                </div>
                <span className="fs-11 ">Conflicting Preferences </span>
              </div>
            </ClayLayout.Col>
          </ClayLayout.Row>
          <ClayLayout.Row>
            <ClayLayout.Col size={12} align={"left"} paddingBottom={10}>
              <div className="fs-12 fw-sb">
                {adminMessages?.crVisualizerMessage}
              </div>
            </ClayLayout.Col>
          </ClayLayout.Row>
          {VisualizerData?.conflictedResponsesInfo?.map(
            (conflictData, index) => (
              <React.Fragment key={index}>
                <ClayLayout.Row
                  paddingBottom={16}
                  style={{ flexWrap: "nowrap" }}
                >
                  <ClayLayout.Col size={12} align={"left"}>
                    <div className="Legends ">
                      <img
                        alt="Conflict Legend"
                        src={
                          "/o/stanford-clce-theme/images/icons/alert_triangle_red_icon.svg"
                        }
                        aria-hidden="true"
                      />
                      <span
                        className="Conflict box"
                        style={
                          conflictData.conflictStatus === "PreferenceConflict"
                            ? {
                                background:
                                  "repeating-linear-gradient(45deg, #005b94 0, #005b94 10%, transparent 0, transparent 50%) 0% 0% / 1.5em 1.5em #019CBA",
                                color: "#fff",
                              }
                            : {}
                        }
                      >
                        <span
                          className="fs-12 fw-sb"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {" "}
                          {conflictData?.subjectCode}{" "}
                          {conflictData?.catalogNumberCode}.
                          {conflictData?.classSection}
                        </span>
                      </span>
                      <span
                        className="fs-12 fw-sb"
                        style={{ lineHeight: "12px" }}
                      >
                        conflicts with
                      </span>
                      <div className="conflict-box">
                        {conflictData?.conflictedSectionsInfo?.map(
                          (conflictValue, conflictDataIndex) => (
                            <>
                              <span
                                className="Enrolled box"
                                style={getBackgroundStyleForConflict(
                                  conflictValue
                                )}
                              >
                                <span
                                  className="fs-12 fw-sb"
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  {conflictValue.conflictSection}
                                </span>
                              </span>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </ClayLayout.Col>
                </ClayLayout.Row>
              </React.Fragment>
            )
          )}
        </ClayLayout.ContainerFluid>
      </div>
    </div>
  );
}
