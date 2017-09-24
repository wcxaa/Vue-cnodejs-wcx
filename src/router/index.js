import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'home',
        component: () =>
            import ( /* webpackChunkName: "home" */ '@/views/home')
    }, {
        path: '/',
        name: 'layout',
        component: () =>
            import ( /* webpackChunkName: "layout" */ '@/views/layout'),
        children: [{
            path: 'login',
            name: 'login',
            component: () =>
                import ( /* webpackChunkName: "login" */ '@/views/login')
        }, {
            path: 'user/:loginname',
            name: 'user',
            component: () =>
                import ( /* webpackChunkName: "user" */ '@/views/user')
        }, {
            path: 'topicList',
            name: 'topicList',
            component: () =>
                import ( /* webpackChunkName: "topic-list" */ '@/views/topic-list')
        }, {
            path: 'topic/:id',
            name: 'topic',
            component: () =>
                import ( /* webpackChunkName: "topic" */ '@/views/topic')
        }, {
            path: 'addTopic',
            name: 'addTopic',
            component: () =>
                import ( /* webpackChunkName: "add-topic" */ '@/views/add-topic')
        }, {
            path: 'message',
            name: 'message',
            component: () =>
                import ( /* webpackChunkName: "message" */ '@/views/message'),
            meta: {
                requiresAuth: true
            }
        }, {
            path: 'about',
            name: 'about',
            component: () =>
                import ( /* webpackChunkName: "about" */ '@/views/about')
        }]
    }]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.user.userInfo.id) {
            next()
        } else {
            next({
                path: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    }

    next()
})

export default router