import React, { useState, useRef } from "react";

const SelectCombobox = ({ options, label, onSelect, cssStyle = "", filterInfo = "filterInfo", cssClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(options[0]); // Default to the first option
  const comboboxRef = useRef(null);
  const listboxRef = useRef(null);

  const parseCssStyle = (styleString) => {
    return styleString
      .split(",")
      .map((s) => s.trim().split(":"))
      .reduce((acc, [key, value]) => {
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      }, {});
  };

  const inlineStyles = cssStyle ? parseCssStyle(cssStyle) : {};

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", " "].includes(event.key)) {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0) {
          handleOptionSelect(activeIndex);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        comboboxRef.current.focus();
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (index) => {
    handleOptionSelect(index);
  };

  const handleOptionSelect = (index) => {
    const option = options[index];
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
    setActiveIndex(-1);
    comboboxRef.current.focus();
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const preventNarratorInterference = (event) => {
    if (["ArrowDown", "ArrowUp", " "].includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div
      className={`select-combo ${isOpen ? "show" : ""} ${cssClass}`}
      style={inlineStyles}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <label id="combobox-label" htmlFor="combobox-input" className="select-combo-label">
        {label}
      </label>
      <div
        id="combobox-input"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby="combobox-label"
        aria-owns="listbox"
        aria-controls="listbox"
        ref={comboboxRef}
        className="select-combo-input"
        onClick={handleToggle}
        onKeyDown={preventNarratorInterference} // Prevent Narrator from double-interpreting key presses
      >
        <span aria-live="polite">{selectedOption?.name || "Choose an option"}</span>
      </div>
      {isOpen && (
        <div
          id="listbox"
          role="listbox"
          ref={listboxRef}
          aria-labelledby="combobox-label"
          className="select-combo-menu"
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              role="option"
              tabIndex={-1}
              aria-selected={index === activeIndex}
              onClick={() => handleOptionClick(index)}
              className={`select-combo-option ${index === activeIndex ? "option-current" : ""}`}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectCombobox;
