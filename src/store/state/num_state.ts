const numstate={
  namespaced:true,
  //全局状态初始值
  state: {
   count:1
 },
 //计算state的值，获取对应的值
 getters: {
   countStatus(state:any){
     return state.count>=1
   }
 },
 //更新状态state的唯一方法-commit mutations
 mutations: {
   setCount(state:any,num:any){
     state.count=num
   }
 },
 //可以异步操作，可以返回promise，改数据还是在mutations中更改
 actions: {
   setCountPromise(context:any,num:any){
     return new Promise((resolve,reject)=>{
           if(num>100){
             reject('值不能大于100')
           }else{
             context.commit('setCount',num)
            //  resolve()
           }
     })
   }
 },
 //当数据较多的时候可以放到模块中分类
 modules: {
 }
}

export default numstate