import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import { CheckboxListFilter } from "./CheckBoxListFilter";

function SwitchEventsFilters({
  dropDownList,
  label,
  filterList,
  initialFilterState,
  setInitialFilterState,
  dropdownActive,
  setDropdownActive,
}) {
  const prepareDropDownList = () => {
    let timingListOptions = [];
    if (label === "Timing") {
      Object.keys(dropDownList).forEach((key, index) => {
        if (key !== "All") {
          const childrens = dropDownList?.[key]?.map((list, listIndex) => {
            if (
              list ==
                initialFilterState?.[label]?.[index - 1]?.children[listIndex]
                  ?.name &&
              initialFilterState?.[label]?.[index - 1]?.children[listIndex]
                ?.isChecked
            ) {
              return {
                id: list + index.toString() + listIndex.toString(),
                name: list,
                isChecked: true,
              };
            } else if (
              list ==
                initialFilterState?.[label]?.[index - 1]?.children[listIndex]
                  ?.name &&
              !initialFilterState?.[label]?.[index - 1]?.children[listIndex]
                ?.isChecked
            ) {
              return {
                id: list + index.toString() + listIndex.toString(),
                name: list,
                isChecked: false,
              };
            } else {
              return {
                id: list + index.toString() + listIndex.toString(),
                name: list,
                isChecked: true,
              };
            }
          });
          const timeListObject = () => {
            if (
              key == initialFilterState?.[label]?.[index - 1]?.name &&
              initialFilterState?.[label]?.[index - 1]?.isChecked
            ) {
              return {
                id: label + index,
                name: key,
                isChecked: true,
                children: childrens,
              };
            } else if (
              key == initialFilterState?.[label]?.[index - 1]?.name &&
              !initialFilterState?.[label]?.[index - 1]?.isChecked
            ) {
              return {
                id: label + index,
                name: key,
                isChecked: false,
                children: childrens,
              };
            } else {
              return {
                id: label + index,
                name: key,
                isChecked: true,
                children: childrens,
              };
            }
          };
          timingListOptions.push(timeListObject());
        }
      });
      return timingListOptions;
    }
    return dropDownList
      .map((list, index) => {
        if (list !== "All") {
          if (
            list == initialFilterState?.[label]?.[index - 1]?.name &&
            initialFilterState?.[label]?.[index - 1]?.isChecked
          ) {
            return {
              id: label + index,
              name: list,
              isChecked: true,
              children: [],
            };
          } else if (
            list == initialFilterState?.[label]?.[index - 1]?.name &&
            !initialFilterState?.[label]?.[index - 1]?.isChecked
          ) {
            return {
              id: label + index,
              name: list,
              isChecked: false,
              children: [],
            };
          } else {
            return {
              id: label + index,
              name: list,
              isChecked: true,
              children: [],
            };
          }
        }
      })
      .filter(Boolean);
  };

  const prepareSelectAll = () => {
    const unSelectedValues = initialFilterState?.[label]?.filter(
      (data) => !data.isChecked
    );
    if (unSelectedValues?.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const prepareSelectedValues = () => {
    if (label === "Timing") {
      const seletedValue = {};
      initialFilterState?.[label]?.map((item) => {
        const category = item.name;
        if (!seletedValue?.[category]) {
          seletedValue[category] = [];
        }
        item.children.forEach((child) => {
          if (child.isChecked) {
            seletedValue[category].push(child.name);
          }
        });
      });
      const unSelectedValues = initialFilterState?.[label]?.filter(
        (data) => !data.isChecked
      );
      if (unSelectedValues?.length > 0) {
        return seletedValue;
      } else {
        return ["All"];
      }
    } else {
      const seletedValue = [];
      initialFilterState?.[label]?.map((data) => {
        if (data?.isChecked) {
          seletedValue?.push(data?.name);
        }
        data?.children?.map((childData) => {
          if (data?.isChecked) {
            seletedValue?.push(childData?.name);
          }
        });
      });
      const unSelectedValues = initialFilterState?.[label]?.filter(
        (data) => !data.isChecked
      );
      if (unSelectedValues?.length > 0) {
        return seletedValue;
      } else {
        return ["All"];
      }
    }
  };

  const [filterData, setFilterData] = useState([...prepareDropDownList()]);
  const [selectAll, setSelectAll] = useState(prepareSelectAll());
  const [selectedValues, setSelectedValues] = useState(prepareSelectedValues());

  const AllSelect = (val) => {
    const getUpdatedfilterData = filterData.map((el) => {
      if (el?.children?.length > 0) {
        const childObj = el?.children?.map((child) => {
          return { ...child, isChecked: val };
        });
        el.children = childObj;
      }
      return { ...el, isChecked: val };
    });
    setFilterData(getUpdatedfilterData);
    setInitialFilterState((prevState) => {
      return { ...prevState, [label]: getUpdatedfilterData };
    });
    setDropdownActive({ [label]: true });
    setSelectAll(val);
    if (val) {
      setSelectedValues(["All"]);
    } else {
      setSelectedValues([""]);
    }

    var filteredValues = {};
    val
      ? (filteredValues = { label: label, value: null })
      : (filteredValues = { label: label, value: null });

    filterList(filteredValues);
  };

  const handleFilterClick = (val) => {
    let isAllSelected = true;

    const newFilteredData = filterData.map((el) => {
      if (el.id === val.id) {
        isAllSelected = isAllSelected && !el.isChecked;
        if (el?.children?.length > 0) {
          const childObj = el.children.map((child) => {
            return { ...child, isChecked: !el.isChecked };
          });
          el.children = childObj;
        }
        return { ...el, isChecked: !el.isChecked };
      }
      isAllSelected = isAllSelected && el.isChecked;
      return el;
    });

    if (label === "Timing") {
      const seletedValue = {};
      newFilteredData?.forEach((item) => {
        const category = item.name;
        if (!seletedValue[category]) {
          seletedValue[category] = [];
        }
        item.children.forEach((child) => {
          if (child.isChecked) {
            seletedValue[category].push(child.name);
          }
        });
      });
      isAllSelected
        ? setSelectedValues(["All"])
        : setSelectedValues(seletedValue);
      var filteredValues = {};
      isAllSelected
        ? (filteredValues = { label: label, value: null })
        : (filteredValues = { label: label, value: seletedValue });
      filterList(filteredValues);
    } else {
      const seletedValue = [];
      newFilteredData.map((data) => {
        if (data?.isChecked) {
          seletedValue.push(data?.name);
        }
        data?.children?.map((childData) => {
          if (data?.isChecked) {
            seletedValue.push(childData?.name);
          }
        });
      });
      isAllSelected
        ? setSelectedValues(["All"])
        : setSelectedValues(seletedValue);
      var filteredValues = {};
      isAllSelected
        ? (filteredValues = { label: label, value: null })
        : (filteredValues = { label: label, value: seletedValue });
      filterList(filteredValues);
    }

    setSelectAll(isAllSelected);
    setFilterData(newFilteredData);
    setInitialFilterState((prevState) => {
      return { ...prevState, [label]: newFilteredData };
    });
    setDropdownActive({ [label]: true });
  };

  const handleFilterChildClick = (parentVal, childVal) => {
    let isAllSelected = true;
    let isSubAllSelected = true;
    let seletedValue = {};
    const newFilteredData = filterData.map((el) => {
      if (el.id === parentVal.id) {
        const childObj = el.children.map((child) => {
          if (child.id === childVal.id) {
            isSubAllSelected = isSubAllSelected && !child.isChecked;
            return { ...child, isChecked: !child.isChecked };
          }
          isSubAllSelected = isSubAllSelected && child.isChecked;
          return { ...child };
        });
        el.children = childObj;
        isAllSelected = isAllSelected && isSubAllSelected;
        return { ...el, isChecked: isSubAllSelected };
      }
      isAllSelected = isAllSelected && el.isChecked;
      return { ...el };
    });
    setSelectAll(isAllSelected);
    setFilterData(newFilteredData);
    setInitialFilterState((prevState) => {
      return { ...prevState, [label]: newFilteredData };
    });
    setDropdownActive({ [label]: true });
    newFilteredData?.forEach((item) => {
      const category = item.name;
      if (!seletedValue[category]) {
        seletedValue[category] = [];
      }
      item.children.forEach((child) => {
        if (child.isChecked) {
          seletedValue[category].push(child.name);
        }
      });
    });
    isAllSelected
      ? setSelectedValues(["All"])
      : setSelectedValues(seletedValue);
    var filteredValues = {};
    isAllSelected
      ? (filteredValues = { label: label, value: null })
      : (filteredValues = { label: label, value: seletedValue });
    filterList(filteredValues);
  };

  const formattedFilterData = () => {
    if (Array.isArray(selectedValues)) {
      return selectedValues.join(", ");
    } else if (typeof selectedValues === "object" && selectedValues !== null) {
      const allEmpty = Object.values(selectedValues).every(
        (times) => Array.isArray(times) && times.length === 0
      );
      if (allEmpty) {
        return "NONE";
      }
      return Object.entries(selectedValues)
        .map(([key, times]) => {
          if (!Array.isArray(times)) {
            console.error(
              `Expected times to be an array but got ${typeof times}`
            );
            times = [];
          }
          const formattedTimes = times.length > 0 ? times.join(", ") : "";
          return formattedTimes ? `${key} ${formattedTimes}` : "";
        })
        .filter((entry) => entry !== "")
        .join(", ");
    } else {
      console.error("Unexpected data format");
      return "NONE";
    }
  };

  const handleDropdownMouseLeave = () => {
    setDropdownActive({ [label]: false });
  };

  return (
    <div className="fields-grp">
      <label id={label + "-dropdown"} for={label + "levelFilterButton"}>
        {label}
      </label>
      <div
        className="DropdownList dropdown dropdown-btn"
        role="combobox"
        aria-labelledby={label + "-dropdown"}
        aria-expanded={dropdownActive[label] ? "true" : "false"}
        aria-controls={label + "-dropdown-menu"}
        style={{ width: "100% !important", backgroundColor: "#F7F7F7" }}
      >
        <button
          className={"dropdown-toggle btn"}
          type="button"
          aria-controls={label + "-dropdown-menu"}
          aria-expanded={dropdownActive[label] ? "true" : "false"}
          aria-haspopup="listbox"
          active={0}
          modern
          id={label + "levelFilterButton"}
        >
          <label
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0,
            }}
          >
            {label === "Timing"
              ? formattedFilterData()
              : selectedValues?.length > 0
              ? selectedValues?.map((item, itemIndex) => {
                  return (
                    <>
                      {item}
                      {itemIndex !== selectedValues?.length - 1
                        ? ",\u00A0"
                        : ""}
                    </>
                  );
                })
              : "NONE"}
          </label>
          <svg
            className="arrow"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3.19995 6.40039L7.99995 11.2004L12.8 6.40039"
              stroke="#2E2D29"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="bevel"
            />
          </svg>
        </button>
        <div
          id={label + "-dropdown-menu"}
          role="listbox"
          aria-labelledby={label + "levelFilterButton"}
          className={`dropdown-menu switch-dropdown-menu ${
            dropdownActive[label] ? "show" : ""
          }`}
          style={{ width: "max-content", backgroundColor: "#F7F7F7" }}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <Filter text="All" data={AllSelect} selectAll={selectAll} />
          {filterData?.map((el, elIndex) => {
            return (
              <>
                <CheckboxListFilter
                  key={elIndex}
                  title={el.name}
                  handleInputClick={() => handleFilterClick(el)}
                  checkboxStyle={{ marginRight: "10px" }}
                  isChecked={el.isChecked}
                />
                {el?.children?.length > 0 &&
                  el?.children?.map((child, childIndex) => {
                    return (
                      <div className="child" style={{ paddingLeft: "16px" }}>
                        <CheckboxListFilter
                          key={childIndex}
                          title={child.name}
                          handleInputClick={() =>
                            handleFilterChildClick(el, child)
                          }
                          checkboxStyle={{
                            marginRight: "10px",
                          }}
                          isChecked={child.isChecked}
                        />
                      </div>
                    );
                  })}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SwitchEventsFilters;
