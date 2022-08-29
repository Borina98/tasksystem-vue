<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-header class="common-header flex-float">
          <div class="flex">
            <img src="../../assets/logo.png" alt="" class="logo" />
            <h1 class="tltie">任务管理系统</h1>
          </div>
          <el-button type="danger" @click="LoginOut">退出</el-button>
        </el-header>
        <el-container>
          <el-aside width="200px" class="common-aside">
            <el-menu background-color="none" text-color="#fff" :router="true">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><Avatar /></el-icon>
                  <span>账号管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/user">账号列表</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><TakeawayBox /></el-icon>
                  <span>角色管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/roles">角色列表</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
                            <el-sub-menu index="3">
                <template #title>
                  <el-icon><Goods /></el-icon>
                  <span>商品管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/goods">商品列表</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
               <el-sub-menu index="4">
                <template #title>
                 <el-icon><TakeawayBox /></el-icon>
                  <span>任务管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/task">任务列表</el-menu-item>
                </el-menu-item-group>
                 <el-menu-item-group>
                   <el-menu-item index="/addTask">创建任务表</el-menu-item>
                 </el-menu-item-group>
              </el-sub-menu>
            </el-menu>

            <!-- <router-link to="/index">角色列表 </router-link>
            <router-link to="/user">用户列表</router-link> -->
          </el-aside>
          <el-container>
            <el-main>
              <router-view></router-view>
            </el-main>
        
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex"
import { useRouter } from "vue-router"
export default {
  name: "Layout",
  setup() {
    const router = useRouter()
    const store = useStore()
    const LoginOut = () => {
      localStorage.removeItem("loginData")
      store.commit("setUserInfo", {})
      router.push({ path: "/login" })
    }
  
    return {
      LoginOut
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 90vh;
}
.common-header {
  background: linear-gradient(135deg, #536976, #292e49);
}
.common-aside {
  background: linear-gradient(135deg, #536976, #292e49);
}
.logo {
  width: 50px;
}
h1.tltie {
  color: rgb(255, 255, 255);
}
.el-main{
  background: #f8f8f8;
}
</style>
