import React, { useState } from "react";

function DropDown({ dropDownList, disabled }) {
  const [selectedItem, setSelectedItem] = useState(dropDownList?.default);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const onSelectItem = (event, value) => {
    setSelectedItem(value);
    setIsDropDownOpen(false);
  };
  return (
    <div className="fields-grp">
      <label>{dropDownList?.label}</label>
      <div className="DropdownList checkmark dropdown  dropdown-btn  ">
        <button
          aria-controls="timing-dropdown-menu"
          aria-expanded="false"
          aria-haspopup="true"
          className={`dropdown-toggle btn ${isDropDownOpen ? "active" : ""}`}
          tabIndex="0"
          type="button"
          onClick={(event) => {
            setIsDropDownOpen(true);
          }}
          disabled={disabled}
        >
          <span className="inline-item inline-item-text">{selectedItem}</span>
          <svg
            className="arrow"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.19995 6.40039L7.99995 11.2004L12.8 6.40039"
              stroke="#2E2D29"
              strokeLinecap="square"
              strokeLinejoin="bevel"
              strokeWidth="1.5"
            ></path>
          </svg>
        </button>

        <div
          className={`dropdown-menu ${isDropDownOpen ? "show" : ""}`}
          id="timing-dropdown-menu"
          role="presentation"
        >
          {dropDownList?.list?.map((listItem) => {
            return (
              <div role="presentation" key={listItem}>
                <button
                  className="dropdown-item"
                  role="menuitem"
                  tabIndex="0"
                  onClick={(event) => onSelectItem(event, listItem)}
                >
                  {listItem}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DropDown;
