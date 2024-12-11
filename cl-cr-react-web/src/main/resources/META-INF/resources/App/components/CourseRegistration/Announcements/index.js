import React from "react";
import NoDataFound from "../../CommonComponents/NoDataFound";
import OvalLoader from "../../CommonComponents/OvalLoader";

const Announcements = ({ announcementsError, announcementData, isLoading }) => {
  const decodeHtml = (announcementHtml) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = announcementHtml;
    return txt.value;
  };

  if (isLoading) return <OvalLoader />;

  return (
    <section
      aria-label="Announcements"
      className="cr_home_announcements cr_home_card"
    >
      <div className="content-head" style={{ margin: "0px" }}>
        <h2>
          <svg
            width="32"
            height="22"
            viewBox="0 0 32 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.5061 0.016186C19.8751 -0.0608313 20.2415 0.143511 20.357 0.490691L24.9206 17.3945C24.9787 17.762 24.7635 18.1219 24.405 18.2571C24.2275 18.2815 24.0472 18.2504 23.8905 18.1687C23.726 18.077 23.5973 17.9355 23.5236 17.7656L23.2462 16.7384L18.3574 16.9867L18.9373 19.1347C18.9894 19.3199 18.9588 19.5186 18.8527 19.6826C18.7567 19.8381 18.6017 19.9515 18.4216 19.9975L11.0035 21.969C10.8244 22.0245 10.6303 22.0049 10.4687 21.9148C10.3069 21.8245 10.1923 21.672 10.1526 21.4945L9.0809 17.5254L6.5339 17.6519L2.74624 18.6334C2.5672 18.6892 2.37324 18.6694 2.21141 18.5791C2.0498 18.489 1.93508 18.3366 1.89538 18.1589L0.0296261 11.2481C-0.0255535 11.0744 -0.00295918 10.8856 0.0916094 10.7274C0.186299 10.5689 0.344329 10.4556 0.527503 10.4151L4.28471 9.4164L19.2677 1.90621L18.9904 0.879029C18.8993 0.506425 19.1263 0.126522 19.5061 0.016186ZM1.5548 11.5435L3.06756 17.1468L5.57242 16.4811L4.05966 10.8778L1.5548 11.5435ZM11.3425 20.4524L17.3939 18.8693L16.915 17.0946L10.523 17.4171L11.3425 20.4524ZM5.40088 10.3961L6.97674 16.2331L22.8804 15.3843L19.6331 3.26056L5.40088 10.3961Z"
              fill="#8C1515"
            />
            <path
              d="M25.0186 8.29233C24.8441 8.20289 24.7175 8.04601 24.6693 7.85971C24.6109 7.49206 24.8262 7.1319 25.185 6.99686L30.6584 5.56736C30.8374 5.51156 31.0314 5.53134 31.1932 5.62158C31.355 5.71183 31.4696 5.86407 31.5093 6.04185C31.6004 6.41445 31.3733 6.79433 30.9937 6.90446L25.5506 8.35123C25.3713 8.40061 25.1801 8.37941 25.0186 8.29233Z"
              fill="#8C1515"
            />
            <path
              d="M23.9292 4.71606L24.1415 4.83446C24.3977 4.9709 24.7146 4.94554 24.9482 4.76971L28.8416 1.63652C29.1319 1.38383 29.1746 0.958073 28.9392 0.661443C28.8207 0.519295 28.6477 0.430074 28.4593 0.414266C28.2707 0.398662 28.0826 0.457729 27.9379 0.578133L24.057 3.75787C23.7507 3.99161 23.6937 4.42011 23.9292 4.71606Z"
              fill="#8C1515"
            />
            <path
              d="M31.8733 11.282C31.982 11.4326 32.0232 11.62 31.9874 11.8022C31.9057 12.1729 31.544 12.4224 31.159 12.3734L26.2068 11.5586L25.958 11.4994C25.6935 11.3505 25.5604 11.0512 25.6289 10.7593C25.6583 10.5809 25.7621 10.4216 25.9155 10.3189C26.0692 10.2164 26.2589 10.1798 26.4396 10.2178L31.4097 11.0028C31.5973 11.0307 31.7645 11.1316 31.8733 11.282Z"
              fill="#8C1515"
            />
          </svg>
          Announcements
        </h2>
      </div>

      <div className="content-body">
        {announcementData?.announcements ? (
          announcementData.announcements.map(({ announcement }, index) => {
            const isLast = index === announcementData.announcements.length - 1;
            const isFirst = index === 0;

            const style = {
              paddingTop: "15px",
              paddingBottom: !isLast ? "10px" : undefined,
              borderBottom: !isLast ? "1px solid #D5D5D4" : undefined,
            };

            return (
              <div
                key={index}
                style={style}
                dangerouslySetInnerHTML={{ __html: decodeHtml(announcement) }}
              />
            );
          })
        ) : (
          <NoDataFound message="There are no announcements at this time." />
        )}
        {announcementsError && (
          <NoDataFound message="There are no announcements at this time." />
        )}
      </div>
    </section>
  );
};

export default Announcements;
