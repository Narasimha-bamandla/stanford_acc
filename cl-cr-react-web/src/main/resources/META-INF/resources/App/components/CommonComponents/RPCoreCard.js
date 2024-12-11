import React, { useState } from "react";
import RPSectionCard from "./RPSectionCard";
import { Droppable } from "react-beautiful-dnd";

export default function RPCoreCard({
  coreList,
  coreTitle,
  coreId,
  checkedItems,
  handleCheckboxChange,
  urlId,
  isQuarterEnabled,
  openCards,
  handleCardChange,
  readAccessEnabled,
  searchValue,
  highlightNameAndSearchValue,
}) {
  const handleToggle = (coreTitle) => {
    handleCardChange(coreTitle);
  };

  if (!coreList || coreList.length === 0) return null;

  return (
    <section className="cr_course_item">
      <div className="head">
        <div className="font18b">{coreTitle}</div>
        <button
          className={`toggle-btn btn btn-sm ${
            !openCards?.includes(coreTitle) ? "" : "active"
          }`}
          type="button"
          aria-label={
            !openCards?.includes(coreTitle)
              ? `Hide ${coreTitle}`
              : `Show ${coreTitle}`
          }
          onClick={() => handleToggle(coreTitle)}
        >
          <img
            alt=""
            src="/o/stanford-clce-theme/images/icons/angle_down_icon.svg"
          />
        </button>
      </div>
      {!openCards?.includes(coreTitle) && (
        <Droppable
          droppableId={`drop-down-${coreId}`}
          isDropDisabled={readAccessEnabled}
        >
          {(provider) => (
            <div
              className="content d-flex flex-column c-gap-2"
              ref={provider.innerRef}
              {...provider.droppableProps}
            >
              {coreList.map((core, index) => (
                <RPSectionCard
                  key={core?.section_name}
                  id={core?.section_name}
                  sectionData={core}
                  index={index}
                  isChecked={!!checkedItems[core?.section_name]}
                  onCheckboxChange={() => handleCheckboxChange(core)}
                  urlId={urlId}
                  isQuarterEnabled={isQuarterEnabled}
                  readAccessEnabled={readAccessEnabled}
                  searchValue={searchValue}
                  highlightNameAndSearchValue={highlightNameAndSearchValue}
                />
              ))}
              {provider.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </section>
  );
}
