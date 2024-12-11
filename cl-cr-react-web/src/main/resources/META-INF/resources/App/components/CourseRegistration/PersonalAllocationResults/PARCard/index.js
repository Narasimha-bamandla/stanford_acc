import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "@clayui/modal";
import ViewLastSubmissionFlyout from "../../ViewLastSubmissionFlyout/index";

const PARCard = ({ data, index, adminMessages }) => {
  const { observer, onOpenChange, open } = useModal();

  return (
    <div className="content-body" key={index}>
      <h3  className="event_title">{data?.event_name}</h3>
      <p className="body2">{data?.close_date}</p>
      <div className="btn-group">
        {data?.results_published && (
          <Link
            role="link"
            aria-label={"View Results - " + data?.event_name}
            className="sdfd-btn sm-btn primary-btn"
            to={{
              pathname: "/personal-allocation-results",
              search: `?id=${data?.event_id}&event=${data?.event_name}`,
            }}
            target="_blank"
          >
            View Results
          </Link>
        )}
        {!data?.results_published && (
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
      {!data?.results_published && (
        <div className="body2">
          <i>{data?.publish_date}</i>
        </div>
      )}
      <ViewLastSubmissionFlyout
        observer={observer}
        onOpenChange={onOpenChange}
        open={open}
        eventId={data?.event_id}
        adminMessages={adminMessages}
      />
    </div>
  );
};

export default PARCard;
