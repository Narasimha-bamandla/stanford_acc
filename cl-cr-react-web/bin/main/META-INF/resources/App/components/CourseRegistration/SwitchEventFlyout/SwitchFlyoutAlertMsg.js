import React from "react";
import CustomToolTip from "../../CommonComponents/CustomToolTip";

export default function SwitchFlyoutAlertMsg({ msg }) {
  const conflictTooltip = (msg, text) => {
    const parts = msg.split(text);
    return (
      <>
        {parts[0]}
        <CustomToolTip
          title={`Time conflict.
                  Too few Distribution units.
                  Too many units in the quarter.
                  Account hold in Axess.`}
          childComponent={
            <span style={{ textDecoration: "underline", fontWeight: "600" }}>
              {text}
            </span>
          }
          switchEvent={true}
        />
        {parts[1]}
      </>
    );
  };

  return (
    <div className="event_alert ">
      <div style={{ height: "18px" }}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6.00314 7.6151C6.10964 7.6151 6.21179 7.57255 6.2871 7.49681C6.36241 7.42108 6.40471 7.31836 6.40471 7.21125V4.38432C6.40471 4.27721 6.36241 4.17449 6.2871 4.09875C6.21179 4.02302 6.10964 3.98047 6.00314 3.98047C5.89663 3.98047 5.79449 4.02302 5.71918 4.09875C5.64387 4.17449 5.60156 4.27721 5.60156 4.38432V7.21125C5.60156 7.31836 5.64387 7.42108 5.71918 7.49681C5.79449 7.57255 5.89663 7.6151 6.00314 7.6151Z"
            fill="#BB2625"
          ></path>
          <path
            d="M6.00314 9.23348C6.22492 9.23348 6.40471 9.05267 6.40471 8.82963C6.40471 8.60659 6.22492 8.42578 6.00314 8.42578C5.78135 8.42578 5.60156 8.60659 5.60156 8.82963C5.60156 9.05267 5.78135 9.23348 6.00314 9.23348Z"
            fill="#BB2625"
          ></path>
          <path
            d="M1.21161 11.25H10.7884C11.0026 11.2502 11.2129 11.1932 11.398 11.0849C11.5832 10.9766 11.7364 10.8208 11.8421 10.6335C11.9479 10.4463 12.0023 10.2341 11.9999 10.0187C11.9975 9.80338 11.9384 9.59251 11.8285 9.40765L7.03968 1.34362C6.93228 1.16265 6.78002 1.01281 6.59778 0.908754C6.41554 0.804702 6.20956 0.75 6 0.75C5.79044 0.75 5.58446 0.804702 5.40222 0.908754C5.21998 1.01281 5.06771 1.16265 4.96032 1.34362L0.171529 9.40765C0.0616416 9.59251 0.00247888 9.80338 7.62161e-05 10.0187C-0.00232645 10.2341 0.052117 10.4463 0.157853 10.6335C0.263589 10.8208 0.416833 10.9766 0.601954 11.0849C0.787075 11.1932 0.997447 11.2502 1.21161 11.25ZM0.85983 9.82159L5.64942 1.75958C5.68648 1.69965 5.73812 1.6502 5.79946 1.61592C5.8608 1.58164 5.92982 1.56364 6 1.56364C6.07018 1.56364 6.1392 1.58164 6.20054 1.61592C6.26188 1.6502 6.31352 1.69965 6.35057 1.75958L11.1402 9.82159C11.1761 9.88417 11.195 9.9551 11.1952 10.0273C11.1954 10.0996 11.1768 10.1706 11.1412 10.2334C11.1056 10.2961 11.0544 10.3484 10.9925 10.3851C10.9306 10.4217 10.8602 10.4415 10.7884 10.4423H1.21161C1.13978 10.4415 1.06943 10.4217 1.00753 10.3851C0.945636 10.3484 0.894356 10.2961 0.858788 10.2334C0.82322 10.1706 0.804603 10.0996 0.804785 10.0273C0.804968 9.9551 0.823945 9.88417 0.85983 9.82159Z"
            fill="#BB2625"
          ></path>
        </svg>
      </div>
      <div className="font12">
        {msg?.includes("conflict or issue")
          ? conflictTooltip(msg, "conflict or issue")
          : msg}
      </div>
    </div>
  );
}
