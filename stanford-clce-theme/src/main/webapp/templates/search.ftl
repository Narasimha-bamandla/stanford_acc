 <div class="search-box">
     <div class="search-combo  ">
         <div id="combo1-label" class="combo-label"></div>
         <div aria-controls="listbox1" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="combo1-label" id="combo1" class="search-combo-input combo-input" role="combobox" tabindex="0">All</div> 
         <div class="combo-menu" role="listbox" id="listbox1" aria-labelledby="combo1-label" tabindex="-1">
             <div role="option" id="combo1-0" class="combo-option  " aria-selected="false" >All</div>
             <div role="option" id="combo1-1" class="combo-option" aria-selected="false">Core</div>
             <div role="option" id="combo1-2" class="combo-option" aria-selected="false">Electives</div>
         </div>
     </div> 
     <div class="search-input" role="search">
         <label class="search-label" for="searchbar">Search </label>
         <input type="text" id="searchbar" aria-control="results-hidden-container" autocomplete="off" placeholder="Search by Subject, Catalog Number, Title, or Instructor" />
         <button type="button" id="searchbtn" title="Search" class="sdfd-btn md-btn ghost-btn i-btn " role="button"><svg
                 xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                 <path d="M12.2708 10.6723L9.9824 8.38356C10.6272 7.51106 11.0191 6.43625 11.0191 5.26027C11.0191 2.35195 8.65486 0 5.75957 0C2.85163 0 0.5 2.36459 0.5 5.26027C0.5 8.1686 2.86428 10.5205 5.75957 10.5205C6.92274 10.5205 8.01006 10.1286 8.88244 9.48367L11.1709 11.7724C11.3226 11.9241 11.5249 12 11.7272 12C11.9295 12 12.1317 11.9241 12.2835 11.7724C12.5743 11.4816 12.5743 10.9758 12.2708 10.6723ZM2.05511 5.26027C2.05511 3.22445 3.71137 1.56797 5.74693 1.56797C7.78248 1.56797 9.43874 3.22445 9.43874 5.26027C9.43874 7.2961 7.78248 8.95258 5.74693 8.95258C3.71137 8.96523 2.05511 7.30875 2.05511 5.26027Z"
                     fill="#585754"></path>
             </svg></button>
         <div class="search-results-popup" id="results-container">
             <div id="nodata" class="alert text-center mb-0">No matched data found</div>
             <div id="loading" class="alert text-center mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" stroke="#fff" style="&#10;    stroke: #8C1515;&#10;">
                     <g fill="none" fill-rule="evenodd">
                         <g transform="translate(1 1)" stroke-width="2">
                             <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                             <path d="M36 18c0-9.94-8.06-18-18-18">
                                 <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
                             </path>
                         </g>
                     </g>
                 </svg></div>
             <ul id="results-list"></ul>
             <a id="see-all-link" role="region" aria-live="polite" class="sdfd-btn sm-btn ghost-btn see-all"></a>
         </div>
         <div id="results-hidden-container" role="region" aria-live="polite"></div>
     </div>
 </div>
 <script>
var search_Results_URL = "";
var search_results_academic_year = "";
var searchUrl;
var searchType;
var searchInputValue;
var urlDoAsUserId;
var url_doAsUserId; 
<#if searchResultsURL ? has_content >
    search_Results_URL = "${searchResultsURL}"; 
    </#if>  
<#if searchResultsAcademicYear ? has_content >
    search_results_academic_year = "${searchResultsAcademicYear}"; 
    </#if>  
 </script>
 <!-- inject:js -->
 <script src="${javascript_folder}/search.js" type="text/javascript"></script>
 <!-- endinject -->