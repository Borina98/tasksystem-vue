<template>
  <div>
    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page_content">
      <div class="box">
        <div class="flex">
          <div class="mt-4 input_box seach">
            <el-input v-model="searchParams.query" placeholder="搜索关键字" class="input-with-select">
              <template #append>
                <el-button @click="getAll">
                  <el-icon>
                    <Search />
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <el-button type="primary" class="butT" @click="addTask()">新建收集任务</el-button>
        </div>
        <br />
        <el-table :data="dataList" style="width: 100%">
          <el-table-column type="index" align="center" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column :label="item" align="center" v-for="(item, in2) in dataHeader.name" :key="in2">
            <template #default="scope">
              <div v-if="item == '表名'">
                <router-link :to="show(scope.row.id)">{{ scope.row[dataHeader.propname[in2 + 1]] }}</router-link>
              </div>
              <div v-else>
                <span>{{ scope.row[dataHeader.propname[in2 + 1]] }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" icon="Expand" circle @click="handleUpdate(scope.row)" />
              <el-button type="danger" icon="Delete" circle @click="handleDelete(scope.row)" />
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
          <el-dialog title="表格详情" v-model="dialogFormVisible4Edit">
            <div class="left">
              <div class="paddings">
                <div class="head_table">
                  <span class="table_title head_table">{{ formData.asname }}</span>
                  <span class="head_table_right_date">{{ formData.newtime }}</span>
                </div>
                <div class="head_table descript" style="margin-top: 15px">{{ formData.description }}</div>
              </div>
            </div>
            <div class="right">
              <div class="paddings">
                <div class="r_header">操作</div>
                <el-button @click="showTable(formData.id)">查看</el-button>

                <el-button @click="releaseTable(formData.id)">发布</el-button>

                <el-button @click="downloadTable(formData.id)">下载excel文件</el-button>

                <el-button @click="editTable(formData.id)">编辑</el-button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs } from "vue"
import { getTaskListApi, taskFindById, DeleteAndDropTaskTableById } from "@/util/request"
import blForm from "@/components/bl-form.vue"

import { disposeTime } from "@/util/disposeTimes"
import router from "@/router"
import { ElMessage, ElMessageBox } from "element-plus"

export default {
  components: {
    blForm
  },
  name: "TaskList",
  setup() {
				const { proxy } = getCurrentInstance()
	
    const data = reactive({
      dataHeader: {
        name: ["表名", "时间"],
        propname: []
      },
      searchParams: {
        query: "",
        pagenum: 1,
        pagesize: 8
      },
      total: 0,
      dataList: [], //当前页要展示的列表数据
      formData: {}, //表单数据
      dialogFormVisible4Edit: false //编辑表单是否可见
    })

    const indexMethod = index => {
      index = index + 1 + (data.searchParams.pagenum - 1) * data.searchParams.pagesize
      return index
    }
    const handleSizeChange = val => {
      data.searchParams.pagesize = val
      getAll()
    }
    const handleCurrentChange = val => {
      data.searchParams.pagenum = val
      getAll()
    }
    const getAll = () => {
      getTaskListApi(data.searchParams).then(res => {
        console.log(res)
        data.dataList = res.data.userTables

        for (const r in data.dataList) {
					data.dataList[r].newtime = disposeTime(data.dataList[r].newtime)
					
        }
        for (const resKey in data.dataList[0]) {
          if (resKey === "id" || resKey === "asname" || resKey === "newtime") data.dataHeader.propname.push(resKey)
        }
        data.total = res.data.total
        console.log(data.dataList)
      })
    }
    getAll()
    const handleUpdate = row => {
      taskFindById(row.id).then(res => {
        data.formData = res.data
        console.log(res)
        data.formData.newtime = disposeTime(data.formData.newtime)
        data.dialogFormVisible4Edit = true
      })
    }
    const handleDelete = row => {
      ElMessageBox.confirm("此操作将会删除该任务表，谨慎操作！", "警告", { confirmButtonText: "确认", cancelButtonText: "取消", type: "warning" })
        .then(() => {
          DeleteAndDropTaskTableById(row.id).then(res => {
            console.log(res)
            getAll()
          })
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除"
          })
        })
    }
    const addTask = () => {
      router.push("/addTask")
    }
    const showTable = id => {
		const cryptid = proxy.$AES_Encrypt(id + "")
      router.push({
        name: "taskTable",
        params: {
          id: cryptid
        }
      })
		}
		const show=(id)=>{
			const cryptid = proxy.$AES_Encrypt(id + "")
			const go =({
				 name: "taskTable",
        params: {
          id: cryptid
        }
			})
       return go
		}
    return {
      ...toRefs(data),
      getAll,
      handleUpdate,
      addTask,
      handleDelete,
      handleCurrentChange,
      handleSizeChange,
      indexMethod,
      showTable,show
    }
  }
}
</script>

<style lang="less" scoped>
.input_box {
  width: 200px;
  margin-right: 10px;
}

.add-form {
  /deep/ .el-dialog__body {
    padding-top: 15px;
    display: flex;
  }

  .head_table {
    text-align: left;
  }

  span.table_title.head_table {
    font-size: 1.7rem;
  }

  .descript {
    font-size: 1rem;
    opacity: 0.95;
  }

  span.head_table_right_date {
    font-size: 0.8rem;
    color: rgba(62, 62, 68, 0.68);
  }

  .paddings {
    padding: 2px 8px 2px 8px;
  }

  .left {
    width: 48.5%;
  }

  .right {
    position: relative;
    width: 48.5%;
    text-align: right;

    .r_header {
      font-size: 1.5rem;
      text-align: left;
      margin-left: 20px;
    }

    .el-button {
      width: 100%;
      margin-left: 12px;
    }
  }

  .right:before {
    position: absolute;
    content: "";
    height: 100%;
    width: 2px;
    left: 0;
    opacity: 0.8;
    background: #000c40;
  }
}
</style>
