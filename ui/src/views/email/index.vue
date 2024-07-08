<template>
  <LayoutContainer :header="$t('emailSettings')">
    <div class="email-setting main-calc-height">
      <el-scrollbar>
        <div class="p-24" v-loading="loading">
          <el-form
            ref="emailFormRef"
            :rules="rules"
            :model="form"
            label-position="top"
            require-asterisk-position="right"
          >
            <el-form-item :label="$t('smtpHost')" prop="email_host">
              <el-input v-model="form.email_host" :placeholder="$t('enterSmtpHost')" />
            </el-form-item>
            <el-form-item :label="$t('smtpPort')" prop="email_port">
              <el-input v-model="form.email_port" :placeholder="$t('enterSmtpPort')" />
            </el-form-item>
            <el-form-item :label="$t('smtpAccount')" prop="email_host_user">
              <el-input v-model="form.email_host_user" :placeholder="$t('enterSmtpAccount')" />
            </el-form-item>
            <el-form-item :label="$t('senderEmail')" prop="from_email">
              <el-input v-model="form.from_email" :placeholder="$t('enterSenderEmail')" />
            </el-form-item>
            <el-form-item :label="$t('password')" prop="email_host_password">
              <el-input
                v-model="form.email_host_password"
                :placeholder="$t('enterPassword')"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="form.email_use_ssl">{{ $t('enableSsl') }}</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="form.email_use_tls">{{ $t('enableTls') }}</el-checkbox>
            </el-form-item>
            <el-button @click="submit(emailFormRef, 'test')" :disabled="loading">
              {{ $t('testConnection') }}
            </el-button>
          </el-form>

          <div class="text-right">
            <el-button @click="submit(emailFormRef)" type="primary" :disabled="loading">
              {{ $t('save') }}
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </LayoutContainer>
</template>
<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import emailApi from '@/api/email-setting'
import type { FormInstance, FormRules } from 'element-plus'
import { MsgSuccess } from '@/utils/message'
import { useI18n } from 'vue-i18n' // 导入国际化

const { t } = useI18n() // 使用国际化
const form = ref<any>({
  email_host: '',
  email_port: '',
  email_host_user: '',
  email_host_password: '',
  email_use_tls: false,
  email_use_ssl: false,
  from_email: ''
})

const emailFormRef = ref()

const loading = ref(false)

const rules = reactive<FormRules<any>>({
  email_host: [{ required: true, message: t('enterSmtpHost'), trigger: 'blur' }],
  email_port: [{ required: true, message: t('enterSmtpPort'), trigger: 'blur' }],
  email_host_user: [{ required: true, message: t('enterSmtpAccount'), trigger: 'blur' }],
  email_host_password: [{ required: true, message: t('enterPassword'), trigger: 'blur' }],
  from_email: [{ required: true, message: t('enterSenderEmail'), trigger: 'blur' }]
})

const submit = async (formEl: FormInstance | undefined, test?: string) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (test) {
        emailApi.postTestEmail(form.value, loading).then((res) => {
          MsgSuccess(t('testConnectionSuccess'))
        })
      } else {
        emailApi.putEmailSetting(form.value, loading).then((res) => {
          MsgSuccess(t('settingsSuccess'))
        })
      }
    }
  })
}

function getDetail() {
  emailApi.getEmailSetting(loading).then((res: any) => {
    if (res.data && JSON.stringify(res.data) !== '{}') {
      form.value = res.data
    }
  })
}

onMounted(() => {
  getDetail()
})
</script>
<style lang="scss" scoped>
.email-setting {
  width: 70%;
  margin: 0 auto;
  :deep(.el-checkbox__label) {
    font-weight: 400;
  }
}
</style>
