import React, { useState } from "react";
import { ClayTooltipProvider } from "@clayui/tooltip";

const CustomToolTip = ({
  title,
  alignToolTip = "top",
  childComponent,
  switchEvent = false,
}) => {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  const handleClick = () => {
    setVisible(false);
  };

  return (
    <ClayTooltipProvider>
      {switchEvent ? (
        <span
          data-tooltip-align={alignToolTip}
          title={visible ? title : undefined}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          aria-label={title}
          style={{ cursor: "pointer" }}
        >
          {childComponent}
        </span>
      ) : (
        <div
          data-tooltip-align={alignToolTip}
          title={visible ? title : undefined}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          aria-label={title}
          style={{ cursor: "pointer" }}
        >
          {childComponent}
        </div>
      )}
    </ClayTooltipProvider>
  );
};

export default CustomToolTip;
