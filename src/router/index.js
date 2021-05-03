import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Permission from '../components/right/Permission.vue'
import Role from '../components/right/Role.vue'
import Category from '../components/courseManage/Category.vue'
import Course from '../components/courseManage/Course.vue'
import Department from '../components/courseManage/Department.vue'
import Teacher from '../components/user/Teacher.vue'
import Supervisor from '../components/user/Supervisor.vue'
import Student from '../components/user/Student.vue'
import EvaluationItem from '../components/evaluation/EvaluationItem.vue'
// import { component } from 'vue/types/umd'

Vue.use(Router)

const routes = [
  { path: '/' , redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', 
    component: Home, 
    redirect: '/welcome',
    children: [ 
      { path: '/welcome', component: Welcome }, 
      { path: '/user', component: Users },
      { path: '/teacher', component: Teacher },
      { path: '/supervisor', component: Supervisor },
      { path: '/student', component: Student },
      { path: '/permission', component: Permission },
      { path: '/role', component: Role },
      { path: '/category', component: Category},
      { path: '/course', component: Course},
      { path: '/department', component: Department},
      { path: '/evaluationItem', component: EvaluationItem}
    ] 
  }
]

const router = new Router({
  routes
})

/**
 * 挂载路由导航守卫
 * to代表目标路径
 * from代表来源路径
 * next是一个函数，next()代表直接放行至to路径,next('/direct')表示强制跳转路径
 */
router.beforeEach((to, from, next) => {
  //若用户将访问登录页则直接放行，否则获取token，查看用户是否登录
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token');
  //若token不存在则跳转到login登陆页面
  if (!token) {
    return next('/login')
  }
  //若token存在则用户已经登陆，直接放行
  next()

});

export default router
