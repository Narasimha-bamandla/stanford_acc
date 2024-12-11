import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ReadMore({
  content,
  heading,
  classId,
  scrolling,
  redirectTo,
}) {
  const length = content.split(" ").length;
  const [isMoreLines, setIsMoreLines] = useState(true);

  return (
    <>
      {content && (
        <div className="d-flex flex-column c-gap-3 mb-4">
          <h4>{heading}</h4>
          <div
            style={{
              overflow: isMoreLines ? "hidden" : "",
              display: isMoreLines ? "-webkit-box" : "",
              WebkitBoxOrient: isMoreLines ? "vertical" : "",
              WebkitLineClamp: isMoreLines ? 10 : "none",
            }}
            className={`font16`}
          >
            {content}
          </div>
          {length > 70 && (
            <a
              href={`${
                redirectTo
                  ? redirectTo
                  : "https://webserver-mygsb-uat.lfr.cloud/group/course-research/course-listing/#/coursedetails?id="
              }${classId}&section=${scrolling}`}
              target="_blank"
            >
              <button
                className="sdfd-btn sm-btn ghost-btn read-more"
                style={{ display: "flex", justifyContent: "start" }}
              >
                {isMoreLines ? "Read More" : "Show Less"}
              </button>
            </a>
          )}
        </div>
      )}
    </>
  );
}
