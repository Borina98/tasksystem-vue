<template>
  <div class="login_wrap">
    <div class="form_wrap">
      <el-form ref="formRef" :model="loginData" label-width="120px" class="demo-dynamic">
        <el-form-item
          prop="username"
          label="用户名："
          :rules="[
            {
              required: true,
              message: '用户名必填',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="loginData.username" @blur="isnull" />
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码："
          :rules="[
            {
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="loginData.password" type="password" @blur="isnull" />
        </el-form-item>
        <el-button type="primary" size="default" :disabled="isable" @click="loginToIndex"  >登录</el-button>
        <el-button type="primary" size="default" @click="Regist">注册</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import { loginApi } from "@/util/request"
export default {
  name: "Login",
  setup() {
    const store = useStore()
    const router = useRouter()
    const count = store.state.number.count
    const Data = reactive({
      loginData: {
        username: "",
        password: ""
      },
      isable: true
    })
    const isnull = () => {
      if (Data.username === "" && Data.password === "") {
        Data.isable = true
      } else {
        Data.isable = false
      }
    }

     document.onkeydown = function(e) {            
      let key = window.event.keyCode;            
      if (key== 13) { 
            window.event.preventDefault() //关闭浏览器快捷键
           loginToIndex()
            }
        } 
    const loginToIndex = () => {
       location.replace("/")
      // loginApi(Data.loginData).then(res => {
      //   console.log("登录的返回值：" , res)
      //   if (res.data) {
      //     store.commit("setUserInfo", res.data)
      //     localStorage.setItem("loginData", JSON.stringify(res.data))

      //     // router.replace({
      //     //   path: "/index"
            
      //     // })
      //     location.replace("/")
      //   }
      // })
      
    }
    const Regist = () => {
      router.push({
        path: "/regist"
      })
    }
    //  console.log(store.getters['number/countStatus']);
    // const loginToIndex=()=>{
    //   store.commit('number/setCount',520)
    //   store.dispatch('number/setCountPromise', 500).then(res=>{
    //     alert('成功')
    //   }).catch(err=>{
    //     alert(err)
    //   })
    //   console.log(store.getters['number/countStatus']);
    //   console.log(count,store.state.number.count);
    // }

    return {
      ...toRefs(Data),
      loginToIndex,
      isnull,
      Regist
    }
  }
}
</script>

<style lang="less" scoped>
.login_wrap {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #000c40, #607d8b);
  .form_wrap {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(255, 255, 251);
    padding: 20px 30px 10px 10px;
    border-radius: 5px;
    form {
      text-align: right;
    }
  }
}
</style>
