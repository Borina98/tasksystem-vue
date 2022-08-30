<template>
  <div>
    <div class="page">
      <h1>欢迎来到我的网站</h1>
     
      <br />
    </div>
  </div>
</template>

<script >
import { reactive, toRefs, computed, ref } from "vue"
import { userAddApi, UserChangeByIdApi } from "@/util/request"
import BlForm from "@/components/bl-form.vue"
export default {
  components: { BlForm },
  setup() {
    const el_userForm = ref()
    const validate = (rule, content, callback) => {
      const t = rule.field


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
      switch (n) {
        case "0":
          empytverify("请输入用户名")
          verify(userReg, "4到16位（字母，数字，下划线）")
          break
        case "1":
          empytverify("请输入密码")
          verify(pwd, "6~10位的数字、字母、特殊字符")
          break
        case "2":
          verify(emailReg, "请输入邮箱的格式")
          break
        case "3":
          verify(mobileReg, "请输入正确的手机的格式")
          break
      }
    }
    const data = reactive({
      form: {
        input: [
          { n: "usern", content: "", CNn: "用户名" },
          { n: "password", content: "", CNn: "密码" },
          { n: "email", content: "", CNn: "邮箱" },
          { n: "mobile", content: "", CNn: "电话" }
        ]
      },
      tableState: "添加用户",
      rules: {
        checkUrl: [{ trigger: "blur", validator: validate }]
      },
      dialogFormVisible: true
    })

    const submitForm = formEl => {
      if (data.tableState == "添加用户") {
        const sendform = {}
        const inputInfo = data.form.input
        sendform.username = inputInfo[0].content
        sendform.password = inputInfo[1].content
        sendform.email = inputInfo[2].content
        sendform.mobile = inputInfo[3].content
        // validate
        console.log(el_userForm)
        console.log(formEl)

        formEl.validate(res => {
          if (!res) return
          userAddApi(data.sendform).then(res => {
            if (res.data) {
              data.dialogFormVisible = false
              data.form.input = [
                { title: "username", content: "", CNn: "用户名" },
                { title: "password", content: "", CNn: "密码" },
                { title: "email", content: "", CNn: "邮箱" },
                { title: "mobile", content: "", CNn: "电话" }
              ]
              initList()
            }
          })
          // alert("表单验证通过")
        })
      }
      if (data.tableState == "编辑用户") {
        const sendbyIdform = {}
        const inputInfo = data.form.input
        sendbyIdform.email = inputInfo[0].content
        sendbyIdform.mobile = inputInfo[1].content
        sendbyIdform.id = data.fromId
        formEl.validate(res => {
          console.log(data.tableState)
          if (!res) return

          UserChangeByIdApi(sendbyIdform).then(res => {
            if (res.data) initList()
            data.dialogFormVisible = false
          })
        })
      }
    }
    return {
      ...toRefs(data),
      // validate,
      // rulesCheck,
      el_userForm,
      submitForm
    }
  }
}
</script>

<style>
.page h1 {
  margin: 50px auto;
  text-align: center;
}
</style>
