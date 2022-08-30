<template>
  <div class="successfulJump">
      <h3>您已成功填写表单</h3>
      <el-button type="primary" size="small" @click="back">重新填写</el-button>
      <el-button type="primary" size="small" @click="login">登录查看</el-button>
  </div>
</template>

<script>
import router from '@/router'
export default {
  name:"successfulJump"
  ,
  setup(){
    const back=()=>{
        router.go(-1)
    }
    document.title="成功填写"
    return {
      back
    }
  }
}
</script>

<style>

</style>