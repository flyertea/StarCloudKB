<template>
  <LayoutContainer :header="t('views.login.userManagement.header')">
    <div class="p-24">
      <div class="flex-between">
        <el-button type="primary" @click="createUser">{{ t('views.login.userManagement.createUser') }}</el-button>
        <el-input
          v-model="searchValue"
          @change="searchHandle"
          :placeholder="t('views.login.userManagement.search')"
          prefix-icon="Search"
          class="w-240"
          clearable
        />
      </div>

      <app-table
        class="mt-16"
        :data="tableData"
        :pagination-config="paginationConfig"
        @sizeChange="handleSizeChange"
        @changePage="getList"
        v-loading="loading"
      >
        <el-table-column prop="username" :label="t('views.login.userManagement.username')" />
        <el-table-column prop="nick_name" :label="t('views.login.userManagement.nickname')" />
        <el-table-column prop="email" :label="t('views.login.userManagement.email')" show-overflow-tooltip />
        <el-table-column prop="phone" :label="t('views.login.userManagement.phone')" />
        <el-table-column :label="t('views.login.userManagement.status')" width="80">
          <template #default="{ row }">
            <div @click.stop>
              <el-switch
                :disabled="row.role === 'ADMIN'"
                size="small"
                v-model="row.is_active"
                @change="changeState($event, row)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('views.login.userManagement.creationTime')" width="180">
          <template #default="{ row }">
            {{ datetimeFormat(row.create_time) }}
          </template>
        </el-table-column>

        <el-table-column :label="t('views.login.userManagement.actions')" width="110" align="left" fixed="right">
          <template #default="{ row }">
            <span class="mr-4">
              <el-tooltip effect="dark" :content="t('views.login.userManagement.edit')" placement="top">
                <el-button type="primary" text @click.stop="editUser(row)">
                  <el-icon><EditPen /></el-icon>
                </el-button>
              </el-tooltip>
            </span>
            <span class="mr-4">
              <el-tooltip effect="dark" :content="t('views.login.userManagement.changePassword')" placement="top">
                <el-button type="primary" text @click.stop="editPwdUser(row)">
                  <el-icon><Lock /></el-icon>
                </el-button>
              </el-tooltip>
            </span>
            <span class="mr-4">
              <el-tooltip effect="dark" :content="t('views.login.userManagement.delete')" placement="top">
                <el-button
                  :disabled="row.role === 'ADMIN'"
                  type="primary"
                  text
                  @click.stop="deleteUserManage(row)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </app-table>
    </div>
    <UserDialog :title="title" ref="UserDialogRef" @refresh="refresh" />
    <UserPwdDialog ref="UserPwdDialogRef" @refresh="refresh" />
  </LayoutContainer>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import UserDialog from './component/UserDialog.vue'
import UserPwdDialog from './component/UserPwdDialog.vue'
import { MsgSuccess, MsgConfirm } from '@/utils/message'
import userApi from '@/api/user-manage'
import { datetimeFormat } from '@/utils/time'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const UserDialogRef = ref()
const UserPwdDialogRef = ref()
const title = ref('')
const loading = ref(false)
const paginationConfig = reactive({
  current_page: 1,
  page_size: 20,
  total: 0
})
const tableData = ref<any[]>([])

const searchValue = ref('')

function searchHandle() {
  paginationConfig.total = 0
  paginationConfig.current_page = 1
  tableData.value = []
  getList()
}

function changeState(bool: Boolean, row: any) {
  const obj = {
    is_active: bool
  }
  const str = bool ? t('views.login.userManagement.enableSuccess') : t('views.login.userManagement.disableSuccess')
  userApi.putUserManage(row.id, obj, loading).then((res) => {
    getList()
    MsgSuccess(str)
  })
}

function editPwdUser(row: any) {
  UserPwdDialogRef.value.open(row)
}
function editUser(row: any) {
  title.value = t('views.login.userManagement.editUser')
  UserDialogRef.value.open(row)
}

function createUser() {
  title.value = t('views.login.userManagement.createUser')
  UserDialogRef.value.open()
}

function deleteUserManage(row: any) {
  MsgConfirm(
    t('views.login.userManagement.deleteConfirm', { username: row.username }),
    t('views.login.userManagement.deleteWarning'),
    {
      confirmButtonText: t('views.login.common.delete'),
      confirmButtonClass: 'danger'
    }
  )
    .then(() => {
      loading.value = true
      userApi.delUserManage(row.id, loading).then(() => {
        MsgSuccess(t('views.login.userManagement.deleteSuccess'))
        getList()
      })
    })
    .catch(() => {})
}

function handleSizeChange() {
  paginationConfig.current_page = 1
  getList()
}

function getList() {
  return userApi.getUserManage(paginationConfig, searchValue.value, loading).then((res) => {
    tableData.value = res.data.records
    paginationConfig.total = res.data.total
  })
}

function refresh() {
  getList()
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.log-table tr {
  cursor: pointer;
}
</style>
