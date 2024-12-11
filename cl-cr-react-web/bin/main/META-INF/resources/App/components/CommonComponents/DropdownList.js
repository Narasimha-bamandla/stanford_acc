import React, { useState } from "react";
import { ClayRadio } from "@clayui/form";

export function SortByList({
  items,
  handleSortCheckList,
  initalstate = 1,
  filterInfo = "filterInfo",
}) {
  // Initialize state to keep track of the selected radio index
  const [selectedItem, setSelectedItem] = useState(initalstate);

  // Handle radio button change
  const handleRadioChange = (index, item) => {
    setSelectedItem(index);
    handleSortCheckList(item);
  };

  return (
    <div>
      {items?.map((item, index) => (
        <div key={index} className="custom-radio" tabIndex={0}>
          <ClayRadio
            className="sm"
            aria-label={item.name}
            checked={item.id === selectedItem}
            onChange={() => handleRadioChange(item.id, item.name)}
            label={item.name}
            tabIndex={0}
            aria-controls={filterInfo}
          />
          {item.id === selectedItem && (
            <div className="custom-check-icon" tabIndex={0}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={11}
                viewBox="0 0 16 11"
                fill="none"
              >
                <path
                  d="M14.6668 1L5.50016 10.1667L1.3335 6"
                  stroke="currentColor"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
