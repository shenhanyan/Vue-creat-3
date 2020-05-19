import Vue from 'vue'
// 应用的reset.css
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 引入Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// ES6模块化语法测试

import './test/es-module/test2'
import './test/es-module/test4'
// 引入自定义全局样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 加载所有的svg图片
import '@/icons' // icon
// 加载权限控制的模块
import '@/permission' // permission control
// 引入用于判断当前用户是否有特定按钮权限的函数
import { hasBtnPermission } from './utils/permission'
// 引入所有接口请求函数
import * as API from '@/api'
// 引入自定义的带文本提示的按钮
import HintButton from '@/components/HintButton'
// 引入三级分类选择的组件
import CategorySelector from '@/components/CategorySelector'

// 注册全局组件
Vue.component('HintButton', HintButton)
Vue.component('CategorySelector', CategorySelector)

Vue.prototype.$hasBP = hasBtnPermission
Vue.prototype.$API = API // 将包含所有接口请求函数的对象让所有组件可见

/**
 * 加载mock接口 (已预弃用)
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 声明使用ElementUI(所有组件语法都注册上了)
Vue.use(ElementUI)

// 不输出当前不是生产环境运行的提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
