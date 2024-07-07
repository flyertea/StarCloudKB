// 导入全局样式
import '@/styles/index.scss'

// 导入ElementPlus库
import ElementPlus from 'element-plus'
// 导入ElementPlus的所有图标
import * as ElementPlusIcons from '@element-plus/icons-vue'
// 导入中文语言包
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 导入英文语言包
import en from 'element-plus/es/locale/lang/en'

// 创建Vue应用
import { createApp } from 'vue'
// 导入全局状态管理器
import { store } from '@/stores'
// 导入主题配置
import theme from '@/theme'
// 导入自定义指令
import directives from '@/directives'
// 导入应用主组件
import App from './App.vue'
// 导入路由配置
import router from '@/router'
// 导入所有组件
import Components from '@/components'
// 导入多语言配置
import i18n from './locales'
// 导入Markdown编辑器配置
import { config } from 'md-editor-v3'

// 导入全屏扩展库
import screenfull from 'screenfull'

// 导入KaTeX数学公式渲染库
import katex from 'katex'
// 引入KaTeX的CSS样式
import 'katex/dist/katex.min.css'

// 导入图像裁剪库
import Cropper from 'cropperjs'
// 引入Cropper的CSS样式
import 'cropperjs/dist/cropper.css'

// 导入流程图绘制库
import mermaid from 'mermaid'

// 导入代码高亮库
import highlight from 'highlight.js'
// 引入代码高亮的样式
import 'highlight.js/styles/atom-one-dark.css'

// 配置Markdown编辑器的扩展功能
config({
  editorExtensions: {
    highlight: {
      instance: highlight
    },
    screenfull: {
      instance: screenfull
    },
    katex: {
      instance: katex
    },
    cropper: {
      instance: Cropper
    },
    mermaid: {
      instance: mermaid
    }
  }
})

// 创建Vue应用实例
const app = createApp(App)
// 使用全局状态管理器
app.use(store)
// 使用自定义指令
app.use(directives)

// 注册ElementPlus的所有图标为Vue组件
for (const [key, component] of Object.entries(ElementPlusIcons)) {
  app.component(key, component)
}
// 使用ElementPlus，并设置中文语言
app.use(ElementPlus, {
  locale: en
})

// 使用主题配置
app.use(theme)

// 使用路由
app.use(router)
// 使用多语言
app.use(i18n)
// 使用所有组件
app.use(Components)
// 将应用挂载到DOM元素上
app.mount('#app')

// 导出应用实例
export { app }
