import React, { useEffect, useState } from "react";
import UpcomingEvents from "./UpcomingEvents/index";
import OpenEvents from "./OpenEvents/index";
import PersonalAllocationResults from "./PersonalAllocationResults/index";
import Announcements from "./Announcements/index";
import OverAllocationResult from "./OverAllocationResult/index";
import { GET } from "../HttpServices/index";
import NotificationAlert from "../CommonComponents/NotificationAlert";

const CourseRegistration = ({
  adminMessages,
  initialApiCall,
  setInitialApiCall,
  registrationNumber = null,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOpenEvent, setIsLoadingOpenEvent] = useState(true);
  const [announcements, setAnnouncements] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(null);
  const [openEvents, setOpenEvents] = useState(null);
  const [PAREvents, setPAREvents] = useState(null);
  const [announcementsError, setAnnouncementsError] = useState(false);
  const [upcomingEventsError, setUpcomingEventsError] = useState(false);
  const [openEventsError, setOpenEventsError] = useState(false);
  const [PARError, setPARError] = useState(false);

  const callAnnouncement = async () => {
    try {
      var requestUrl = "/o/clcr/announcements";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
        setAnnouncements(data);
        setAnnouncementsError(false);
        setIsLoading(false);
      } else {
        setAnnouncementsError(true);
        setIsLoading(false);
      }
    } catch (error) {
      setAnnouncementsError(true);
      setIsLoading(false);
    }
  };

  const callUpcomingEvents = async () => {
    try {
      var requestUrl = "/o/clcr/upcoming-events";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
        setUpcomingEvents(data);
        setUpcomingEventsError(false);
      } else {
        setUpcomingEventsError(true);
      }
    } catch (error) {
      setUpcomingEventsError(true);
    }
  };

  const callOpenEvents = async () => {
    try {
      var requestUrl = "/o/clcr/open-events";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
        setOpenEvents(data);
        setIsLoadingOpenEvent(false);
        if (
          data?.rankableEvents?.length > 0 ||
          data?.switchingEvents?.length > 0
        ) {
          setOpenEventsError(false);
        } else {
          setOpenEventsError(true);
        }
      } else {
        setOpenEventsError(true);
        setIsLoadingOpenEvent(false);
      }
    } catch (error) {
      setOpenEventsError(true);
      setIsLoadingOpenEvent(false);
    }
  };

  const callPersonalAllocationResult = async () => {
    try {
      var requestUrl = "/o/clcr/personal-allocation-results";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        const data = await result.json();
        setPAREvents(data);
        setPARError(false);
      } else {
        setPARError(true);
      }
    } catch (error) {
      setPARError(true);
    }
  };

  const callInitalOAR = async () => {
    try {
      var requestUrl = "/o/clcr/get/overall-allocation-results";
      const result = await GET(requestUrl);
      if (result.status === 200) {
        // If the response is successful
      } else {
        console.log("Error in Inital OAR Api");
      }
    } catch (error) {
      console.log("Error in Inital OAR Api");
    }
  };

  const makeAPIRequest = async () => {
    await Promise.all([
      callInitalOAR(),
      callAnnouncement(),
      callUpcomingEvents(),
      callOpenEvents(),
      callPersonalAllocationResult(),
    ]);
    setInitialApiCall(false);
  };

  useEffect(() => {
    if (initialApiCall) {
      makeAPIRequest();
    }
  }, [initialApiCall]);

  return (
    <>
      <div className="course_registration container-fluid">
        <section className="info-banner-area" style={{ position: "static" }}>
          <div
            className="row"
            style={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div className="col-md-6">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a
                      className="breadcrumb-text-truncate"
                      href={
                        window.doAsUserId
                          ? window.location.pathname +
                            "?doAsUserId=" +
                            window.doAsUserId
                          : window.location.pathname
                      }
                    >
                      Course Registration
                    </a>
                  </li>
                </ol>
              </nav>
            </div>
            {registrationNumber && registrationNumber !== 0 && (
              <div>
                <b>Registration Number: {registrationNumber}</b>
              </div>
            )}
          </div>
        </section>
        {adminMessages?.courseRegHomeUserMsg && (
          <div style={{ position: "relative", bottom: "15px", height: "10px" }}>
            <NotificationAlert
              content={
                adminMessages?.courseRegHomeUserMsg
                  ? adminMessages?.courseRegHomeUserMsg
                  : ``
              }
            />
          </div>
        )}
        <div className="row">
          <div className="col-md-4">
            {upcomingEvents && (
              <UpcomingEvents
                upComingEventData={upcomingEvents}
                upcomingEventsError={upcomingEventsError}
              />
            )}
            <OpenEvents
              openEventsData={openEvents}
              openEventsError={openEventsError}
              handleDelete={callOpenEvents}
              setIsLoadingOpenEvent={setIsLoadingOpenEvent}
              isLoadingOpenEvent={isLoadingOpenEvent}
            />
            {PAREvents && (
              <PersonalAllocationResults
                PAREvents={PAREvents}
                PARError={PARError}
                adminMessages={adminMessages}
              />
            )}
          </div>
          <div className="col-md-8">
            <Announcements
              announcementData={announcements}
              announcementsError={announcementsError}
              isLoading={isLoading}
            />
          </div>
        </div>
        <OverAllocationResult />
      </div>
    </>
  );
};

export default CourseRegistration;
