import React from "react";

const NoDataFound = ({
  message = "NO DATA FOUND",
  backgroundColor = "",
  containerHeight = "200px",
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: containerHeight,
        display: "flex",
        justifyContent: " center",
        alignItems: "center",
        background: backgroundColor,
      }}
      aria-live="polite"
      tabIndex={0} 
    >
      <span style={{ fontWeight: "600" }}>{message}</span>
    </div>
  );
};

export default NoDataFound;
