import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { i18n, langCode, localeConfigKey } from '@/locales/index';
// 导入ElementPlus库
// import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import en from 'element-plus/es/locale/lang/en';
export function useLocale() {
    const { locale } = useI18n({ useScope: 'global' });
    function changeLocale(lang: string) {
        // 如果切换的语言不在对应语言文件里则默认为简体中文
        if (!langCode.includes(lang)) {
            lang = 'zh_CN';
        }

        locale.value = lang;
        useLocalStorage(localeConfigKey, 'zh_CN').value = lang;
        // 根据语言切换 ElementPlus 的语言
        // let elementPlusLang;
        // switch (lang) {
        //     case 'zh_CN':
        //         elementPlusLang = zhCn;
        //         break;
        //     case 'en_US':
        //         elementPlusLang = en;
        //         break;
        //     default:
        //         elementPlusLang = en;
        // }
        // // // 动态更新 ElementPlus 的语言配置
        // ElementPlus.locale(elementPlusLang);
    }

    const getComponentsLocale = computed(() => {
        return i18n.global.getLocaleMessage(locale.value).componentsLocale;
    });

    return {
        changeLocale,
        getComponentsLocale,
        locale,
    };
}
