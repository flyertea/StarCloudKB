import { useLocalStorage, usePreferredLanguages } from '@vueuse/core'
import { computed } from 'vue'
import { createI18n } from 'vue-i18n'

// 导入语言文件
const langModules = import.meta.glob('./lang/*/index.ts', { eager: true }) as Record<string, { default: any }> // 使用 as any

const langModuleMap = new Map<string, Object>()

export const langCode: Array<string> = []

export const localeConfigKey = 'MaxKB-locale'

// 获取浏览器默认语言环境
const languages = usePreferredLanguages()

// 生成语言模块列表
const generateLangModuleMap = () => {
    const fullPaths = Object.keys(langModules)
    fullPaths.forEach((fullPath) => {
        const k = fullPath.replace('./lang', '')
        const startIndex = 1
        const lastIndex = k.lastIndexOf('/')
        const code = k.substring(startIndex, lastIndex)
        langCode.push(code)
        langModuleMap.set(code, langModules[fullPath].default)
    })
}

// 导出 Message
const importMessages = computed(() => {
    generateLangModuleMap()

    const message: Record<string, any> = {} // 使用 as any
    langModuleMap.forEach((value: any, key) => {
        message[key] = value
    })
    return message
})

export const i18n = createI18n({
    legacy: false,
    locale: useLocalStorage(localeConfigKey, 'zh_CN').value || languages.value[0] || 'zh_CN',
    fallbackLocale: 'zh_CN',
    messages: importMessages.value,
    globalInjection: true,
})

export const langList = computed(() => {
    if (langModuleMap.size === 0) generateLangModuleMap()

    const list: any = [] // 使用 as any
    langModuleMap.forEach((value: any, key) => {
        list.push({
            label: value.lang,
            value: key,
        })
    })

    return list
})

// @ts-ignore
export const { t } = i18n.global

export default i18n