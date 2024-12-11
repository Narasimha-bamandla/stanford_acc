import React, { useEffect, useState } from "react";
import ClayButton from "@clayui/button";
import { Row, Col, ContainerFluid } from "@clayui/layout";
import ClayTabs from "@clayui/tabs";
import CoreCourseCard from "./CoreCourseCard";
import ElectiveWishlist from "./ElectiveWishlist";
import Modal from "./Modal";
import CustomToolTip from "../../CommonComponents/CustomToolTip";
import { GET, POST } from "../../HttpServices/index";
import { useLocation } from "react-router-dom";
import TransparentLoader from "../../CommonComponents/TransparentLoader";

const WishlistModal = ({
  observer,
  onOpenChange,
  open,
  handleAfterModalClose,
  adminMessages,
  activeWishlistTab,
  handleImportedCourses,
}) => {
  const [active, setActive] = useState(activeWishlistTab);
  const [data, setData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sectionType, setSectionType] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [roleData, setRoleData] = useState(role.toUpperCase());
  const [showExportButton, setShowExportButton] = useState(true);
  const [exportConfirmation, setExportConfirmation] = useState();
  const controller = new AbortController();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eventId = location.pathname.includes("/rank-preference")
    ? searchParams.get("id")
    : null;
  const eventName = location.pathname.includes("/rank-preference")
    ? searchParams.get("event")
    : null;
  const [electiveCheckedCourses, setElectiveCheckedCourses] = useState([]);
  const [importCourseLoader, setImportCourseLoader] = useState(false);

  const getdefaultData = async () => {
    setShowLoader(true);
    var requestUrl =
      `/o/clcr/get/wishlist-courses?eventId=${eventId}&eventName=${eventName}&section_type=${sectionType}&p_auth=` +
      Liferay.authToken;
    var requestHeaders = new Headers({
      Accept: "application/json",
    });
    await fetch(requestUrl, {
      method: "GET",
      headers: requestHeaders,
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          setShowLoader(false);
          setNoDataFound(true);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((userData) => {
        if (
          userData.length < 1 ||
          Object?.keys(userData)?.length < 1 ||
          userData == null
        ) {
          setNoDataFound(true);
        } else {
          setNoDataFound(false);
        }
        setData(userData);
        setShowLoader(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          setNoDataFound(false);
        } else {
          setNoDataFound(true);
        }
      });
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    setShowSuccessMessage(false);
    handleAfterModalClose(true);
    const currentUrl = window.location.href;
    if (currentUrl?.includes("?open=wishlist")) {
      const updatedUrl = currentUrl.replace("?open=wishlist", "");
      window.history.replaceState({}, document.title, updatedUrl);
    }
    var interval = setInterval(function () {
      var button = document.querySelector('[data-title="Wishlist"]');
      if (button) {
        button.focus();
        clearInterval(interval);
      }
    }, 100);
  };

  const handleImportButton = async () => {
    Liferay?.Session?.extend();
    setImportCourseLoader(true);
    try {
      var requestUrl = "/o/clcr/import-from-wishlist";
      const params = `&eventId=${eventId}&courseType=${sectionType}`;
      var payload = {};
      if (sectionType === "Core" && role.toUpperCase() !== "MSX") {
        payload = [];
      } else {
        payload = electiveCheckedCourses.filter((course) => course.checked);
      }
      const result = await POST(requestUrl, params, payload);
      if (result.status === 200) {
        setImportCourseLoader(false);
        const data = await result.json();
        handleImportedCourses(data);
        setSuccessMessage(data?.message);
      } else {
        setImportCourseLoader(false);
        handleImportedCourses([]);
        setSuccessMessage(
          data?.message || "No new sections could be added from the wishlist."
        );
      }
    } catch (error) {
      setImportCourseLoader(false);
      handleImportedCourses([]);
      setSuccessMessage("No new sections could be added from the wishlist.");
    }
    handleSuccessMessage();
  };

  const handleCheckedCourses = (index) => {
    setElectiveCheckedCourses([
      ...electiveCheckedCourses,
      (electiveCheckedCourses[index].checked =
        !electiveCheckedCourses[index].checked),
    ]);
  };

  useEffect(() => {
    if (data && data !== undefined) {
      setElectiveCheckedCourses(data.plannedSections);
    }
  }, [data]);

  const handleSuccessMessage = () => {
    setShowSuccessMessage(!showSuccessMessage);
  };

  const handleExportBtn = (value) => {
    setData({ ...data, electiveExport: value });
  };

  const handleOk = () => {
    setShowSuccessMessage(true);
    setExportConfirmation(true);
  };

  useEffect(() => {
    if (isStudentView && !isAdmin) {
      setShowExportButton(false);
    } else if (isStudentView && isAdmin) {
      setShowExportButton(isAdmin);
    } else if (
      role.toUpperCase() != "STAFF" &&
      role.toUpperCase() != "FACULTY" &&
      role.toUpperCase() != "ADVISOR" &&
      role.toUpperCase() != "ADMIN" &&
      role.toUpperCase() != "AO"
    ) {
      setShowExportButton(true);
    } else {
      setShowExportButton(false);
    }
  }, []);

  useEffect(() => {
    if (active === 0 && roleData.toUpperCase() === "MBA1") {
      setSectionType("Core");
    } else if (
      active === 0 &&
      (roleData.toUpperCase() === "MBA2" || roleData.toUpperCase() === "PHD")
    ) {
      setSectionType("Electives");
    } else if (active === 0 && roleData.toUpperCase() === "MSX") {
      setSectionType("Core");
    } else if (
      active === 1 &&
      (roleData.toUpperCase() === "MBA1" || roleData.toUpperCase() === "MSX")
    ) {
      setSectionType("Electives");
    } else if (active === 1 && roleData.toUpperCase() === "MBA2") {
      setSectionType("Core");
    } else if (active === 1) {
      setSectionType("Electives");
    } else {
      setSectionType("Core");
    }
  }, [active]);

  useEffect(() => {
    if (open) {
      Liferay?.Session?.extend();
      setShowLoader(false);
      setNoDataFound(false);
      getdefaultData();
      return () => {
        controller.abort();
      };
    }
  }, [open, sectionType]);

  useEffect(() => {
    if (roleData.toUpperCase() === "MBA2" && activeWishlistTab == 2) {
      setActive(1);
    } else if (activeWishlistTab < 2) {
      setActive(activeWishlistTab);
    } else {
      setActive(0);
    }
  }, [open, activeWishlistTab]);

  const [isModalFocused, setIsModalFocused] = useState(false);
  const [lastFocusedElement, setLastFocusedElement] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        const modalContent = document.querySelector(".wishlist-side-modal");
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
      } else if (
        e.key === "Escape" &&
        document.activeElement?.getAttribute("role") !== "tooltip"
      ) {
        handleCloseModal();
      }
    };

    const handleFocusInModal = (e) => {
      const modalContent = document.querySelector(".wishlist-side-modal");
      if (modalContent && modalContent.contains(e.target)) {
        setIsModalFocused(true);
        setLastFocusedElement(e.target);
      } else {
        setIsModalFocused(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        open &&
        event.target.className ==
          "fade modal d-block course-details-textbook-modal show"
      ) {
        handleCloseModal();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("focusin", handleFocusInModal);
      const modalContent = document.querySelector(".wishlist-side-modal");
      modalContent.focus();
      const allFocusableElements = document.querySelectorAll("button");
      allFocusableElements.forEach(function (element) {
        element.setAttribute("tabindex", "0");
      });

      // Restore the focus to the last focused element inside the modal
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
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
  }, [open, handleCloseModal]);

  const onCloseWishlist = () => {
    handleCloseModal();
  };

  return (
    <div style={{ display: open ? "" : "none" }}>
      <div
        aria-hidden="true"
        className={`modal-backdrop fade ${open ? "show" : ""}`}
        data-suppressed="true"
        inert="true"
        tabIndex={"-1"}
      ></div>
      <div
        className={`fade modal d-block course-details-textbook-modal ${
          open ? "show" : ""
        }`}
        tabIndex={"-1"}
      >
        <div
          aria-label="Wishlist"
          aria-modal="true"
          className="modal-dialog modal-full-screen modal-info modal-content wishlist-side-modal"
          role="dialog"
          style={{ width: "1102px" }}
          tabIndex={isModalFocused ? "0" : "-1"}
        >
          <ContainerFluid view className="wishlist-side-modal-container">
            <Row justify="between" style={{ marginBottom: "20px" }}>
              <Col size={"auto"}>
                <h3>Hi {userName}, you are viewing your Wishlist</h3>
              </Col>
              <Col size={"auto"} style={{ marginRight: "10px" }}>
                <button
                  aria-label="Close"
                  className="btn-flex textbook-btn btn-unstyled"
                  onClick={handleCloseModal}
                >
                  Close
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="#43423E"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </Col>
            </Row>
            <Row justify="between">
              <Col size={"auto"}>
                <div
                  className="nav nav-tabs"
                  role="tablist"
                  style={{ gap: "15px" }}
                >
                  <div
                    class="nav-item btns"
                    id="tab1"
                    aria-controls="tabpanel1"
                    type="button"
                    aria-selected={active == 0 ? "true" : "false"}
                    role="tab"
                    onClick={() => {
                      setActive(0);
                    }}
                  >
                    <button
                      className={
                        active == 0
                          ? "nav-link active btn btn-unstyled"
                          : "nav-link btn btn-unstyled"
                      }
                    >
                      {roleData.toUpperCase() === "MBA1" ? (
                        <>{"Core & Distribution (Winter & Spring)"}</>
                      ) : roleData.toUpperCase() === "MBA2" ||
                        roleData.toUpperCase() === "PHD" ? (
                        <>{"Electives"}</>
                      ) : roleData.toUpperCase() === "MSX" ? (
                        <>{"Core Courses"}</>
                      ) : (
                        <>{"Core & Distribution (Winter & Spring)"}</>
                      )}
                    </button>
                  </div>
                  <div
                    class="nav-item btns"
                    id="tab2"
                    aria-controls="tabpanel2"
                    type="button"
                    aria-selected={active == 1 ? "true" : "false"}
                    role="tab"
                    onClick={() => {
                      setActive(1);
                    }}
                  >
                    <button
                      className={
                        active == 1
                          ? "nav-link active btn btn-unstyled"
                          : "nav-link btn btn-unstyled"
                      }
                    >
                      {roleData.toUpperCase() === "MBA1" ||
                      roleData.toUpperCase() === "MSX" ? (
                        <>{"Electives"}</>
                      ) : roleData.toUpperCase() === "MBA2" ? (
                        <>{"Core & Distribution (Winter & Spring)"}</>
                      ) : (
                        <>{"Electives"}</>
                      )}
                    </button>
                  </div>
                </div>
              </Col>
              {showExportButton && (
                <Col size={"auto"} style={{ marginRight: "10px" }}>
                  <CustomToolTip
                    title={
                      sectionType === "Core"
                        ? "Click here to import all core course sections from Course Listing"
                        : data?.electiveExport
                        ? "Click here to import all elective course sections from Course Listing"
                        : ""
                    }
                    childComponent={
                      <ClayButton
                        displayType="primary"
                        size="sm"
                        style={{ margin: "auto", display: "block" }}
                        onClick={() => {
                          handleImportButton();
                          setExportConfirmation(false);
                        }}
                        disabled={
                          sectionType === "Core"
                            ? !data?.coreExport
                            : !data?.electiveExport
                        }
                      >
                        {"Import from Course Research"}
                      </ClayButton>
                    }
                  ></CustomToolTip>
                </Col>
              )}
            </Row>
            <ClayTabs.Content
              activeIndex={active}
              fade
              className="courses"
              id="wishList"
            >
              {active == 0 && (
                <ClayTabs.TabPane
                  aria-labelledby="tab1"
                  role="tabpanel"
                  id="tabpanel1"
                >
                  {roleData.toUpperCase() === "MBA1" ? (
                    <CoreCourseCard
                      data={data}
                      noDataFound={noDataFound}
                      showLoader={showLoader}
                      getdefaultCoreCourseData={getdefaultData}
                      adminMessages={adminMessages}
                      sectionType={sectionType}
                      isAllowDelete={data?.allowDelete}
                      key={0}
                      onCloseWishlist={onCloseWishlist}
                    />
                  ) : roleData.toUpperCase() === "MBA2" ||
                    roleData.toUpperCase() === "PHD" ? (
                    <ElectiveWishlist
                      data={data}
                      noDataFound={noDataFound}
                      showLoader={showLoader}
                      getdefaultElectivesData={getdefaultData}
                      sectionType={sectionType}
                      adminMessages={adminMessages}
                      isAllowDelete={data?.allowDelete}
                      handleExportBtn={handleExportBtn}
                      handleCheckedCourses={handleCheckedCourses}
                      onCloseWishlist={onCloseWishlist}
                    />
                  ) : roleData.toUpperCase() === "MSX" ? (
                    <ElectiveWishlist
                      data={data}
                      noDataFound={noDataFound}
                      showLoader={showLoader}
                      getdefaultElectivesData={getdefaultData}
                      sectionType={sectionType}
                      adminMessages={adminMessages}
                      isAllowDelete={data?.allowDelete}
                      handleExportBtn={handleExportBtn}
                      handleCheckedCourses={handleCheckedCourses}
                      onCloseWishlist={onCloseWishlist}
                    />
                  ) : (
                    <CoreCourseCard
                      data={data}
                      noDataFound={noDataFound}
                      showLoader={showLoader}
                      getdefaultCoreCourseData={getdefaultData}
                      adminMessages={adminMessages}
                      sectionType={sectionType}
                      isAllowDelete={data?.allowDelete}
                      key={1}
                      onCloseWishlist={onCloseWishlist}
                    />
                  )}
                </ClayTabs.TabPane>
              )}
              {active == 1 && (
                <ClayTabs.TabPane
                  aria-labelledby="tab2"
                  role="tabpanel"
                  id="tabpanel2"
                >
                  {roleData.toUpperCase() === "MBA1" ||
                  roleData.toUpperCase() === "MSX" ? (
                    <ElectiveWishlist
                      data={data}
                      noDataFound={noDataFound}
                      showLoader={showLoader}
                      getdefaultElectivesData={getdefaultData}
                      sectionType={sectionType}
                      adminMessages={adminMessages}
                      isAllowDelete={data?.allowDelete}
                      handleExportBtn={handleExportBtn}
                      handleCheckedCourses={handleCheckedCourses}
                      onCloseWishlist={onCloseWishlist}
                    />
                  ) : roleData.toUpperCase() === "MBA2" ? (
                    <CoreCourseCard
                      data={data}
                      noDataFound={noDataFound}
                      showLoader={showLoader}
                      getdefaultCoreCourseData={getdefaultData}
                      adminMessages={adminMessages}
                      sectionType={sectionType}
                      isAllowDelete={data?.allowDelete}
                      key={2}
                      onCloseWishlist={onCloseWishlist}
                    />
                  ) : (
                    <ElectiveWishlist
                      data={data}
                      noDataFound={noDataFound}
                      showLoader={showLoader}
                      getdefaultElectivesData={getdefaultData}
                      sectionType={sectionType}
                      adminMessages={adminMessages}
                      isAllowDelete={data?.allowDelete}
                      handleExportBtn={handleExportBtn}
                      handleCheckedCourses={handleCheckedCourses}
                      onCloseWishlist={onCloseWishlist}
                    />
                  )}
                </ClayTabs.TabPane>
              )}
            </ClayTabs.Content>
          </ContainerFluid>
        </div>
      </div>
      {importCourseLoader && <TransparentLoader />}
      <Modal
        observer={observer}
        onOpenChange={handleSuccessMessage}
        open={showSuccessMessage}
        message={successMessage}
        onHandleClosePopup={handleCloseModal}
        handleOk={handleOk}
      />
    </div>
  );
};

export default WishlistModal;
