import React from "react";
import OpenEventsCard from "./OpenEventsCard/index";
import OngoingEventsCard from "./OngoingEventsCard/index";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";

const OpenEvents = ({
  openEventsData,
  openEventsError,
  adminMessages,
  handleDelete,
  setIsLoadingOpenEvent,
  isLoadingOpenEvent,
}) => {
  return (
    <section
      aria-label="Open Events"
      className="cr_home_open_events cr_home_card"
    >
      <div className="content-head">
        <h2>Open Events</h2>
      </div>
      {isLoadingOpenEvent ? (
        <OvalLoader />
      ) : openEventsError ? (
        <NoDataFound message="There are no open events at this time." />
      ) : (
        <div className="content-body">
          {openEventsData?.rankableEvents?.length > 0 &&
            openEventsData?.rankableEvents?.map((openEvents) => (
              <OpenEventsCard
                data={openEvents}
                key={openEvents?.event_id}
                adminMessages={adminMessages}
              />
            ))}
          {!openEventsData?.removeDoubleDivider && (
            <div className="double-line"></div>
          )}
          {openEventsData?.switchingEvents?.length > 0 && (
            <>
              <div
                className="event_head"
                style={{
                  display: "flex",
                  justifyContent: "end",
                  width: "100%",
                  marginTop: "30px",
                }}
              >
                <h2 className="event_ongo_title">Ongoing</h2>
              </div>
              {openEventsData?.switchingEvents?.map((onGoingData) => (
                <OngoingEventsCard
                  data={onGoingData}
                  key={onGoingData?.event_id}
                  adminMessages={adminMessages}
                  handleDelete={handleDelete}
                  setIsLoadingOpenEvent={setIsLoadingOpenEvent}
                />
              ))}
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default OpenEvents;
