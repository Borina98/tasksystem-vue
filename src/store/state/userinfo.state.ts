export default {
  state:{
    userInfo:(localStorage.getItem("loginData")&&JSON.parse(localStorage.getItem('loginData') || '{}'))||{}
  },
  mutations:{
    setUserInfo(state:any,uInfo:any){
      state.userInfo=uInfo
    }
  }

}