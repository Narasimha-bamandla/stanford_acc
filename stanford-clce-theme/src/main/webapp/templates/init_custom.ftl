<#assign
  	wrap_widget_page_content = getterUtil.getBoolean(themeDisplay.getThemeSetting("wrap-widget-page-content"))

	 gaAnalytics = getterUtil.getString(theme_settings["ga-script"]) 
	 showHeaderTitle = getterUtil.getBoolean(theme_settings["show-header-title"]) 
	 headerTitle = getterUtil.getString(theme_settings["header-title"]) 
	 showSearch = getterUtil.getBoolean(theme_settings["show-search"]) 
	 linkCourseListing = getterUtil.getString(theme_settings["link-course-listing"]) 
	 showDegreeProgress = getterUtil.getBoolean(theme_settings["show-degree-progress"]) 
	 linkDegreeProgress = getterUtil.getString(theme_settings["link-degree-progress"]) 
	 showMyNotes = getterUtil.getBoolean(theme_settings["show-my-notes"]) 
	 linkMyNotes = getterUtil.getString(theme_settings["link-my-notes"]) 
	 showWishlist = getterUtil.getBoolean(theme_settings["show-wishlist"])       
	 linkWishlist = getterUtil.getString(theme_settings["link-wishlist"]) 
	 linkHowTo = getterUtil.getString(theme_settings["link-how-to"]) 
	 searchResultsURL = getterUtil.getString(theme_settings["search-results-url"]) 
	 searchResultsAcademicYear = getterUtil.getString(theme_settings["search-results-academic-year"]) 
	 customLogoUrl = getterUtil.getBoolean(theme_settings["custom-logo-url"]) 
	 logoUrl = getterUtil.getString(theme_settings["logo-url"]) 
	 studentProfileMenuWebContentId = theme_settings["student-profile-menu-webcontent-id"] 
	 staffProfileMenuWebContentId = theme_settings["staff-profile-menu-webcontent-id"]     
	 linkCourseConfigSettings = getterUtil.getString(theme_settings["link-course-config-settings"]) 

 
/>
<#if wrap_widget_page_content && ((layout.isTypeContent() && themeDisplay.isStateMaximized()) || (layout.getType() == "portlet"))>
	<#assign portal_content_css_class = "container" />
<#else>
	<#assign portal_content_css_class = "container-fluid" />
</#if> 