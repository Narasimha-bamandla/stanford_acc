import React from "react";
import NotificationAlert from "./NotificationAlert";

const InfoBanner = ({ data, type, eventName, adminMessages }) => {
  return (
    <div className="cr_info-banner">
      <section className="info-banner-area">
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a
                    className="breadcrumb-text-truncate"
                    href={
                      window.doAsUserId
                        ? window.location.pathname +
                          "?doAsUserId=" +
                          window.doAsUserId
                        : window.location.pathname
                    }
                  >
                    Course Registration
                  </a>
                </li>
                <li className="active breadcrumb-item">
                  <span className="breadcrumb-text-truncate" title="Active">
                    {eventName}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </section>
      <div className="row">
        <div className="col-md-12">
          <h2 style={{ fontSize: "24px" }}>
            {`Hello ${userName}, you are viewing your Allocation Results for ${eventName}`}
          </h2>
        </div>
      </div>
      {type == "Core" && (
        <div className="row">
          <div className="col-md-10">
            <section className="unitinfo">
              <strong className="pr-3">
                Total Units: {data?.totalUnits || 0}
              </strong>
              <span> Winter : {data?.winter || 0}</span>
              <span> Spring : {data?.spring || 0}</span>
              <div
                style={{
                  backgroundColor: "rgb(82, 77, 76)",
                  opacity: "0.2",
                  width: 1,
                  height: 20,
                  margin: "0 10px",
                }}
              ></div>
              <strong className="pr-3">
                Current Core Units: {data?.currentCoreUnits || 0}
              </strong>
              <strong>
                Current Distribution Units:{" "}
                {data?.currentDistributionUnits || 0}
              </strong>
              <strong>
                (Minimum Requirement: {data?.minimum_distribution_units || 0}{" "}
                Units)
              </strong>
            </section>
          </div>
        </div>
      )}
      {type == "Elective" && (
        <div className="row">
          <div className="col-md-10">
            <section className="unitinfo">
              <strong className="pr-3">
                Total Units: {data?.totalUnits || 0}
              </strong>
            </section>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-12">
          <NotificationAlert
            content={
              type == "Core"
                ? adminMessages?.PARCoreUserMessage
                  ? adminMessages?.PARCoreUserMessage
                  : ``
                : adminMessages?.PARElectiveUserMsg
                ? adminMessages?.PARElectiveUserMsg
                : ``
            }
          />
        </div>
      </div>
      <hr className="hline" />
    </div>
  );
};

export default InfoBanner;
