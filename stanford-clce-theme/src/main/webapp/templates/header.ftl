<#assign theme_display=themeDisplay />
<#if theme_display.isSignedIn()>
    <#assign user=theme_display.user />
</#if>
<#if customLogoUrl>
    <#assign logoLink=logoUrl />
    <#else>
        <#assign logoLink=site_default_url />
</#if> 
<header role="banner" id="header" class="header-section container-fluid   ">
<h1 class="sr-only">${htmlUtil.escape(the_title)}</h1>
    <div class="logo-area"> <a target="_blank" class="${logo_css_class} lfr-portal-tooltip" href="${logoLink}"
            data-bs-toggle="tooltip" data-bs-placement="bottom" data-title="Stanford Graduate School of  Business, Student Portal Home">
            <img alt="Stanford Graduate School of  Business, Student Portal Home" src="${images_folder}/logo.png"  />
        </a>
        <#if showHeaderTitle>
            <div class="vline"></div>
            <div class="header-title">
                ${headerTitle}
            </div>
        </#if>
    </div>
    <#if doAsUserId !='' && actualRole=="Advisor" && role !="Advisor">
        <#else>
            <#if crmStudentView>
                <#else>
                    <#if showSearch>
                        <#include "${full_templates_path}/search.ftl" />
                    </#if>
            </#if>
    </#if>
    <div class="header-right"> 
         <nav   aria-label="Student Quick Links">
   		 <ul class="main-menu"> 
            <#if doAsUserId !='' && actualRole=="Advisor" && role !="Advisor">
                <#else>
                    <#if crmStudentView>
                        <#else>
                            <#if showDegreeProgress>
                               <li class="top-level-entry-container "> <a href="${linkDegreeProgress}" target="_blank" title="Degree Progress" class="icon-btn btn lfr-portal-tooltip" data-bs-toggle="tooltip" data-bs-placement="bottom" data-title="Degree Progress"><img alt="Degree Progress"
                                        src="${images_folder}/icons/edu_icon.svg">
                                </a></li>
                            </#if>
                    </#if>
            </#if>
            <#if role=="Admin" || role=="AO" || role=="Advisor">
             <li class="top-level-entry-container "><a href="${linkCourseConfigSettings}" title="Settings" class="icon-btn btn lfr-portal-tooltip settinglink" data-bs-toggle="tooltip" data-bs-placement="bottom" data-title="Course Configuration Settings"><img alt="Course Configuration Settings"
                        src="${images_folder}/icons/config_icon.svg">
                </a> </li>
                <#else>
                    <#if doAsUserId !='' && actualRole=="Advisor" && role !="Advisor">
                        <#else>
                            <#if crmStudentView>
                                <#else>
                                    <#if role=="MBA1" || role=="MBA2" || role=="MSx" || role=="PhD">
                                        <#if showMyNotes>
                                           <li  class="top-level-entry-container "> <a href="${linkMyNotes}" class="icon-btn btn lfr-portal-tooltip notelink" data-bs-toggle="tooltip" data-bs-placement="bottom" data-title="All Notes"><img
                                                    alt="All Notes" id="myNoteIcon" src="${images_folder}/icons/note_line_icon.svg">
                                            </a></li>
                                        </#if>
                                        <#if showWishlist>
                                          <li   class="top-level-entry-container ">  <a href="javascript:wishlistpopup()" aria-haspopup="dialog" class="icon-btn btn lfr-portal-tooltip" data-bs-toggle="tooltip" data-bs-placement="bottom" data-title="Wishlist">
                                                <img alt="Wishlist" id="wishListIcon"
                                                    src="${images_folder}/icons/fav_fill_icon.svg">
                                            </a></li>
                                        </#if>
                                    </#if>
                            </#if>
                    </#if>
            </#if> 
        <#if doAsUserId !='' && actualRole=="Advisor" && role !="Advisor">
            <#else>
                <#if crmStudentView>
                    <#else>
                       <li class="top-level-entry-container "> <a href="${linkHowTo}" class="sdfd-btn sm-btn secondary-btn lfr-portal-tooltip howtolink" data-bs-toggle="tooltip" data-bs-placement="bottom" data-title="Click to learn more about the Course Research tool">
                            <svg aria-hidden="true"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_7878_107842)">
                                    <path d="M10.0003 13.3332V9.99984M10.0003 6.6665H10.0087M18.3337 9.99984C18.3337 14.6022 14.6027 18.3332 10.0003 18.3332C5.39795 18.3332 1.66699 14.6022 1.66699 9.99984C1.66699 5.39746 5.39795 1.6665 10.0003 1.6665C14.6027 1.6665 18.3337 5.39746 18.3337 9.99984Z"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_7878_107842">
                                        <rect width="20" height="20" fill="white"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                            How To </a></li>
                </#if>
        </#if>
       <li class="top-level-entry-container ">
               <button class="dropdown-toggle btn" id="profile-menu-button"
                type="button" aria-controls="profile-dropdown-menu" aria-expanded="false" aria-haspopup="true"
                active="0">
                <#if is_signed_in>
                    <#if crmStudentView>
                        ${userName}
                        <#else>
                            ${user.fullName}
                    </#if>
                    <#else> Guest
                </#if>
                <#if doAsUserId !='' && actualRole=="Advisor" && role !="Advisor">
                    <#else>
                        <#if crmStudentView>
                            <#else>
                                <svg aria-hidden="true" class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.19995 6.40039L7.99995 11.2004L12.8 6.40039" stroke="currentColor"
                                        stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel"></path>
                                </svg>
                        </#if>
                </#if>
            </button>
           		  <#if doAsUserId !='' && actualRole=="Advisor" && role !="Advisor">
                <#else>
                    <div id="user-profile-menu" class="dropdown-menu" role="menu">
                        <#-- ---------- Profile Menu Web content ---------- -->
                            <#if role=="Advisor" || role=="Staff" || role=="Faculty">
                                <#if staffProfileMenuWebContentId?has_content>
                                    <#assign journalArticlePreferencesMap={ "groupId" : "${group_id}" , "articleId" : "${staffProfileMenuWebContentId}"
                                        } />
                                    <#assign journalArticlePreferences=freeMarkerPortletPreferences.getPreferences(journalArticlePreferencesMap) />
                                    <@liferay_portlet["runtime"]
                                        defaultPreferences="${journalArticlePreferences}"
                                        portletProviderAction=portletProviderAction.VIEW
                                        portletName="com_liferay_journal_content_web_portlet_JournalContentPortlet"
                                        instanceId="staffProfileMenu" />
                                </#if>
                                <#else>
                                    <#if studentProfileMenuWebContentId?has_content>
                                        <#assign journalArticlePreferencesMap={ "groupId" : "${group_id}" , "articleId" : "${studentProfileMenuWebContentId}"
                                            } />
                                        <#assign journalArticlePreferences=freeMarkerPortletPreferences.getPreferences(journalArticlePreferencesMap) />
                                        <@liferay_portlet["runtime"]
                                            defaultPreferences="${journalArticlePreferences}"
                                            portletProviderAction=portletProviderAction.VIEW
                                            portletName="com_liferay_journal_content_web_portlet_JournalContentPortlet"
                                            instanceId="studentProfileMenu" />
                                    </#if>
                            </#if>
                    </div>
            </#if>
     	   </li>
      	  </ul>
        </nav>
    </div>
</header>
<#if doAsUserId?has_content>
    <section aria-label="Student View Mode" class="student-view-mode">Student View Mode</section>
</#if>
<#if crmStudentView && !crmStudent>
    <section aria-label="Student View Mode" class="student-view-mode">Student View Mode</section>
</#if>

<#assign 
	userFirstName = user.getFirstName()
	userLastName = user.getLastName()
	userName = user.getFullName()
	>
	  
<script>
var userFirstName ="";
var userLastName = "";
var userName = "" ; 
try { 
  userFirstName = `${userFirstName}`;
  userLastName = `${userLastName}`;
  userName = `${userName}`; 
} catch (error) {
    console.error("An error occurred while reading username:", error.message);
} 
var doAsUserId = "${doAsUserId}";
var images_folder = "${images_folder}";
var role = "${role}"; 
var actualRole = "${actualRole}";
var linkCourseConfigSettings = "${linkCourseConfigSettings}"
var crmStudentView = "${crmStudentView?string}";
var crmStudent = "${crmStudent?string}";
var linkCourseListing = "${linkCourseListing}"
var linkWishlist = "${linkWishlist}"
</script>