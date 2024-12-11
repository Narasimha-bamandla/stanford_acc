import React, { useEffect, useState, useCallback, useRef } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import RPDraggedSection from "../../CommonComponents/RPDraggedSection";
import { useLocation, useNavigate } from "react-router-dom";
import RPCoreCard from "../../CommonComponents/RPCoreCard";
import DnDTextCard from "../../CommonComponents/DnDTextCard";
import RPSectionCard from "../../CommonComponents/RPSectionCard";
import CourseConflictBox from "../../CommonComponents/CourseConflictBox";
import ViewLastSubmissionFlyout from "../ViewLastSubmissionFlyout/index";
import { useModal } from "@clayui/modal";
import NotificationAlert from "../../CommonComponents/NotificationAlert";
import RPPagination from "../../CommonComponents/RPPagination";
import Visualizer from "../Visualizer/index";
import { GET, PATCH, POST } from "../../HttpServices/index";
import TransparentLoader from "../../CommonComponents/TransparentLoader";
import OvalLoader from "../../CommonComponents/OvalLoader";
import NoDataFound from "../../CommonComponents/NoDataFound";
import CourseNavigation from "../../CommonComponents/CourseNavigation";
import SubmitPerferenceErrorBox from "./SubmitPerferenceErrorBox";

const RankPreference = ({
  importedCourses,
  importedQuarterEnabled,
  handleWishlist,
  adminMessages,
}) => {
  const [electiveData, setElectives] = useState();
  const [coreData, setCoreData] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPaes, setTotalPages] = useState(1);
  const [isLoadingOtherCourses, setIsLoadingOtherCourses] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchDropDown, setShowSearchDropDown] = useState();
  const [dropDownList, setDropDownList] = useState();
  const [enableSubmitPreferenceBtn, setEnableSubmitPreferenceBtn] =
    useState(true);
  const [enableSubmitErrorMsg, setEnableSubmitErrorMsg] = useState(false);
  const [callSubmitConflictRquest, setEnableSubmitPreferenceRquest] =
    useState(false);
  const [enableViewFlyOutSubmittMsg, setEnableViewFlyOutSubmitMsg] =
    useState(false);
  const [enableViewSubmitLoader, setEnableViewSubmitLoader] = useState(false);
  const { observer, onOpenChange, open } = useModal();
  const location = useLocation();
  const [checkedItems, setCheckedItems] = useState({});
  const [conflictBoxEnable, setConflictBoxEnable] = useState(false);
  const [conflictMsg, setConflictMsg] = useState([]);
  const [newDropPointItems, setNewDropPointItems] = useState([]);
  const [tempSectionStore, setTempSectionStore] = useState([]);
  const [expandId, setExpandID] = useState(false);
  const [enableViewLastSubmit, setEnableViewSubmit] = useState(false);
  const [submitSectionStore, setSubmitSectionStore] = useState([]);
  const [enableVLSConflictMsg, setEnableVLSConflictMsg] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const event_id = searchParams.get("id");
  const urlId = searchParams.get("type");
  const eventName = searchParams.get("event");
  const [visualizerData, setVisualizerData] = useState(null);
  const [enableDnDTextMsg, setEnableDnDTextMsg] = useState("");
  const [showDnDLoader, setShowDnDLoader] = useState(false);
  const [visualizerQuaterData, setVisualizerQuaterData] = useState(null);
  const [visualizerWeekData, setVisualizerWeekData] = useState(null);
  const [isQuarterEnabled, setIsQuarterEnabled] = useState(false);
  const [openCards, setOpenCards] = useState([]);
  const [visualizerWeekIndex, setVisualizerWeekIndex] = useState(0);
  const [isCalendarEnabled, setIsCalendarEnabled] = useState(false);
  const [readAccessEnabled, setReadAccessEnabled] = useState(false);
  const navigate = useNavigate();
  const isClosed = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [finishStatus, setFinishStatus] = useState(false);
  const confirmedNavigation = useRef(false);
  const [submitPreferenceErrorMsg, setSubmitPreferenceErrorMsg] = useState(
    "Your preferences cannot be submitted because the event is closed"
  );
  const [EnableSubmitPreferenceErrorMsg, setEnableSubmitPreferenceErrorMsg] =
    useState(false);
  const [isEventOpen, setIsEventOpen] = useState(null);
  const [EventOpenMsg, setEventOpenMsg] = useState(null);
  const [unPublizedMessageVLSFlyout, setUnPublizedMessageVLSFlyout] =
    useState(null);

  const updateSelectedCourses = async (addCourses, updatedCourses, action) => {
    Liferay?.Session?.extend();
    const payload = getAddedCourses(addCourses, action);
    const upDateData = getUpdatedCourses(updatedCourses);
    if (updatedCourses?.length > 0) {
      payload.updateData = upDateData;
    }
    try {
      const requestUrl = `/o/clcr/add-preference-ranking`;
      var params = "";
      const response = await POST(requestUrl, params, payload);
      if (response.status || response.code === 200) {
        setShowDnDLoader(true);
        getDragDropPaneData();
        getOtherCourseInformation(pageNumber, searchValue);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.log("Error in Updating on updateSelectedCourses method", error);
    }
  };

  const getAddedCourses = (addCourses, action) => {
    const rank =
      newDropPointItems?.length > 0
        ? newDropPointItems[newDropPointItems.length - 1]?.rank + 1
        : 1;
    let addedCourses = {
      postData: [],
    };
    addCourses?.map((item, index) => {
      addedCourses.postData.push({
        eventId: event_id,
        sectionName: item?.section_name,
        type: urlId,
        groupName: item?.group_name,
        rank: action === "AddRankBtn" ? index + rank : item?.rank,
      });
    });
    return addedCourses;
  };

  const handleSPErrorBoxChange = () => {
    setEnableSubmitPreferenceErrorMsg(false);
    navigate("/");
  };

  const getUpdatedCourses = (updatedCourses) => {
    return updatedCourses?.length > 0
      ? updatedCourses?.map((course, index) => ({
          eventId: event_id,
          classId: course?.classId,
          classNumber: course?.classNumber,
          type: urlId,
          academicYear: course?.academicYear,
          // When new item added updated courses rank should add by 1
          rank: course?.rank + 1,
        }))
      : "";
  };

  const callRequiredApi = () => {
    callViewLastSubmissionStatusResponse();
    callSubmitErrorTextResponse();
    callSubmitPreferenceStatusResponse();
  };

  const handleCheckboxChange = (data, action = "checkbox") => {
    const sectionID = data?.section_name;
    if (action == "checkbox") {
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [sectionID]: !prevCheckedItems[sectionID],
      }));
      // Adding and removing in tempSectionStore
      if (sectionID in checkedItems && checkedItems[sectionID]) {
        setTempSectionStore((prevCheckedItems) => {
          return prevCheckedItems.filter(
            (item) => item?.section_name !== data?.section_name
          );
        });
      } else if (!checkedItems[sectionID]) {
        setTempSectionStore((prevCheckedItems) => {
          return [
            ...prevCheckedItems.filter(
              (item) => item?.section_name !== data?.section_name
            ),
            data,
          ];
        });
      }
    } else {
      if (sectionID in checkedItems && checkedItems[sectionID]) {
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [sectionID]: false,
        }));
      }
      // removing in tempSectionStore
      if (sectionID in checkedItems && checkedItems[sectionID]) {
        setTempSectionStore((prevCheckedItems) => {
          return prevCheckedItems.filter(
            (item) => item?.section_name !== data?.section_name
          );
        });
      }
    }
  };

  // To Update the Drag and Drop Pane
  const handleAddToRank = () => {
    updateSelectedCourses(tempSectionStore, [], "AddRankBtn");
    setCheckedItems({});
    setTempSectionStore([]);
  };

  const handleExpandVisulizer = () => {
    setExpandID(!expandId);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (urlId == "Core") {
      const sourceDroppableId = source.droppableId;
      const destinationDroppableId = destination.droppableId;
      if (destinationDroppableId === "new-drop-point") {
        const updatedNewDropPointItems = Array.from(newDropPointItems);
        if (sourceDroppableId === "new-drop-point") {
          let destRank = updatedNewDropPointItems[destination.index].rank;
          let sourceRank = updatedNewDropPointItems[source.index].rank;
          const [movedItem] = updatedNewDropPointItems.splice(source.index, 1);
          updatedNewDropPointItems.splice(destination.index, 0, movedItem);
          if (source.index > destination.index) {
            for (
              let index = 0;
              index <= updatedNewDropPointItems.length - 1;
              index++
            ) {
              if (index >= destination.index) {
                updatedNewDropPointItems[index].rank = destRank;
                destRank = destRank + 1;
              }
            }
          } else {
            for (
              let index = 0;
              index <= updatedNewDropPointItems.length - 1;
              index++
            ) {
              if (index >= source.index) {
                updatedNewDropPointItems[index].rank = sourceRank;
                sourceRank = sourceRank + 1;
              }
            }
          }
          if (source.index < destination.index) {
            updatingPreferenceRanking(
              updatedNewDropPointItems.slice(
                source.index,
                destination.index + 1
              )
            );
          } else {
            updatingPreferenceRanking(
              updatedNewDropPointItems.slice(
                destination.index,
                source.index + 1
              )
            );
          }
          setNewDropPointItems(updatedNewDropPointItems);
        } else if (sourceDroppableId.startsWith("drop-down")) {
          // Dropping From Other courses to Preference Courses
          const sourceKey = sourceDroppableId?.split("-").slice(2).join("-");
          let movedItem = coreData[sourceKey][source?.index];
          handleCheckboxChange(movedItem, "dnd");
          let dropItem = newDropPointItems[destination?.index];
          // Getting updated courses on drag&drop
          let updatedCourses = [];
          newDropPointItems?.forEach((item, index) => {
            if (
              (destination?.index === 0 || destination?.index) &&
              index >= destination?.index
            ) {
              updatedCourses.push(item);
            }
          });
          if (dropItem) {
            movedItem.rank = dropItem?.rank;
          } else {
            movedItem.rank =
              newDropPointItems?.length > 0
                ? newDropPointItems[newDropPointItems?.length - 1]?.rank + 1
                : 1;
          }
          updateSelectedCourses(
            [{ ...movedItem }],
            updatedCourses,
            "Drag&Drop"
          );
        }
      } else if (
        sourceDroppableId === destinationDroppableId &&
        sourceDroppableId.startsWith("drop-down")
      ) {
        return;
      }
    } else {
      if (source.droppableId === destination.droppableId) {
        if (source.droppableId === "drop-down") {
          // Should not perform drag operation
        } else {
          const updatedNewDropPointItems = Array.from(newDropPointItems);
          let destRank = updatedNewDropPointItems[destination.index].rank;
          let sourceRank = updatedNewDropPointItems[source.index].rank;
          const [movedItem] = updatedNewDropPointItems.splice(source.index, 1);
          updatedNewDropPointItems.splice(destination.index, 0, movedItem);
          if (source.index > destination.index) {
            for (
              let index = 0;
              index <= updatedNewDropPointItems.length - 1;
              index++
            ) {
              if (index >= destination.index) {
                updatedNewDropPointItems[index].rank = destRank;
                destRank = destRank + 1;
              }
            }
          } else {
            for (
              let index = 0;
              index <= updatedNewDropPointItems.length - 1;
              index++
            ) {
              if (index >= source.index) {
                updatedNewDropPointItems[index].rank = sourceRank;
                sourceRank = sourceRank + 1;
              }
            }
          }
          if (source.index < destination.index) {
            updatingPreferenceRanking(
              updatedNewDropPointItems.slice(
                source.index,
                destination.index + 1
              )
            );
          } else {
            updatingPreferenceRanking(
              updatedNewDropPointItems.slice(
                destination.index,
                source.index + 1
              )
            );
          }
          setNewDropPointItems(updatedNewDropPointItems);
        }
      } else {
        if (
          source.droppableId === "drop-down" &&
          destination.droppableId === "new-drop-point"
        ) {
          let movedItem = electiveData[source?.index];
          handleCheckboxChange(movedItem, "dnd");
          let dropItem = newDropPointItems[destination?.index];
          // Getting updated courses on drag&drop
          let updatedCourses = [];
          newDropPointItems?.forEach((item, index) => {
            if (
              (destination?.index === 0 || destination?.index) &&
              index >= destination?.index
            ) {
              updatedCourses.push(item);
            }
          });
          if (dropItem) {
            movedItem.rank = dropItem?.rank;
          } else {
            movedItem.rank =
              newDropPointItems?.length > 0
                ? newDropPointItems[newDropPointItems?.length - 1]?.rank + 1
                : 1;
          }
          updateSelectedCourses(
            [{ ...movedItem }],
            updatedCourses,
            "Drag&Drop"
          );
        }
      }
    }
  };

  const handleDeleteSection = async (sectionData) => {
    Liferay?.Session?.extend();
    try {
      var requestUrl = "/o/clcr/delete-rank-preference";
      var payload = {
        eventId: event_id,
        classId: sectionData?.classId,
        classNumber: sectionData?.classNumber,
        type: urlId,
        academicYear: sectionData?.academicYear,
      };
      var params = "";
      const result = await POST(requestUrl, params, payload);
      if (result.status === 200) {
        // If successful response
      } else {
        console.error("Error in delete");
      }
    } catch (error) {
      console.error("Error in delete");
    }
    setShowDnDLoader(false);
    getDragDropPaneData();
    CallVisulizerResponse(
      visualizerWeekData,
      visualizerQuaterData,
      visualizerWeekIndex
    );
    getOtherCourseInformation(pageNumber, searchValue);
  };

  const handleCalendar = async (sectionData, isCalendar) => {
    Liferay?.Session?.extend();
    try {
      var requestUrl = `/o/clcr/${
        isCalendar ? "remove-from-calendar" : "add-to-calendar"
      }`;
      var payload = {
        eventId: event_id,
        classId: sectionData?.classId,
        classNumber: sectionData?.classNumber,
        type: urlId,
        academicYear: sectionData?.academicYear,
      };
      var params = "";
      const result = await POST(requestUrl, params, payload);
      if (result.status == 200) {
        setShowDnDLoader(false);
        getDragDropPaneData();
        CallVisulizerResponse(
          visualizerWeekData,
          visualizerQuaterData,
          visualizerWeekIndex
        );
        getOtherCourseInformation(pageNumber, searchValue);
      } else {
        console.error("Error in delete");
      }
    } catch (error) {
      console.error("Error in delete");
    }
  };

  const handleRankChange = async (newRank, sourceIndex) => {
    if (newRank) {
      const updatedNewDropPointItems = Array.from(newDropPointItems);
      const destinationIndex = updatedNewDropPointItems.findIndex(
        (item) => item.rank == newRank
      );
      if (destinationIndex !== -1) {
        let destRank = updatedNewDropPointItems[destinationIndex]?.rank;
        let sourceRank = updatedNewDropPointItems[sourceIndex]?.rank;
        const [movedItem] = updatedNewDropPointItems.splice(sourceIndex, 1);
        updatedNewDropPointItems.splice(destinationIndex, 0, movedItem);
        if (sourceIndex > destinationIndex) {
          for (
            let index = 0;
            index <= updatedNewDropPointItems.length - 1;
            index++
          ) {
            if (index >= destinationIndex) {
              updatedNewDropPointItems[index].rank = destRank;
              destRank = destRank + 1;
            }
          }
        } else {
          for (
            let index = 0;
            index <= updatedNewDropPointItems.length - 1;
            index++
          ) {
            if (index >= sourceIndex) {
              updatedNewDropPointItems[index].rank = sourceRank;
              sourceRank = sourceRank + 1;
            }
          }
        }
        if (sourceIndex < destinationIndex) {
          updatingPreferenceRanking(
            updatedNewDropPointItems.slice(sourceIndex, destinationIndex + 1)
          );
        } else {
          updatingPreferenceRanking(
            updatedNewDropPointItems.slice(destinationIndex, sourceIndex + 1)
          );
        }
        setNewDropPointItems(updatedNewDropPointItems);
      } else {
        setShowDnDLoader(true);
        getDragDropPaneData();
      }
    }
  };

  const getDragDropPaneData = async () => {
    try {
      var requestUrl = `/o/clcr/preference-ranking`;
      const params = `&eventId=${event_id}&type=${urlId}`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        if (data?.preference_list) {
          setNewDropPointItems(data?.preference_list);
          setIsQuarterEnabled(data?.enableQuarter);
        } else {
          setNewDropPointItems([]);
          setIsQuarterEnabled(false);
        }
        setEnableDnDTextMsg(data);
      } else {
        console.log("errror in DnD");
      }
    } catch (error) {
      console.log("errror in DnD");
    }
    callSubmitErrorTextResponse();
    callSubmitPreferenceStatusResponse();
    setShowDnDLoader(false);
  };

  const updatingPreferenceRanking = async (draggedData) => {
    Liferay?.Session?.extend();
    try {
      var requestUrl = `/o/clcr/preference-ranking`;
      const params = "";
      const extractedData = draggedData.map((item) => ({
        eventId: event_id,
        classId: item.classId,
        classNumber: item.classNumber,
        type: urlId,
        academicYear: item.academicYear,
        rank: item.rank,
      }));
      var body = extractedData;
      const result = await PATCH(requestUrl, params, body);
      if (result.status === 200) {
        setShowDnDLoader(true);
        getDragDropPaneData();
      } else {
        console.log("errror in DnD");
      }
    } catch (error) {
      console.log("errror in DnD");
    }
  };

  const handleSubmitPreferences = () => {
    Liferay?.Session?.extend();
    setEnableViewSubmitLoader(true);
    callSubmitPreferencesRequest();
  };

  const handleConflictSubmit = () => {
    setSubmitSectionStore(newDropPointItems);
    handleConflictClose();
    onOpenChange(true);
  };

  const callSubmitPreferencesRequest = async () => {
    try {
      const params = `&eventId=${event_id}`;
      var requestUrl = `/o/clcr/submit-preferences`;
      const result = await GET(requestUrl, params);
      setUnPublizedMessageVLSFlyout(null);
      if (result.status === 200) {
        setEnableViewSubmitLoader(false);
        const data = await result.json();
        if (!data?.errorMessage) {
          if (data.status) {
            onOpenChange(true);
            setEnableSubmitPreferenceRquest(false);
            setEnableViewFlyOutSubmitMsg(true);
            setSubmitSectionStore(newDropPointItems);
            setConflictMsg([]);
          } else {
            setConflictMsg(data.conflictedStrings);
            setConflictBoxEnable(true);
            setEnableViewFlyOutSubmitMsg(true);
            setEnableSubmitPreferenceRquest(true);
          }
        } else {
          setEnableSubmitPreferenceErrorMsg(true);
          setSubmitPreferenceErrorMsg(data.errorMessage);
        }
      } else if (result.status == 400) {
        setEnableViewSubmitLoader(false);
        const data = await result.json();
        setUnPublizedMessageVLSFlyout(data.message);
        onOpenChange(true);
        setEnableSubmitPreferenceRquest(false);
        setEnableViewFlyOutSubmitMsg(false);
      } else {
        setEnableViewSubmitLoader(false);
      }
    } catch (error) {
      setEnableViewSubmitLoader(false);
    }
  };

  const callSubmitErrorTextResponse = async () => {
    try {
      const params = `&eventId=${event_id}`;
      var requestUrl = `/o/clcr/is-preference-ranking-edited`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        if (data.status) {
          let status = data?.status;
          setEnableSubmitErrorMsg(status);
        } else {
          console.log("error in RankingPreferencesText");
          setEnableSubmitErrorMsg(false);
        }
      } else {
        console.log("error in RankingPreferencesText");
      }
    } catch (error) {
      console.log("error in RankingPreferencesText");
    }
  };

  const handleConflictClose = () => {
    setConflictBoxEnable(false);
  };

  const callVisualizerApi = (week, quarter, index) => {
    Liferay?.Session?.extend();
    CallVisulizerResponse(week, quarter, index);
  };

  const CallVisulizerResponse = async (week, quarter, index) => {
    try {
      setVisualizerWeekIndex(index);
      setVisualizerQuaterData(quarter);
      setVisualizerWeekData(week);
      var params = `&eventId=${event_id}&sectionType=${urlId}`;
      if (week) {
        params += `&weekPattern=${week}`;
      }
      if (quarter) {
        params += `&selection=${quarter}`;
      }
      const requestUrl = `/o/clcr/visualizer-data`;
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

  const callGetStudenrRecommendations = async () => {
    try {
      var requestUrl = "/o/mygsb/gsb/clce/get-student-recommendations";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
      } else {
        console.log("Error in Inital PAR Api");
      }
    } catch (error) {
      console.log("Error in Inital PAR Api");
    }
  };

  const callInitalGetEnrollments = async () => {
    try {
      var requestUrl = "/o/mygsb/gsb/clce/get-enrollments";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
      } else {
        console.log("Error in Inital UpcomingOpenEvent Api");
      }
    } catch (error) {
      console.log("Error in Inital UpcomingOpenEvent Api");
    }
  };

  const callViewLastSubmissionStatusResponse = async () => {
    try {
      const params = `&eventId=${event_id}`;
      var requestUrl = "/o/clcr/last-submission-status";
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        setEnableViewSubmit(data.enable_last_submission);
      } else {
        console.log("Error in callLastSubmissionStatusResponse Api");
      }
    } catch (error) {
      console.log("Error in callLastSubmissionStatusResponse Api");
    }
  };

  const callSubmitPreferenceStatusResponse = async () => {
    try {
      const params = `&eventId=${event_id}`;
      var requestUrl = "/o/clcr/submit-preferences-status";
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        setEnableSubmitPreferenceBtn(data.enable_submit_preference);
      } else {
        console.log("Error in callSubmitPreferenceStatusResponse Api");
      }
    } catch (error) {
      console.log("Error in callSubmitPreferenceStatusResponse Api");
    }
  };

  const callInitalOtherPreferenceCourses = async () => {
    try {
      var requestUrl = `/o/clcr/get/other-preference-courses`;
      const params = `&eventId=${event_id}`;
      const result = await GET(requestUrl, params);
      setEventOpenMsg(null);
      if (result.status === 200) {
        const data = await result.json();
        setIsEventOpen(data?.eventOpen);
        setEventOpenMsg(data?.message);
        if (data?.eventOpen) {
          getOtherCourseInformation(1, "");
        } else {
          setIsLoadingOtherCourses(false);
        }
      } else {
        setIsEventOpen(false);
        console.log("Error in Inital announcements Api");
      }
    } catch (error) {
      setIsEventOpen(false);
      console.log("Error in Inital announcements Api");
    }
  };

  const callInitalGetEvents = async () => {
    try {
      var requestUrl = `/o/mygsb/gsb/clce/get-events`;
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
      } else {
        console.log("Error in Inital announcements Api");
      }
    } catch (error) {
      console.log("Error in Inital announcements Api");
    }
  };

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

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const highlightWord = (text, phrase) => {
    const sanitizedPhrase = escapeRegExp(phrase);
    const words = sanitizedPhrase.split(" ").filter(Boolean);
    const regex = new RegExp(`(${words.join("|")})`, "gi");
    const parts = String(text).split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const highlightNameAndSearchValue = (text) => {
    let highlightedText = text;
    highlightedText = highlightWord(highlightedText, searchValue);
    return highlightedText;
  };

  const handleConfirm = () => {
    confirmedNavigation.current = true; // Mark navigation as confirmed
    setFinishStatus(true);
    setShowModal(false);
    navigate("/");
  };

  const handleCancel = () => {
    setShowModal(false);
    isClosed.current = true;
    navigate(1);
  };

  const getOtherCourseInformation = async (pageNumber, searchValue = "") => {
    try {
      const requestUrl = `/o/clcr/other-preference-courses?eventId=${event_id}&pageNumber=${pageNumber}&search=${searchValue}&p_auth=${Liferay.authToken}`;
      var requestHeaders = new Headers({
        Accept: "application/json",
      });
      setIsLoadingOtherCourses(true);
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: requestHeaders,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      urlId === "Core"
        ? setCoreData(responseData?.coreMap)
        : setElectives(responseData?.list);
      setPageNumber(responseData?.pageNumber ? responseData?.pageNumber : 1);
      setTotalPages(responseData?.totalPages);
      urlId === "Core"
        ? setDropDownList(responseData?.coreMap)
        : setDropDownList(responseData?.list);
      setIsQuarterEnabled(responseData?.enableQuarter);
      setIsLoadingOtherCourses(false);
    } catch (error) {
      setCoreData();
      setElectives();
      setIsLoadingOtherCourses(false);
      console.log(
        "Error in getting Rank Prefrence on getOtherCourseInformation",
        error
      );
    }
  };

  const searchOtherCoursesInfo = (event) => {
    const searchValue = event?.target?.value;
    setSearchValue(searchValue);
    setPageNumber(1);
    try {
      if (searchValue?.length >= 2) {
        setDropDownList();
        debouncedFetchResults(1, searchValue);
        setShowSearchDropDown(true);
      } else if (searchValue == "") {
        setDropDownList();
        debouncedFetchResults(1, "");
        setShowSearchDropDown(false);
      }
    } catch (error) {}
  };

  const handleClickDelete = (event) => {
    if (
      event?.key === "Delete" ||
      event.keyCode === 46 ||
      event.key === "Backspace" ||
      event.keyCode === 8
    ) {
      if (event?.target?.value?.length === 2) {
        setDropDownList();
        debouncedFetchResults(pageNumber, null);
      }
    }
  };

  const handleClickEnter = (event) => {
    if (event?.key === "Enter" || event.keyCode === 13) {
      setDropDownList();
      setShowSearchDropDown(false);
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".cr_home_oar_search")) {
      setShowSearchDropDown(false);
    }
  };

  const getPageNumber = (pageNumber) => {
    if (searchValue?.length >= 2) {
      debouncedFetchResults(pageNumber, searchValue);
    } else {
      debouncedFetchResults(pageNumber, "");
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
    debounce(async (pageNumber, searchValue) => {
      Liferay?.Session?.extend();
      getOtherCourseInformation(pageNumber, searchValue);
    }, 1000),
    []
  );

  const makeInitialAPIRequest = async () => {
    await Promise.all([
      callGetStudenrRecommendations(),
      callInitalGetEnrollments(),
      callInitalOtherPreferenceCourses(),
    ]);
  };

  useEffect(() => {
    // calling initial API call for setting data in session.
    makeInitialAPIRequest();
    // Setting read access to different roles
    if (isStudentView && !isAdmin) {
      // disable all
      setIsCalendarEnabled(false);
      setReadAccessEnabled(true);
    } else if (isStudentView && isAdmin) {
      // disable only add to calendar,
      // remove from calendar(in ranking pane)
      // and disabled remove - from - calendar in visualizer tool tip
      setIsCalendarEnabled(false);
      setReadAccessEnabled(false);
    } else if (
      role.toUpperCase() != "STAFF" &&
      role.toUpperCase() != "FACULTY" &&
      role.toUpperCase() != "ADVISOR" &&
      role.toUpperCase() != "ADMIN" &&
      role.toUpperCase() != "AO"
    ) {
      // enable all
      setIsCalendarEnabled(true);
      setReadAccessEnabled(false);
    } else {
      // disable all
      setIsCalendarEnabled(false);
      setReadAccessEnabled(true);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEventOpen) {
      setShowDnDLoader(true);
      // calling initial API call for setting dropdown data.
      getDragDropPaneData();
      CallVisulizerResponse(null, null, 0);
      callViewLastSubmissionStatusResponse();
      callInitalGetEvents();
    } else if (!isEventOpen) {
      setCoreData();
      setElectives();
      setNewDropPointItems([]);
    }
  }, [isEventOpen]);

  useEffect(() => {
    setNewDropPointItems(importedCourses);
    setIsQuarterEnabled(importedQuarterEnabled);
    if (importedCourses.length > 0 && importedQuarterEnabled !== null) {
      callSubmitErrorTextResponse();
      callSubmitPreferenceStatusResponse();
      getOtherCourseInformation(pageNumber, searchValue);
    }
  }, [importedCourses, importedQuarterEnabled]);

  useEffect(() => {
    if (!window.history.state || window.history.state.page !== "locked") {
      window.history.pushState({ page: "locked" }, document.title);
    }
    const handlePopStateRe = () => {
      if (!enableSubmitErrorMsg) {
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
    if (enableSubmitErrorMsg) {
      window.addEventListener("popstate", handlePopState);
    } else {
      window.removeEventListener("popstate", handlePopState);
      window.addEventListener("popstate", handlePopStateRe);
    }
    return () => {
      window.removeEventListener("popstate", handlePopStateRe);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enableSubmitErrorMsg]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {urlId && (
          <div className="course_registration container-fluid">
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
                              if (enableSubmitErrorMsg) {
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
                          <span
                            className="breadcrumb-text-truncate"
                            title="Active"
                          >
                            {eventName}
                          </span>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </section>
              {isEventOpen && (
                <div className="row">
                  <div className="col-md-8">
                    <h2>Preference Ranking for {eventName}</h2>
                  </div>
                  <div className="col-md-4">
                    <div className="btn-group push-right">
                      {enableViewLastSubmit && (
                        <button
                          id={`viewlastsubmitbtn-${event_id}`}
                          className="sdfd-btn lg-btn secondary-btn  pull-right "
                          onClick={() => {
                            onOpenChange(true);
                            setEnableViewFlyOutSubmitMsg(false);
                            setEnableSubmitPreferenceRquest(false);
                          }}
                        >
                          View Last Submission
                        </button>
                      )}
                      <button
                        className="sdfd-btn lg-btn primary-btn pull-right"
                        disabled={
                          readAccessEnabled || !enableSubmitPreferenceBtn
                        }
                        onClick={() => handleSubmitPreferences()}
                      >
                        Submit Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isEventOpen && (
              <>
                <div
                  className="row"
                  {...(expandId && {
                    style: { flexDirection: "column-reverse" },
                  })}
                >
                  <div className={expandId ? "col-md-12" : "col-md-8"}>
                    <NotificationAlert
                      content={
                        adminMessages?.prefRankInstructionUserMsg
                          ? adminMessages?.prefRankInstructionUserMsg
                          : ``
                      }
                    />
                    {showDnDLoader ? (
                      <OvalLoader />
                    ) : (
                      <Droppable
                        droppableId="new-drop-point"
                        isDropDisabled={readAccessEnabled}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            aria-live="polite"
                          >
                            {newDropPointItems.length > 0 ? (
                              <div className="row">
                                <div className="col-md-12">
                                  {enableSubmitErrorMsg ? (
                                    <div
                                      className="preference-ranking mb-2"
                                      style={{
                                        textAlign: "center",
                                        padding: "25px 10px 25px 10px",
                                        fontSize: "15px",
                                      }}
                                      id="submitErrorMsg"
                                      aria-live="polite"
                                      tabIndex={0}
                                    >
                                      You have made changes to your preferences
                                      {enableViewLastSubmit &&
                                        " since the last submission"}
                                      . Click{"  "}
                                      <span
                                        style={{
                                          textDecoration: "underline",
                                          fontWeight: 600,
                                          cursor: readAccessEnabled
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                        onClick={() => {
                                          if (!readAccessEnabled) {
                                            handleSubmitPreferences();
                                          }
                                        }}
                                        tabIndex={0}
                                        aria-label="Submit Preferences button"
                                      >
                                        Submit Preferences
                                      </span>{" "}
                                      to include them in this event.
                                    </div>
                                  ) : (
                                    <section className="card card-type-template border-0 d-flex c-gap-2 align-items-center px-3 py-2">
                                      <div>
                                        Use the{" "}
                                        <svg
                                          width={16}
                                          height={16}
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                        >
                                          <circle
                                            cx={8}
                                            cy={8}
                                            r={8}
                                            fill="white"
                                          />
                                          <path d="M2 7H14" stroke="#524D4C" />
                                          <path d="M2 10H14" stroke="#524D4C" />
                                          <path
                                            d="M7.99805 3L5.99805 5H9.99805L7.99805 3Z"
                                            fill="#524D4C"
                                          />
                                          <path
                                            d="M7.99805 14L5.99805 12H9.99805L7.99805 14Z"
                                            fill="#524D4C"
                                          />
                                        </svg>{" "}
                                        icon to drag a section up or down in
                                        your preference list to change its
                                        ranking. You can also update the rank
                                        number in the text box to change its
                                        ranking. As you make a change to a
                                        section’s ranking, your other
                                        preferences will be re-ordered
                                        accordingly.
                                      </div>
                                    </section>
                                  )}
                                  <div role="list">
                                    {newDropPointItems.map((item, index) => (
                                      <RPDraggedSection
                                        key={item.rank}
                                        id={item.rank}
                                        data={item}
                                        index={index}
                                        handleDeleteSection={
                                          handleDeleteSection
                                        }
                                        urlId={urlId}
                                        handleCalendar={handleCalendar}
                                        handleRankChange={handleRankChange}
                                        isQuarterEnabled={isQuarterEnabled}
                                        isCalendarEnabled={isCalendarEnabled}
                                        readAccessEnabled={readAccessEnabled}
                                      />
                                    ))}
                                  </div>
                                  {provided.placeholder}
                                </div>
                              </div>
                            ) : (
                              <DnDTextCard
                                enableDnDTextMsg={enableDnDTextMsg}
                                handleWishlist={handleWishlist}
                              />
                            )}
                          </div>
                        )}
                      </Droppable>
                    )}

                    <section className="cr_other_courses_might_interest">
                      <div className="row">
                        <div className="col-md-8 pt-3">
                          <h4>Other Courses that might Interest You</h4>
                          <section
                            className="cr_home_oar_search fullwidth mt-3"
                            role="search"
                          >
                            <input
                              minLength={2}
                              aria-controls="courseList"
                              className="form-control sdtd-input"
                              type="text"
                              id="oarSearch"
                              autoComplete="off"
                              placeholder="Search Course, Title, or Instructor"
                              aria-label="Search Course, Title, or Instructor"
                              onChange={(event) =>
                                searchOtherCoursesInfo(event)
                              }
                              onKeyDown={handleClickEnter}
                              onKeyUp={handleClickDelete}
                            />
                            <div className="sdfd-btn sm-btn ghost-btn i-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={13}
                                height={12}
                                viewBox="0 0 13 12"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M12.2708 10.6723L9.9824 8.38356C10.6272 7.51106 11.0191 6.43625 11.0191 5.26027C11.0191 2.35195 8.65486 0 5.75957 0C2.85163 0 0.5 2.36459 0.5 5.26027C0.5 8.1686 2.86428 10.5205 5.75957 10.5205C6.92274 10.5205 8.01006 10.1286 8.88244 9.48367L11.1709 11.7724C11.3226 11.9241 11.5249 12 11.7272 12C11.9295 12 12.1317 11.9241 12.2835 11.7724C12.5743 11.4816 12.5743 10.9758 12.2708 10.6723ZM2.05511 5.26027C2.05511 3.22445 3.71137 1.56797 5.74693 1.56797C7.78248 1.56797 9.43874 3.22445 9.43874 5.26027C9.43874 7.2961 7.78248 8.95258 5.74693 8.95258C3.71137 8.96523 2.05511 7.30875 2.05511 5.26027Z"
                                  fill="#585754"
                                />
                              </svg>
                            </div>
                          </section>
                        </div>
                        <div className="col-md-4 pt-3">
                          <div className="btn-group push-right">
                            {" "}
                            <button
                              onClick={handleAddToRank}
                              className="sdfd-btn md-btn secondary-btn"
                              disabled={
                                !readAccessEnabled &&
                                tempSectionStore.length > 0
                                  ? false
                                  : true
                              }
                              aria-controls="submitErrorMsg"
                            >
                              Add to Rank
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                    <div className="row">
                      <div className="col-md-12">
                        <section className="card card-type-template border-0  d-flex flex-column c-gap-2 align-content-start	px-3 pb-2 my-4">
                          <div className=" d-flex c-gap-2   ">
                            <svg
                              fill="none"
                              height={16}
                              viewBox="0 0 16 16"
                              width={16}
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <circle cx={8} cy={8} fill="white" r={8} />
                              <path d="M2 7H14" stroke="#524D4C" />
                              <path d="M2 10H14" stroke="#524D4C" />
                              <path
                                d="M7.99805 3L5.99805 5H9.99805L7.99805 3Z"
                                fill="#524D4C"
                              />
                              <path
                                d="M7.99805 14L5.99805 12H9.99805L7.99805 14Z"
                                fill="#524D4C"
                              />
                            </svg>{" "}
                            Drag any section below to the top pane to add it as
                            a preference.
                          </div>
                          <div className="d-flex c-gap-2   ">
                            <svg
                              fill="none"
                              height={16}
                              viewBox="0 0 16 16"
                              width={16}
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <rect
                                fill="white"
                                height={15}
                                rx="1.5"
                                width={15}
                                x="0.5"
                                y="0.5"
                              />
                              <rect
                                height={15}
                                rx="1.5"
                                stroke="#767674"
                                width={15}
                                x="0.5"
                                y="0.5"
                              />
                            </svg>
                            <div>
                              {" "}
                              Select multiple sections below and click on “Add
                              to Rank” to add them in batch to your preference
                              list.
                            </div>
                          </div>
                        </section>
                        {isLoadingOtherCourses ? (
                          <OvalLoader />
                        ) : (
                          <>
                            {electiveData || coreData ? (
                              <>
                                {urlId == "Core" ? (
                                  <div
                                    className="core-data-container"
                                    aria-live="polite"
                                    aria-atomic="true"
                                    id="courseList"
                                    role="region"
                                  >
                                    {Object.keys(coreData)?.map((key) => (
                                      <RPCoreCard
                                        key={key}
                                        coreId={key}
                                        coreTitle={key}
                                        coreList={coreData[key]}
                                        checkedItems={checkedItems}
                                        handleCheckboxChange={
                                          handleCheckboxChange
                                        }
                                        urlId={urlId}
                                        isQuarterEnabled={isQuarterEnabled}
                                        openCards={openCards}
                                        handleCardChange={handleCardChange}
                                        readAccessEnabled={readAccessEnabled}
                                        searchValue={searchValue}
                                        highlightNameAndSearchValue={
                                          highlightNameAndSearchValue
                                        }
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <div
                                    aria-label="Other Courses that might Interest You"
                                    aria-live="polite"
                                    id="courseList"
                                    role="region"
                                  >
                                    <Droppable droppableId="drop-down">
                                      {(provider) => (
                                        <div
                                          ref={provider.innerRef}
                                          {...provider.droppableProps}
                                          role="list"
                                        >
                                          {electiveData?.map(
                                            (electiveData, index) => (
                                              <RPSectionCard
                                                key={electiveData?.section_name}
                                                id={electiveData?.section_name}
                                                sectionData={electiveData}
                                                index={index}
                                                isChecked={
                                                  !!checkedItems[
                                                    electiveData?.section_name
                                                  ]
                                                }
                                                onCheckboxChange={() =>
                                                  handleCheckboxChange(
                                                    electiveData
                                                  )
                                                }
                                                urlId={urlId}
                                                isQuarterEnabled={
                                                  isQuarterEnabled
                                                }
                                                readAccessEnabled={
                                                  readAccessEnabled
                                                }
                                                searchValue={searchValue}
                                                highlightNameAndSearchValue={
                                                  highlightNameAndSearchValue
                                                }
                                              />
                                            )
                                          )}
                                          {provider.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  </div>
                                )}
                              </>
                            ) : (
                              <NoDataFound />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <RPPagination
                      totalPages={totalPaes}
                      pageNumber={pageNumber}
                      handlePageNumber={getPageNumber}
                    />
                  </div>
                  <Visualizer
                    handleExpandVisulizer={handleExpandVisulizer}
                    expandStyle={expandId ? "12" : "4"}
                    expandEnable={expandId}
                    VisualizerData={visualizerData}
                    callVisualizerApi={callVisualizerApi}
                    eventType={urlId}
                    eventId={event_id}
                    handleDelete={handleCalendar}
                    adminMessages={adminMessages}
                    visualizerWeekIndex={visualizerWeekIndex}
                    isDeleteEnabled={isCalendarEnabled}
                  />
                </div>
                {conflictBoxEnable && (
                  <CourseConflictBox
                    conflictMsg={conflictMsg}
                    handleConflictClose={handleConflictClose}
                    handleConflictSubmit={handleConflictSubmit}
                  />
                )}
                {enableViewSubmitLoader && <TransparentLoader />}
              </>
            )}
          </div>
        )}
        {isEventOpen && (
          <ViewLastSubmissionFlyout
            observer={observer}
            onOpenChange={onOpenChange}
            open={open}
            enableVLSConflictMsg={enableVLSConflictMsg}
            eventId={event_id}
            submitConflictRquest={callSubmitConflictRquest}
            enableViewFlyOutSubmittMsg={enableViewFlyOutSubmittMsg}
            adminMessages={adminMessages}
            callRequiredApi={callRequiredApi}
            unPublizedMessageVLSFlyout={unPublizedMessageVLSFlyout}
          />
        )}
      </DragDropContext>
      {isEventOpen ? (
        <>
          {showModal && (
            <CourseNavigation
              message="Are you sure you want to leave? Your preferences are
                      currently saved, but they won't be submitted until you
                      click ‘Submit Preferences’."
              onContinue={handleConfirm}
              onCancel={handleCancel}
            />
          )}
          {EnableSubmitPreferenceErrorMsg && (
            <SubmitPerferenceErrorBox
              msg={submitPreferenceErrorMsg}
              handleSPErrorBoxChange={handleSPErrorBoxChange}
            />
          )}
        </>
      ) : isEventOpen == false ? (
        <NoDataFound
          message={EventOpenMsg ? EventOpenMsg : "NO DATA FOUND"}
          backgroundColor="#F7F7F7"
          containerHeight="100vh"
        />
      ) : (
        <OvalLoader containerHeight="100vh" />
      )}
    </>
  );
};

export default RankPreference;
