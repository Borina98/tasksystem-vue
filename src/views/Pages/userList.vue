<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账号列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 白色内容区域 -->
    <div class="page_content">
      <div class="flex">
        <div class="mt-4 input_box seach">
          <el-input v-model="searchParams.query" placeholder="搜索关键字" class="input-with-select">
            <template #append>
              <el-button @click="initList"
                ><el-icon><Search /></el-icon
              ></el-button>
            </template>
          </el-input>
        </div>
        <el-button type="primary" size="default" @click="addUser(state)">添加用户</el-button>
      </div>
      <br />
      <!-- 表格 -->
      <div>
        <el-table ref="multipleTableRef" :data="userList" style="width: 100%">
          <el-table-column :type="'index'" label="序号" :index="indexMethod" />
          <el-table-column label="用户名" property="username" />
          <el-table-column property="email" label="邮箱" />
          <el-table-column property="mobile" label="电话" />
          <el-table-column property="role_name" label="角色" show-overflow-tooltip />
          <el-table-column property="mg_state" label="状态" align="center">
            <template #default="scope">
              <div class="flex" style="justify-content: center">
                <el-switch v-model="scope.row.mg_state" class="ml-2" @click="changeSwitch(scope.row)" style="--el-switch-on-color: #54a0ff; --el-switch-off-color: #dff9fb" />
              </div>
            </template>
          </el-table-column>
          <el-table-column property="address" label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" icon="Edit" circle @click="editUser(scope.row)" />
              <el-button type="danger" icon="Delete" circle @click="deleteUser(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination v-model:currentPage="searchParams.pagenum" 
          v-model:page-size="searchParams.pagesize" :default-current-page='10'
          :page-sizes="[6,10, 20, 30, 100]" :background="true" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <!-- 添加用户弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="tableState + '用户'">
      <bl-form :form="form" :tableState="tableState" @bl-ref="elfromRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(el_userForm)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue"
import { userAddApi, getUserListApi, changeUserStateApi, UserChangeByIdApi, deleteUserByIdApi } from "@/util/request"
import blForm from "@/components/bl-form.vue"
import { ElMessage } from "element-plus"
export default {
  components: { blForm },
  name: "userList",
  setup() {
    const data = reactive({
      searchParams: {
        query: "",
        pagenum: 1,
        pagesize: 6
      },
      userList: [],
      dialogFormVisible: false,
      form: {},
      fromId: 0,
      sendform: {},
      tableState: "",
      total: 0
    })

    const indexMethod = index => {
      index = index + 1 + (data.searchParams.pagenum - 1) * data.searchParams.pagesize
      return index
    }
    const changeSwitch = row => {
      changeUserStateApi(row).then(res => {
        if (res.data) {
          initList()
        }
      })
    }
    const el_userForm = ref()
    const elfromRef = val => {
      el_userForm.value = val
    }
    elfromRef()

    const submitForm = formEl => {
      if (data.tableState == "添加") {
        const sendform = {
          username: data.form.input[0].content,
          password: data.form.input[1].content,
          email: data.form.input[2].content,
          mobile: data.form.input[3].content
        }
        formEl._rawValue.validate(res => {
          if (!res) return
        })
        userAddApi(sendform).then(res => {
          if (res.data) {
            data.dialogFormVisible = false
            initList()
          }
        })
      }

      if (data.tableState == "编辑") {
        const sendbyIdform = {
          email: data.form.input[0].content,
          mobile: data.form.input[1].content,
          id: data.fromId
        }
        formEl._rawValue.validate(res => {
          if (!res) return
        })
        UserChangeByIdApi(sendbyIdform).then(res => {
          console.log(res)
          if (res.data) initList()
          data.dialogFormVisible = false
        })
      }
    }

    const addUser = state => {
      // console.log(data.userForm.usersInfo);
      data.tableState = "添加"
      //初始化
      data.form.input = [
        { title: "username", content: "", CNn: "用户名" },
        { title: "password", content: "", CNn: "密码" },
        { title: "email", content: "", CNn: "邮箱" },
        { title: "mobile", content: "", CNn: "电话" }
      ]
      data.dialogFormVisible = true
    }
    const editUser = row => {
      data.tableState = "编辑"
      console.log(row)
      data.dialogFormVisible = true
      data.form.input = [
        { title: "email", content: row.email, CNn: "邮箱" },
        { title: "mobile", content: row.mobile, CNn: "电话" }
      ]
      data.fromId = row.id
    }
    const deleteUser = row => {
      deleteUserByIdApi(row).then(res => {
        if (!res.data) return
        initList()
      })
    }

    const handleSizeChange = val => {
      data.searchParams.pagesize = val
      initList()
    }
    const handleCurrentChange = val => {
      data.searchParams.pagenum = val
      initList()
    }

    const initList = () => {
      getUserListApi(data.searchParams).then(res => {
        if (res.data) {
          data.userList = res.data.users
          data.total = res.data.total
        }
      })
    }

    initList()
    return {
      ...toRefs(data),
      initList,
      addUser,
      submitForm,
      el_userForm,
      changeSwitch,
      editUser,
      elfromRef,
      handleSizeChange,
      handleCurrentChange,
      deleteUser,
      indexMethod
    }
  }
}
</script>

<style lang="less" scoped>
.input_box {
  width: 200px;
  margin-right: 10px;
}
</style>
