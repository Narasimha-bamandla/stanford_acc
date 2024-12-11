jQuery(document).ready(function () {
  searchUrl = search_Results_URL;
  urlDoAsUserId = searchUrl.split("#"); 

  jQuery(".header-section .search-box #nodata").hide();

  jQuery(".search-box .search-combo-input").click(function () {
    jQuery(this).closest(".search-box").find("#results-container").hide();
    jQuery(this).closest(".search-box").find("#results-list").empty();
    jQuery(this).closest(".search-box").find("#searchbar").empty();
  });
  jQuery(document).on("keydown click", function (event) {
    if (event.key === "Escape") {
      jQuery(".search-box").find("#results-container").hide();
      jQuery(".search-box").find("#results-list").empty();
      jQuery(".search-box").find("#searchbar").empty();
    }
    var $target = $(event.target);
    if (!$target.closest('.search-box').length) {
      jQuery(".search-box").find("#results-container").hide();
   	  jQuery(".search-box").find("#results-list").empty();
   	  jQuery(".search-box").find("#searchbar").empty();
    } 
  });
  activeInactiveSearchBtn = function () {
    if (jQuery(".header-section .search-box #searchbar").val().length < 3) {
      jQuery(".header-section .search-box #searchbtn")
        .attr("disabled", true)
        .attr("tabindex", "-1");
    } else {
      jQuery(".header-section .search-box #searchbtn")
        .attr("disabled", false)
        .attr("tabindex", "0");
    }
  };
  activeInactiveSearchBtn();

  jQuery("#header .search-box #see-all-link ").click(function () {
    jQuery(this).closest(".search-box").find("#results-container").hide();
  });

  function highlightWord(element, wordToHighlight) {
    var content = jQuery(element).html();
    var highlightedContent = content.replace(
      new RegExp(wordToHighlight, "gi"),
      '<span class="highlight">$&</span>'
    );
    jQuery(element).html(highlightedContent);
  }
  jQuery("#header .search-box #searchbar").on(
    "keyup keypress click",
    function (e) {
      jQuery(this)
        .closest(".search-box")
        .find(".search-combo")
        .removeClass("show");
      activeInactiveSearchBtn();
    }
  );
  jQuery("#header .search-box #searchbar").on("keyup", function (e) { 
    searchType = jQuery("#header .search-box .search-combo-input").text();
    searchInputValue = jQuery("#header .search-box #searchbar").val();

    jQuery(this)
      .closest(".search-box")
      .find("#selectlist-dropdown-menu")
      .removeClass("show");
    activeInactiveSearchBtn();

    if (e.target.value.length >= 3) {
      jQuery("#header .search-box #loading").show();
      var resultContainer = document.getElementById("results-list");
      var resultContainerDiv = jQuery("#header .search-box #results-list div");
      var requestUrl =
        "/o/mygsb/gsb/clce/get-filtered/data?academic_year=" +
        search_results_academic_year +
        "&startsAndEndsWith=" +
        encodeURIComponent(searchInputValue) +
        "&filter=" +
        searchType +
        "&p_auth=" +
        Liferay.authToken;
      var requestHeaders = new Headers({
        Accept: "application/json",
      });

      fetch(requestUrl, {
        method: "GET",
        headers: requestHeaders,
      })
        .then(async (response) => {
          jQuery("#header .search-box #results-container").show();
          jQuery("#header .search-box #see-all-link ").hide();
          if (response.ok) {
            const responseData = await response.text();
            if (responseData === "no matched data found") { 
              jQuery("#header .search-box #nodata").show();
              jQuery("#header .search-box #results-list").empty();
              jQuery("#header .search-box #loading").hide();
              jQuery("#results-hidden-container ").text(
                "No matched data found"
              );
            } else {
              jQuery("#header .search-box #nodata").hide();
              const data = JSON.parse(responseData);
              jQuery("#header .search-box #loading").hide(); 
              jQuery("#results-hidden-container ").text(
                data.length + " search results available below"
              );
              var htmlContent = "";
              data.slice(0, 5).forEach((element) => {
                urlDoAsUserId = element.course_details_url.split("#");
                url_doAsUserId = urlDoAsUserId[0] + "?doAsUserId=" + doAsUserId;
                if (urlDoAsUserId.length > 1) {
                  url_doAsUserId += "#" + urlDoAsUserId[1];
                }
                htmlContent += '<li> <a class="body2" target="_blank" href="';

                if (doAsUserId.length > 0) {
                  htmlContent += url_doAsUserId;
                } else {
                  htmlContent += element.course_details_url;
                }
                htmlContent += '">';
                htmlContent +=
                  element.subject_code +
                  " " +
                  element.catalog_number_code +
                  " - " +
                  element.title +
                  " (" +
                  element.acadamic_year +
                  ", " +
                  element.term +
                  ")";
                htmlContent +=
                  '</a>  <div class="body3 instructors_list"><div class="body3"> Instructors - </div><div class="instructors">';
                const uniqueInstructors = Array.from(
                  new Set(
                    element.Instructors_with_url.map(
                      (instructor) =>
                        '<a class="body3" href="' +
                        instructor.instructor_url +
                        '" target="_blank">' +
                        instructor.first_name_and_lastNamePri +
                        "</a>"
                    )
                  )
                );

                uniqueInstructors.forEach((instructor, index, array) => {
                  htmlContent += instructor;
                  if (index < array.length - 1) {
                    htmlContent += ", ";
                  }
                });
                htmlContent += "</div> </div> </li>";
              });

              resultContainer.innerHTML = htmlContent;
              jQuery(
                "#header .search-box #results-list li a.body2, #header .search-box #results-list li  a.body3"
              ).each(function () {
                highlightWord(this, e.target.value);
              });

              // Insert ?doAsUserId=doAsUserId after the split
              url_doAsUserId = "?doAsUserId=" + doAsUserId;
              if (urlDoAsUserId.length > 1) {
                url_doAsUserId += "#" + urlDoAsUserId[1];
              }
              if (doAsUserId.length > 0) {
                searchUrl =
                  "?doAsUserId=" +
                  doAsUserId +
                  "#" +
                  search_Results_URL.split("#")[1] +
                  "?" +
                  urlDoAsUserId[1].split("?")[1] +
                  "&academic_year=" +
                  search_results_academic_year +
                  "&filter=" +
                  searchType +
                  "&search=" +
                  encodeURIComponent(searchInputValue);  
              } else {
                searchUrl =
                  search_Results_URL +
                  "?academic_year=" +
                  search_results_academic_year +
                  "&filter=" +
                  searchType +
                  "&search=" +
                  encodeURIComponent(searchInputValue);  
              }
              if (data.length > 5) {
                jQuery("#header .search-box #see-all-link").attr(
                  "href",
                  searchUrl
                );
                jQuery("#header .search-box #see-all-link").attr(
                  "target",
                  "_blank"
                );
                jQuery("#header .search-box #see-all-link").html(
                  'See all results for    "' +
                    e.target.value +
                    '" in Course Research <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.1665 6.99984H12.8332M12.8332 6.99984L6.99984 1.1665M12.8332 6.99984L6.99984 12.8332" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel"></path></svg>'
                );
                jQuery("#header .search-box #see-all-link ").show();
              } else {
                jQuery("#header .search-box #see-all-link ").hide();
              }
            }
          }
        })
        .catch((error) => {
          jQuery("#header .search-box #loading").hide();
          jQuery("#header .search-box #results-container").hide();
          console.error("Error fetching or parsing data:", error);
        });
    } else {
      jQuery("#header .search-box #results-container").hide();
      jQuery("#header .search-box #results-list").empty();
    }
  });
  // Global Search Button and Search Result Link redirect to Search Results page
  jQuery("#header .search-box #searchbtn ").on("click", function () {
    searchType = jQuery("#header .search-box .search-combo-input").text();
    if (doAsUserId.length > 0) {
      searchUrl =
        "?doAsUserId=" +
        doAsUserId +
        "#" +
        search_Results_URL.split("#")[1] +
        "?" +
        urlDoAsUserId[1].split("?")[1] +
        "&academic_year=" +
        search_results_academic_year +
        "&filter=" +
        searchType +
        "&search=" +
        encodeURIComponent(searchInputValue);
    } else {
      searchUrl =
        search_Results_URL +
        "?academic_year=" +
        search_results_academic_year +
        "&filter=" +
        searchType +
        "&search=" +
        encodeURIComponent(searchInputValue);
    }
    window.open(searchUrl);
  });
  jQuery("#header .search-box #searchbar").keypress(function (e) {
    searchType = jQuery("#header .search-box .search-combo-input").text();
    if (doAsUserId.length > 0) {
      searchUrl =
        "?doAsUserId=" +
        doAsUserId +
        "#" +
        search_Results_URL.split("#")[1] +
        "?" +
        urlDoAsUserId[1].split("?")[1] +
        "&academic_year=" +
        search_results_academic_year +
        "&filter=" +
        searchType +
        "&search=" +
        encodeURIComponent(searchInputValue);
    } else {
      searchUrl =
        search_Results_URL +
        "?academic_year=" +
        search_results_academic_year +
        "&filter=" +
        searchType +
        "&search=" +
        encodeURIComponent(searchInputValue);
    }
    if (jQuery(this).val().length >= 3) {
      var key = e.which;
      if (key == 13) {
        window.open(searchUrl);
        return false;
      }
    }
  });
  jQuery("#header .search-box #results-container").on(
    "click",
    function (event) {
      event.stopPropagation();
    }
  );
  //  jQuery(document).on("click", function () {
  //    jQuery("#header .search-box #results-container").hide();
  //    if (
  //      !jQuery("#header .search-box .DropdownList.dropdown").is(event.target) &&
  //      jQuery("#header .search-box .DropdownList.dropdown").has(event.target)
  //        .length === 0
  //    ) {
  //      jQuery("#header .search-box #selectlist-dropdown-menu").removeClass(
  //        "show"
  //      );
  //    }
  //  });
  jQuery("#header .search-box #see-all-link").on("click", function (event) {
    event.stopPropagation();
  });
});
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

("use strict");

// Save a list of named combobox actions, for future readability
const SelectActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  PageDown: 6,
  PageUp: 7,
  Previous: 8,
  Select: 9,
  Type: 10,
};

/*
 * Helper functions
 */

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
function filterOptions(options = [], filter, exclude = []) {
  return options.filter((option) => {
    const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
}

// map a key press to an action
function getActionFromKey(event, menuOpen) {
  const { key, altKey, ctrlKey, metaKey } = event;
  const openKeys = ["ArrowDown", "ArrowUp", "Enter", " "]; // all keys that will do the default open action
  // handle opening when closed
  if (!menuOpen && openKeys.includes(key)) {
    return SelectActions.Open;
  }

  // home and end move the selected option when open or closed
  if (key === "Home") {
    return SelectActions.First;
  }
  if (key === "End") {
    return SelectActions.Last;
  }

  // handle typing characters when open or closed
  if (
    key === "Backspace" ||
    key === "Clear" ||
    (key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey)
  ) {
    return SelectActions.Type;
  }

  // handle keys when open
  if (menuOpen) {
    if (key === "ArrowUp" && altKey) {
      return SelectActions.CloseSelect;
    } else if (key === "ArrowDown" && !altKey) {
      return SelectActions.Next;
    } else if (key === "ArrowUp") {
      return SelectActions.Previous;
    } else if (key === "PageUp") {
      return SelectActions.PageUp;
    } else if (key === "PageDown") {
      return SelectActions.PageDown;
    } else if (key === "Escape") {
      return SelectActions.Close;
    } else if (key === "Enter" || key === " ") {
      return SelectActions.CloseSelect;
    }
  }
}

// return the index of an option from an array of options, based on a search string
// if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
function getIndexByLetter(options, filter, startIndex = 0) {
  const orderedOptions = [
    ...options.slice(startIndex),
    ...options.slice(0, startIndex),
  ];
  const firstMatch = filterOptions(orderedOptions, filter)[0];
  const allSameLetter = (array) => array.every((letter) => letter === array[0]);

  // first check if there is an exact match for the typed string
  if (firstMatch) {
    return options.indexOf(firstMatch);
  }

  // if the same letter is being repeated, cycle through first-letter matches
  else if (allSameLetter(filter.split(""))) {
    const matches = filterOptions(orderedOptions, filter[0]);
    return options.indexOf(matches[0]);
  }

  // if no matches, return -1
  else {
    return -1;
  }
}

// get an updated option index after performing an action
function getUpdatedIndex(currentIndex, maxIndex, action) {
  const pageSize = 10; // used for pageup/pagedown

  switch (action) {
    case SelectActions.First:
      return 0;
    case SelectActions.Last:
      return maxIndex;
    case SelectActions.Previous:
      return Math.max(0, currentIndex - 1);
    case SelectActions.Next:
      return Math.min(maxIndex, currentIndex + 1);
    case SelectActions.PageUp:
      return Math.max(0, currentIndex - pageSize);
    case SelectActions.PageDown:
      return Math.min(maxIndex, currentIndex + pageSize);
    default:
      return currentIndex;
  }
}

// check if element is visible in browser view port
function isElementInView(element) {
  var bounding = element.getBoundingClientRect();

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

// check if an element is currently scrollable
function isScrollable(element) {
  return element && element.clientHeight < element.scrollHeight;
}

// ensure a given child element is within the parent's visible scroll area
// if the child is not visible, scroll the parent
function maintainScrollVisibility(activeElement, scrollParent) {
  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
}

/*
 * Select Component
 * Accepts a combobox element and an array of string options
 */
const Select = function (el) {
  // element refs
  this.el = el;
  this.comboEl = el.querySelector("[role=combobox]");
  this.listboxEl = el.querySelector("[role=listbox]");

  // data
  this.idBase = this.comboEl.id || "combo";
  const rawOptions = Array.from(this.listboxEl.children).map((option) =>
    option.textContent.trim()
  );
  this.options = Array.from(new Set(rawOptions)); // Remove duplicates and trim whitespace

  // state
  this.activeIndex = 0;
  this.open = false;
  this.searchString = "";
  this.searchTimeout = null;

  // init
  if (el && this.comboEl && this.listboxEl) {
    this.init();
  }
};

Select.prototype.init = function () {
  // select first option by default
//  if (this.options.length > 0) {
//    this.comboEl.innerHTML = this.options[0];
//  }
  // add event listeners
  this.comboEl.addEventListener("blur", this.onComboBlur.bind(this));
  this.listboxEl.addEventListener("focusout", this.onComboBlur.bind(this));
  this.comboEl.addEventListener("click", this.onComboClick.bind(this));
  this.comboEl.addEventListener("keydown", this.onComboKeyDown.bind(this));

  // Clear existing options and create option elements
  this.listboxEl.innerHTML = ""; // Clear any existing options
  this.options.forEach((option, index) => {
    const optionEl = this.createOption(option, index);
    this.listboxEl.appendChild(optionEl);
  });
};

Select.prototype.createOption = function (optionText, index) {
  const optionEl = document.createElement("div");
  optionEl.setAttribute("role", "option");
  optionEl.id = `${this.idBase}-${index}`;
  optionEl.className =
    index === 0 ? "combo-option option-current" : "combo-option";
  optionEl.setAttribute("aria-selected", `${index === 0}`);
  optionEl.innerText = optionText;

  optionEl.addEventListener("click", (event) => {
    event.stopPropagation();
    this.onOptionClick(index);
  });
  optionEl.addEventListener("mousedown", this.onOptionMouseDown.bind(this));

  return optionEl;
};

Select.prototype.getSearchString = function (char) {
  // reset typing timeout and start new timeout
  // this allows us to make multiple-letter matches, like a native select
  if (typeof this.searchTimeout === "number") {
    window.clearTimeout(this.searchTimeout);
  }

  this.searchTimeout = window.setTimeout(() => {
    this.searchString = "";
  }, 500);

  // add most recent letter to saved search string
  this.searchString += char;
  return this.searchString;
};

Select.prototype.onLabelClick = function () {
  this.comboEl.focus();
};

Select.prototype.onComboBlur = function (event) {
  // do nothing if relatedTarget is contained within listboxEl
  if (this.listboxEl.contains(event.relatedTarget)) {
    return;
  }

  // select current option and close
  if (this.open) {
    this.selectOption(this.activeIndex);
    this.updateMenuState(false, false);
  }
};

Select.prototype.onComboClick = function () {
  this.updateMenuState(!this.open, false);
};

Select.prototype.onComboKeyDown = function (event) {
  const { key } = event;
  const max = this.options.length - 1;

  const action = getActionFromKey(event, this.open);

  switch (action) {
    case SelectActions.Last:
    case SelectActions.First:
      this.updateMenuState(true);
    // intentional fallthrough
    case SelectActions.Next:
    case SelectActions.Previous:
    case SelectActions.PageUp:
    case SelectActions.PageDown:
      event.preventDefault();
      return this.onOptionChange(
        getUpdatedIndex(this.activeIndex, max, action)
      );
    case SelectActions.CloseSelect:
      event.preventDefault();
      this.selectOption(this.activeIndex);
    // intentional fallthrough
    case SelectActions.Close:
      event.preventDefault();
      return this.updateMenuState(false);
    case SelectActions.Type:
      return this.onComboType(key);
    case SelectActions.Open:
      event.preventDefault();
      return this.updateMenuState(true);
  }
};

Select.prototype.onComboType = function (letter) {
  // open the listbox if it is closed
  this.updateMenuState(true);

  // find the index of the first matching option
  const searchString = this.getSearchString(letter);
  const searchIndex = getIndexByLetter(
    this.options,
    searchString,
    this.activeIndex + 1
  );

  // if a match was found, go to it
  if (searchIndex >= 0) {
    this.onOptionChange(searchIndex);
  }
  // if no matches, clear the timeout and search string
  else {
    window.clearTimeout(this.searchTimeout);
    this.searchString = "";
  }
};

Select.prototype.onOptionChange = function (index) {
  // update state
  this.activeIndex = index;

  // update aria-activedescendant
  this.comboEl.setAttribute("aria-activedescendant", `${this.idBase}-${index}`);

  // update active option styles
  const options = this.el.querySelectorAll("[role=option]");
  [...options].forEach((optionEl) => {
    optionEl.classList.remove("option-current");
  });
  options[index].classList.add("option-current");

  // ensure the new option is in view
  if (isScrollable(this.listboxEl)) {
    maintainScrollVisibility(options[index], this.listboxEl);
  }

  // ensure the new option is visible on screen
  // ensure the new option is in view
  if (!isElementInView(options[index])) {
    options[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
};

Select.prototype.onOptionClick = function (index) {
  this.onOptionChange(index);
  this.selectOption(index);
  this.updateMenuState(false);
};

Select.prototype.onOptionMouseDown = function () {
  // Clicking an option will cause a blur event,
  // but we don't want to perform the default keyboard blur action
  this.ignoreBlur = true;
};

Select.prototype.selectOption = function (index) {
  // update state
  this.activeIndex = index;

  // update displayed value
  const selected = this.options[index];
  this.comboEl.innerHTML = selected;

  // update aria-selected
  const options = this.el.querySelectorAll("[role=option]");
  [...options].forEach((optionEl) => {
    optionEl.setAttribute("aria-selected", "false");
  });
  options[index].setAttribute("aria-selected", "true");
};

Select.prototype.updateMenuState = function (open, callFocus = true) {
  if (this.open === open) {
    return;
  }

  // update state
  this.open = open;

  // update aria-expanded and styles
  this.comboEl.setAttribute("aria-expanded", `${open}`);
  open ? this.el.classList.add("show") : this.el.classList.remove("show");

  // update activedescendant
  const activeID = open ? `${this.idBase}-${this.activeIndex}` : "";
  this.comboEl.setAttribute("aria-activedescendant", activeID);

  if (activeID === "" && !isElementInView(this.comboEl)) {
    this.comboEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // move focus back to the combobox, if needed
  callFocus && this.comboEl.focus();
};

window.addEventListener("load", function () {
  const selectEls = document.querySelectorAll(".search-combo");

  selectEls.forEach((el) => {
    new Select(el);
  });
});
