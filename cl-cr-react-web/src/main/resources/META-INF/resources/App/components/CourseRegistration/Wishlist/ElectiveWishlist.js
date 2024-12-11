import React, { useEffect, useState } from "react";
import { Row, Col, ContainerFluid } from "@clayui/layout";
import ElectiveCourseCard from "./ElectiveCourseCard";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";

const ElectiveWishlist = ({
  data,
  getdefaultElectivesData,
  showLoader,
  noDataFound,
  sectionType,
  adminMessages,
  isAllowDelete,
  handleExportBtn,
  handleCheckedCourses,
  onCloseWishlist,
}) => {
  return (
    <ContainerFluid>
      {showLoader && <OvalLoader />}
      {(noDataFound ||
        data?.length < 1 ||
        ((data?.plannedSections?.length < 1 ||
          data?.plannedSections === null) &&
          (data?.pastSections?.length < 1 || data?.pastSections === null))) &&
        !showLoader && (
          <NoDataFound message={`No items added for ${sectionType}.`} />
        )}
      {!noDataFound && !showLoader && (
        <>
          {data?.plannedSections?.length > 0 && (
            <>
              <Row style={{ marginBottom: "15px" }}>
                <Col>
                  <h3>Planned Sections</h3>
                </Col>
              </Row>
              {data?.plannedSections?.map((data, index) => {
                return (
                  <ElectiveCourseCard
                    details={data}
                    index={index}
                    key={index}
                    sectionType={"planned"}
                    getdefaultElectivesData={getdefaultElectivesData}
                    type={sectionType}
                    adminMessages={adminMessages}
                    isAllowDelete={isAllowDelete}
                    handleExportBtn={handleExportBtn}
                    handleCheckedCourses={handleCheckedCourses}
                    onCloseWishlist={onCloseWishlist}
                  />
                );
              })}
            </>
          )}
          {data?.pastSections?.length > 0 && (
            <>
              <Row style={{ marginTop: "30px", marginBottom: "15px" }}>
                <Col>
                  <h3>Past Sections</h3>
                </Col>
              </Row>
              {data?.pastSections?.map((data, index) => {
                return (
                  <ElectiveCourseCard
                    details={data}
                    index={index}
                    key={index}
                    sectionType={"past"}
                    getdefaultElectivesData={getdefaultElectivesData}
                    type={sectionType}
                    adminMessages={adminMessages}
                    isAllowDelete={isAllowDelete}
                    handleExportBtn={handleExportBtn}
                    handleCheckedCourses={handleCheckedCourses}
                    onCloseWishlist={onCloseWishlist}
                  />
                );
              })}
            </>
          )}
        </>
      )}
    </ContainerFluid>
  );
};

export default ElectiveWishlist;
