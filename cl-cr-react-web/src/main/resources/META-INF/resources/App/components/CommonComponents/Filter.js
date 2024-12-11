import React, { useEffect, useState } from "react";
import { CheckboxListFilter } from "./CheckBoxListFilter";

const Filter = ({ selectAll = false, text, data, status = true }) => {
  const [allselect, setAllSelect] = useState(selectAll);

  const controlledHandleChange = () => {
    setAllSelect(!allselect);
    data(!allselect);
  };
  useEffect(() => {
    setAllSelect(selectAll);
  }, [selectAll]);

  return (
    <>
      {status && (
        <CheckboxListFilter
          title={text}
          handleInputClick={controlledHandleChange}
          checkboxStyle={{ marginRight: "10px" }}
          isChecked={selectAll}
        />
      )}
    </>
  );
};

export default Filter;
