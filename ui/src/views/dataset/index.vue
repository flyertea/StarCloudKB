<template>
  <div class="dataset-list-container p-24" style="padding-top: 16px">
    <div class="flex-between mb-16">
      <h4>{{ $t('knowledgeBase') }}</h4>
      <el-input
        v-model="searchValue"
        @change="searchHandle"
        :placeholder="$t('searchByName')"
        prefix-icon="Search"
        class="w-240"
        clearable
      />
    </div>
    <div v-loading.fullscreen.lock="paginationConfig.current_page === 1 && loading">
      <InfiniteScroll
        :size="datasetList.length"
        :total="paginationConfig.total"
        :page_size="paginationConfig.page_size"
        v-model:current_page="paginationConfig.current_page"
        @load="getList"
        :loading="loading"
      >
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb-16">
            <CardAdd :title="$t('createKnowledgeBase')" @click="router.push({ path: '/dataset/create' })" />
          </el-col>
          <template v-for="(item, index) in datasetList" :key="index">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb-16">
              <CardBox
                :title="item.name"
                :description="item.desc"
                class="cursor"
                @click="router.push({ path: `/dataset/${item.id}/document` })"
              >
                <template #icon>
                  <AppAvatar
                    v-if="item.type === '1'"
                    class="mr-8 avatar-purple"
                    shape="square"
                    :size="32"
                  >
                    <img src="@/assets/icon_web.svg" style="width: 58%" alt="" />
                  </AppAvatar>
                  <AppAvatar v-else class="mr-8" shape="square" :size="32">
                    <img src="@/assets/icon_document.svg" style="width: 58%" alt="" />
                  </AppAvatar>
                </template>
                <div class="delete-button">
                  <el-tag v-if="item.type === '0'">{{ $t('generalType') }}</el-tag>
                  <el-tag class="purple-tag" v-else-if="item.type === '1'" type="warning"
                  >{{ $t('webSite') }}</el-tag
                  >
                </div>

                <template #footer>
                  <div class="footer-content flex-between">
                    <div>
                      <span class="bold">{{ item?.document_count || 0 }}</span>
                      {{ $t('documents') }}<el-divider direction="vertical" />
                      <span class="bold">{{ numberFormat(item?.char_length) || 0 }}</span>
                      {{ $t('characters') }}<el-divider direction="vertical" />
                      <span class="bold">{{ item?.application_mapping_count || 0 }}</span>
                      {{ $t('associatedApplications') }}
                    </div>
                    <div @click.stop>
                      <el-dropdown trigger="click">
                        <el-button text @click.stop>
                          <el-icon><MoreFilled /></el-icon>
                        </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item
                              icon="Refresh"
                              @click.stop="syncDataset(item)"
                              v-if="item.type === '1'"
                            >{{ $t('sync') }}</el-dropdown-item
                            >
                            <el-dropdown-item @click="reEmbeddingDataset(item)">
                              <AppIcon
                                iconName="app-document-refresh"
                                style="font-size: 16px"
                              ></AppIcon>
                              {{ $t('reEmbed') }}</el-dropdown-item
                            >
                            <el-dropdown-item
                              icon="Setting"
                              @click.stop="router.push({ path: `/dataset/${item.id}/setting` })"
                            >
                              {{ $t('settings') }}</el-dropdown-item
                            >
                            <el-dropdown-item @click.stop="export_dataset(item)">
                              <AppIcon iconName="app-export"></AppIcon>{{ $t('export') }}</el-dropdown-item
                            >
                            <el-dropdown-item icon="Delete" @click.stop="deleteDataset(item)"
                            >{{ $t('delete') }}</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                </template>
              </CardBox>
            </el-col>
          </template>
        </el-row>
      </InfiniteScroll>
    </div>
    <SyncWebDialog ref="SyncWebDialogRef" @refresh="refresh" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import SyncWebDialog from '@/views/dataset/component/SyncWebDialog.vue'
import datasetApi from '@/api/dataset'
import { MsgSuccess, MsgConfirm } from '@/utils/message'
import { useRouter } from 'vue-router'
import { numberFormat } from '@/utils/utils'
import { useI18n } from 'vue-i18n' // 导入国际化

const { t } = useI18n() // 使用国际化
const router = useRouter()

const SyncWebDialogRef = ref()
const loading = ref(false)
const datasetList = ref<any[]>([])
const paginationConfig = reactive({
  current_page: 1,
  page_size: 20,
  total: 0
})

const searchValue = ref('')

function refresh() {
  MsgSuccess(t('syncTaskSuccess'))
}

function reEmbeddingDataset(row: any) {
  datasetApi.putReEmbeddingDataset(row.id).then(() => {
    MsgSuccess(t('submitSuccess'))
  })
}

function syncDataset(row: any) {
  SyncWebDialogRef.value.open(row.id)
}

function searchHandle() {
  paginationConfig.current_page = 1
  datasetList.value = []
  getList()
}
const export_dataset = (item: any) => {
  datasetApi.exportDataset(item.name, item.id, loading).then((ok) => {
    MsgSuccess(t('exportSuccess'))
  })
}

function deleteDataset(row: any) {
  MsgConfirm(
    t('confirmDelete', { name: row.name }),
    t('confirmDeleteWarning', { count: row.application_mapping_count }),
    {
      confirmButtonText: t('confirmDeleteButton'),
      confirmButtonClass: 'danger'
    }
  )
    .then(() => {
      datasetApi.delDataset(row.id, loading).then(() => {
        const index = datasetList.value.findIndex((v) => v.id === row.id)
        datasetList.value.splice(index, 1)
        MsgSuccess(t('deleteSuccess'))
      })
    })
    .catch(() => {})
}

function getList() {
  datasetApi
    .getDataset(paginationConfig, searchValue.value && { name: searchValue.value }, loading)
    .then((res) => {
      paginationConfig.total = res.data.total
      datasetList.value = [...datasetList.value, ...res.data.records]
    })
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.dataset-list-container {
  .delete-button {
    position: absolute;
    right: 12px;
    top: 18px;
    height: auto;
  }
  .footer-content {
    .bold {
      color: var(--app-text-color);
    }
  }
  :deep(.el-divider__text) {
    background: var(--app-layout-bg-color);
  }
}
</style>
