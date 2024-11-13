import { createRouter, createWebHistory } from 'vue-router'
import MyBtnVue from "../components/MyBtn.vue";
import LoginVue from "@/components/Login.vue";
import UserVue from "@/components/User.vue";
import RegisterVue from "@/components/Register.vue";
import FavoriteVue from "@/components/Favorite.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: LoginVue
        },
        {
            path: '/register',
            component: RegisterVue
        },
        {
            path: '/user',
            component: UserVue
        },
        {
            path: '/favorites',
            component: FavoriteVue
        }
    ]
})
router.beforeEach((to, from, next)=>{
    if(!sessionStorage.getItem("token") && (to.path !== '/login' && to.path !== '/register')){
        next({path: '/login'})
    } else {
        next()
    }
})

export default router