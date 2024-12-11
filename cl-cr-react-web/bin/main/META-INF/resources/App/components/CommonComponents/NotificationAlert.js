import React, { useState, useEffect, useRef } from "react";

const NotificationAlert = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textContentRef = useRef(null);

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize(); // Check on text change
  }, [content]);

  const handleResize = () => {
    const textContent = textContentRef?.current;
    if (textContent?.scrollHeight > textContent?.clientHeight) {
      setShowReadMore(true);
    } else {
      setShowReadMore(false);
      setExpanded(false); // Ensure content is collapsed if no longer needed
    }
  };

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  return (
    content && (
      <section className="cr_notification_banner mb-2" tabIndex={0}>
        <div className="notification-alert-icon">
          <svg
            fill="none"
            height={16}
            viewBox="0 0 18 16"
            width={18}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="notification alert icon"
          >
            <path
              d="M9.00471 10.4626C9.16446 10.4626 9.31768 10.3977 9.43064 10.2823C9.54361 10.1669 9.60707 10.0104 9.60707 9.84717V5.53946C9.60707 5.37625 9.54361 5.21972 9.43064 5.10431C9.31768 4.98891 9.16446 4.92407 9.00471 4.92407C8.84495 4.92407 8.69174 4.98891 8.57877 5.10431C8.46581 5.21972 8.40234 5.37625 8.40234 5.53946V9.84717C8.40234 10.0104 8.46581 10.1669 8.57877 10.2823C8.69174 10.3977 8.84495 10.4626 9.00471 10.4626Z"
              fill="#BB2625"
            />
            <path
              d="M9.00471 12.9273C9.33738 12.9273 9.60707 12.6518 9.60707 12.3119C9.60707 11.9721 9.33738 11.6965 9.00471 11.6965C8.67203 11.6965 8.40234 11.9721 8.40234 12.3119C8.40234 12.6518 8.67203 12.9273 9.00471 12.9273Z"
              fill="#BB2625"
            />
            <path
              clipRule="evenodd"
              d="M17.0971 15.7484C16.8194 15.9134 16.5038 16.0002 16.1826 16H1.81742C1.49617 16.0002 1.18061 15.9134 0.902931 15.7484C0.62525 15.5834 0.395383 15.346 0.236779 15.0606C0.0781755 14.7752 -0.00348967 14.452 0.000114324 14.1238C0.00371832 13.7956 0.0924625 13.4743 0.257294 13.1926L7.44048 0.904563C7.60157 0.628796 7.82997 0.400468 8.10333 0.241911C8.37669 0.0833547 8.68565 0 9 0C9.31435 0 9.62331 0.0833547 9.89667 0.241911C10.17 0.400468 10.3984 0.628796 10.5595 0.904563L17.7427 13.1926C17.9075 13.4743 17.9963 13.7956 17.9999 14.1238C18.0035 14.452 17.9218 14.7752 17.7632 15.0606C17.6046 15.346 17.3747 15.5834 17.0971 15.7484ZM8.47414 1.53841L1.28975 13.8234C1.23592 13.9187 1.20745 14.0268 1.20718 14.1369C1.2069 14.247 1.23483 14.3552 1.28818 14.4508C1.34153 14.5465 1.41845 14.6262 1.5113 14.682C1.60414 14.7379 1.70968 14.7679 1.81742 14.7692H16.1826C16.2903 14.7679 16.3959 14.7379 16.4887 14.682C16.5815 14.6262 16.6585 14.5465 16.7118 14.4508C16.7652 14.3552 16.7931 14.247 16.7928 14.1369C16.7925 14.0268 16.7641 13.9187 16.7103 13.8234L9.52586 1.53841C9.47028 1.44708 9.39282 1.37174 9.30081 1.3195C9.2088 1.26725 9.10527 1.23984 9 1.23984C8.89473 1.23984 8.7912 1.26725 8.69919 1.3195C8.60718 1.37174 8.52972 1.44708 8.47414 1.53841Z"
              fill="#BB2625"
              fillRule="evenodd"
            />
          </svg>{" "}
        </div>
        <div
          className="info"
          ref={textContentRef}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.5em",
            maxHeight: expanded ? "none" : "3em",
          }}
        >
          {content}{" "}
          {showReadMore && expanded && (
            <button
              onClick={toggleReadMore}
              className="sdfd-btn sm-btn ghost-btn read-more"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
        {showReadMore && !expanded && (
          <button
            onClick={toggleReadMore}
            className="sdfd-btn sm-btn ghost-btn read-more"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </section>
    )
  );
};

export default NotificationAlert;
