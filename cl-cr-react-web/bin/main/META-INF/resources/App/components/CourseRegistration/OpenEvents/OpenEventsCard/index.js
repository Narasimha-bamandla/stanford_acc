import React from "react";
import ViewLastSubmissionFlyout from "../../ViewLastSubmissionFlyout/index";
import { useModal } from "@clayui/modal";
import { Link } from "react-router-dom";

const OpenEventsCard = ({ data, adminMessages }) => {
  const { observer, onOpenChange, open } = useModal();

  return (
    <div className="event open_event">
      <div className="event_head">
        <h3 className="event_title">{data?.event_name}</h3>
        <div className="event_tdt">
          <div className="text">Until</div>
          <div className="date_time">
            <div className="date_month">
              <div className="date">{data?.eventCloseDay}</div>
              <span className="month body2">
                {(data?.eventCloseMonth).slice(0, 3)}
              </span>
            </div>
            <div className="time">{data?.eventCloseTime}</div>
          </div>
        </div>
      </div>

      <div className="body2">{data?.resultReturnTag}</div>
      <div className="btn-group">
        <Link
          role="link"
          aria-label={"Rank Preferences - " + data?.event_name}
          className="sdfd-btn sm-btn primary-btn"
          to={{
            pathname: "/rank-preference",
            search: `?id=${data.event_id}&event=${data?.event_name}&type=${data.eventType}`,
          }}
        >
          Rank Preferences
        </Link>

        {data?.enableViewLastSubmission && (
          <button
            id={`viewlastsubmitbtn-${data?.event_id}`}
            aria-label={"View Last Submission - " + data?.event_name}
            className="sdfd-btn sm-btn secondary-btn"
            onClick={() => onOpenChange(true)}
          >
            View Last Submission
          </button>
        )}
      </div>
      <ViewLastSubmissionFlyout
        observer={observer}
        onOpenChange={onOpenChange}
        open={open}
        eventId={data.event_id}
        adminMessages={adminMessages}
      />
    </div>
  );
};

export default OpenEventsCard;
