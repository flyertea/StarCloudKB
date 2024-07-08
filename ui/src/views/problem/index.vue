<template>
  <LayoutContainer :header="$t('viewquestions.header')">
    <div class="main-calc-height">
      <div class="p-24">
        <div class="flex-between">
          <div>
            <el-button type="primary" @click="createProblem">{{ $t('viewquestions.createButton') }}</el-button>
            <el-button @click="deleteMulDocument" :disabled="multipleSelection.length === 0">
              {{ $t('viewquestions.batchDeleteButton') }}
            </el-button>
          </div>

          <el-input
            v-model="filterText"
            :placeholder="$t('viewquestions.searchPlaceholder')"
            prefix-icon="Search"
            class="w-240"
            @change="getList"
            clearable
          />
        </div>
        <app-table
          ref="multipleTableRef"
          class="mt-16"
          :data="problemData"
          :pagination-config="paginationConfig"
          quick-create
          :quickCreateName="$t('viewquestions.quickCreateName')"
          :quickCreatePlaceholder="$t('viewquestions.quickCreatePlaceholder')"
          :quickCreateMaxlength="256"
          @sizeChange="handleSizeChange"
          @changePage="getList"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          @creatQuick="creatQuickHandle"
          @row-click="rowClickHandle"
          @selection-change="handleSelectionChange"
          :row-class-name="setRowClass"
          v-loading="loading"
          :row-key="(row: any) => row.id"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true" />
          <el-table-column prop="content" :label="$t('viewquestions.contentLabel')" min-width="280">
            <template #default="{ row }">
              <ReadWrite
                @change="editName($event, row.id)"
                :data="row.content"
                :showEditIcon="row.id === currentMouseId"
                :maxlength="256"
              />
            </template>
          </el-table-column>
          <el-table-column prop="paragraph_count" :label="$t('viewquestions.paragraphCountLabel')" align="right" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click.stop="rowClickHandle(row)" v-if="row.paragraph_count">
                {{ row.paragraph_count }}
              </el-link>
              <span v-else>
                {{ row.paragraph_count }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('viewquestions.createTimeLabel')" width="170">
            <template #default="{ row }">
              {{ datetimeFormat(row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="update_time" :label="$t('viewquestions.updateTimeLabel')" width="170">
            <template #default="{ row }">
              {{ datetimeFormat(row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('viewquestions.actionsLabel')" align="left">
            <template #default="{ row }">
              <div>
                <span class="mr-4">
                  <el-tooltip effect="dark" :content="$t('viewquestions.relateButton')" placement="top">
                    <el-button type="primary" text @click.stop="relateProblem(row)">
                      <el-icon><Connection /></el-icon>
                    </el-button>
                  </el-tooltip>
                </span>
                <span>
                  <el-tooltip effect="dark" :content="$t('viewquestions.deleteButton')" placement="top">
                    <el-button type="primary" text @click.stop="deleteProblem(row)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
        </app-table>
      </div>
    </div>
    <CreateProblemDialog ref="CreateProblemDialogRef" @refresh="refresh" />
    <DetailProblemDrawer
      :next="nextChatRecord"
      :pre="preChatRecord"
      ref="DetailProblemRef"
      v-model:currentId="currentClickId"
      v-model:currentContent="currentContent"
      :pre_disable="pre_disable"
      :next_disable="next_disable"
      @refresh="refresh"
    />
    <RelateProblemDialog ref="RelateProblemDialogRef" @refresh="refresh" />
  </LayoutContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import problemApi from '@/api/problem'
import CreateProblemDialog from './component/CreateProblemDialog.vue'
import DetailProblemDrawer from './component/DetailProblemDrawer.vue'
import RelateProblemDialog from './component/RelateProblemDialog.vue'
import { datetimeFormat } from '@/utils/time'
import { MsgSuccess, MsgConfirm, MsgError } from '@/utils/message'
import type { Dict } from '@/api/type/common'
import useStore from '@/stores'
import { useI18n } from 'vue-i18n'
const { t } = useI18n() // 使用国际化
const route = useRoute()
const {
  params: { id } // 知识库id
} = route as any

const { problem } = useStore()

const RelateProblemDialogRef = ref()
const DetailProblemRef = ref()
const CreateProblemDialogRef = ref()
const loading = ref(false)

// 当前需要修改问题的id
const currentMouseId = ref('')
// 当前点击打开drawer的id
const currentClickId = ref('')
const currentContent = ref('')

const paginationConfig = reactive({
  current_page: 1,
  page_size: 10,
  total: 0
})

const filterText = ref('')
const problemData = ref<any[]>([])
const problemIndexMap = computed<Dict<number>>(() => {
  return problemData.value
    .map((row, index) => ({
      [row.id]: index
    }))
    .reduce((pre, next) => ({ ...pre, ...next }), {})
})

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<any[]>([])

function relateProblem(row: any) {
  RelateProblemDialogRef.value.open(row.id)
}

function createProblem() {
  CreateProblemDialogRef.value.open()
}

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

/*
  快速创建空白文档
*/
function creatQuickHandle(val: string) {
  loading.value = true
  const obj = [val]
  problem
    .asyncPostProblem(id, obj)
    .then((res) => {
      getList()
      MsgSuccess(t('viewquestions.createSuccess'))
    })
    .catch(() => {
      loading.value = false
    })
}

function deleteMulDocument() {
  const arr: string[] = []
  multipleSelection.value.map((v) => {
    if (v) {
      arr.push(v.id)
    }
  })
  problemApi.delMulProblem(id, arr, loading).then(() => {
    MsgSuccess(t('viewquestions.batchDeleteSuccess'))
    multipleTableRef.value?.clearSelection()
    getList()
  })
}

function deleteProblem(row: any) {
  MsgConfirm(
    t('viewquestions.deleteConfirm', { content: row.content }),
    t('viewquestions.deleteWarning', { count: row.paragraph_count }),
    {
      confirmButtonText: t('viewquestions.deleteButton'),
      confirmButtonClass: 'danger'
    }
  )
    .then(() => {
      problemApi.delProblems(id, row.id, loading).then(() => {
        MsgSuccess(t('viewquestions.deleteSuccess'))
        getList()
      })
    })
    .catch(() => {})
}

function editName(val: string, problemId: string) {
  if (val) {
    const obj = {
      content: val
    }
    problemApi.putProblems(id, problemId, obj, loading).then(() => {
      getList()
      MsgSuccess(t('viewquestions.editSuccess'))
    })
  } else {
    MsgError(t('viewquestions.emptyError'))
  }
}

function cellMouseEnter(row: any) {
  currentMouseId.value = row.id
}
function cellMouseLeave() {
  currentMouseId.value = ''
}

/**
 * 下一页
 */
const nextChatRecord = () => {
  let index = problemIndexMap.value[currentClickId.value] + 1
  if (index >= problemData.value.length) {
    if (
      index + (paginationConfig.current_page - 1) * paginationConfig.page_size >=
      paginationConfig.total - 1
    ) {
      return
    }
    paginationConfig.current_page = paginationConfig.current_page + 1
    getList().then(() => {
      index = 0
      currentClickId.value = problemData.value[index].id
      currentContent.value = problemData.value[index].content
    })
  } else {
    currentClickId.value = problemData.value[index].id
    currentContent.value = problemData.value[index].content
  }
}
const pre_disable = computed(() => {
  let index = problemIndexMap.value[currentClickId.value] - 1
  return index < 0 && paginationConfig.current_page <= 1
})

const next_disable = computed(() => {
  let index = problemIndexMap.value[currentClickId.value] + 1
  return (
    index >= problemData.value.length &&
    index + (paginationConfig.current_page - 1) * paginationConfig.page_size >=
    paginationConfig.total - 1
  )
})
/**
 * 上一页
 */
const preChatRecord = () => {
  let index = problemIndexMap.value[currentClickId.value] - 1

  if (index < 0) {
    if (paginationConfig.current_page <= 1) {
      return
    }
    paginationConfig.current_page = paginationConfig.current_page - 1
    getList().then((ok) => {
      index = paginationConfig.page_size - 1
      currentClickId.value = problemData.value[index].id
      currentContent.value = problemData.value[index].content
    })
  } else {
    currentClickId.value = problemData.value[index].id
    currentContent.value = problemData.value[index].content
  }
}

function rowClickHandle(row: any, column?: any) {
  if (column && column.type === 'selection') {
    return
  }
  if (row.paragraph_count) {
    currentClickId.value = row.id
    currentContent.value = row.content
    DetailProblemRef.value.open()
  }
}

const setRowClass = ({ row }: any) => {
  return currentClickId.value === row?.id ? 'highlight' : ''
}

function handleSizeChange() {
  paginationConfig.current_page = 1
  getList()
}

function getList() {
  return problem
    .asyncGetProblem(
      id as string,
      paginationConfig,
      filterText.value && { content: filterText.value },
      loading
    )
    .then((res: any) => {
      problemData.value = res.data.records
      paginationConfig.total = res.data.total
    })
}

function refresh() {
  paginationConfig.current_page = 1
  getList()
}

onMounted(() => {
  getList()
})

onBeforeUnmount(() => {})
</script>
<style lang="scss" scoped></style>

