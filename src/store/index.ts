import { createStore } from 'vuex'
import number from './state/num_state'
import userInfo from './state/userinfo.state'
export default createStore({
  
  modules:{
     number,userInfo
    }
})
