import React, { useEffect } from "react";

const CustomToolTips = ({ onTooltipClick, tooltipTitle, tooltipText }) => {
  useEffect(() => {
    // Custom tooltip initialization
    if (tooltipTitle) {
      const tooltips = document.querySelectorAll(".tooltip-new");
      tooltips.forEach((tooltip) => {
        const title = tooltip.getAttribute("title");
        if (title) {
          const tooltipDiv = document.createElement("div");
          tooltipDiv.className = "custom-tooltip";
          tooltipDiv.innerText = title;
          tooltip.appendChild(tooltipDiv);
          tooltip.removeAttribute("title");
        }
        tooltip.addEventListener("mouseenter", () => {
          const tooltipDiv = tooltip.querySelector(".custom-tooltip");
          tooltipDiv.style.visibility = "visible";
          tooltipDiv.style.opacity = "1";
        });
        tooltip.addEventListener("mouseleave", () => {
          const tooltipDiv = tooltip.querySelector(".custom-tooltip");
          tooltipDiv.style.visibility = "hidden";
          tooltipDiv.style.opacity = "0";
        });
      });
    }
  }, []);

  return (
    <div>
      <button
        id="tooltip1"
        className="btn-unstyled tooltip-new"
        title={tooltipTitle}
        onClick={onTooltipClick}
        aria-label={tooltipTitle}
      >
        {tooltipText}
      </button>
    </div>
  );
};

export default CustomToolTips;
