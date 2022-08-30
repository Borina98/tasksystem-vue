import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Layout from '@/views/Layout/Layout.vue'
import store from '@/store'
const routes: Array<RouteRecordRaw> = [
  //登录页面：
  {
    path:'/login',
    name:'login',

    component:()=>import('../views/Pages/Login.vue')
  },
  {
    path:'/releaseTask/:id',
    name:'releaseTask',
    meta:{
      title:'发布页面'
    },
    component:()=>import('../views/Pages/releaseTask.vue')
  },
  {
    path:'/successfulJump',
    name:'successfulJump',
    component:()=>import('../views/Pages/successfulJump.vue') 
  },

  {
    path: '/',
    name:'layout',
  meta:{
      title:'任务管理系统'
    },
    component:Layout,
    redirect:'/index',
    children:[
      {
        path:'/index',
        name:'index',
        component:()=>import('../views/Pages/index.vue')
      },
      {
        path:'/roles',
        name:'roles',
        
        component:()=>import('../views/Pages/rolesList.vue')
      },
      {
        path:'/user',
        name:'user',
        component:()=>import('../views/Pages/userList.vue') 
      },
      {
        path:'/task',
        name:'task',
        component:()=>import('../views/Pages/TasksList.vue') 
      },
      {
        path:'/goods',
        name:'goods',
        component:()=>import('../views/Pages/GoodsList.vue') 
      },
      {
        path:'/addTask',
        name:'addTask',
        component:()=>import('../views/Pages/addTask.vue')
      },
      {
        path:'/task/:id',
        name:'taskTable',
        component:()=>import('../views/Pages/taskTable.vue') 
      },
      {
        path:'/testpage',
        name:'testPage',
        component:()=>import('../views/Pages/TestPage.vue') 
      },

    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // to.meta.title && (document.title = to.meta.title);
//  const state:any = store.state
//   if(!state.userInfo.userInfo.username){
//     // 未登录跳转
//     if(to.path==='/login'){
//       next()
//       return
//     }
//     next('/login')
//   }else{
//     next()
//   }
next()
})
export default router
