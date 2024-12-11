import React, { useState } from "react";
import SlidePaginate from "../../CommonComponents/SlidePaginate";
import UpcomingEventsCard from "./UpcomingEventsCard/index";

const UpcomingEvents = ({ upComingEventData }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section
      aria-label="Upcoming Events"
      className="cr_home_upcoming_events cr_home_card"
    >
      <div className="content-head">
        <h2>Upcoming Events</h2>
        <SlidePaginate
          labelFor={"Upcoming Events pagination"}
          startPage={1}
          endPage={upComingEventData?.totalPages}
          onPageChange={onPageChange}
        />
      </div>
      <UpcomingEventsCard
        data={upComingEventData?.upcomingEvents[currentPage - 1]}
        key={upComingEventData?.upcomingEvents[currentPage - 1].event_id}
      />
    </section>
  );
};

export default UpcomingEvents;
