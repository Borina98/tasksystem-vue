<template>
  <div>
    asdas
    <add-from :form="form" @bl-ref="elfromRef" />
    <el-button type="primary" @click="submitForm(dataAddForm)">确定</el-button>
  </div>
</template>

<script>
import AddFrom from "@/components/addFrom.vue"
import { reactive, ref, toRefs } from "vue-demi"
export default {
  components: {
    AddFrom
  },
  name: "testPage",

  setup() {
    const data = reactive({
      form: {
        dataInfo: [
          {
            rowAsName: "但是好像挺好玩的",
            isnull: true,
            row_name: "row1",
            type: 1,
            content: "123"
          },
          {
            rowAsName: "第二列",
            isnull: true,
            row_name: "row2",
            type: 3,
            content: "123"
          },
          {
            rowAsName: "我是谁我不懂",
            isnull: true,
            row_name: "row3",
            type: 2,
            content: "asdf"
          },
          {
            rowAsName: "测试性别",
            isnull: true,
            row_name: "row4",
            type: 4,
            content: "asdf"
          },
          {
            rowAsName: "手机号",
            isnull: true,
            row_name: "row5",
            type: 5,
            content: "13030899288"
          },
          {
            rowAsName: "前往地址",
            isnull: false,
            row_name: "row6",
            type: 6,
            content: "asf"
          }
        ]
      }
    })
    const submitForm = formEl => {
      console.log(formEl)
      formEl.value.validate(res => {
        if (!res) return

        console.log("成功")
      })
    }
    const dataAddForm = ref()
    const elfromRef = val => {
      dataAddForm.value = val
    }
    elfromRef()
    const showdata = () => {
      console.log(data.form)
    }
    showdata()
    return {
      ...toRefs(data),
      elfromRef,
      dataAddForm,
      submitForm
    }
  }
}
</script>

<style></style>
