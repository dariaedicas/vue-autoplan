import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main/plans-list'
import Login from '@/components/login/login'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Main',
            component: Main
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        }
    ]
})
