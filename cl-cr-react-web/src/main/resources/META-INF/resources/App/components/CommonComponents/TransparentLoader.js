import React from "react";
import Loader from "react-loader-spinner";

export default function TransparentLoader() {
  return (
    <div className="cr-course-conflict">
      <div
        aria-hidden="true"
        className="modal-backdrop fade show"
        data-suppressed="true"
        inert="true"
        tabIndex={-1}
      >
        &nbsp;
      </div>
      <div
        aria-labelledby="courseConflictModalLabel"
        className="fade modal modal_popup  show"
        id="courseConflictModal"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-md">
          <div
            className="modal-content"
            style={{
              height: "300px",
              backgroundColor: "transparent",
              textAlign: "center",
              padding: "30px",
              boxShadow: "none",
              position: "relative",
              top: "145px",
            }}
          >
            {" "}
            <Loader type="Oval" color="#8C1515" height={40} width={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
