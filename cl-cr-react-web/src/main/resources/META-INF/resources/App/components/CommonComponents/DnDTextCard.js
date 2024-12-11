import React from "react";
import { Link } from "react-router-dom";

export default function DnDTextCard({ enableDnDTextMsg, handleWishlist }) {
  return (
    <section className="cr_dragndrop_card">
      <img
        alt="Drag & drop course"
        src="/o/stanford-clce-theme/images/dragndrop.png"
      />
      <div className="content">
        <p>
          {enableDnDTextMsg?.DisplayMessage1 ? (
            <>
              Hi {userName}! You haven't added any preferences for this event
              yet, and we don't see any on your Wishlist.
              <br />
              You can start fresh in{" "}
              <Link
                to={
                  enableDnDTextMsg?.CourseListingUrl
                    ? enableDnDTextMsg?.CourseListingUrl
                    : "https://webserver-mygsb-uat.lfr.cloud/group/course-research/course-listing"
                }
                target="_blank"
                style={{
                  border: "none",
                  textDecoration: "underline",
                  fontWeight: "bold",
                  background: "transparent",
                  color: "black",
                }}
              >
                Course Research
              </Link>{" "}
              or add courses directly from the pane below.
            </>
          ) : (
            enableDnDTextMsg?.DisplayMessage2 && (
              <>
                Hi {userName}! You haven’t added any preferences for this event
                yet.
                <br /> You can
                <button
                  onClick={handleWishlist}
                  style={{
                    border: "none",
                    textDecoration: "underline",
                    fontWeight: "bold",
                    background: "transparent",
                  }}
                >
                  Import from your Wishlist
                </button>
                and/or add other courses that might interest you from the pane
                below.
              </>
            )
          )}
        </p>
        <div className="drapndrop-dashline">
          <svg
            width={21}
            height={18}
            viewBox="0 0 21 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10.4954 0L7.16204 3.27273H13.8287L10.4954 0Z"
              fill="#767674"
            />
            <path d="M0.5 7.48849H20.5V5.59375H0.5V7.48849Z" fill="#767674" />
            <path d="M0.5 12.4025H20.5V10.5078H0.5V12.4025Z" fill="#767674" />
            <path
              d="M7.16393 14.7273L10.4973 18L13.8306 14.7273H7.16393Z"
              fill="#767674"
            />
          </svg>
          <p>
            <strong>
              Drag &amp; drop course from ‘Other Courses’ to add them as
              preferences.
            </strong>{" "}
            <br />
            or Import them using the checkboxes.
          </p>
        </div>
      </div>
    </section>
  );
}
