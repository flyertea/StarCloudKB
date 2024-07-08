<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="600"
    class="member-dialog"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{ $t('views.login.team.addMemberTitle') }}</h4>
      <div class="dialog-sub-title">{{ $t('views.login.team.addMemberSubTitle') }}</div>
    </template>

    <el-form
      ref="addMemberFormRef"
      :model="memberForm"
      label-position="top"
      :rules="rules"
      require-asterisk-position="right"
      @submit.prevent
    >
      <el-form-item :label="$t('views.login.team.usernameOrEmail')" prop="users">
        <tags-input v-model:tags="memberForm.users" :placeholder="$t('views.login.team.enterUsernameOrEmail')" />
        <!-- <el-select
          ref="SelectRemoteRef"
          class="custom-select-multiple"
          v-model="memberForm.users"
          multiple
          filterable
          remote
          reserve-keyword
          :placeholder="$t('views.login.team.enterUsernameOrEmail')"
          :no-data-text="$t('views.login.team.userNotFound')"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="changeSelectHandle"
        >
          <el-option
            v-for="item in userOptions"
            :key="item?.id"
            :label="item?.username"
            :value="item?.id"
          />
        </el-select> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.prevent="dialogVisible = false">{{ $t('views.login.common.cancel') }}</el-button>
        <el-button type="primary" @click="submitMember(addMemberFormRef)" :loading="loading">
          {{ $t('views.login.team.add') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { MsgSuccess } from '@/utils/message'
import TeamApi from '@/api/team'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['refresh'])

const dialogVisible = ref<boolean>(false)

const memberForm = ref({
  users: []
})

const addMemberFormRef = ref<FormInstance>()

const loading = ref<boolean>(false)

const rules = ref<FormRules>({
  users: [
    {
      type: 'array',
      required: true,
      message: t('views.login.team.enterUsernameOrEmail'),
      trigger: 'change'
    }
  ]
})

watch(dialogVisible, (bool) => {
  if (!bool) {
    memberForm.value = {
      users: []
    }
    loading.value = false
  }
})

const open = () => {
  dialogVisible.value = true
}
const submitMember = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      let idsArray = memberForm.value.users.map((obj: any) => obj.id)
      TeamApi.postCreatTeamMember(idsArray).then((res) => {
        MsgSuccess(t('views.login.team.submitSuccess'))
        emit('refresh', idsArray)
        dialogVisible.value = false
        loading.value = false
      })
    }
  })
}

onMounted(() => {})

defineExpose({ open, close })
</script>
<style lang="scss" scope>
.member-dialog {
  .el-dialog__header {
    padding-bottom: 19px;
  }
}
.custom-select-multiple {
  width: 200%;
  .el-input {
    min-height: 100px;
  }
  .el-select__tags {
    top: 0;
    transform: none;
    padding-top: 8px;
  }
  .el-input__wrapper {
    align-items: start;
  }
}
</style>
