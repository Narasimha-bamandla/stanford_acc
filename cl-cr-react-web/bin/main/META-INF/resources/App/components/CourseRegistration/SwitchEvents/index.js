import React, { useState, useEffect, useRef } from "react";
import NotificationAlert from "../../CommonComponents/NotificationAlert";
import { useModal } from "@clayui/modal";
import SwitchEventsSection from "../../CommonComponents/SwitchEventsSection";
import SwitchEventFlyout from "../SwitchEventFlyout/index";
import { SampleVisuilizerData } from "../Visualizer/VisualizerData";
import Visualizer from "../Visualizer/index";
import { useLocation, useNavigate } from "react-router-dom";
import OvalLoader from "../../CommonComponents/OvalLoader";
import { GET, POST } from "../../HttpServices/index";
import NoDataFound from "../../CommonComponents/NoDataFound";
import CourseNavigation from "../../CommonComponents/CourseNavigation";

const SwitchEvents = ({ adminMessages }) => {
  const { observer, onOpenChange, open } = useModal();
  const location = useLocation();
  const [isLoading, setISLoading] = useState(true);
  const searchParams = new URLSearchParams(location.search);
  const [expandId, setExpandID] = useState(false);
  const [visualizerWeekIndex, setVisualizerWeekIndex] = useState(0);
  const [visualizerQuaterData, setVisualizerQuaterData] = useState(null);
  const [visualizerWeekData, setVisualizerWeekData] = useState(null);
  const [isCalendarEnabled, setIsCalendarEnabled] = useState(true);
  const [enableViewRequestsBtn, setEnableViewRequestsBtn] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [apiSelectedItem, setApiSelectedItem] = useState({});
  const [selectedCalendar, setSelectedCalndars] = useState({});
  const [openCards, setOpenCards] = useState({});
  const [expandCard, setExpandCard] = useState(null);
  const [previousExpandedCard, setPreviousExpandedCard] = useState([]);
  const [switchContent, setSwitchContent] = useState();
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [finishStatus, setFinishStatus] = useState(false);
  const confirmedNavigation = useRef(false);
  const isClosed = useRef(false);
  const eventId = searchParams.get("id");
  const eventType = searchParams.get("type");
  const [urlSectionName, setUrlSectionName] = useState(
    searchParams.get("section")
  );
  const [tempSectionName, setTempSectionName] = useState(null);
  const [urlGroupName, setUrlGroupName] = useState(
    searchParams.get("groupName")
  );
  const [tempGroupName, setTempGroupName] = useState(null);
  const [visualizerData, setVisualizerData] = useState(null);
  const [tempSectionData, setTempSectionData] = useState(null);
  const [tempSelectedSection, setTempSelectedSection] = useState(null);
  const [flyOutDeleteStatus, setFlyOutDeleteStatus] = useState(false);
  const [initialFilterState, setInitialFilterState] = useState({
    Timing: [],
    Level: [],
    Area: [],
    Quarter: [],
  });
  const [dropdownActive, setDropdownActive] = useState({
    Timing: false,
    Level: false,
    Area: false,
    Quarter: false,
  });
  const [initalSwitchEventData, setInitalSwitchEventData] = useState(null);
  const [disableActions, setDisableActions] = useState(false);

  const handleDeleteCalendar = async (sectionData, isCalendar) => {
    handleClickCalendarIcon(null, null, true, sectionData);
  };

  const handleExpandVisulizer = () => {
    setExpandID(!expandId);
  };

  const handleNavigation = async (sectionName, groupName) => {
    if (flyOutDeleteStatus) {
      setISLoading(true);
      setTempSectionName(sectionName);
      setTempGroupName(groupName);
      onOpenChange(false);
    } else {
      onOpenChange(false);
      setTempGroupName(groupName);
      setOpenCards({});
      handleSwitchFlyoutEdit(sectionName, groupName);
      setUrlSectionName(sectionName);
      setUrlGroupName(groupName);
    }
  };

  const handleSwitchFlyoutEdit = (tempSectionName, groupName) => {
    const urlSectionData = searchSectionNameData(tempSectionName, groupName);
    handleSwitchFlyoutEditReponse(urlSectionData?.section, urlSectionData);
  };

  const handleSwitchFlyoutEditReponse = (title, data) => {
    setFlyOutDeleteStatus(false);
    setSelectedItems({});
    setSelectedCalndars({});
    setOpenCards({ [title]: title });
    setExpandCard();
    setPreviousExpandedCard([]);
    setTempSelectedSection(null);
    getSectionData(title, data, null, false);
  };

  const CallInitialSwitchEvent = async () => {
    try {
      var requestUrl = "/o/clcr/switch-preferences-response";
      const params = `&eventId=${eventId}`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        setInitalSwitchEventData(data);
        setISLoading(false);
        if (tempSectionName || tempGroupName) {
          setOpenCards({});
          handleSwitchFlyoutEdit(tempSectionName, tempGroupName);
          setUrlSectionName(tempSectionName);
          setUrlGroupName(tempGroupName);
        }
      } else {
        setInitalSwitchEventData(null);
        setISLoading(false);
      }
    } catch (error) {
      setInitalSwitchEventData(null);
      setISLoading(false);
    }
  };

  const handleClickCalendarIcon = async (
    subGroup,
    mainGroup,
    status,
    sectionData = null
  ) => {
    Liferay?.Session?.extend();
    try {
      var requestUrl = status
        ? "/o/clcr/switching/remove-from-calendar"
        : "/o/clcr/switching/add-to-calendar";
      var payload;
      if (sectionData) {
        payload = {
          eventId: eventId,
          classId: sectionData?.classId,
          classNumber: sectionData?.classNumber,
          type: eventType,
          sectionName: sectionData?.sectionName,
          groupName: sectionData?.groupName,
          fromGroupName: sectionData?.fromGroupName,
          mfCategoryName: sectionData?.mfCategoryName,
          academicYear: sectionData?.academicYear,
        };
      } else {
        payload = {
          eventId: eventId,
          classId: subGroup?.classId,
          classNumber: subGroup?.classNumber,
          type: eventType,
          sectionName: subGroup?.sectionName,
          groupName: subGroup?.switchGroupName,
          fromGroupName: mainGroup?.switchGroupName,
          mfCategoryName: tempSectionData?.tempData?.category,
          academicYear: subGroup?.academicYear,
        };
      }
      var params = "";
      const result = await POST(requestUrl, params, payload);
      if (result.status === 200) {
        const data = await result.json();
        handleCalenderForVisuilizer();
        getSectionData(
          tempSectionData?.tempSectionName,
          tempSectionData?.tempData,
          tempSectionData?.tempfilterData,
          true
        );
      } else {
        console.error("Error in adding/removing calender");
      }
    } catch (error) {
      console.error("Error in adding/removing calender");
    }
  };

  const CallViewRequest = async () => {
    try {
      var requestUrl = "/o/clcr/enable/view-your-requests/button";
      const params = `&eventId=${eventId}`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        setEnableViewRequestsBtn(data.enable_view_request_button);
      } else {
        setEnableViewRequestsBtn(enableViewRequestsBtn);
      }
    } catch (error) {
      setEnableViewRequestsBtn(enableViewRequestsBtn);
    }
  };

  const CallVisulizerResponse = async (week, quarter, index) => {
    try {
      setVisualizerWeekIndex(index);
      setVisualizerQuaterData(quarter);
      setVisualizerWeekData(week);
      var params = `&eventId=${eventId}&sectionType=${eventType}`;
      if (week) {
        params += `&weekPattern=${week}`;
      }
      if (quarter) {
        params += `&selection=${quarter}`;
      }
      const requestUrl = `/o/clcr/switching/visualizer-data`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();

        if (data?.weekMap == null && week) {
          CallVisulizerResponse(null, quarter, 0);
        } else {
          setVisualizerData(data);
        }
      } else {
        console.log("errror in VisualizerData");
        setVisualizerData(null);
      }
    } catch (error) {
      console.log("errror in VisualizerData");
      setVisualizerData(null);
    }
  };

  const callInitialSwitchPreferences = async () => {
    try {
      var requestUrl = "/o/clcr/get/switch-preferences";
      const params = `&eventId=${eventId}`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
      } else {
      }
    } catch (error) {}
  };

  const callGetEnrollments = async () => {
    try {
      var requestUrl = "/o/mygsb/gsb/clce/get-enrollments";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
      } else {
      }
    } catch (error) {}
  };

  const callInitialSubmitRequest = async () => {
    try {
      var requestUrl = "/o/clcr/insert/submitted-requests";
      const params = `&eventId=${eventId}`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        CallInitialSwitchEvent();
        CallViewRequest();
        CallVisulizerResponse(
          visualizerWeekData,
          visualizerQuaterData,
          visualizerWeekIndex
        );
      } else {
        CallInitialSwitchEvent();
        CallViewRequest();
        CallVisulizerResponse(
          visualizerWeekData,
          visualizerQuaterData,
          visualizerWeekIndex
        );
      }
    } catch (error) {
      CallInitialSwitchEvent();
      CallViewRequest();
      CallVisulizerResponse(
        visualizerWeekData,
        visualizerQuaterData,
        visualizerWeekIndex
      );
    }
  };

  const callInitialAPIRequest = async () => {
    await Promise.all([callInitialSwitchPreferences(), callGetEnrollments()]);
    callInitialSubmitRequest();
  };

  const getSectionData = async (
    sectionName,
    data,
    filterData = null,
    status = true
  ) => {
    setSelectedItems({});

    var requestUrl = "/o/clcr/switch-group/response";
    var payload = {
      eventId: eventId,
      mfCategoryName: data?.category,
      groupName: data?.groupname,
      sectionName: data?.sectionName ? data?.sectionName : null,
      level: filterData ? filterData?.level : null,
      area: filterData ? filterData?.area : null,
      quarter: filterData ? filterData?.quarter : null,
      timing: filterData ? filterData?.timing : null,
      sectionId: status && tempSelectedSection ? tempSelectedSection : null,
    };

    try {
      setTempSectionData({
        tempSectionName: sectionName,
        tempData: data,
        tempfilterData: filterData,
      });
      setTempSectionName(null);
      setTempGroupName(null);

      setIsContentLoading(true);
      const response = await POST(requestUrl, "", payload);
      if (response) {
        const result = await response.json();
        if (result?.code === "204") {
          throw new Error("Content Not Available");
        }
        setSwitchContent(result);
        if (result?.switchToOptions.length > 0) {
          var selectedValue = result?.switchToOptions
            .filter((item) => item.selectSection === true)
            .map((item) => item.sectionName);

          if (selectedValue?.length > 0) {
            var tempSectionName = selectedValue[0];
            setSelectedItems({
              [sectionName]: tempSectionName,
            });
            setApiSelectedItem({
              [sectionName]: tempSectionName,
            });
          } else {
            setSelectedItems({});
          }
        }

        setIsContentLoading(false);
      }
    } catch (error) {
      setIsContentLoading(false);
      setSwitchContent();
      console.log("Error getting in getSectionData", error);
    }
  };

  const handleConfirm = () => {
    if (Object.keys(expandCard ?? {}).length > 0) {
      setShowModal(false);
      setSelectedItems({});
      setSelectedCalndars({});
      setOpenCards(expandCard);
      setExpandCard();
      getSectionData(
        Object.keys(expandCard)[0],
        previousExpandedCard,
        null,
        false
      );
      setPreviousExpandedCard([]);
    } else {
      setShowModal(false);
      confirmedNavigation.current = true; // Mark navigation as confirmed
      setFinishStatus(true);
      navigate("/");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    isClosed.current = true;
    navigate(1);
  };

  const handleCalenderForVisuilizer = () => {
    CallVisulizerResponse(
      visualizerWeekData,
      visualizerQuaterData,
      visualizerWeekIndex
    );
  };

  const onHandleCards = (title, data) => {
    Liferay?.Session?.extend();
    if (openCards[title]) {
      // Condition for closing the items
      setOpenCards({});
      setSelectedItems({});
      setSelectedCalndars({});
      return false;
    } else {
      setExpandCard({ [title]: title });
      setPreviousExpandedCard(data);

      if (
        Object.keys(selectedItems).length !== 0 &&
        Object.values(selectedItems)[0] !== Object.values(apiSelectedItem)[0]
      ) {
        setShowModal(true);
      } else {
        setSelectedItems({});
        setSelectedCalndars({});
        setOpenCards({ [title]: title });
        setExpandCard();
        setPreviousExpandedCard([]);
        setTempSelectedSection(null);
        getSectionData(title, data, null, false);
        return false;
      }
    }
  };

  const callApiAfterSwitching = async () => {
    await Promise.all([callInitialSwitchPreferences()]);
    await Promise.all([callInitialSubmitRequest()]);
    await Promise.all([
      getSectionData(
        tempSectionData?.tempSectionName,
        tempSectionData?.tempData,
        tempSectionData?.tempfilterData,
        false
      ),
    ]);
  };

  const searchSectionNameData = (ScrollsectionName, ScrollgroupName) => {
    if (ScrollsectionName) {
      for (const category in initalSwitchEventData?.switchGroups) {
        const found = initalSwitchEventData?.switchGroups[category].find(
          (item) =>
            item.section == ScrollsectionName ||
            item.sectionName == ScrollsectionName
        );
        if (found) {
          return found;
        }
      }
      return null;
    } else {
      const groupFound = initalSwitchEventData?.switchGroups[
        "Other Available Courses"
      ]?.find((item) => item.groupname == ScrollgroupName);

      return groupFound || null;
    }
  };

  const handleScroll = () => {
    const targetSection = document.getElementById(Object?.keys(openCards)[0]);
    window.scrollTo({
      top: targetSection?.offsetTop + 10,
      behavior: "smooth",
    });
    setUrlSectionName(null);
    setUrlGroupName(null);
  };

  useEffect(() => {
    callInitialAPIRequest();
    if (isStudentView && !isAdmin) {
      setDisableActions(true);
      setIsCalendarEnabled(false);
    } else if (isStudentView && isAdmin) {
      setDisableActions(false);
      setIsCalendarEnabled(false);
    } else if (
      role.toUpperCase() != "STAFF" &&
      role.toUpperCase() != "FACULTY" &&
      role.toUpperCase() != "ADVISOR" &&
      role.toUpperCase() != "ADMIN" &&
      role.toUpperCase() != "AO"
    ) {
      setDisableActions(false);
      setIsCalendarEnabled(true);
    } else {
      setDisableActions(true);
      setIsCalendarEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (flyOutDeleteStatus) {
      setOpenCards({});
      setSelectedItems({});
      setISLoading(true);
      callInitialSubmitRequest();
      setFlyOutDeleteStatus(false);
    }
  }, [open]);

  useEffect(() => {
    if (initalSwitchEventData && (urlSectionName || urlGroupName)) {
      const urlSectionData = searchSectionNameData(
        urlSectionName,
        urlGroupName
      );
      onHandleCards(urlSectionData?.section, urlSectionData);
    }
  }, [initalSwitchEventData]);

  useEffect(() => {
    if (switchContent && (urlSectionName || urlGroupName)) {
      handleScroll();
      setTempGroupName(null);
    }
    setTempGroupName(null);
  }, [switchContent]);

  useEffect(() => {
    if (!window.history.state || window.history.state.page !== "locked") {
      window.history.pushState({ page: "locked" }, document.title);
    }
    const handlePopStateRe = () => {
      if (Object.keys(selectedItems).length === 0) {
        navigate("/");
      }
    };
    const handlePopState = (event) => {
      event.preventDefault();
      if (!finishStatus && !confirmedNavigation.current && !isClosed.current) {
        setShowModal(true); // Show the custom confirmation modal
      } else if (confirmedNavigation.current) {
        // Perform the actual navigation if already confirmed
        window.history.go(-1);
      }
      if (isClosed.current) {
        isClosed.current = false;
      }
    };
    if (Object.keys(selectedItems).length > 0) {
      window.addEventListener("popstate", handlePopState);
    } else {
      window.removeEventListener("popstate", handlePopState);
      window.addEventListener("popstate", handlePopStateRe);
    }
    return () => {
      window.removeEventListener("popstate", handlePopStateRe);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedItems]);

  return (
    <>
      <div
        aria-label="Course Registration"
        className="course_registration container-fluid"
      >
        <div className="cr_info-banner">
          <section className="info-banner-area">
            <div className="row">
              <div className="col-md-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a
                        className="breadcrumb-text-truncate"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (
                            Object.keys(selectedItems).length !== 0 &&
                            Object.values(selectedItems)[0] !==
                              Object.values(apiSelectedItem)[0]
                          ) {
                            setShowModal(true);
                          } else {
                            navigate("/");
                          }
                        }}
                      >
                        Course Registration
                      </a>
                    </li>
                    <li className="active breadcrumb-item">
                      <span className="breadcrumb-text-truncate" title="Active">
                        {initalSwitchEventData?.event_name}
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </section>
          <div className="row">
            <div className="col-md-12">
              <div className="title-btn">
                <h3>
                  Switching options for {initalSwitchEventData?.event_name}
                </h3>
                <div className="btn-group push-right">
                  {enableViewRequestsBtn && (
                    <button
                      className="sdfd-btn lg-btn secondary-btn  "
                      onClick={() => onOpenChange(true)}
                    >
                      View your Requests
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-10">
              <section className="unitinfo">
                <strong className="pr-3">
                  Total Enrolled Units:{"  "}
                  {initalSwitchEventData?.totalEnrolledUnits}
                </strong>
                <span>Winter: {initalSwitchEventData?.winterUnits} units</span>
                <span>Spring: {initalSwitchEventData?.springUnits} units</span>
                <div
                  style={{
                    backgroundColor: "rgb(82, 77, 76)",
                    opacity: "0.2",
                    width: "1px",
                    height: "20px",
                    margin: "0 10px",
                  }}
                ></div>
                <strong className="pr-3">
                  Current Core Units: {initalSwitchEventData?.currentCoreUnits}
                </strong>
                <strong>
                  Current Distribution Units:{"  "}
                  {initalSwitchEventData?.currentDistributionUnits}
                </strong>
                <strong>
                  (Minimum Requirement:{"  "}
                  {initalSwitchEventData?.minimumDistributionUnits} Units)
                </strong>
              </section>
            </div>
            <div className="col-md-12" style={{ marginTop: "14px" }}></div>
          </div>
        </div>

        <div
          className="row"
          {...(expandId && {
            style: { flexDirection: "column-reverse" },
          })}
        >
          <div className={expandId ? "col-md-12" : "col-md-8"}>
            <NotificationAlert
              content={
                adminMessages?.SwitchingCoreUserMsg
                  ? adminMessages?.SwitchingCoreUserMsg
                  : ``
              }
            />

            {isLoading ? (
              <OvalLoader />
            ) : initalSwitchEventData?.switchGroups &&
              Object.keys(initalSwitchEventData?.switchGroups).length > 0 ? (
              <>
                <div className="row">
                  <div className="col-md-12">
                    <div aria-live="polite" id="switchEventList" role="region">
                      {Object.keys(initalSwitchEventData.switchGroups).map(
                        (groupKey) => (
                          <SwitchEventsSection
                            key={groupKey}
                            initalSwitchData={
                              initalSwitchEventData.switchGroups[groupKey]
                            }
                            type={groupKey}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            selectedCalendar={selectedCalendar}
                            setSelectedCalndars={setSelectedCalndars}
                            openCards={openCards}
                            switchContent={switchContent}
                            isContentLoading={isContentLoading}
                            onHandleCards={onHandleCards}
                            callSectionDataResponse={getSectionData}
                            eventId={eventId}
                            eventType={eventType}
                            initialFilterState={initialFilterState}
                            setInitialFilterState={setInitialFilterState}
                            handleClickCalendarIcon={handleClickCalendarIcon}
                            callApiAfterSwitching={callApiAfterSwitching}
                            dropdownActive={dropdownActive}
                            setDropdownActive={setDropdownActive}
                            setTempSelectedSection={setTempSelectedSection}
                            disableActions={disableActions}
                            isCalendarEnabled={isCalendarEnabled}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <NoDataFound />
            )}
          </div>
          <Visualizer
            handleExpandVisulizer={handleExpandVisulizer}
            expandStyle={expandId ? "12" : "4"}
            expandEnable={expandId}
            VisualizerData={visualizerData}
            callVisualizerApi={CallVisulizerResponse}
            eventType={eventType}
            eventId={eventId}
            handleDelete={handleDeleteCalendar}
            adminMessages={adminMessages}
            visualizerWeekIndex={visualizerWeekIndex}
            isDeleteEnabled={isCalendarEnabled}
            disableActions={disableActions}
          />
        </div>
        <SwitchEventFlyout
          observer={observer}
          onOpenChange={onOpenChange}
          open={open}
          handleNavigation={handleNavigation}
          eventId={eventId}
          eventType={eventType}
          setFlyOutDeleteStatus={setFlyOutDeleteStatus}
          disableActions={disableActions}
        />
      </div>
      {showModal && (
        <CourseNavigation
          message="Are you sure you want to leave? If you navigate away without submitting, your work will be lost."
          onContinue={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default SwitchEvents;
