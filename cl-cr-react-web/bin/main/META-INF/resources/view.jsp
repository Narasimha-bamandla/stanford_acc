<%@page import="com.liferay.portal.kernel.util.Validator"%>
<%@ include file="/init.jsp" %>

<div id="<portlet:namespace />-root"></div>

<aui:script require="<%= mainRequire %>">
	main.default('<portlet:namespace />-root');
</aui:script>
<%
String userName=themeDisplay.getUser().getFirstName();

boolean isStudentView=false;
boolean isAdmin=false;

if(Validator.isNotNull(request.getAttribute("isStudentView"))){
	isStudentView=(boolean)request.getAttribute("isStudentView");
}

if(Validator.isNotNull(request.getAttribute("isAdmin"))){
	isAdmin=(boolean)request.getAttribute("isAdmin");
}
%>
<script>
var userName = "" ; 
try {  
	userName=`<%=userName%>`;
} catch (error) {
    console.error("An error occurred while reading username:", error.message);
} 
var isStudentView=<%=isStudentView%>;
var isAdmin=<%=isAdmin%>;

</script>