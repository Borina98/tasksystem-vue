import axios from 'axios'
import {ElLoading,ElMessage} from 'element-plus'
import store from '@/store'

let loadingObj:any
let state:any = store.state
// 创建实例cretae创建axios实例
const Service = axios.create({
  timeout:8000,
  baseURL:"http://39.101.76.240:8081",
  headers:{
    'content-type':'application/json;charset=utf-8',
    'Authorization':state.userInfo.userInfo.token
  }
})
//请求拦截-增加loading，对请求做统一处理
Service.interceptors.request.use(config=>{
   loadingObj=ElLoading.service({
    lock: true,
    text: '加载...',
    fullscreen:true,
    background: 'rgba(0, 0, 0, 0.4)',
  })
  return config
})
//相应拦截-对返回值统一处理
Service.interceptors.response.use(response=>{

    loadingObj.close()

     

  const data = response.data
  const str = new String(data.code)
  const state= str.charAt(4)
  if(state=="1"&&data.msg!="成功查询数据"&&data.msg!="成功按id查询"){
    ElMessage.success(data.msg)
  }else if(state=="0"){
    ElMessage.error(data.msg||"服务器出错")
  }

return data
},error=>{

    loadingObj.close()

  ElMessage({
    message:'服务器错误',
    type:'error',
    duration:2000
  })    
})


export const get =(config:any)=>{
  return Service({
      ...config,
      method:'get',
      params:config.data
  })
}


export const post =(config:any)=>{
  return Service({
      ...config,
      method:'post',
      data:config.data
  })
}

export const put =(config:any)=>{
  return Service({
      ...config,
      method:'put',
      data:config.data
  })
}


export const rDelete =(config:any)=>{
  return Service({
      ...config,
      method:'delete',
      data:config.data
  })
}



