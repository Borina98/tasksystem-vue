<template>
  <div id="releaseTask">
    <div class="content-header">
      <h1>{{ tableInfo.asname }}</h1>
      <span>创建于：{{ tableInfo.newtime }}</span>
      <span>描述：{{ tableInfo.description }}</span>
    </div>
    <div class="app-container">
      <div class="box"></div>
      <div class="add-form">
        <!--写入表格-->
        <add-from :form="form" @bl-ref="elfromRef" class="main-form" />

        <div class="dialog-footer">
          <el-button type="primary" @click="handleAdd(dataAddForm)">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, ref, toRefs } from "vue"
import { getChildTableByIdInfoApi, saveChildByTaskApi } from "@/util/request"
import { useRouter } from "vue-router"
import { timeTrans } from "@/util/disposeTimes"
import AddFrom from "@/components/addFrom.vue"
import { ElMessage } from "element-plus"
import router from '@/router'

export default {
  name: "releaseTask",
  components: {
    AddFrom
  },

  setup() {
    const route = useRouter() // 第一步

    const { proxy } = getCurrentInstance()
    const dataAddForm = ref()
    const elfromRef = val => {
      //加载来自addform的表单验证
      dataAddForm.value = val
    }
    elfromRef()

    const cryptid = route.currentRoute.value.params.id
    const id = proxy.$AES_Decrypt(cryptid + "")
    const data = reactive({
      tableInfo: [],
      form: {
        dataInfo: []
      }
    })
   
   
    const getTableInfo = () => {
      getChildTableByIdInfoApi(id).then(res => {
        data.tableInfo = res.data.tableInfo
        data.form.dataInfo = res.data.childTableInfo
        for (let i = 0; i < data.form.dataInfo.length; i++) {
          data.form.dataInfo[i].content = ""
        }
        document.title=data.tableInfo.asname+"收集页"
      })
    }

    const handleAdd = formEl => {
      console.log(formEl)
      formEl.value.validate(res => {
        for (const i in data.form.dataInfo) {
          const element = data.form.dataInfo[i]
          if (element.type == 6 && element.content == "")
            ElMessage({
              message: "请正确输入地址",
              type: "warning"
            })
        }
        if (!res) return

        const sendData = []
        const sendInfo = { id: id }

        for (let i = 0; i < data.form.dataInfo.length; i++) {
          const element = data.form.dataInfo[i]
          if (element.type == 6) element.content = element.addr + element.addr2
          if (element.type == 3) {
            if (element.content != "") element.content = timeTrans(element.content, 2)
          }
          sendData.push({
            row_name: element.row_name,
            content: element.content
          })
        }
        const datas = { sendData, sendInfo }

        saveChildByTaskApi(datas).then(res => {
          if (res.code == 20011) {
            ElMessage({
              message: "成功提交信息，正在跳转页面",
              type: "success"
            })
            router.push({
              path: "/successfulJump"
            })
          } else {
            ElMessage.error("服务器错误")
          }
        })
      })
    }
    getTableInfo()
    return {
      ...toRefs(data),
      getTableInfo,
      handleAdd,
      dataAddForm,
      elfromRef
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .main-form {
  background: #f8f8f8;
  form {
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 2px 1px 1px 1px rgb(171, 184, 198);
  }
}
.content-header {
  background: url(@/assets/img/headimage.jpg) center;
  h1 {
    padding-top: 30px;
    margin-top: 0;
  }
  padding-bottom: 12px;
}
#releaseTask {
  background: #f8f8f8;
}
</style>
