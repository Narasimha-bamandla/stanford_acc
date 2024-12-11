import React, { useState } from "react";
import { ClayTooltipProvider } from "@clayui/tooltip";

const LockIconTooltip = ({
  message = "MBA1 permission required.",
  position = "top",
  onCloseWishlist = () => {},
}) => {
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
        data-tooltip-align={position}
        title={isTooltipVisible ? message : ""}
        aria-label={isTooltipVisible ? message : ""}
        tabIndex={0}
        role="tooltip"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onBlur={() => setIsTooltipVisible(false)}
        onKeyDown={handleKeyDown}
      >
        <img
          alt="Lock"
          src="/o/stanford-clce-theme/images/icons/lock-icon.svg"
          aria-hidden="true"
        />
      </div>
    </ClayTooltipProvider>
  );
};

export default LockIconTooltip;
