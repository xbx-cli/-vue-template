import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * constantRoutes 基础路由
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

]

/**
 * asyncRoutes 异步路由 -- 根据角色返回路由列表
 */
export const asyncRoutes = [{
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: () =>
                import ('@/views/home/index'),
            meta: {
                title: '首页',
                icon: 'el-icon-s-home',
                roles: ['admin', 'operator', 'cwAdmin', 'zhAdmin']
            }
        }]
    },
    // 404 page must be placed at the end !!!
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]

let baseURL = '/'

if (process.env.NODE_ENV == 'production' && process.env.VUE_APP_PROD) { // 线上环境
    baseURL = 'xkMui'
} else if (process.env.NODE_ENV == 'production' && process.env.VUE_APP_SANDBOX) { // 沙盒环境
    baseURL = 'xkPreMui'
} else if (process.env.NODE_ENV == 'production' && process.env.VUE_APP_DEVELOP) { // 测试环境
    baseURL = 'xkTestMui'
}

const createRouter = () =>
    new Router({
        mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: constantRoutes,
        base: baseURL
    })

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
