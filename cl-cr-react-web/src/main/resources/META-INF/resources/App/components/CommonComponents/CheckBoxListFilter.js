import React from "react";
import { ClayCheckbox } from "@clayui/form";
export const CheckboxListFilter = ({ title, handleInputClick, isChecked }) => {
  return (
    <ClayCheckbox
      className="sm"
      aria-label={title}
      checked={isChecked}
      onChange={() => {}}
      label={title}
      onClick={handleInputClick}
      aria-controls="courseListInfo"
    />
  );
};
