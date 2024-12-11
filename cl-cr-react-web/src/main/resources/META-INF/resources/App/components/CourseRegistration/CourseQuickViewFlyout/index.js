import React, { useEffect, useState } from "react";
import ReadMore from "../../CommonComponents/ReadMore";
import { Link } from "react-router-dom";
import MyNotesModal from "../../CommonComponents/MyNotesModal";
import LockIconTooltip from "../../CommonComponents/LockIconTooltip";
import OvalLoader from "../../CommonComponents/OvalLoader";
import NoDataFound from "../../CommonComponents/NoDataFound";

const CourseQuickViewFlyout = ({
  observer,
  onOpenChange,
  open,
  type,
  sectionData,
}) => {
  const [notesData, setNotesData] = useState([]);
  const [CQVData, setCQVData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myNotesEnabled, setMyNotesEnabled] = useState(true);

  const getNotesData = async (data) => {
    var requestUrl =
      "/o/mygsb/gsb/clce/get-notes?class_id=" +
      data?.classId +
      "&p_auth=" +
      Liferay.authToken;

    var requestHeaders = new Headers({
      Accept: "application/json",
    });

    await fetch(requestUrl, {
      method: "GET",
      headers: requestHeaders,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((userData) => {
        setNotesData(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSelectedRowData = async (data) => {
    try {
      const requestUrl = `/o/clcr/get/section-info?classId=${data?.classId}&classNumber=${data?.classNumber}&academicYear=${data?.academicYear}&p_auth=${Liferay.authToken}`;
      var requestHeaders = new Headers({
        Accept: "application/json",
      });
      setIsLoading(true);
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: requestHeaders,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      setCQVData(responseData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(
        "Error in getting CourseQuickViewFlyOut on getSelectedRowData",
        error
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        event.target.className == "fade modal d-block modal_popup show"
      ) {
        onOpenChange(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    Liferay?.Session?.extend();
    getSelectedRowData(sectionData);
    getNotesData(sectionData);
    if (isStudentView && !isAdmin) {
      setMyNotesEnabled(false);
    } else if (isStudentView && isAdmin) {
      setMyNotesEnabled(!isAdmin);
    } else if (
      role.toUpperCase() != "STAFF" &&
      role.toUpperCase() != "FACULTY" &&
      role.toUpperCase() != "ADVISOR" &&
      role.toUpperCase() != "ADMIN" &&
      role.toUpperCase() != "AO"
    ) {
      setMyNotesEnabled(true);
    } else {
      setMyNotesEnabled(false);
    }
  }, []);

  if (isLoading)
    return (
      <div
        className="cr-core-quickview"
        style={{ display: open ? "" : "none" }}
      >
        <div
          aria-hidden="true"
          className={`modal-backdrop fade ${open ? "show" : ""}`}
          data-suppressed="true"
          inert="true"
          tabIndex={-1}
        ></div>
        <div
          className={`fade modal d-block modal_popup ${open ? "show" : ""}`}
          tabIndex={-1}
        >
          <div
            aria-label="Core Quickview Modal Popup"
            aria-labelledby="clay-modal-label-6"
            aria-modal="true"
            className="modal-dialog modal-full-screen modal-info modal-content wishlist-side-modal"
            role="dialog"
            style={{ width: 1102, maxHeight: "inherit" }}
            tabIndex={0}
          >
            <OvalLoader />
          </div>
        </div>
      </div>
    );
  if (!CQVData?.type)
    return (
      <div
        className="cr-core-quickview"
        style={{ display: open ? "" : "none" }}
      >
        <div
          aria-hidden="true"
          className={`modal-backdrop fade ${open ? "show" : ""}`}
          data-suppressed="true"
          inert="true"
          tabIndex={-1}
        ></div>
        <div
          className={`fade modal d-block modal_popup ${open ? "show" : ""}`}
          tabIndex={-1}
        >
          <div
            aria-label="Course Quickview Modal Popup"
            aria-labelledby="clay-modal-label-6"
            aria-modal="true"
            className="modal-dialog modal-full-screen modal-info modal-content wishlist-side-modal"
            role="dialog"
            style={{ width: 1102, maxHeight: "inherit" }}
            tabIndex={0}
          >
            <div
              className="col-auto"
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", to: "10px" }}>
                <button
                  aria-label="Close course quickview modal popup"
                  className="btn-flex textbook-btn btn-unstyled"
                  tabIndex={0}
                  onClick={() => onOpenChange(false)}
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
            </div>
            <NoDataFound />
          </div>
        </div>
      </div>
    );

  return (
    <div className="cr-core-quickview" style={{ display: open ? "" : "none" }}>
      <div
        aria-hidden="true"
        className={`modal-backdrop fade ${open ? "show" : ""}`}
        data-suppressed="true"
        inert="true"
        tabIndex={-1}
      ></div>
      <div
        className={`fade modal d-block modal_popup ${open ? "show" : ""}`}
        tabIndex={-1}
      >
        <div
          aria-label="Core Quickview Modal Popup"
          aria-labelledby="clay-modal-label-6"
          aria-modal="true"
          className="modal-dialog modal-full-screen modal-info modal-content wishlist-side-modal"
          role="dialog"
          style={{ width: 1102, maxHeight: "inherit" }}
          tabIndex={0}
        >
          <div className="modal_popup-container container-fluid container-view container-fluid-max-xl">
            <div className="container-fluid">
              <div
                className="row justify-content-between"
                style={{ marginBottom: 20 }}
              >
                <div className="col-auto" style={{ width: "85%" }}>
                  <div className="d-flex flex-column c-gap-3 mb-3">
                    <div className="d-flex flex-row c-gap-2">
                      <span className="font16b">
                        {" "}
                        {CQVData?.subjectCode} {CQVData?.catalogNumberCode}
                        {" - "}
                        {CQVData?.classSection}
                      </span>{" "}
                      {CQVData?.recommended && (
                        <span
                          aria-label="This section is recommended for you as per your study plan."
                          className="tag sm lfr-portal-tooltip"
                          data-tooltip-align="bottom"
                          role="tooltip"
                          tabIndex={0}
                          title="This section is recommended for you as per your study plan."
                        >
                          <strong>RECOMMENDED</strong>
                        </span>
                      )}
                      {CQVData?.sectionInformationResponse
                        ?.permissionRequired && (
                        <LockIconTooltip
                          position="bottom"
                          message={
                            CQVData?.sectionInformationResponse
                              ?.permissionRequired
                          }
                        />
                      )}
                    </div>
                    <h3 className="font-weight-bold">{CQVData?.title}</h3>
                    <div className="d-flex flex-row c-gap-2 font16">
                      <strong>Instructors:</strong>
                      {CQVData?.instructors?.join(", ")}
                    </div>
                  </div>
                </div>
                <div
                  className="col-auto"
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", bottom: "29px" }}>
                    <button
                      aria-label="Close"
                      className="btn-flex textbook-btn btn-unstyled"
                      tabIndex={0}
                      onClick={() => onOpenChange(false)}
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
                  {myNotesEnabled && (
                    <div
                      style={{
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <MyNotesModal
                        data={sectionData}
                        notesData={notesData}
                        getNotesData={getNotesData}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div
                className="d-flex c-gap-3  justify-content-between"
                style={{ marginBottom: 20 }}
              >
                <div className="col-6 pl-0">
                  <div className="d-flex flex-column c-gap-3  ">
                    <div className="d-flex flex-column c-gap-3 mb-4">
                      <h4>Section Information</h4>
                      <div className="cr_course_info">
                        {type == "Core" && (
                          <div className="data">
                            <label>Course Area & Level</label>
                            <div className="data-text">
                              {CQVData?.courseArea} - {CQVData?.type}
                            </div>
                          </div>
                        )}
                        <div className="data">
                          <label>Timing</label>
                          <div className="data-text">
                            {CQVData?.sectionInformationResponse?.meetingPatterns?.map(
                              (timeFrame, timeFrameIndex) => (
                                <ul className="line_list" key={timeFrameIndex}>
                                  <li className="day_time">{timeFrame}</li>
                                </ul>
                              )
                            )}
                          </div>
                        </div>
                        <div className="data">
                          <label>Units</label>
                          <div className="data-text">
                            {CQVData?.sectionInformationResponse?.unit_maximum}
                          </div>
                        </div>
                        <div className="data">
                          <label>Quarter</label>
                          <div className="data-text">
                            {CQVData?.sectionInformationResponse?.quarter}
                          </div>
                        </div>
                        {CQVData?.sectionInformationResponse?.ACAP && (
                          <div className="data">
                            <label>Capacity</label>
                            <div className="data-text">
                              {CQVData?.sectionInformationResponse?.ACAP}
                            </div>
                          </div>
                        )}
                        <div className="data">
                          <label>Grade Basis</label>
                          <div className="data-text">
                            {CQVData?.sectionInformationResponse?.APFA}
                          </div>
                        </div>
                        <div className="data">
                          <label>Grade Distribution</label>
                          <div className="data-text">
                            {CQVData?.sectionInformationResponse?.AGRA}
                          </div>
                        </div>
                      </div>
                    </div>
                    {(CQVData?.sectionInformationResponse?.section_video ||
                      CQVData?.sectionInformationResponse
                        ?.section_syllabus) && (
                      <div className="d-flex flex-column c-gap-3 mb-4">
                        <h4>Helpful Links</h4>
                        <div className="d-flex flex-wrap gap-3">
                          {CQVData?.sectionInformationResponse
                            ?.section_video && (
                            <div
                              className="link_cards"
                              style={{ width: "auto" }}
                            >
                              <Link
                                className="link_card active"
                                to={
                                  CQVData?.sectionInformationResponse
                                    ?.section_video
                                }
                                style={{
                                  display: "contents",
                                  textDecoration: "none",
                                }}
                                target="_blank"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    window.open(
                                      CQVData?.sectionInformationResponse
                                        ?.section_video,
                                      "_blank"
                                    );
                                  }
                                }}
                                tabIndex="0"
                              >
                                <div className="link_card">
                                  <div className="link_card-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={33}
                                      height={32}
                                      viewBox="0 0 33 32"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M6.34999 4C3.26148 4 0.75 6.51148 0.75 9.59999V22.4C0.75 25.4885 3.26148 28 6.34999 28H27.15C30.2385 28 32.75 25.4885 32.75 22.4V9.59999C32.75 6.51148 30.2385 4 27.15 4H6.34999ZM6.34999 5.6H27.15C29.3798 5.6 31.15 7.3702 31.15 9.59999V22.4C31.15 24.6298 29.3798 26.4 27.15 26.4H6.34999C4.1202 26.4 2.35 24.6298 2.35 22.4V9.59999C2.35 7.3702 4.1202 5.6 6.34999 5.6ZM13.1 9.99999C12.8966 10.0127 12.7058 10.1026 12.5664 10.2513C12.427 10.4 12.3496 10.5962 12.35 10.8V21.2C12.3488 21.3978 12.421 21.5891 12.5526 21.7368C12.6842 21.8846 12.8658 21.9783 13.0625 22C13.222 22.0178 13.3831 21.9873 13.525 21.9125L23.125 16.7125C23.2531 16.6443 23.3602 16.5425 23.4349 16.4181C23.5096 16.2937 23.5491 16.1513 23.5491 16.0062C23.5491 15.8611 23.5096 15.7187 23.4349 15.5943C23.3602 15.4699 23.2531 15.3682 23.125 15.3L13.525 10.1C13.3953 10.0279 13.2482 9.99328 13.1 9.99999ZM13.95 12.15L21.075 16L13.95 19.8625V12.15Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </div>
                                  <div className="link_card-text">
                                    {" "}
                                    BBL/Faculty Video
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                          {CQVData?.sectionInformationResponse
                            ?.section_syllabus && (
                            <div
                              className="link_cards"
                              style={{ width: "auto", marginLeft: "10px" }}
                            >
                              <Link
                                className="link_card active"
                                to={
                                  CQVData?.sectionInformationResponse
                                    ?.section_syllabus
                                }
                                style={{
                                  display: "contents",
                                  textDecoration: "none",
                                }}
                                target="_blank"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    window.open(
                                      CQVData?.sectionInformationResponse
                                        ?.section_syllabus,
                                      "_blank"
                                    );
                                  }
                                }}
                                tabIndex="0"
                              >
                                <div className="link_card">
                                  <div className="link_card-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={33}
                                      height={34}
                                      viewBox="0 0 33 34"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M28.9582 24.5244L23.4133 21.7356V4.73547C23.4133 4.59407 23.3574 4.45837 23.2579 4.35839C23.1584 4.2584 23.0234 4.20222 22.8827 4.20222H18.6378V3.66897C18.6378 3.52756 18.5819 3.39186 18.4824 3.29188C18.3829 3.1919 18.2479 3.13571 18.1071 3.13571H15.9316C15.768 2.32584 15.24 1.63785 14.5018 1.27335C13.7639 0.908882 12.8993 0.908882 12.1614 1.27335C11.4233 1.63782 10.8953 2.32584 10.7316 3.13571H8.55612C8.2631 3.13571 8.02551 3.37449 8.02551 3.66897V4.20222H3.78061C3.48759 4.20222 3.25 4.44099 3.25 4.73547V29.2651C3.25 29.4065 3.3059 29.5422 3.40539 29.6422C3.50488 29.7422 3.63991 29.7983 3.78061 29.7983H18.1071V30.3316C18.1064 30.5228 18.2076 30.6999 18.3724 30.7956L22.0867 32.9286C22.2509 33.0238 22.4532 33.0238 22.6173 32.9286L26.3316 30.7956C26.4965 30.6999 26.5976 30.5228 26.5969 30.3316V26.6629L28.1888 25.863V32.4644C28.1888 32.7588 28.4264 32.9976 28.7194 32.9976C29.0124 32.9976 29.25 32.7588 29.25 32.4644V24.9988C29.2493 24.7981 29.1366 24.6149 28.9582 24.5244ZM9.08661 4.20234H11.2091C11.3498 4.20234 11.4848 4.14616 11.5843 4.04617C11.6838 3.94619 11.7397 3.81049 11.7397 3.66909C11.7397 3.09751 12.0431 2.56949 12.5356 2.28361C13.0281 1.99794 13.635 1.99794 14.1274 2.28361C14.6199 2.56952 14.9233 3.0975 14.9233 3.66909C14.9233 3.81049 14.9793 3.94619 15.0787 4.04617C15.1782 4.14616 15.3133 4.20234 15.454 4.20234H17.5764V5.8021H9.08661V4.20234ZM4.3111 28.732V5.26885H8.02539V6.33535C8.02539 6.47676 8.08129 6.61245 8.18078 6.71244C8.28027 6.81242 8.4153 6.8686 8.556 6.8686H18.107C18.2477 6.8686 18.3828 6.81242 18.4822 6.71244C18.5817 6.61245 18.6376 6.47676 18.6376 6.33535V5.26885H22.3519V21.2664C22.2688 21.2669 22.187 21.2871 22.1131 21.325L15.7458 24.5245C15.5686 24.6159 15.457 24.799 15.457 24.9992C15.457 25.1994 15.5686 25.3825 15.7458 25.4739L18.1071 26.663V28.732L4.3111 28.732ZM25.5356 30.0225L22.3519 31.8515L19.1682 30.0225V27.1962L22.1131 28.6734C22.2633 28.7493 22.4405 28.7493 22.5907 28.6734L25.5355 27.1962L25.5356 30.0225ZM22.3519 27.6014L17.1733 24.9992L22.3519 22.397L27.5306 24.9992L22.3519 27.6014Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M7.76128 10.6014H16.7817C17.0747 10.6014 17.3123 10.3626 17.3123 10.0681C17.3123 9.77367 17.0747 9.5349 16.7817 9.5349H7.76128C7.46826 9.5349 7.23067 9.77367 7.23067 10.0681C7.23067 10.3626 7.46826 10.6014 7.76128 10.6014Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M16.7817 17.0004H7.76128C7.46826 17.0004 7.23067 17.2392 7.23067 17.5337C7.23067 17.8282 7.46826 18.0669 7.76128 18.0669H16.7817C17.0747 18.0669 17.3123 17.8282 17.3123 17.5337C17.3123 17.2392 17.0747 17.0004 16.7817 17.0004Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M7.76103 14.3342H19.4345C19.7275 14.3342 19.9651 14.0954 19.9651 13.8009C19.9651 13.5064 19.7275 13.2677 19.4345 13.2677H7.76103C7.46801 13.2677 7.23042 13.5064 7.23042 13.8009C7.23042 14.0954 7.46801 14.3342 7.76103 14.3342Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M17.3121 21.2665C17.3121 21.125 17.2562 20.9893 17.1567 20.8894C17.0572 20.7894 16.9221 20.7332 16.7814 20.7332H7.76103C7.46801 20.7332 7.23042 20.972 7.23042 21.2665C7.23042 21.5609 7.46801 21.7997 7.76103 21.7997H16.7814C16.9221 21.7997 17.0572 21.7435 17.1567 21.6435C17.2561 21.5436 17.3121 21.4079 17.3121 21.2665Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M28.9582 24.5244L23.4133 21.7356V4.73547C23.4133 4.59407 23.3574 4.45837 23.2579 4.35839C23.1584 4.2584 23.0234 4.20222 22.8827 4.20222H18.6378V3.66897C18.6378 3.52756 18.5819 3.39186 18.4824 3.29188C18.3829 3.1919 18.2479 3.13571 18.1071 3.13571H15.9316C15.768 2.32584 15.24 1.63785 14.5018 1.27335C13.7639 0.908882 12.8993 0.908882 12.1614 1.27335C11.4233 1.63782 10.8953 2.32584 10.7316 3.13571H8.55612C8.2631 3.13571 8.02551 3.37449 8.02551 3.66897V4.20222H3.78061C3.48759 4.20222 3.25 4.44099 3.25 4.73547V29.2651C3.25 29.4065 3.3059 29.5422 3.40539 29.6422C3.50488 29.7422 3.63991 29.7983 3.78061 29.7983H18.1071V30.3316C18.1064 30.5228 18.2076 30.6999 18.3724 30.7956L22.0867 32.9286C22.2509 33.0238 22.4532 33.0238 22.6173 32.9286L26.3316 30.7956C26.4965 30.6999 26.5976 30.5228 26.5969 30.3316V26.6629L28.1888 25.863V32.4644C28.1888 32.7588 28.4264 32.9976 28.7194 32.9976C29.0124 32.9976 29.25 32.7588 29.25 32.4644V24.9988C29.2493 24.7981 29.1366 24.6149 28.9582 24.5244ZM9.08661 4.20234H11.2091C11.3498 4.20234 11.4848 4.14616 11.5843 4.04617C11.6838 3.94619 11.7397 3.81049 11.7397 3.66909C11.7397 3.09751 12.0431 2.56949 12.5356 2.28361C13.0281 1.99794 13.635 1.99794 14.1274 2.28361C14.6199 2.56952 14.9233 3.0975 14.9233 3.66909C14.9233 3.81049 14.9793 3.94619 15.0787 4.04617C15.1782 4.14616 15.3133 4.20234 15.454 4.20234H17.5764V5.8021H9.08661V4.20234ZM4.3111 28.732V5.26885H8.02539V6.33535C8.02539 6.47676 8.08129 6.61245 8.18078 6.71244C8.28027 6.81242 8.4153 6.8686 8.556 6.8686H18.107C18.2477 6.8686 18.3828 6.81242 18.4822 6.71244C18.5817 6.61245 18.6376 6.47676 18.6376 6.33535V5.26885H22.3519V21.2664C22.2688 21.2669 22.187 21.2871 22.1131 21.325L15.7458 24.5245C15.5686 24.6159 15.457 24.799 15.457 24.9992C15.457 25.1994 15.5686 25.3825 15.7458 25.4739L18.1071 26.663V28.732L4.3111 28.732ZM25.5356 30.0225L22.3519 31.8515L19.1682 30.0225V27.1962L22.1131 28.6734C22.2633 28.7493 22.4405 28.7493 22.5907 28.6734L25.5355 27.1962L25.5356 30.0225ZM22.3519 27.6014L17.1733 24.9992L22.3519 22.397L27.5306 24.9992L22.3519 27.6014Z"
                                        stroke="currentColor"
                                        strokeWidth="0.4"
                                      />
                                      <path
                                        d="M7.76128 10.6014H16.7817C17.0747 10.6014 17.3123 10.3626 17.3123 10.0681C17.3123 9.77367 17.0747 9.5349 16.7817 9.5349H7.76128C7.46826 9.5349 7.23067 9.77367 7.23067 10.0681C7.23067 10.3626 7.46826 10.6014 7.76128 10.6014Z"
                                        stroke="currentColor"
                                        strokeWidth="0.4"
                                      />
                                      <path
                                        d="M16.7817 17.0004H7.76128C7.46826 17.0004 7.23067 17.2392 7.23067 17.5337C7.23067 17.8282 7.46826 18.0669 7.76128 18.0669H16.7817C17.0747 18.0669 17.3123 17.8282 17.3123 17.5337C17.3123 17.2392 17.0747 17.0004 16.7817 17.0004Z"
                                        stroke="currentColor"
                                        strokeWidth="0.4"
                                      />
                                      <path
                                        d="M7.76103 14.3342H19.4345C19.7275 14.3342 19.9651 14.0954 19.9651 13.8009C19.9651 13.5064 19.7275 13.2677 19.4345 13.2677H7.76103C7.46801 13.2677 7.23042 13.5064 7.23042 13.8009C7.23042 14.0954 7.46801 14.3342 7.76103 14.3342Z"
                                        stroke="currentColor"
                                        strokeWidth="0.4"
                                      />
                                      <path
                                        d="M17.3121 21.2665C17.3121 21.125 17.2562 20.9893 17.1567 20.8894C17.0572 20.7894 16.9221 20.7332 16.7814 20.7332H7.76103C7.46801 20.7332 7.23042 20.972 7.23042 21.2665C7.23042 21.5609 7.46801 21.7997 7.76103 21.7997H16.7814C16.9221 21.7997 17.0572 21.7435 17.1567 21.6435C17.2561 21.5436 17.3121 21.4079 17.3121 21.2665Z"
                                        stroke="currentColor"
                                        strokeWidth="0.4"
                                      />
                                    </svg>
                                  </div>
                                  <div className="link_card-text">
                                    {" "}
                                    View Historical Syllabus{" "}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column c-gap-3  ">
                    {CQVData?.note && (
                      <ReadMore
                        heading={"Special Notes"}
                        content={CQVData?.note}
                        scrolling={`courseinformation&sectionId=${CQVData?.sectionInformationResponse?.section_id}`}
                        classId={sectionData?.classId}
                        redirectTo={
                          CQVData?.courseDetailsUrl
                            ? CQVData?.courseDetailsUrl
                            : "https://webserver-mygsb-uat.lfr.cloud/group/course-research/course-listing/#/coursedetails?id="
                        }
                      />
                    )}
                    {CQVData?.overview && (
                      <ReadMore
                        heading={"Overview"}
                        content={CQVData?.overview}
                        scrolling={`overview&sectionId=${CQVData?.sectionInformationResponse?.section_id}`}
                        classId={sectionData?.classId}
                        redirectTo={
                          CQVData?.courseDetailsUrl
                            ? CQVData?.courseDetailsUrl
                            : "https://webserver-mygsb-uat.lfr.cloud/group/course-research/course-listing/#/coursedetails?id="
                        }
                      />
                    )}
                    <div className="d-flex flex-column c-gap-3 mb-2">
                      <h4>Student Course Evaluations</h4>
                      {CQVData?.sectionInformationResponse?.courseEvaluationResponse?.courseEvaluationList?.map(
                        (evaluationList) => {
                          return (
                            <div
                              key={
                                evaluationList?.instructorName +
                                evaluationList?.teachingTIme
                              }
                              className="d-flex flex-column c-gap-3"
                            >
                              <div className="grey-link-text font16">
                                Showing Evaluations for{" "}
                                <strong>
                                  {evaluationList?.instructorUrl ? (
                                    <Link
                                      to={evaluationList?.instructorUrl}
                                      target="_blank"
                                    >
                                      {evaluationList?.instructorName}
                                    </Link>
                                  ) : (
                                    <span
                                      style={{
                                        color: "#585754",
                                        textDecorationLine: "underline",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {evaluationList?.instructorName}
                                    </span>
                                  )}
                                </strong>{" "}
                                for {evaluationList?.teachingTIme}
                              </div>
                              <div className="d-flex flex-column c-gap-3 font16b">
                                {evaluationList?.ratings?.map(
                                  (rating, ratingIndex) => {
                                    return (
                                      <div
                                        className="ratings d-flex c-gap-2"
                                        key={ratingIndex}
                                      >
                                        <div className="w-25">
                                          {rating?.category}
                                        </div>
                                        <div>{rating?.rating?.toFixed(1)}</div>
                                        <div className={"sdfd-ratingbar"}>
                                          {Object?.values(rating?.ratingFrames)
                                            ?.reverse()
                                            ?.map((frame, frameIndex) => {
                                              if (frame?.toFixed(0) !== "0") {
                                                return (
                                                  <>
                                                    {frame?.toFixed(0) >= 4 ? (
                                                      <div
                                                        key={frameIndex}
                                                        className={`star${
                                                          Object?.values(
                                                            rating?.ratingFrames
                                                          )?.length - frameIndex
                                                        }`}
                                                        style={{
                                                          width: `max(${frame.toFixed(
                                                            0
                                                          )}%, 30px)`,
                                                          minWidth: "30px",
                                                        }}
                                                      >
                                                        {frame?.toFixed(0) >= 4
                                                          ? `${frame?.toFixed(
                                                              0
                                                            )}%`
                                                          : ""}
                                                      </div>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </>
                                                );
                                              }
                                            })}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                                <div />
                              </div>
                            </div>
                          );
                        }
                      )}
                      <a
                        className="d-flex c-gap-2 "
                        href={`${
                          CQVData?.courseDetailsUrl
                            ? encodeURI(CQVData.courseDetailsUrl)
                            : "https://webserver-mygsb-uat.lfr.cloud/group/course-research/course-listing/#/coursedetails?id="
                        }${encodeURIComponent(
                          sectionData?.classId
                        )}&section=studentcourseevaluations&sectionId=${encodeURIComponent(
                          CQVData?.sectionInformationResponse?.section_id
                        )}`}
                        target="_blank"
                      >
                        <strong> See Full Details</strong>
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M14 9.83333V14.8333C14 15.2754 13.8244 15.6993 13.5118 16.0118C13.1993 16.3244 12.7754 16.5 12.3333 16.5H3.16667C2.72464 16.5 2.30072 16.3244 1.98816 16.0118C1.67559 15.6993 1.5 15.2754 1.5 14.8333V5.66667C1.5 5.22464 1.67559 4.80072 1.98816 4.48816C2.30072 4.17559 2.72464 4 3.16667 4H8.16667M11.5 1.5H16.5M16.5 1.5V6.5M16.5 1.5L7.33333 10.6667"
                            stroke="#8C1515"
                            strokeWidth="1.5"
                            strokeLinecap="square"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseQuickViewFlyout;
