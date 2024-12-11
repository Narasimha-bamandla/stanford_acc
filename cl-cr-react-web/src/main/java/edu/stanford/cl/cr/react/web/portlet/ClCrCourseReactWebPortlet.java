package edu.stanford.cl.cr.react.web.portlet;

import edu.stanford.cl.cr.react.web.constants.ClCrCourseReactWebPortletKeys;
import edu.stanford.mygsb.cl.ce.api.configuration.CLCEConfiguration;
import edu.stanford.mygsb.cl.ce.api.util.CommonUtil;

import com.liferay.frontend.js.loader.modules.extender.npm.NPMResolver;
import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.dao.orm.PropertyFactoryUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Release;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.service.ReleaseLocalServiceUtil;
import com.liferay.portal.kernel.service.RoleLocalServiceUtil;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

/**
 * @author AsikMD
 */
@Component(immediate = true, configurationPid = "edu.stanford.mygsb.cl.ce.api.configuration.CLCEConfiguration", property = {
		"com.liferay.portlet.display-category=CLCE", "com.liferay.portlet.header-portlet-css=/css/index.css",
		"com.liferay.portlet.instanceable=true", "javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=" + ClCrCourseReactWebPortletKeys.ClCrCourseReactWeb,
		"javax.portlet.resource-bundle=content.Language", "javax.portlet.security-role-ref=power-user,user",
		"javax.portlet.display-name=CL CR Course React Web" }, service = Portlet.class)
public class ClCrCourseReactWebPortlet extends MVCPortlet {

	protected CLCEConfiguration clceConfiguration;

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		clceConfiguration = ConfigurableUtil.createConfigurable(CLCEConfiguration.class, properties);
	}

	private static final Log log = LogFactoryUtil.getLog(ClCrCourseReactWebPortlet.class);

	@Override
	public void doView(RenderRequest renderRequest, RenderResponse renderResponse)
			throws IOException, PortletException {

		try {

			ThemeDisplay themeDisplay = (ThemeDisplay) renderRequest.getAttribute(WebKeys.THEME_DISPLAY); // TODO
			final HttpServletRequest httpServletRequest = PortalUtil.getHttpServletRequest(renderRequest);
			final HttpServletRequest originalServletRequest = PortalUtil.getOriginalServletRequest(httpServletRequest);
			HttpSession session = originalServletRequest.getSession();
			CommonUtil.setCurrentAcademicYear(clceConfiguration, session);
			long userId = themeDisplay.getUserId();
			String univId = themeDisplay.getUser().getScreenName();
			long groupId = themeDisplay.getScopeGroupId();
			boolean isStudentView = themeDisplay.isImpersonated();
			boolean isAdminAsStudent = false;
			session.setAttribute("univId", univId);
			session.setAttribute("userId", userId);
			session.setAttribute("realUnivId", univId);
			session.setAttribute("realUserId", userId);
			session.setAttribute("groupId", groupId);
			session.setAttribute("doAsUserId", themeDisplay.getDoAsUserId());
			boolean isAdmin = themeDisplay.getPermissionChecker().isOmniadmin();
			if (isAdmin) {
				session.setAttribute("role", "admin");
			} else {
				String roleNameInfo = CommonUtil.getUserRole(userId, themeDisplay.getLocale());
				session.setAttribute("role", roleNameInfo);
			}
			if (isStudentView) {
				session.setAttribute("studentViewEnabled", true);
				Role adminRole = RoleLocalServiceUtil.fetchRole(themeDisplay.getCompanyId(), "Administrator");
				long realUserId = themeDisplay.getRealUserId();
				isAdminAsStudent = UserLocalServiceUtil.hasRoleUser(adminRole.getRoleId(), realUserId);
				String realScreenName = UserLocalServiceUtil.getUser(realUserId).getScreenName();
				if (!isAdminAsStudent) {
					String actualRole = CommonUtil.getUserRole(themeDisplay.getRealUserId(), themeDisplay.getLocale());
					// session.setAttribute("role", actualRole);
					if (actualRole.equalsIgnoreCase("AO")) {
						isAdminAsStudent = true;
					}
				}
				session.setAttribute("realUnivId", realScreenName);
				session.setAttribute("realUserId", realUserId);
				log.info("Screen Name: " + realScreenName);
				log.info("isAdminAsStudent Name: " + isAdminAsStudent);

			}
			log.info("Screen Name: " + univId);
			log.info("isStudentView Name: " + isStudentView);
			renderRequest.setAttribute("isStudentView", isStudentView);
			renderRequest.setAttribute("isAdmin", isAdminAsStudent);
			renderRequest.setAttribute("mainRequire", _npmResolver.resolveModuleName("cl-cr-react-web") + " as main");
			super.doView(renderRequest, renderResponse);
		} catch (Exception e) {

		}

	}

	@Reference
	private NPMResolver _npmResolver;

}