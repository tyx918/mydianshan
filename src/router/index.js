import Vue from 'vue'
import VueRouter from 'vue-router'

const login = () => import('components/Login')
const home = () => import('components/Home')
const welcome = () => import('components/Welcome')
const users = () => import('components/user/users')

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        redirect:"/login"
    },
    {
        path:'/login',
        component:login
    },
    {
        path:'/home',
        component:home,
        redirect:'/welcome',
        // 在home的路由下
        children: [
            {
                path:'/welcome',
                component:welcome,
            },
            {
                path:'/users',
                component:users
            }
        ]
    }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫,控制页面访问权限   
router.beforeEach((to, from ,next) =>{
    //to 将要访问的路径
    //from 从哪个页面跳转而来
    //next表示是一个函数，表示放行 next()放行 next('/路径')跳转到对应路径
    //
    if(to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login');
    next();
});

export default router
