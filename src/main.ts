import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhLang from 'element-plus/lib/locale/lang/zh-cn'; // 引入官方的中文国际化
import locale from './assets/locale/cn'; // 引入自己的

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'

//全局密码加密
import { AES_Encrypt, AES_Decrypt } from '@/util/aes'


const app=createApp(App)
 
app.config.globalProperties.$AES_Encrypt = AES_Encrypt //全局加密
app.config.globalProperties.$AES_Decrypt = AES_Decrypt //全局解密

// axios.defaults.baseURL='/api'
app.use(ElementPlus, {
  locale: { ...zhLang, ...locale }, // 使用本地的 locale 去覆盖官方的 zhLang
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus).use(store).use(router).mount('#app')
