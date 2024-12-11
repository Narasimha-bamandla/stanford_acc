import React, { useState } from "react";
import { ClayTooltipProvider } from "@clayui/tooltip";

const RecommendedToolTip = ({ onCloseWishlist = () => {} }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      if (isTooltipVisible) {
        setIsTooltipVisible(false);
      } else if (onCloseWishlist) {
        onCloseWishlist();
      }
    } else if (event.key === "Tab" || event.key === "Enter") {
      setIsTooltipVisible(true);
    }
  };

  return (
    <ClayTooltipProvider>
      <div
        className="tag sm"
        data-tooltip-align="top"
        title={
          isTooltipVisible
            ? "This section is recommended for you as per your study plan."
            : ""
        }
        aria-label={
          isTooltipVisible
            ? "This section is recommended for you as per your study plan."
            : ""
        }
        tabIndex={0}
        role="tooltip"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onBlur={() => setIsTooltipVisible(false)}
        onKeyDown={handleKeyDown}
      >
        <strong>RECOMMENDED</strong>
      </div>
    </ClayTooltipProvider>
  );
};

export default RecommendedToolTip;
