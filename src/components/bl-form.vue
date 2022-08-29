<template>
  <div>
    <!-- 通过v-for的方法写表单 :model的form一定要与循环的对象一致或父子关系，
          规则验证form的:rules可不用，但是form-item的:prop一定要定位到input上可以通过拼接的方法
          ，上面的rules=写法很多还可以通过自定义:rules=rules.checkUrl的方法到js中
          定义 checkUrl: [{ trigger: "blur", validator: validateUrl }] 
          然后写一个带有callback的函数 const validateUrl = (rule, content, callback)进行调用 callback出去??详情请见index.vue中的代码-->

    <el-form :model="form" label-position="right" label-width="80px" :inline="true" ref="el_userForm">
      <el-row>
        <el-col :span="12" v-for="(item, index) in form.input" :key="index">
        <el-form-item :label="item.CNn + ':'" :prop="'input.' + index + '.content'" :rules="rules.check">
            <el-input v-model="item.content" autocomplete="off" :placeholder="'请输入' + item.CNn" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, defineEmits } from "vue"
export default {
  name: "bl-form",
  props: {
    form: {
      type: Object
    }
  },

  setup(props, { emit }) {
    //将表单验证的规则导出去
    const el_userForm = ref()
    const exputform = () => {
      emit("bl-ref", el_userForm)
    }

    exputform()
    const validateRulse = (rule, content, callback, inpu) => {
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
        if (content === "") {
          callback(new Error(message))
        }
      }
      if (inpu.title === "username") {
        empytverify("用户名必填")
        verify(userReg, "4到16位（字母，数字，下划线）")
      } else if (inpu.title === "password") {
        empytverify("密码必填")
        verify(pwd, "6~10位的数字、字母、特殊字符")
      } else if (inpu.title === "email") {
        empytverify("邮箱必填")
        verify(emailReg, "请输入邮箱的格式")
      } else if (inpu.title === "mobile") {
        empytverify("手机号码必填")
        verify(mobileReg, "请输入正确的手机的格式")
      } else if (inpu.title === "roleName") {
        empytverify("角色名必须填写")
      } else {
        callback()
      }
    }

    const data = reactive({
      rules: {
        check: [
          {
            trigger: "blur",
            validator: (rule, content, callback) => {
              const t = rule.field
              let n = t.substr(t.indexOf(".") + 1, t.length)
              n = n.substr(0, n.lastIndexOf("."))
              validateRulse(rule, content, callback, props.form.input[n])
            }
          }
        ]
      }
    })
    return {
      ...toRefs(data),
      validateRulse,
      props,
      exputform,
      el_userForm
    }
  }
}
</script>

<style></style>
