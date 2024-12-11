jQuery(document).ready(function () {
	/* Sticky filter area obscures focus  
	document.addEventListener('focusin', function(event) {
	    const stickySelectors = ['.cadmin.control-menu-container', '.header-section', '.info-banner'];
	    let totalStickyHeight = 0;

	    stickySelectors.forEach(selector => {
	        const stickyElement = document.querySelector(selector);
	        if (stickyElement) {
	            totalStickyHeight += stickyElement.offsetHeight;
	        }
	    });

	    const focusedElement = event.target;
	    const rect = focusedElement.getBoundingClientRect();
	    const elementTop = rect.top + window.scrollY;

	    if (elementTop < window.scrollY + totalStickyHeight || elementTop > window.scrollY + window.innerHeight) {
	        window.scrollTo({
	            top: elementTop - totalStickyHeight,
	            behavior: 'smooth'
	        });
	    }
	});
*/
	
	console.log("doAsUserId" + doAsUserId);
	// control panel hide when student view mode
	if (doAsUserId.length > 0) {
	  jQuery("body").removeClass("has-control-menu");
	  jQuery("#ControlMenu").hide();
	}
	window.profilemenuhide = function () {
	  if (
	    jQuery(".Menulinks .menu-link").length == 1 &&
	    jQuery(".Menulinks .menu-link").css("display") == "none"
	  ) {
	    jQuery("#profile-dropdown-menu").hide();
	    jQuery("#profile-dropdown-menu").prev().find(".arrow").hide();
	  }
	};
	// function selectDropdownToggle
	 
	function initializeDropdownToggle() {
	  console.log("initializeDropdownToggle");

	  // Click event handler for dropdown toggle button
	  jQuery(document).on("click", ".DropdownList .dropdown-toggle", function (event) {
	    var toggleButton = jQuery(this);
	    toggleButton.toggleClass("active");

	    // Toggle dropdown visibility when the trigger button is clicked
	    var dropdown = toggleButton.next(".dropdown-menu");
	    dropdown.toggleClass("show");
	    toggleButton.attr("aria-expanded", true);
	    dropdown.hasClass("show")
	      ? toggleButton.attr("aria-expanded", true)
	      : toggleButton.attr("aria-expanded", false);
	  });

	  // Mouseleave event handler for removing 'active' class and hiding dropdown menu
	  jQuery(document).on("mouseleave", ".DropdownList", function (event) {
	    var dropdown = jQuery(this);
	    var toggleButton = dropdown.find(".dropdown-toggle");
	    var toggleMenu = dropdown.find(".dropdown-menu");

	    // Remove 'active' class from the toggle button
	    toggleButton.removeClass("active");

	    // Remove 'show' class from the dropdown menu
	    toggleMenu.removeClass("show");
	    toggleButton.attr("aria-expanded", false);
	  });
	}
	// Call selectDropdownToggle() to attach event handlers
	if (!window.dropdownToggleInitialized) {
	  initializeDropdownToggle();
	  window.dropdownToggleInitialized = true;
	} else {
	  console.log("Dropdown toggle behavior is already initialized");
	} 
  /* Skip to Content   */
	jQuery(".quick-access-nav a").on("keydown click", function (event) { 
    if (event.type === "click" | event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault(); 
      $('#content').first().find('a').first().focus(); 
      return false;  
    }
  });
 

  window.profilemenuhide();

  window.infobannerSticky = function () {
    var headerHeight = jQuery("#header").height() + 24;
    if (
      doAsUserId.length > 0 ||
      (crmStudentView === "true" && crmStudent === "false")
    ) {
    	jQuery("section[id*=_clcecoursereactweb] .info-banner").css(
        "top",
        headerHeight
      );
      jQuery("section[id*=_clcecoursereactweb] .Visualizer").css("top", 324);
    } else {
      jQuery(
        "section[id*=_clcecoursereactweb] .info-banner, section[id*=_clcecoursereactweb] .Visualizer"
      ).removeAttr("style");
    }
  };
  window.infobannerSticky();

  settinglink = function () {
    var url = jQuery(".settinglink").attr("href");
    var settingTarget;

    if (window.location.pathname === url) {
      settingTarget = "_self";
    } else {
      settingTarget = "_blank";
    }
    jQuery(".settinglink").attr("target", settingTarget);
  };
  settinglink();

  howtolink = function () {
    var url = jQuery(".howtolink").attr("href");
    var howtoTarget = "";
    if (window.location.pathname === url) {
      howtoTarget = "_self";
    } else {
      howtoTarget = "_blank";
    }
    if (doAsUserId.length > 0) {
      newURL = url + "?doAsUserId=" + doAsUserId;
      jQuery(".howtolink").attr("href", newURL).attr("target", howtoTarget);
    } else {
      jQuery(".howtolink").attr("href", url).attr("target", howtoTarget);
    }
  };
  howtolink();
  notelink = function () {
    var url = jQuery(".notelink").attr("href");
    var noteTarget = "";
    var isURL = window.location.pathname + window.location.hash;
    if (isURL === url) {
      noteTarget = "_self";
    } else {
      noteTarget = "_blank";
    }
    if (doAsUserId.length > 0) {
      newUrl = url.split("#");
      new_Url = newUrl[0] + "?doAsUserId=" + doAsUserId + "#" + newUrl[1];
      jQuery(".notelink").attr("href", new_Url).attr("target", noteTarget);
    } else {
      jQuery(".notelink").attr("href", url).attr("target", noteTarget);
    }
  };
  notelink();
  jQuery('div:contains("Node: liferay-").alert.alert-info').addClass("hide");

  /* My Note Icon change with API response */
  window.myNoteData = async function () {
    try {
      // Fetch JSON data from a URL
      const response = await fetch(
        "/o/mygsb/gsb/clce/all-notes?p_auth=" + Liferay.authToken
      );

      if (!response.ok) {
        throw new Error("My Note HTTP error! Status:" + response.status);
      }

      // Convert response to JSON
      const data = await response.json();

      // Check if the data is an empty object
      if (Object.keys(data).length === 0 && data.constructor === Object) {
        console.log("My Note Data is an empty object");
      } else {
        // Process the non-empty data here
        if (data?.courses?.length > 0) {
          jQuery("#myNoteIcon").attr(
            "src",
            images_folder + "/icons/note_fill_icon.svg"
          );
        } else {
          jQuery("#myNoteIcon").attr(
            "src",
            images_folder + "/icons/note_line_icon.svg"
          );
        }
      }
    } catch (error) {
      console.error("My Note Error fetching or processing data:", error);
    }
  };

  // Call the async function
  window.myNoteData();

  /* Wishlist Icon change with API response */
  window.wishListData = async function () {
    try {
      // Fetch JSON data from a URL
      const response = await fetch(
        "/o/mygsb/gsb/clce/user-wishlist?p_auth=" + Liferay.authToken
      );

      if (!response.ok) {
        throw new Error("Wishlist HTTP error! Status:" + response.status);
      }

      // Convert response to JSON
      const data = await response.json();

      // Check if the data is an empty object
      if (data.hasOwnProperty("IsWishlist") && data.IsWishlist === "true") {
        jQuery("#wishListIcon").attr(
          "src",
          images_folder + "/icons/fav_fill_icon.svg"
        );
      } else {
        jQuery("#wishListIcon").attr(
          "src",
          images_folder + "/icons/fav_line_icon.svg"
        );
      }
    } catch (error) {
      console.error("Wishlist Data Error fetching or processing data:", error);
    }
  };

  // Call the async function
  window.wishListData();
});
window.wishlistpopup =   function() { 
    var event = new CustomEvent('openReactModalEvent', {
    bubbles: true,
    detail: {}
    });
    document.dispatchEvent(event);
  }
window.visualizerScroll = function (id) {
  console.log("visualizerScroll" + id);
  var targetSection = jQuery("#" + id).offset().top; // section id
  var headerHight = jQuery("#header").height();
  var infoBannerHight = jQuery(".info-banner").height();
  var controlMenuHight = jQuery("#ControlMenu").height();
  var withMenu = headerHight + infoBannerHight + controlMenuHight;
  var withoutMenu = headerHight + infoBannerHight;
  if (document.body.classList.contains("has-control-menu")) {
    window.scrollTo({
      top: targetSection - withMenu,
      behavior: "smooth",
    });
  } else {
    window.scrollTo({
      top: targetSection - withoutMenu,
      behavior: "smooth",
    });
  }
};
// Call visualizerScroll() to attach event handlers
if (!window.visualizerScroll) {
  visualizerScroll();
  window.visualizerScroll = true;
} else {
  console.log("visualizerScroll behavior is already initialized");
}

// Control menu hidden the AO

console.log("actualRole" + actualRole);
console.log("linkCourseConfigSettings" + linkCourseConfigSettings);
console.log("crmStudentView" + crmStudentView);
console.log("crmStudent" + crmStudent);
window.controlMenuHide = function () {
  if (doAsUserId.length > 0 || crmStudentView === "true") {
    jQuery(".control-menu ").hide();
    jQuery(".controls-visible").removeClass();
  }
  if (role === "AO") {
    console.log("controlMenuHide" + role);
    jQuery(
      ".portlet-boundary_cl_ce_admin_config_web_ClCeAdminConfigWebPortlet_ .portlet-topper"
    ).hide();
    jQuery(
      " .control-menu #layoutFinder,  .control-menu  li.control-menu-nav-category.sites-control-group"
    ).hide();
    jQuery(
      ".control-menu  li.control-menu-nav-category.user-control-group  "
    ).css("visibility", "hidden");
  }
};
window.controlMenuHide();

 