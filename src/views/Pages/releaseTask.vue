<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <div class="content-header">
        <h1>{{ tableInfo.asname }}</h1>
        <span>创建于：{{ tableInfo.newtime }}</span>
        <span>描述：{{ tableInfo.description }}</span>
      </div>
      <div class="app-container">
        <div class="box"></div>
        <div class="add-form">
          <!--写入表格-->
          <el-form class="dataAddForm" ref="dataAddForm" label-position="top" :model="form" label-width="80px">
            <el-row v-for="(ts, key) in form.dataInfo" :key="key">
              <el-col :span="12">
                <el-form-item :label="key + 1 + '、' + ts.rowAsName + '： '" :prop="'dataInfo.' + key + '.content'" :rules="rules.check">
                  <div v-if="ts.type == 3">
                    <el-date-picker v-model="ts.content" type="datetime" placeholder="选择日期" :shortcuts="shortcuts" />
                  </div>
                  <div v-else-if="ts.type == 4">
                    <el-radio-group v-model="ts.content">
                      <el-radio label="男">男</el-radio>
                      <el-radio label="女">女</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-else-if="ts.type == 2">
                    <el-input v-model="ts.content" placeholder=" 请输入数字" @input="checkType(ts.content, ts.type, ts)" clearable></el-input>
                  </div>
                  <div v-else-if="ts.type == 5">
                    <el-input v-model="ts.content" placeholder="请输入手机号码" maxlength="11" @input="checkType(ts.content, ts.type, ts)" clearable></el-input>
                  </div>
                  <div v-else-if="ts.type == 6">
                    <div class="flex">
                      <elui-china-area-dht @change="onChange($event, ts)" />
                      <el-input v-model="ts.addr2" placeholder="详细地址" clearable></el-input>
                    </div>
                  </div>
                  <div v-else>
                    <el-input v-model="ts.content" placeholder="" clearable></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="dialog-footer">
              <el-button type="primary" @click="handleAdd(dataAddForm)">完成</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script>
import { getCurrentInstance, nextTick, reactive, ref, toRefs } from "vue"
import { getChildTableByIdInfoApi, saveChildByTaskApi } from "@/util/request"
import { useRouter } from "vue-router"
import { ElConfigProvider, ElMessage } from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import { timeTrans } from "@/util/disposeTimes"
import { EluiChinaAreaDht } from "elui-china-area-dht"

export default {
  name: "releaseTask",
  components: {
    [ElConfigProvider.name]: ElConfigProvider, //添加组件
    EluiChinaAreaDht
  },

  setup() {
    const route = useRouter() // 第一步

    const { proxy } = getCurrentInstance()

    const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
    const cryptid = route.currentRoute.value.params.id
    const id = proxy.$AES_Decrypt(cryptid + "")
    const data = reactive({
      tableInfo: [],
      form: {
        dataInfo: []
      },
      formData: {}, //表单数据
      rules: {
        check: [
          {
            trigger: "blur",
            validator: (rule, content, callback) => {
              const t = rule.field
              let n = t.substr(t.indexOf(".") + 1, t.length)
              n = n.substr(0, n.lastIndexOf("."))
              validateRulse(rule, content, callback, n)
            }
          }
        ]
      },
      options: [
        { value: 1, text: "请输入" },
        { value: 2, text: "请输入数字类型" },
        { value: 3, text: "时间" },
        { value: 4, text: "请输入性别" },
        { value: 5, text: "请输入电话" },
        { value: 6, text: "请输入地址" }
      ],
      locale: zhCn
    })
    const validateRulse = (rule, content, callback, n) => {
      const userReg = /^[a-zA-Z0-9_-]{4,16}$/
      const pwd = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,10}/
      const mobileReg = /^(\+?0?86\-?)?1[3-9]\d{9}$/
      const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/

      const verify = (reg, message) => {
        if (reg.test(content) === true) {
          callback()
        } else {
          callback(new Error(message))
        }
      }
      const empytverify = message => {
        if (content == "") {
          callback(new Error(message))
        }
      }
      const flag = data.form.dataInfo[n]
      if (flag.type == 5) {
        verify(mobileReg, "手机格式错误")
      }
      if (flag.isnull === true) {
        if (flag.content === undefined || flag.content === "") {
          callback(new Error("此项为必填项！"))
        }
      }
    }
    const getTableInfo = () => {
      getChildTableByIdInfoApi(id).then(res => {
        console.log(res)
        data.tableInfo = res.data.tableInfo
        data.form.dataInfo = res.data.childTableInfo
        for (let i = 0; i < data.form.dataInfo.length; i++) {
          data.form.dataInfo[i].content = ""
        }
        console.log(data.form.dataInfo)
      })
    }
    const typetxt = type => {
      for (let i = 0; i < data.options.length; i++) {
        if (data.options[i].value == type) {
          return data.options[i].text
        }
      }
    }
    const checkType = (content, type, ts) => {
      nextTick(() => {
        ts.content = content.replace(/[^\d]/g, "")
      })
    }

    const onChange = (e, ts) => {
      const one = chinaData[e[0]]
      const two = chinaData[e[1]]
      const three = chinaData[e[2]]
      ts.addr = one.label + two.label + three.label
    }
    const shortcuts = [
      {
        text: "今天",
        value: new Date()
      },
      {
        text: "昨天",
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return date
        }
      },
      {
        text: "一周以前",
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          return date
        }
      }
    ]
    const dataAddForm = ref()
    const handleAdd = formEl => {
      if(!formEl) return
      console.log(formEl)
      formEl.validate(res => {
        if (res == false) return
      })

      const sendData = []
      const sendInfo = { id: id }

      for (let i = 0; i < data.form.dataInfo.length; i++) {
        const element = data.form.dataInfo[i]
        if(element.isnull&&element.content=="") return

        if (element.type == 6) element.content = element.addr + element.addr2
        if (element.type == 3) {
          if (element.content != "") element.content = timeTrans(element.content, 2)
        }
        sendData.push({
          row_name: element.row_name,
          content: element.content
        })
      }
      console.log(data.form.dataInfo)
      const datas = { sendData, sendInfo }

      saveChildByTaskApi(datas).then(res => {
        console.log(res)
      })
    }
    getTableInfo()
    return {
      ...toRefs(data),
      getTableInfo,
      typetxt,
      checkType,
      onChange,
      shortcuts,
      handleAdd,
      validateRulse,
      dataAddForm
    }
  }
}
</script>

<style></style>
