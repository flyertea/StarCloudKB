import { ElMessageBox, ElMessage } from 'element-plus'
import { t } from '@/locales' // 导入国际化配置
export const MsgSuccess = (message: string) => {
  ElMessage.success({
    message: message,
    type: 'success',
    showClose: true,
    duration: 1500
  })
}

export const MsgInfo = (message: string) => {
  ElMessage.info({
    message: message,
    type: 'info',
    showClose: true,
    duration: 1500
  })
}

export const MsgWarning = (message: string) => {
  ElMessage.warning({
    message: message,
    type: 'warning',
    showClose: true,
    duration: 1500
  })
}

export const MsgError = (message: string) => {
  ElMessage.error({
    message: message,
    type: 'error',
    showClose: true,
    duration: 1500
  })
}

/**
 * 删除知识库
 * @param 参数 message: {title, description,type}
 */

export const MsgConfirm = (title: string, description: string, options?: any) => {
  const defaultOptions: Object = {
    showCancelButton: true,
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    ...options
  }
  return ElMessageBox.confirm(description, title, defaultOptions)
}
