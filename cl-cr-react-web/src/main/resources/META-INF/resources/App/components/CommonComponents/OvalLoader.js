import React from "react";
import Loader from "react-loader-spinner";

const OvalLoader = ({ containerHeight = "200px" }) => {
  return (
    <div
      style={{
        width: "100%",
        height: containerHeight,
        display: "flex",
        justifyContent: " center",
        alignItems: "center",
      }}
      aria-live="polite"
      tabIndex={0}
      aria-label={"Loading"}
    >
      <Loader type="Oval" color="#8C1515" height={40} width={40} />
    </div>
  );
};

export default OvalLoader;
