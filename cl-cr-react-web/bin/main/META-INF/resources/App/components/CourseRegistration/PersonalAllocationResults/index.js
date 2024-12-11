import React, { useState } from "react";
import SlidePaginate from "../../CommonComponents/SlidePaginate";
import PARCard from "./PARCard/index";

const PersonalAllocationResults = ({ PAREvents, adminMessages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section
      aria-label="Personal Allocation Results"
      className="cr_home_personal_allocation_results cr_home_card"
    >
      <div className="content-head">
        <h2>
          Personal
          <br />
          Allocation Results
        </h2>
        <SlidePaginate
          labelFor={"Personal Allocation Results Pagination"}
          startPage={1}
          endPage={PAREvents?.totalPages}
          onPageChange={onPageChange}
        />
      </div>
      <PARCard
        data={PAREvents?.personal_allocation_results[currentPage - 1]}
        index={currentPage}
        key={PAREvents?.personal_allocation_results[currentPage - 1]?.event_id}
        adminMessages={adminMessages}
      />
    </section>
  );
};

export default PersonalAllocationResults;
