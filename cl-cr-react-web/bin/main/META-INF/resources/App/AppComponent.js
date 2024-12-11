import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import CourseRegistration from "./components/CourseRegistration/index";
import ViewPersonalAllocationResults from "./components/CourseRegistration/ViewPersonalAllocationResults/index";
import ViewOARPage from "./components/CourseRegistration/ViewOARPage/index";
import WishlistModal from "./components/CourseRegistration/Wishlist/WishlistModal";
import { useModal } from "@clayui/modal";
import RankPreference from "./components/CourseRegistration/RankPreference/index";
import { GET } from "./components/HttpServices/index";
import SwitchEvents from "./components/CourseRegistration/SwitchEvents/index";

const AppComponent = () => {
  const { observer, onOpenChange, open } = useModal();
  const [callApi, setCallApi] = useState(false);
  const [adminMessages, setAdminMessages] = useState("");
  const [activeWishlistTab, setActiveWishlistTab] = useState(0);
  const [importedCourses, setImportedCourses] = useState([]);
  const [importedQuarterEnabled, setImportedQuarterEnabled] = useState(null);
  const [initialApiCall, setInitialApiCall] = useState(false);
  const location = useLocation();
  const [registrationNumber, setRegistrationNumber] = useState(null);

  const handleAfterModalClose = (value) => {
    setCallApi(value);
  };

  const handleActiveWishlistTab = (activeTab) => {
    setActiveWishlistTab(activeTab);
  };

  const handleImportedCourses = (data) => {
    setImportedCourses(data?.preference_list);
    setImportedQuarterEnabled(data?.enableQuarter);
  };

  const callInitalPAR = async () => {
    try {
      var requestUrl = "/o/clcr/get/personal-allocation-results";
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

  const callInitalUpcomingOpenEvent = async () => {
    try {
      var requestUrl = "/o/clcr/get/upcoming-open-events";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
        if (data?.registration_number !== 0) {
          setRegistrationNumber(data?.registration_number);
        } else {
          setRegistrationNumber(null);
        }
      } else {
        console.log("Error in Inital UpcomingOpenEvent Api");
        setRegistrationNumber(null);
      }
    } catch (error) {
      console.log("Error in Inital UpcomingOpenEvent Api");
      setRegistrationNumber(null);
    }
  };

  const callInitalAnnouncements = async () => {
    try {
      var requestUrl = "/o/clcr/get-announcements";
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

  const callAdminMessages = async () => {
    try {
      var requestUrl = "/o/clcr/get-cr-user-messages";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
        setAdminMessages(data);
      } else {
        console.log("Error in Admin messages");
      }
    } catch (error) {
      console.log("Error in Admin messages");
    }
  };

  const makeInitialAPIRequest = async () => {
    await Promise.all([
      callInitalPAR(),
      callInitalUpcomingOpenEvent(),
      callInitalAnnouncements(),
      callInitalGetEvents(),
    ]);
    setInitialApiCall(true);
  };

  document.addEventListener("openReactModalEvent", () => {
    onOpenChange(true);
    setCallApi(false);
  });

  useEffect(() => {
    if (window.location.search?.includes("open=wishlist")) {
      onOpenChange(true);
      setCallApi(false);
    }
  }, [window.location.search]);

  useEffect(() => {
    callAdminMessages();
    if (location.pathname.includes("personal-allocation-results")) {
      document.title = "Personal Allocation Results";
    } else if (location.pathname.includes("overall-allocation-results")) {
      document.title = "Overall Allocation Results";
    } else if (location.pathname.includes("rank-preference")) {
      document.title = "Rank Preference";
    } else if (location.pathname.includes("switch-events")) {
      document.title = "Switch Request";
    } else {
      document.title = "Course Registration";
      makeInitialAPIRequest();
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <CourseRegistration
              adminMessages={adminMessages}
              initialApiCall={initialApiCall}
              setInitialApiCall={setInitialApiCall}
              registrationNumber={registrationNumber}
            />
          }
        />
        <Route
          path="/personal-allocation-results"
          element={
            <ViewPersonalAllocationResults adminMessages={adminMessages} />
          }
        />
        <Route
          path="/overall-allocation-results"
          element={<ViewOARPage adminMessages={adminMessages} />}
        />
        <Route
          path="/rank-preference"
          element={
            <RankPreference
              importedCourses={importedCourses}
              importedQuarterEnabled={importedQuarterEnabled}
              handleWishlist={() => onOpenChange(true)}
              adminMessages={adminMessages}
            />
          }
        />
        <Route
          path="/switch-events"
          element={<SwitchEvents adminMessages={adminMessages} />}
        />
      </Routes>
      <WishlistModal
        observer={observer}
        onOpenChange={onOpenChange}
        open={open}
        handleAfterModalClose={handleAfterModalClose}
        adminMessages={adminMessages}
        activeWishlistTab={activeWishlistTab}
        handleImportedCourses={handleImportedCourses}
      />
    </>
  );
};

export default AppComponent;
