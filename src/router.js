import VueRouter from 'vue-router'
import Vue from 'vue'
import Home from './components/Coupon'
Vue.use(VueRouter)

export default new VueRouter({
    routes:[
        {
            path:'/',
            redirect: '/home'
        },
        {
            path:'/home',
            component:Home,

        }
    ]
})
