<template>
  <div>
    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <div class="page_content">
      <div class="flex">
        <el-button type="primary" size="default" @click="addRoles(state)">添加用户</el-button>
      </div>
      <br />
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column :type="'index'" label="序号" />
        <el-table-column property="roleName" label="角色名" />
        <el-table-column property="roleDesc" label="角色描述" />
        <el-table-column property="address" label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" icon="Edit" circle @click="editRow(scope.row)" />
            <el-button type="danger" icon="Delete" circle @click="deleteRow(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 角色弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="tableState + '角色'">
      <bl-form :form="form" :tableState="tableState" @bl-ref="eluserfrom" />
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
import { getRolesListApi, getUserListApi, rolesAddApi, rolesChangeByIdApi, rolesDelByIdApi } from "@/util/request"
import blForm from "@/components/bl-form.vue"
export default {
  components: { blForm },
  name: "rolesList",

  setup() {
    const data = reactive({
      rolesList: [],
      dialogFormVisible: false,
      form: {},
      fromId: 0,
      sendform: {},
      tableState: "添加"
    })
    const initRoles = () => {
      getRolesListApi().then(res => {
        data.rolesList = res.data
      })
    }
    initRoles()
    const el_userForm = ref()
    const eluserfrom = val => {
      el_userForm.value = val
    }
    eluserfrom()
    const submitForm = formEl => {
      if (data.tableState == "添加") {
        const inputInfo = data.form.input
        const sendform = {
          roleName: inputInfo[0].content,
          roleDesc: inputInfo[1].content
        }
        formEl._rawValue.validate(res => {
          if (!res) return
        })
        rolesAddApi(sendform).then(res => {
          if (res.data) {
            data.dialogFormVisible = false
            initRoles()
          }
        })
      }
      if (data.tableState == "编辑") {
        const inputInfo = data.form.input
        const sendbyIdform = {
          roleName: inputInfo[0].content,
          roleDesc: inputInfo[1].content,
          id: data.fromId
        }
        formEl._rawValue.validate(res => {
          if (!res) return
        })
        rolesChangeByIdApi(sendbyIdform).then(res => {
          if (res.data) initRoles()
          data.dialogFormVisible = false
        })
      }
    }

    const addRoles = state => {
      // console.log(data.userForm.usersInfo);
      data.tableState = "添加"
      //初始化
      data.form.input = [
        { title: "roleName", content: "", CNn: "角色名" },
        { title: "roleDesc", content: "", CNn: "角色描述" }
      ]
      data.dialogFormVisible = true
    }
    const editRow = row => {
      data.tableState = "编辑"
      console.log(row)
      data.dialogFormVisible = true
      data.form.input = [
        { title: "roleName", content: row.roleName, CNn: "角色名" },
        { title: "roleDesc", content: row.roleDesc, CNn: "角色描述" }
      ]
      data.fromId = row.id
    }
    const deleteRow = row => {
      rolesDelByIdApi(row).then(res => {
        if (!res.data) return

        initList()
      })
    }
    return {
      ...toRefs(data),
      initRoles,
      editRow,
      deleteRow,
      addRoles,
      submitForm,
      el_userForm,
      eluserfrom
    }
  }
}
</script>

<style></style>
