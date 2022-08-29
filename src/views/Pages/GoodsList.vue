<template>
  <div>
    <!-- 面包屑 -->




    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品</el-breadcrumb-item>
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
      </div>
      <br />
      <!-- 表格 -->
      <div>
           <el-scrollbar height="450px">
        <el-table ref="multipleTableRef" :data="GoodsList" style="width: 100%">
          <el-table-column :type="'index'" label="序号" :index="indexMethod" />
          <el-table-column property="goods_name" label="商品名称" min-width="300px" />
          <el-table-column property="goods_price" label="价格" />
          <el-table-column property="goods_number" label="数量" />
          <el-table-column property="goods_weight" label="重量" />
          <el-table-column property="goods_state" label="商品状态" />
          <el-table-column property="add_time" label="添加时间" />
          <el-table-column property="upd_time" label="更新时间" />
          <el-table-column property="hot_mumber" label="热销品数量" show-overflow-tooltip />
          <el-table-column property="is_promote" label="是否是热销品" align="center" />
          <el-table-column property="address" label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" icon="Edit" circle @click="editUser(scope.row)" />
              <el-button type="danger" icon="Delete" circle @click="deleteUser(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
          </el-scrollbar>
        <div style="margin-top: 20px" class="buttom_div">
          <el-pagination
            v-model:currentPage="searchParams.pagenum"
            v-model:page-size="searchParams.pagesize"
            :default-current-page="10"
            :page-sizes="[6, 10, 20, 30, 100]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue"
import { getGoodsListApi } from "@/util/request"
export default {
  name: "GoodsList",
  setup() {
    const data = reactive({
      searchParams: {
        query: "",
        pagenum: 1,
        pagesize: 6
      },
      GoodsList: [],
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
      getGoodsListApi(data.searchParams).then(res => {
        if (res.data) {
          console.log(res.data)
          data.GoodsList = res.data.goods
          data.total = res.data.total
        }
      })
    }

    initList()
    return {
      ...toRefs(data),
      initList,
      changeSwitch,
      editUser,
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
