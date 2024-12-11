import React from "react";

const UpcomingEventsCard = ({ data }) => {
  return (
    <div className="content-body">
      <div className="date_month">
        <h2 className="date">{data?.eventOpenDay}</h2>
        <span className="month body2">{data?.eventOpenMonth}</span>
      </div>
      <h4>{data?.event_name}</h4>
      <div className="body2">{data?.closedTag}</div>
    </div>
  );
};

export default UpcomingEventsCard;
