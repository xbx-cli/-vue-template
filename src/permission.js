import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; // 进度条样式
import { getToken, getPermission } from "@/utils/auth"; // 获取token
import getPageTitle from "@/utils/get-page-title";
NProgress.configure({ showSpinner: false }); // 进度条 配置

const whiteList = ["/login", "/add", "/forgotPassword"]; // 免登录白名单

router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start();
  // 设置页面标题
  document.title = getPageTitle(to.meta.title);
  // 确定用户是否登录
  const hasToken = getToken();
  // 根据角色获取权限信息
  const roles = store.getters.roles;
  console.log(roles, 'roles')
  if (hasToken) {
    if (to.path !== "/login") {
      //是否动态生成路由列表
      const hasGetRules = getPermission();
      console.log(hasGetRules, 'hasGetRules')
      if (!hasGetRules) {
        try {
          // 获取用户信息
          // 角色列表必须是数组 such as: ['admin'] or ,['developer','editor']
          // 根据角色动态生成路由表
          getNewRouterList(roles, to, next);
        } catch (error) {
          // 删除令牌  转到登录页面重新登录
          await store.dispatch("user/logout");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          // next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else {
        if (to.matched && to.matched.length) {
          next();
        } else {
          getNewRouterList(roles, to, next);
        }
      }
    } else {
      if (roles.length === 0) {
        // 角色列表为空，用户待审核状态
        next();
      } else {
        // 已登录，重定向到首页
        next({ path: "/" });
      }
      NProgress.done();
    }
  } else {
    // 没有登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 允许访问 免登录白名单里面的页面
      next();
    } else {
      // 没有访问权限 转到登录页面
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

/**
 * 获取路由列表
 * @param roles
 * @param to
 * @param next
 */
const getNewRouterList = async (roles, to, next) => {
  // 动态添加路由
  const accessedRoutes = await store.dispatch(
    "permission/generateRoutes",
    roles
  );
  // 确保路由添加完毕
  router.addRoutes(accessedRoutes);
  // set the replace: true, 导航不会留下历史记录
  next({ ...to, replace: true });
};

router.afterEach(() => {
  // 进度条加载完成
  NProgress.done();
});
