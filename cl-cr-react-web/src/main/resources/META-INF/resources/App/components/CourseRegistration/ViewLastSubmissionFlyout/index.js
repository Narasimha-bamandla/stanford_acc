import React, { useEffect, useState } from "react";
import VLSBanner from "./VLSBanner/index";
import VLSCourseCard from "./VLSCourseCard/index";
import { GET } from "../../HttpServices/index";
import OvalLoader from "../../CommonComponents/OvalLoader";
import NoDataFound from "../../CommonComponents/NoDataFound";

const ViewLastSubmissionFlyout = ({
  open,
  onOpenChange,
  enableVLSConflictMsg = false,
  eventId = null,
  submitConflictRquest = false,
  enableViewFlyOutSubmittMsg = false,
  adminMessages,
  callRequiredApi,
  unPublizedMessageVLSFlyout = null,
}) => {
  const [vlsData, setVLSData] = useState(null);
  const [isLoading, setISLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    "Your Course Preferences could not be submitted. Please try again later"
  );
  const [isModalFocused, setIsModalFocused] = useState(false);

  const makeAPIRequest = async () => {
    if (submitConflictRquest) {
      await callSubmitConflictRquest();
    } else if (unPublizedMessageVLSFlyout) {
      setISLoading(false);
    } else {
      await callViewSubmission();
    }
  };

  const getSubmissionData = (data) => {
    setVLSData(data);
  };

  const callSubmitConflictRquest = async () => {
    try {
      const params = `&eventId=${eventId}&consent=true`;
      var requestUrl = `/o/clcr/submit-preferences`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        callViewSubmission();
      } else if (result.status === 400) {
        const data = await result.json();
        setISLoading(false);
        setErrorMsg(data.message);
      } else {
        console.log("error in callSubmitConflictRquest ");
        setISLoading(false);
      }
    } catch (error) {
      console.log("error in callSubmitConflictRquest ");
      setISLoading(false);
    }
  };

  const callViewSubmission = async () => {
    Liferay?.Session?.extend();
    try {
      const params = `&eventId=${eventId}`;
      const requestUrl = `/o/clcr/last-submission-details`;
      const result = await GET(requestUrl, params);
      if (result.status === 200) {
        const data = await result.json();
        if (data.confirmation_code) {
          getSubmissionData(data);
          setISLoading(false);
          callRequiredApi();
        } else {
          setISLoading(false);
          setErrorMsg(data.status);
        }
      } else {
        console.error("Failed to fetch submission data");
        setISLoading(false);
      }
    } catch (error) {
      console.error("Error fetching submission data:", error);
      setISLoading(false);
    }
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    var interval = setInterval(function () {
      var button = document.getElementById(`viewlastsubmitbtn-${eventId}`);
      if (button) {
        button.focus();
        clearInterval(interval);
      }
    }, 100);
  };

  useEffect(() => {
    setVLSData(null);
    if (open) {
      setISLoading(true);
      makeAPIRequest();
    }
  }, [open]);

  useEffect(() => {
    setErrorMsg(
      unPublizedMessageVLSFlyout
        ? unPublizedMessageVLSFlyout
        : "Your Course Preferences could not be submitted. Please try again later"
    );
  }, [unPublizedMessageVLSFlyout]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        const modalContent = document.querySelector(".vls-side-modal");
        const focusableElements = modalContent.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (focusableElements.length > 0) {
          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      } else if (e.key === "Escape" && !isLoading) {
        handleCloseModal();
      }
    };

    const handleFocusInModal = (e) => {
      const modalContent = document.querySelector(".vls-side-modal");
      if (modalContent && modalContent.contains(e.target)) {
        setIsModalFocused(true);
      } else {
        setIsModalFocused(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        open &&
        !isLoading &&
        event.target.className == "fade modal d-block modal_popup show"
      ) {
        handleCloseModal();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("focusin", handleFocusInModal);
      const modalContent = document.querySelector(".vls-side-modal");
      modalContent.focus();
      const allFocusableElements = document.querySelectorAll("button");
      allFocusableElements.forEach(function (element) {
        element.setAttribute("tabindex", "0");
      });
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusInModal);
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusInModal);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, handleCloseModal, isLoading]);

  return (
    <>
      <div
        id={eventId}
        className="cr-core-view-last-submission"
        style={{ display: open ? "" : "none" }}
      >
        <div
          aria-hidden="true"
          className={`modal-backdrop fade ${open ? "show" : ""}`}
          data-suppressed="true"
          inert="true"
          tabIndex={"-1"}
        />
        <div
          className={`fade modal d-block modal_popup ${open ? "show" : ""}`}
          tabIndex={"-1"}
        >
          <div
            aria-label="View Last Submission Modal Popup"
            aria-modal="true"
            className="modal-dialog modal-full-screen modal-info modal-content vls-side-modal"
            role="dialog"
            style={{ width: 1102, maxHeight: "inherit" }}
            tabIndex={isModalFocused ? "0" : "-1"}
          >
            {isLoading ? (
              <OvalLoader />
            ) : vlsData ? (
              <div
                className="course_registration modal_popup-container container-fluid container-view container-fluid-max-xl"
                style={{ background: "#f7f7f7" }}
              >
                <VLSBanner
                  handleCloseModal={handleCloseModal}
                  data={vlsData}
                  type={vlsData?.event_type}
                  enableVLSConflictMsg={enableVLSConflictMsg}
                  enableViewFlyOutSubmittMsg={enableViewFlyOutSubmittMsg}
                  adminMessages={adminMessages}
                />
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-12" role="list">
                          {vlsData.preferences?.map((data, dataIndex) => (
                            <VLSCourseCard
                              data={data}
                              index={dataIndex}
                              key={dataIndex}
                              type={vlsData?.event_type}
                              enableQuarter={vlsData?.enableQuarter}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="col-auto"
                  style={{
                    marginRight: "30px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    marginTop: "38px",
                  }}
                >
                  <button
                    aria-label="Close"
                    className="btn-flex textbook-btn btn-unstyled"
                    tabIndex={0}
                    onClick={handleCloseModal}
                  >
                    Close
                    <svg
                      fill="none"
                      height={24}
                      viewBox="0 0 24 24"
                      width={24}
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="#43423E"
                        strokeLinecap="square"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
                <NoDataFound message={errorMsg} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewLastSubmissionFlyout;
