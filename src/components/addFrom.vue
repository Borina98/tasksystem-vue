<template>
  <el-config-provider :locale="locale">
    <div class="main-form"> 
      <el-form class="dataAddForm" ref="dataAddForm" label-position="top" :model="form" label-width="80px">
        <el-row v-for="(ts, key) in form.dataInfo" :key="key">
          <el-col :span="24">
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
                <span v-show="showaddress">

                  {{ ts.content }}

                </span>
                <div class="flex-v">
                  <elui-china-area-dht @change="onChange($event, ts)" />
                  <el-input v-model="ts.addr2" placeholder="详细地址" clearable @change="onChange2($event, ts)"></el-input>
                </div>
                
              </div>
              <div v-else>
                <el-input v-model="ts.content" placeholder="" clearable></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-config-provider>
</template>

<script>
import { reactive, toRefs, nextTick, ref } from "vue-demi"
import { ElConfigProvider } from "element-plus"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import { EluiChinaAreaDht } from "elui-china-area-dht"
export default {
  name: "addFrom",
  components: {
    [ElConfigProvider.name]: ElConfigProvider, //添加组件
    EluiChinaAreaDht
  },
  props: {
    form: {
      type: Object
    },
    showaddress: {
      type: Boolean,
      default: false
    }
  },
  emits: ["bl-ref"],
  setup(props, { emit }) {
    const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat

    const dataAddForm = ref()
    const exputform = () => {
      emit("bl-ref", dataAddForm)
    }
    exputform()
    const data = reactive({
      options: [
        { value: 1, text: "请输入" },
        { value: 2, text: "请输入数字类型" },
        { value: 3, text: "时间" },
        { value: 4, text: "请输入性别" },
        { value: 5, text: "请输入电话" },
        { value: 6, text: "请输入地址" }
      ],
      locale: zhCn,
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
      }
    })

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

    const validateRulse = (rule, content, callback, n) => {
      const mobileReg = /^(\+?0?86\-?)?1[3-9]\d{9}$/

      const verify = (reg, message) => {
        if (reg.test(content) === true) {
          callback()
        } else {
          callback(new Error(message))
        }
      }

      const flag = props.form.dataInfo[n]
      if (flag.type == 5) {
        if (flag.isnull) {
          if (flag.content === undefined || flag.content === "") {
            callback(new Error("此项为必填项！"))
          } else {
            callback()
          }
        } else {
          if (flag.content === "") {
            callback()
          } else verify(mobileReg, "手机格式错误")
        }
      }
      if (flag.isnull) {
        if (flag.content === undefined || flag.content === "") {
          callback(new Error("此项为必填项！"))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const onChange = (e, ts) => {
      const one = chinaData[e[0]]
      const two = chinaData[e[1]]
      const three = chinaData[e[2]]
      ts.addr = one.label + two.label + three.label
      if (ts.addr != "" && ts.addr2 != undefined && ts.addr2 != "") {
        ts.content = ts.addr + ts.addr2
      }
    }
    const onChange2 = (e, ts) => {
      if (e != "" && ts.addr != undefined) {
        ts.content = ts.addr + ts.addr2
      }
      console.log(e, ts)
    }
    const checkType = (content, type, ts) => {
      nextTick(() => {
        ts.content = content.replace(/[^\d]/g, "")
      })
    }

    const typetxt = type => {
      for (let i = 0; i < data.options.length; i++) {
        if (data.options[i].value == type) {
          return data.options[i].text
        }
      }
    }

    return {
      ...toRefs(data),
      onChange,
      typetxt,
      checkType,
      shortcuts,
      props,
      validateRulse,
      onChange2,
      dataAddForm,
      exputform
    }
  }
}
</script>

<style  lang="less" scoped>
.dataAddForm {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  width: 300px;
  margin: 10px auto;
  padding: 20px;
}

/deep/ .el-form-item__content {
  display: flex;

  flex-direction: column;
  align-items: normal;
}
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 100%;
}
.flex-v {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
}
.el-radio-group {
  float: left;
  margin-left: 10px;
}
</style>
