<template>
  <el-dialog :title="$t('views.login.user.changePasswordTitle')" v-model="dialogVisible">
    <el-form
      ref="userFormRef"
      :model="userForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      @submit.prevent
    >
      <el-form-item :label="$t('views.login.user.newPassword')" prop="password">
        <el-input
          type="password"
          v-model="userForm.password"
          :placeholder="$t('views.login.user.enterNewPassword')"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('views.login.user.confirmPassword')" prop="re_password">
        <el-input
          type="password"
          v-model="userForm.re_password"
          :placeholder="$t('views.login.user.enterConfirmPassword')"
          show-password
        >
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.prevent="dialogVisible = false"> {{ $t('views.login.common.cancel') }} </el-button>
        <el-button type="primary" @click="submit(userFormRef)" :loading="loading"> {{ $t('views.login.common.save') }} </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ResetPasswordRequest } from '@/api/type/user'
import userApi from '@/api/user-manage'
import { MsgSuccess } from '@/utils/message'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['refresh'])

const userFormRef = ref()
const userForm = ref<any>({
  password: '',
  re_password: ''
})

const { t } = useI18n()

const rules = reactive<FormRules<ResetPasswordRequest>>({
  password: [
    {
      required: true,
      message: t('views.login.user.enterNewPassword'),
      trigger: 'blur'
    },
    {
      min: 6,
      max: 20,
      message: t('views.login.user.passwordLength'),
      trigger: 'blur'
    }
  ],
  re_password: [
    {
      required: true,
      message: t('views.login.user.enterConfirmPassword'),
      trigger: 'blur'
    },
    {
      min: 6,
      max: 20,
      message: t('views.login.user.passwordLength'),
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (userForm.value.password !== userForm.value.re_password) {
          callback(new Error(t('views.login.user.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const dialogVisible = ref<boolean>(false)
const loading = ref(false)
const userId = ref('')

watch(dialogVisible, (bool) => {
  if (!bool) {
    userForm.value = {
      password: '',
      re_password: ''
    }
  }
})

const open = (data: any) => {
  userId.value = data.id
  dialogVisible.value = true
  userFormRef.value?.clearValidate()
}

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      userApi.putUserManagePassword(userId.value, userForm.value, loading).then((res) => {
        emit('refresh')
        MsgSuccess(t('views.login.user.changePasswordSuccess'))
        dialogVisible.value = false
      })
    }
  })
}

defineExpose({ open })
</script>
<style lang="scss" scope></style>
