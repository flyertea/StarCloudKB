import Clipboard from 'vue-clipboard3'
import { MsgSuccess, MsgError } from '@/utils/message'
import { t } from '@/locales' // 导入国际化配置

/*
  复制粘贴
*/
export async function copyClick(info: string) {
  const { toClipboard } = Clipboard()
  try {
    await toClipboard(info)
    MsgSuccess(t('copySuccess')) // 使用国际化函数
  } catch (e) {
    console.error(e)
    MsgError(t('copyFailed')) // 使用国际化函数
  }
}