import { asyncRoutes, constantRoutes } from "@/router";
import { setPermission, getPermission } from "@/utils/auth";

const state = {
    routes: [],
    addRoutes: [],
    hasGetRules: getPermission() || false
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        let concatRoutes = constantRoutes.concat(routes);
        state.routes = concatRoutes;
    }
};

/**
 * 判断当前角色是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role));
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = [];
    routes.forEach(route => {
        const tmp = {...route };
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles);
            }
            res.push(tmp);
        }
    });

    return res;
}

const actions = {
    /**
     * 根据角色信息动态生成路由列表
     * @param roles
     */
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            let accessedRoutes;
            if (roles.includes("admin")) {
                //超级管理员
                accessedRoutes = asyncRoutes || [];
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
            }
            state.hasGetRules = true;
            setPermission(state.hasGetRules);
            commit("SET_ROUTES", accessedRoutes);
            resolve(accessedRoutes);
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
