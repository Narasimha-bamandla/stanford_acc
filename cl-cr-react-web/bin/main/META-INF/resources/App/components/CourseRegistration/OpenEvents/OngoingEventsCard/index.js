import React, { useEffect, useState } from "react";
import ViewLastSubmissionFlyout from "../../ViewLastSubmissionFlyout/index";
import { useModal } from "@clayui/modal";
import { Link } from "react-router-dom";
import SwitchEventFlyout from "../../SwitchEventFlyout/index";
import { useLocation, useNavigate } from "react-router-dom";

const OngoingCard = ({
  data,
  adminMessages,
  handleDelete,
  setIsLoadingOpenEvent,
}) => {
  const { observer, onOpenChange, open } = useModal();
  const [disableActions, setDisableActions] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [flyOutDeleteStatus, setFlyOutDeleteStatus] = useState(false);

  const handleNavigation = (sectionName, groupName) => {
    onOpenChange(false);
    if (sectionName) {
      navigate(
        `/switch-events?id=${data?.event_id}&type=${data?.eventType}&section=${sectionName}&groupName=${groupName}`
      );
    } else {
      navigate(
        `/switch-events?id=${data?.event_id}&type=${data?.eventType}&groupName=${groupName}`
      );
    }
  };

  useEffect(() => {
    if (isStudentView && !isAdmin) {
      setDisableActions(true);
    } else if (isStudentView && isAdmin) {
      setDisableActions(false);
    } else if (
      role.toUpperCase() != "STAFF" &&
      role.toUpperCase() != "FACULTY" &&
      role.toUpperCase() != "ADVISOR" &&
      role.toUpperCase() != "ADMIN" &&
      role.toUpperCase() != "AO"
    ) {
      setDisableActions(false);
    } else {
      setDisableActions(true);
    }
  }, []);

  useEffect(() => {
    if (flyOutDeleteStatus) {
      setIsLoadingOpenEvent(true);
      setFlyOutDeleteStatus(false);
      handleDelete();
    }
  }, [open]);

  return (
    <div
      className="event ongo"
      style={{ marginTop: "0px", padding: "10px 0px" }}
    >
      <h3 className="event_title">
        <svg
          width="13"
          height="16"
          viewBox="0 0 13 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg" 
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.8536 3.64645L9.67157 0.464466C9.47631 0.269204 9.15973 0.269204 8.96447 0.464466C8.7692 0.659728 8.7692 0.976311 8.96447 1.17157L11.2929 3.5H3C2.72386 3.5 2.5 3.72386 2.5 4C2.5 4.27614 2.72386 4.5 3 4.5H11.2929L8.96447 6.82843C8.7692 7.02369 8.7692 7.34027 8.96447 7.53553C9.15973 7.7308 9.47631 7.7308 9.67157 7.53553L12.8536 4.35355C13.0488 4.15829 13.0488 3.84171 12.8536 3.64645ZM0.646447 11.6464C0.451184 11.8417 0.451184 12.1583 0.646447 12.3536L3.82843 15.5355C4.02369 15.7308 4.34027 15.7308 4.53553 15.5355C4.7308 15.3403 4.7308 15.0237 4.53553 14.8284L2.20711 12.5H10.5C10.7761 12.5 11 12.2761 11 12C11 11.7239 10.7761 11.5 10.5 11.5H2.20711L4.53553 9.17157C4.7308 8.97631 4.7308 8.65973 4.53553 8.46447C4.34027 8.2692 4.02369 8.2692 3.82843 8.46447L0.646447 11.6464Z"
            fill="#8C1515"
          />
        </svg>
        {data?.event_name}
      </h3>
      <div className="btn-group">
        {data?.eventType == "Elective" ? (
          <Link
            role="link"
            className="sdfd-btn sm-btn primary-btn"
            aria-label={"Elective Switch - " + data?.event_name}
            to={data?.preference_ui_url}
            target={"_blank"}
          >
            Elective Switch
          </Link>
        ) : (
          <Link
            role="link"
            className="sdfd-btn sm-btn primary-btn"
            aria-label={"Request Switch - " + data?.event_name}
            to={{
              pathname: "/switch-events",
              search: `?id=${data?.event_id}&type=${data?.eventType}`,
            }}
          >
            Request Switch
          </Link>
        )}
        {data?.enableViewYourRequests && (
          <button
            aria-label={"View Your Request - " + data?.event_name}
            className="sdfd-btn sm-btn secondary-btn"
            onClick={() => onOpenChange(true)}
          >
            View Your Request
          </button>
        )}
      </div>
      <SwitchEventFlyout
        observer={observer}
        onOpenChange={onOpenChange}
        open={open}
        handleNavigation={handleNavigation}
        eventId={data?.event_id}
        eventType="Core"
        setFlyOutDeleteStatus={setFlyOutDeleteStatus}
        disableActions={disableActions}
      />
    </div>
  );
};

export default OngoingCard;
