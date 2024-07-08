<template>
  <LayoutContainer :header="$t('teamMembers')">
    <div class="team-manage flex main-calc-height">
      <div class="team-member p-8 border-r">
        <div class="flex-between p-16">
          <h4>{{ $t('members') }}</h4>
          <el-button type="primary" link @click="addMember">
            <AppIcon iconName="app-add-users" class="add-user-icon" />
          </el-button>
        </div>
        <div class="team-member-input">
          <el-input
            v-model="filterText"
            :placeholder="$t('searchByUsername')"
            prefix-icon="Search"
            clearable
          />
        </div>
        <common-list
          :data="filterMember"
          class="mt-8"
          v-loading="loading"
          @click="clickMemberHandle"
          :default-active="currentUser"
        >
          <template #default="{ row }">
            <div class="flex-between">
              <div>
                <span class="mr-8">{{ row.username }}</span>
                <el-tag v-if="isManage(row.type)" class="default-tag">{{ $t('owner') }}</el-tag>
              </div>
              <div @click.stop style="margin-top: 5px">
                <el-dropdown trigger="click" v-if="!isManage(row.type)">
                  <span class="cursor">
                    <el-icon class="rotate-90"><MoreFilled /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click.prevent="deleteMember(row)">{{ $t('remove') }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
        </common-list>
      </div>
      <div class="permission-setting flex" v-loading="rLoading">
        <div class="team-manage__table">
          <h4 class="p-24 pb-0 mb-4">{{ $t('permissionSettings') }}</h4>
          <el-tabs v-model="activeName" class="team-manage__tabs">
            <el-tab-pane
              v-for="(item, index) in settingTags"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            >
              <PermissionSetting
                :key="index"
                :data="item.data"
                :type="item.value"
                :tableHeight="tableHeight"
                :manage="isManage(currentType)"
              ></PermissionSetting>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="submit-button">
          <el-button type="primary" @click="submitPermissions">{{ $t('save') }}</el-button>
        </div>
      </div>
    </div>
    <CreateMemberDialog ref="CreateMemberRef" @refresh="refresh" />
  </LayoutContainer>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, watch } from 'vue'
import TeamApi from '@/api/team'
import type { TeamMember } from '@/api/type/team'
import CreateMemberDialog from './component/CreateMemberDialog.vue'
import PermissionSetting from './component/PermissionSetting.vue'
import { MsgSuccess, MsgConfirm } from '@/utils/message'
import { TeamEnum } from '@/enums/team'
import { useI18n } from 'vue-i18n' // 导入国际化

const { t } = useI18n() // 使用国际化

const CreateMemberRef = ref<InstanceType<typeof CreateMemberDialog>>()
const loading = ref(false)
const rLoading = ref(false)
const memberList = ref<TeamMember[]>([]) // 全部成员
const filterMember = ref<TeamMember[]>([]) // 搜索过滤后列表
const currentUser = ref<String>('')
const currentType = ref<String>('')

const filterText = ref('')

const activeName = ref(TeamEnum.DATASET)
const tableHeight = ref(0)

const settingTags = reactive([
  {
    label: t('knowledgeBase'),
    value: TeamEnum.DATASET,
    data: [] as any
  },
  {
    label: t('application'),
    value: TeamEnum.APPLICATION,
    data: [] as any
  }
])

watch(filterText, (val) => {
  if (val) {
    filterMember.value = memberList.value.filter((v) => v.username.includes(val))
  } else {
    filterMember.value = memberList.value
  }
})

function isManage(type: String) {
  return type === 'manage'
}

function submitPermissions() {
  rLoading.value = true
  const obj: any = {
    team_member_permission_list: []
  }
  settingTags.map((item) => {
    item.data.map((v: any) => {
      obj['team_member_permission_list'].push({
        target_id: v.id,
        type: v.type,
        operate: v.operate
      })
    })
  })
  TeamApi.putMemberPermissions(currentUser.value, obj)
    .then(() => {
      MsgSuccess(t('submitSuccess'))
      MemberPermissions(currentUser.value)
    })
    .catch(() => {
      rLoading.value = false
    })
}

function MemberPermissions(id: String) {
  rLoading.value = true
  TeamApi.getMemberPermissions(id)
    .then((res) => {
      if (!res.data || Object.keys(res.data).length > 0) {
        settingTags.map((item) => {
          if (Object.keys(res.data).indexOf(item.value) !== -1) {
            item.data = res.data[item.value]
          }
        })
      }
      rLoading.value = false
    })
    .catch(() => {
      rLoading.value = false
    })
}

function deleteMember(row: TeamMember) {
  MsgConfirm(
    t('removeMember', { username: row.username }),
    t('removeWarning'),
    {
      confirmButtonText: t('remove'),
      confirmButtonClass: 'danger'
    }
  )
    .then(() => {
      loading.value = true
      TeamApi.delTeamMember(row.id)
        .then(() => {
          MsgSuccess(t('removeSuccess'))
          getMember()
        })
        .catch(() => {
          loading.value = false
        })
    })
    .catch(() => {})
}

function clickMemberHandle(item: any) {
  currentUser.value = item.id
  currentType.value = item.type
  MemberPermissions(item.id)
}
function addMember() {
  CreateMemberRef.value?.open()
}

function getMember(id?: string) {
  loading.value = true
  TeamApi.getTeamMember()
    .then((res) => {
      memberList.value = res.data
      filterMember.value = res.data

      const user = (id && memberList.value.find((p) => p.user_id === id)) || null
      currentUser.value = user ? user.id : memberList.value[0].id
      currentType.value = user ? user.type : memberList.value[0].type
      MemberPermissions(currentUser.value)
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

function refresh(data?: string[]) {
  getMember(data && data[0])
}

onMounted(() => {
  tableHeight.value = window.innerHeight - 330
  window.onresize = () => {
    return (() => {
      tableHeight.value = window.innerHeight - 330
    })()
  }
  getMember()
})
</script>

<style lang="scss" scoped>
.team-manage {
  .add-user-icon {
    font-size: 17px;
  }
  .team-member-input {
    padding: 0 calc(var(--app-base-px) * 2);
  }
  .team-member {
    box-sizing: border-box;
    width: var(--setting-left-width);
    min-width: var(--setting-left-width);
  }

  .permission-setting {
    box-sizing: border-box;
    width: calc(100% - var(--setting-left-width));
    flex-direction: column;
    position: relative;
    .submit-button {
      position: absolute;
      top: 54px;
      right: 24px;
    }
  }

  &__tabs {
    margin-top: 10px;
    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
    }
    :deep(.el-tabs__nav-scroll) {
      padding: 0 24px;
    }
    :deep(.el-tabs__active-bar) {
      height: 3px;
    }
  }
  &__table {
    flex: 1;
  }
}
</style>
