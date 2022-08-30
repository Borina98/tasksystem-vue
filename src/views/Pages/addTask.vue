<template>
  <div id="addTask">
    <el-breadcrumb separator="|">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>创建任务表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="page_content">
      <div class="box-hit" ><span style="color: red ;">* </span>请在此处创建你的任务列表
      </div>
      <div class="add-form">

        <el-form :model="tableInfo" :rules="rules" label-position="right" label-width="100px"
                 ref="dataAddForm">
          <el-row>

            <el-col :span="24">
              <el-form-item label="任务名称:" prop="asname">
                <el-input placeholder="请输入任务名称" v-model="tableInfo.asname" />

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="描述:" prop="description">
                <el-input type="textarea" v-model="tableInfo.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="el-form-item_setbutton">
 
            <el-row v-for="(item,index) in tableInfo.tableData" class="li_block" :key="index">
              <el-col :span="24">
                <el-form-item :label="'第'+(index+1)+'列:'" :prop="'tableData.'+index+'.rowAsName'" :rules="rules.check">
                  <div class="table_info_space">
                    <el-input placeholder="请输入列名" v-model="item.rowAsName" @input="checkValue(item)"></el-input>
                    <el-select placeholder="请选择类型" v-model="item.type">
                      <el-option
                          :key="item.value"
                          :label="item.text"
                          :value="item.value"
                          v-for="item in options">
                      </el-option>
                    </el-select>
                    <el-checkbox v-model="item.isnull">非空</el-checkbox>
                  </div>
                  <div style="width: 30%;text-align: right;margin-right: 5px">
                  <el-button :span="2" @click="deleteRow(index)" type="danger">删除</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="li_block">
              <el-col :span="24">
                <el-button @click="handleAddrow()">添加一行</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <div class="dialog-footer right">
          <el-button @click="returnIndex()">返回</el-button>
          <el-button @click="handleCreateTable()" type="primary">创建</el-button>
        </div>
      </div>
    </div>
  </div>


</template>
<script>
import {reactive, toRefs,nextTick } from "vue";
import {createTableApi} from "@/util/request";
import {ElMessage} from "element-plus"
import UserList from "./userList";
import router from "@/router";
import { pinyin } from 'pinyin-pro';
import   "@/util/v_noemoij";

export default {

  name: 'addTask',
  components: {UserList},
  setup() {
    const data = reactive({
      isnull: [],
      options: [
        {value: 1, text: "默认"},
        {value: 2, text: "数字"},
        {value: 3, text: "时间"},
        {value: 4, text: "性别"},
        {value: 5, text: "电话"},
        {value: 6, text: "地址"}
      ],
      rowAsNames: [],
      rowNames: [],
      tableData: [],
      rowType: [],
      tableInfo: {
        asname:'',
        description:'',
        newtime:'',
        tableData:[]
      }, //表单数据
      indexRow: 1,
      rules: { //校验规则
        asname: [{
          required: true,
          message: '任务名称必须填写',
          trigger: 'blur'
        }],
        check:[{
          required: true,
          message: '列名必须填写',
          trigger: 'blur'
        }]
      },
    })
    const handleAddrow = () => {
      let tableRowName = "row" + data.indexRow;
      data.tableInfo.tableData.push({
        rowAsName: '',
        isnull: false,
        type: data.options[0].value,
        row_name: tableRowName
      }),
          data.indexRow++;
    }
    handleAddrow()
    handleAddrow()
    //删除行
    const deleteRow = (index) => {
      data.tableData.splice(index, 1)
    }
    //创建表格到数据库
    const handleCreateTable = () => {
      let date = new Date();
      data.tableInfo.newtime = date;
      data.tableInfo.userid = 1;
      const tabledbname=pinyin(data.tableInfo.asname, { toneType: 'none' }).replace(/\s+/g,"").replace(/[^a-zA-Z]/g,'').substring(0,8)
      data.tableInfo.table_name = tabledbname+"_" + date.getFullYear() + "0" + (date.getMonth()+1) + "" + date.getDate()+'_'+Math.floor(Math.random() * (100 - 1 + 1)) + 1
      createTableApi(data.tableInfo).then((res) => {
        if (res.code == 20011) {
          ElMessage.success("创建成功！");
          router.push('/task')
        } else if (res.code == 20010) {
          ElMessage.error("创建失败！");
        } else {
          ElMessage.error(res.data.msg);
        }
      })

    }
    const returnIndex = () => {
      location.href = '/pages/index.html';
    }
    // 检查输入框内容是否包含特殊符号
    const checkValue = (value) => {
      const regStr = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im

      // 获取输入的最后一个字符
      let temp = value.rowAsName.charAt(value.rowAsName.length - 1)
      console.log(temp)
      // 对其进行正则校验
      temp = temp ? temp.replace(regStr, '') : ''
      // 把输入框的值的最后一个值由temp替代
      nextTick(()=>{
   // value.rowAsName=value.rowAsName.replace(/[^u4E00-u9FA5|d|a-zA-Z|rns,.?!，。？！…—&$=()-+/*{}[]]|s/g,"");
        value.rowAsName = value.rowAsName.replace(value.rowAsName.charAt(value.rowAsName.length - 1), temp)
    //    value.rowAsName=value.rowAsName.replace(/ [^~\x22]+/g,"")
      })


    }

    return {
      ...toRefs(data),
      handleAddrow, deleteRow, handleCreateTable, returnIndex,checkValue
    }
  }
}
</script>

<style lang="less" scoped>
.li_block {
  padding: 5px;
  box-shadow: 0 -1px 0 0 #f5f6f7;
}
.box-hit{
  font-size: 0.8px;text-align: left;opacity: 0.8;
  margin-left: 25px;
  margin-bottom: 15px;
}
.el-form-item {
  align-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
  /deep/ .el-select .el-input__inner {
    width: 30px;
  }
  /deep/ .el-form-item__content {
    flex-wrap: nowrap;
    align-items: center;
  }
}
.table_info_space{
  text-align: left;
  * {
    margin-right: 5px;
  }
}


.dialog-footer.right {
  text-align: right;
  margin-right: 5px;
  padding: 5px;
}
.add-form{
  width: 70%;
}
</style>