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
        <div style="margin-top: 20px">
          <el-pagination
            v-model:currentPage="searchParams.pagenum"
            v-model:page-size="searchParams.pagesize"
            :default-current-page="10"
            :page-sizes="[8, 16, 24, 50, 100]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <div class="add-form">
          <el-dialog title="编辑内容" v-model="dialogFormVisible4Edit">
            <add-from  :form="form" @bl-ref="elfromRef" :showaddress="true" />
            <div class="dialog-footer">
              <el-button @click="dialogFormVisible4Edit = false">取消</el-button>
              <el-button type="primary" @click="handleEdit(dataAddForm)">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>

</template>

<script>
import { getCurrentInstance, nextTick, reactive, ref, toRefs } from "vue"
import { useRouter } from "vue-router"
import { getChildTableByIdAllApi, updateChildTableByTaskIdApi } from "@/util/request"
import { ElLoading } from "element-plus"
import { timeTrans } from "@/util/disposeTimes"
import addFrom from '@/components/addFrom.vue'
export default {
  components: { addFrom },
  name: "taskTable",
  setup() {
    const router = useRouter() 
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

      form: {         
        dataInfo: []
      },
      dialogFormVisible4Edit: false, //编辑表单是否可见
      rowIndex: 0,
      total:2
    })
    const handleSizeChange = val => {
      data.searchParams.pagesize = val
      getByIdAll()
    }
    const handleCurrentChange = val => {
      data.searchParams.pagenum = val
      getByIdAll()
    }
    const getByIdAll = () => {
      const id = proxy.$AES_Decrypt(cryptid + "")
      getChildTableByIdAllApi(id, data.searchParams).then(res => {
        data.dataInfo = res.data.childTableInfo
        data.tableInfo = res.data.tableInfo
        data.dataList = res.data.data
      })
    }
    const handleDelete = () => {}
    const handleUpdate = (row, index) => {
      data.dialogFormVisible4Edit = true
      data.form.dataInfo = []
      data.rowIndex = index
      for (let i in data.dataInfo) {
        data.form.dataInfo.push({
          rowAsName: data.dataInfo[i].rowAsName,
          isnull: data.dataInfo[i].isnull,
          row_name: data.dataInfo[i].row_name,
          type: data.dataInfo[i].type,
          content: row[data.dataInfo[i].row_name]
        })
      }
      console.log(data.form);
    }
    const dataAddForm = ref()
    const elfromRef = val => {
      dataAddForm.value = val
    }
    elfromRef()

    const handleEdit = formEl => {
      // console.log(formEl);
      formEl.value.validate(res => {

        if (!res) return

        for (let i = 0; i < data.form.dataInfo.length; i++) {
          const element = data.form.dataInfo[i]
          if (element.type == 3) {
            data.form.dataInfo[i].content = timeTrans(element.content, 2)
          }
        }
        const sendUpdateData = {
          taskid: data.tableInfo.id,
          rowid: data.dataList[data.rowIndex].id,
          formData: data.form.dataInfo
        }
        updateChildTableByTaskIdApi(sendUpdateData).then(res => {
          getByIdAll()
        })
        data.dialogFormVisible4Edit = false
      })
    }

    const releaseTask = () => {
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
      releaseTask,
      elfromRef,
      dataAddForm,handleSizeChange,handleCurrentChange
    }
  }
}
</script>

<style scoped lang="less">
.content-header {
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
