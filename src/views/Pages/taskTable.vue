<template>
  <div id="app">
    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/task' }">任务列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tableInfo.asname }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="page_content">
      <div class="flex">
        <div class="mt-4 input_box seach">
          <el-input v-model="searchParams.query" placeholder="关键字" class="input-with-select">
            <template #prepend>
              <el-select v-model="searchParams.row" placeholder="选择列" style="width: 115px">
                <el-option :label="item.rowAsName" :value="item.row_name" v-for="(item, index) in dataInfo" :key="index" />
              </el-select>
            </template>
            <template #append>
              <el-button @click="getByIdAll">
                <el-icon>
                  <Search />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        <el-button type="primary" class="butT" @click="handleCreate()">以此为模板新建任务</el-button>
        <el-button type="primary" class="butT" @click="releaseTask()">发布</el-button>
        <el-button type="primary" class="butT" @click="downloadFile()">下载Excel</el-button>
      </div>
      <div class="content-header">
        <h1>{{ tableInfo.asname }}</h1>
        <span>创建于：{{ tableInfo.newtime }}</span>
        <span>描述：{{ tableInfo.description }}</span>
      </div>
      <el-table :data="dataList" stripe highlight-current-row>
        <el-table-column type="index" align="center" label="序号"></el-table-column>

        <el-table-column :label="item.rowAsName" align="center" v-for="(item, index) in dataInfo" :key="index">
          <template #default="scope">
            <span>{{ scope.row[item.row_name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" @click="handleUpdate(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="add-form">
        <el-dialog title="编辑检查项" v-model="dialogFormVisible4Edit">
          <el-form ref="dataEditForm" :model="formData" label-position="top" label-width="100px">
            <el-row v-for="(item, index) in formData" :key="item.id">
              <el-col :span="20">
                <el-form-item :label="index + 1 + '、' + item.rowAsName">
                  <div v-if="item.type == 3">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="item.content" style="width: 100%"></el-date-picker>
                  </div>
                  <div v-else-if="item.type == 4">
                    <el-radio-group v-model="item.content">
                      <el-radio label="男">男</el-radio>
                      <el-radio label="女">女</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-else>
                    <el-input v-model="item.content" />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible4Edit = false">取消</el-button>
            <el-button type="primary" @click="handleEdit()">确定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, nextTick, reactive, toRefs } from "vue"
import { useRouter } from "vue-router"
import { getChildTableByIdAllApi, updateChildTableByTaskIdApi } from "@/util/request"
import { ElLoading } from "element-plus"
import { timeTrans } from "@/util/disposeTimes"
export default {
  name: "taskTable",
  setup() {
    const router = useRouter() // 第一步
		const cryptid = router.currentRoute.value.params.id
		const { proxy } = getCurrentInstance()


    const data = reactive({
      sendUpdateData: {},
      id: [],
      tableInfo: [],
      dataInfo: [],
      searchParams: {
        query: "",
        pagenum: 1,
        pagesize: 8,
        row: "row1"
      },
      dataList: [], //当前页要展示的列表数据
      formData: [], //表单数据
      dialogFormVisible: false, //控制表单是否可见
      dialogFormVisible4Edit: false, //编辑表单是否可见
      rowIndex: 0
    })

    const getByIdAll = () => {
			       const id=  proxy.$AES_Decrypt(cryptid+'')
      getChildTableByIdAllApi(id, data.searchParams).then(res => {
        console.log(res)
        data.dataInfo = res.data.childTableInfo
        data.tableInfo = res.data.tableInfo
        data.dataList = res.data.data
      })
    }
    const handleDelete = () => {}
    const handleUpdate = (row, index) => {
      data.dialogFormVisible4Edit = true
      data.formData = []
      data.rowIndex = index
      for (let i in data.dataInfo) {
        data.formData.push({
          id: 20220 + i,
          rowAsName: data.dataInfo[i].rowAsName,
          isnull: data.dataInfo[i].isnull,
          type: data.dataInfo[i].type,
          row_name: data.dataInfo[i].row_name,
          content: row[data.dataInfo[i].row_name]
        })
      }
      console.log(data.formData)
    }


    const handleEdit = () => {
      for (let i = 0; i < data.formData.length; i++) {
        const element = data.formData[i]
        if (element.type == 3) {
          data.formData[i].content = timeTrans(element.content, 2)
        }
      }
      const sendUpdateData = {
        taskid: data.tableInfo.id,
        rowid: data.dataList[data.rowIndex].id,
        formData: data.formData
      }
      updateChildTableByTaskIdApi(sendUpdateData).then(res => {
				        getByIdAll()
      })

      data.dialogFormVisible4Edit = false
    }
   

 
    const releaseTask = () => {
    
      console.log(cryptid)
      router.push({
        name: "releaseTask",
        params: {
          id: cryptid
        }
      })
		}
		   getByIdAll()
    return {
      ...toRefs(data),
      getByIdAll,
      handleDelete,
      handleUpdate,
      handleEdit,
      releaseTask
    }
  }
}
</script>

<style scoped lang="less">
.content-header {
  display: flex;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  h1 {
    font-size: 1.5rem;
    opacity: 1;
  }
  font-size: 0.8rem;
  opacity: 0.8;
}
</style>
