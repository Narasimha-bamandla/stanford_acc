import React, { useEffect, useState } from "react";
import SEFlyoutBanner from "./SEFlyoutBanner";
import SubmitRequestComponent from "./SubmitRequestComponent";
import CompletedRequestComponent from "./CompletedRequestComponent";
import DeleteErrorMsg from "./DeleteErrorMsg";
import { GET } from "../../HttpServices/index";
import { POST } from "../../HttpServices/index";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";

const SwitchEventFlyout = ({
  onOpenChange,
  open,
  handleNavigation,
  eventId,
  eventType = null,
  setFlyOutDeleteStatus = false,
  disableActions = false,
}) => {
  const [isLoading, setISLoading] = useState(false);
  const [enableDeleteModel, setEnableDeleteModel] = useState(false);
  const [ViewYourRequestData, setViewYourRequestData] = useState(null);
  const [openCards, setOpenCards] = useState([]);
  const [tempDeleteData, setTempDeleteData] = useState(null);
  const [tempDeleteTitle, setTempDeleteTitle] = useState(null);
  const [tempDeleteGroup, setTempDeleteGroup] = useState(null);
  const [ActiveCardStatus, setActiveCardStatus] = useState(true);
  const [InActiveCardStatus, setInActiveCardStatus] = useState(false);
  const [CompletedCardStatus, setCompletedStatus] = useState(false);
  const handleCardChange = (courseTitle) => {
    setOpenCards(
      openCards
        ? () => {
            const isOpen = openCards?.includes(courseTitle);
            return isOpen
              ? openCards.filter((item) => item !== courseTitle)
              : [...openCards, courseTitle];
          }
        : courseTitle
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        !isLoading &&
        event.target.className == "fade modal d-block modal_popup show"
      ) {
        onOpenChange(false);
        setActiveCardStatus(true);
        setInActiveCardStatus(false);
        setCompletedStatus(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isLoading) {
        onOpenChange(false);
        setActiveCardStatus(true);
        setInActiveCardStatus(false);
        setCompletedStatus(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleKeep = () => {
    setEnableDeleteModel(false);
  };

  const handleDelete = () => {
    setEnableDeleteModel(false);
    callSectionDeleteApi();
  };

  const reSetState = () => {
    setActiveCardStatus(true);
    setInActiveCardStatus(false);
    setCompletedStatus(false);
  };

  const callInitialSwitchPreferences = async () => {
    try {
      var requestUrl = "/o/clcr/get/switch-preferences";
      const params = `&eventId=${eventId}`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        callViewYourRequestApi();
      } else {
        console.log("error in callInitialSwitchPreferences");
      }
    } catch (error) {
      console.log("error in callInitialSwitchPreferences");
    }
  };

  const openErrorBox = (data) => {
    setTempDeleteData(data);
    if (data?.requestType == "DROP") {
      setTempDeleteTitle(data?.fromSection);
      setTempDeleteGroup(data?.fromGroupName);
    } else if (data?.requestType == "ADD") {
      setTempDeleteTitle(data?.toSection);
      setTempDeleteGroup(data?.toGroupName);
    } else if (data?.requestType == "SWITCH") {
      setTempDeleteTitle(data?.fromSection);
      setTempDeleteGroup(data?.fromGroupName);
    }
    setEnableDeleteModel(true);
  };

  const handleEdit = (sectionName, groupName) => {
    handleNavigation(sectionName, groupName);
  };

  const callSectionDeleteApi = async () => {
    try {
      setISLoading(true);
      var requestUrl = "/o/clcr/submit/switch-request";
      var payload;

      if (tempDeleteData.requestType == "SWITCH") {
        payload = {
          eventId: eventId,
          eventType: eventType,
          switchPreferencesList: [
            {
              classId: tempDeleteData.toClassId,
              classNumber: tempDeleteData.toClassNumber,
              academicYear: tempDeleteData.academicYear,
              fromCategoryName: tempDeleteData.fromCategoryName,
              categoryName: tempDeleteData.toCategoryName,
              fromSectionName: tempDeleteData.fromSectionName,
              sectionName: tempDeleteData.toSectionName,
              fromGroupName: tempDeleteData.fromGroupName,
              groupName: tempDeleteData.toGroupName,
              fromMfLevelName: tempDeleteData.fromMfLevelName,
              mfLevelName: tempDeleteData.toMfLevelName,
              quarter: tempDeleteData.toQuarter,
              fromQuarter: tempDeleteData.fromQuarter,
              units: tempDeleteData.toUnits,
              gradingBasis: tempDeleteData.toGradingBasis,
              switchPreferenceId: tempDeleteData.switchPreferenceId,
              isDeleteRequest: true,
              switchRequestType: "DELETE",
            },
          ],
        };
      } else if (tempDeleteData.requestType == "ADD") {
        payload = {
          eventId: eventId,
          eventType: eventType,
          switchPreferencesList: [
            {
              classId: tempDeleteData.toClassId,
              classNumber: tempDeleteData.toClassNumber,
              academicYear: tempDeleteData.academicYear,
              fromCategoryName: null,
              categoryName: tempDeleteData.toCategoryName,
              fromSectionName: null,
              sectionName: tempDeleteData.toSectionName,
              fromGroupName: null,
              groupName: tempDeleteData.toGroupName,
              fromMfLevelName: null,
              mfLevelName: tempDeleteData.toMfLevelName,
              quarter: tempDeleteData.toQuarter,
              fromQuarter: null,
              units: tempDeleteData.toUnits,
              gradingBasis: tempDeleteData.toGradingBasis,
              switchPreferenceId: tempDeleteData.switchPreferenceId,
              isDeleteRequest: true,
              switchRequestType: "DELETE",
            },
          ],
        };
      } else if (tempDeleteData.requestType == "DROP") {
        payload = {
          eventId: eventId,
          eventType: eventType,
          switchPreferencesList: [
            {
              classId: tempDeleteData.fromClassId,
              classNumber: tempDeleteData.fromClassNumber,
              academicYear: tempDeleteData.academicYear,
              fromCategoryName: tempDeleteData.fromCategoryName,
              categoryName: null,
              fromSectionName: tempDeleteData.fromSectionName,
              sectionName: null,
              fromGroupName: tempDeleteData.fromGroupName,
              groupName: null,
              fromMfLevelName: tempDeleteData.fromMfLevelName,
              mfLevelName: null,
              quarter: null,
              fromQuarter: tempDeleteData.fromQuarter,
              units: tempDeleteData.fromUnits,
              gradingBasis: tempDeleteData.fromGradingBasis,
              switchPreferenceId: tempDeleteData.switchPreferenceId,
              isDeleteRequest: true,
              switchRequestType: "DELETE",
            },
          ],
        };
      }
      const result = await POST(requestUrl, "", payload);
      if (result.status === 200) {
        const data = await result.json();
        callInitialSwitchPreferences();

        setISLoading(true);
        setFlyOutDeleteStatus(true);
      } else {
        console.error("Error in deleting view your request");
        setISLoading(false);
      }
    } catch (error) {
      console.error("Error in deleting view your request");
      setISLoading(false);
    }
  };

  const callViewYourRequestApi = async () => {
    Liferay?.Session?.extend();
    try {
      var requestUrl = "/o/clcr/switch-submission-preferences";
      const params = `&eventId=${eventId}`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        setViewYourRequestData(data);
        const openCardsTitle = data.submittedPreferencesMap.Active;
        if (Array.isArray(openCardsTitle)) {
          setOpenCards(
            openCardsTitle.map((item) => item.timeStamp + item.fromGroupName)
          );
        } else {
          setOpenCards([]);
        }
        setISLoading(false);
      } else {
        console.log("Error in view your request");
        setISLoading(false);
        setViewYourRequestData(null);
      }
    } catch (error) {
      console.log("Error in view your request");
      setISLoading(false);
      setViewYourRequestData(null);
    }
  };

  useEffect(() => {
    setViewYourRequestData(null);
    if (open) {
      setISLoading(true);
      callViewYourRequestApi();
    }
  }, [open]);

  return (
    <div
      className="cr-switch-event-flyout course_registration"
      style={{ display: open ? "" : "none" }}
    >
      <div
        aria-hidden="true"
        className={`modal-backdrop fade ${open ? "show" : ""}`}
        data-suppressed="true"
        inert="true"
        tabIndex={-1}
      >
        &nbsp;
      </div>
      <div
        className={`fade modal d-block modal_popup ${open ? "show" : ""}`}
        tabIndex={-1}
      >
        <div
          aria-labelledby="switch-event-info"
          aria-modal="true"
          className="modal-dialog modal-full-screen modal-info modal-content "
          role="dialog"
          tabIndex={0}
        >
          <div className="modal_popup-container container-fluid container-view container-fluid-max-xl">
            <SEFlyoutBanner
              onOpenChange={onOpenChange}
              ViewYourRequestData={ViewYourRequestData}
              reSetState={reSetState}
            />
            {isLoading ? (
              <OvalLoader />
            ) : ViewYourRequestData ? (
              <div className="container-fluid p-0">
                <div className="col-12">
                  <SubmitRequestComponent
                    submitRequestData={
                      ViewYourRequestData?.submittedPreferencesMap?.Active
                    }
                    handleDelete={openErrorBox}
                    openCards={openCards}
                    handleCardChange={handleCardChange}
                    handleEdit={handleEdit}
                    courseDisable={false}
                    groupTitle={"Active/Held Request(s)"}
                    topPosition={"-13px"}
                    disableActions={disableActions}
                    showMore={ActiveCardStatus}
                    setShowMoreStatus={setActiveCardStatus}
                  />
                  <SubmitRequestComponent
                    submitRequestData={
                      ViewYourRequestData?.submittedPreferencesMap?.InActive
                    }
                    handleDelete={openErrorBox}
                    openCards={openCards}
                    handleCardChange={handleCardChange}
                    handleEdit={handleEdit}
                    courseDisable={true}
                    groupTitle={"Inactive Request(s)"}
                    topPosition={"0px"}
                    disableActions={disableActions}
                    showMore={InActiveCardStatus}
                    setShowMoreStatus={setInActiveCardStatus}
                  />
                  <CompletedRequestComponent
                    completedRequestData={
                      ViewYourRequestData?.submittedPreferencesMap?.Completed
                    }
                    handleDelete={openErrorBox}
                    openCards={openCards}
                    handleCardChange={handleCardChange}
                    handleEdit={handleEdit}
                    courseDisable={true}
                    showMore={CompletedCardStatus}
                    setShowMoreStatus={setCompletedStatus}
                  />
                </div>
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>
      </div>
      {enableDeleteModel && (
        <DeleteErrorMsg
          handleKeep={handleKeep}
          handleDelete={handleDelete}
          title={tempDeleteTitle}
          group={tempDeleteGroup}
        />
      )}
    </div>
  );
};

export default SwitchEventFlyout;
