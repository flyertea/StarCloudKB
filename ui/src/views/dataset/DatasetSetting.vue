<template>
  <LayoutContainer :header="$t('settings')">
    <div class="dataset-setting main-calc-height">
      <el-scrollbar>
        <div class="p-24" v-loading="loading">
          <BaseForm ref="BaseFormRef" :data="detail" />

          <el-form
            ref="webFormRef"
            :rules="rules"
            :model="form"
            label-position="top"
            require-asterisk-position="right"
          >
            <el-form-item :label="$t('knowledgeBaseType')" required>
              <el-card shadow="never" class="mb-8" v-if="detail.type === '0'">
                <div class="flex align-center">
                  <AppAvatar class="mr-8" shape="square" :size="32">
                    <img src="@/assets/icon_document.svg" style="width: 58%" alt="" />
                  </AppAvatar>
                  <div>
                    <div>{{ $t('generalType') }}</div>
                    <el-text type="info">{{ $t('generalTypeInfo') }}</el-text>
                  </div>
                </div>
              </el-card>
              <el-card shadow="never" class="mb-8" v-if="detail?.type === '1'">
                <div class="flex align-center">
                  <AppAvatar class="mr-8 avatar-purple" shape="square" :size="32">
                    <img src="@/assets/icon_web.svg" style="width: 58%" alt="" />
                  </AppAvatar>
                  <div>
                    <div>{{ $t('webSite') }}</div>
                    <el-text type="info">{{ $t('webSiteInfo') }}</el-text>
                  </div>
                </div>
              </el-card>
            </el-form-item>
            <el-form-item :label="$t('webRootAddress')" prop="source_url" v-if="detail.type === '1'">
              <el-input
                v-model="form.source_url"
                :placeholder="$t('enterWebRootAddress')"
                @blur="form.source_url = form.source_url.trim()"
              />
            </el-form-item>
            <el-form-item :label="$t('selector')" v-if="detail.type === '1'">
              <el-input
                v-model="form.selector"
                :placeholder="$t('defaultSelector')"
                @blur="form.selector = form.selector.trim()"
              />
            </el-form-item>
          </el-form>
          <div v-if="application_id_list.length > 0">
            <h4 class="title-decoration-1 mb-16">{{ $t('associatedApplications') }}</h4>
            <el-row :gutter="12">
              <el-col
                :span="12"
                v-for="(item, index) in application_list.filter((obj: any) =>
                  application_id_list.some((v: any) => v === obj?.id)
                )"
                :key="index"
                class="mb-16"
              >
                <el-card shadow="never">
                  <div class="flex-between">
                    <div class="flex align-center">
                      <AppAvatar
                        v-if="isAppIcon(item?.icon)"
                        shape="square"
                        :size="32"
                        style="background: none"
                        class="mr-12"
                      >
                        <img :src="item?.icon" alt="" />
                      </AppAvatar>
                      <AppAvatar
                        v-else-if="item?.name"
                        :name="item?.name"
                        pinyinColor
                        shape="square"
                        :size="32"
                        class="mr-12"
                      />
                      {{ item.name }}
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <div class="text-right">
            <el-button @click="submit" type="primary"> {{ $t('save') }} </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </LayoutContainer>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import BaseForm from '@/views/dataset/component/BaseForm.vue'
import datasetApi from '@/api/dataset'
import type { ApplicationFormType } from '@/api/type/application'
import { MsgSuccess } from '@/utils/message'
import { isAppIcon } from '@/utils/application'
import useStore from '@/stores'
import { t } from '@/locales'
const route = useRoute()
const {
  params: { id }
} = route as any

const { dataset } = useStore()
const webFormRef = ref()
const BaseFormRef = ref()
const loading = ref(false)
const detail = ref<any>({})
const application_list = ref<Array<ApplicationFormType>>([])
const application_id_list = ref([])
const form = ref<any>({
  source_url: '',
  selector: ''
})

const rules = reactive({
  source_url: [{ required: true, message: t('enterWebRootAddress'), trigger: 'blur' }]
})

async function submit() {
  if (await BaseFormRef.value?.validate()) {
    await webFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true
        const obj =
          detail.value.type === '1'
            ? {
              application_id_list: application_id_list.value,
              meta: form.value,
              ...BaseFormRef.value.form
            }
            : {
              application_id_list: application_id_list.value,
              ...BaseFormRef.value.form
            }
        datasetApi
          .putDataset(id, obj)
          .then((res) => {
            MsgSuccess(t('saveSuccess'))
            loading.value = false
          })
          .catch(() => {
            loading.value = false
          })
      }
    })
  }
}

function getDetail() {
  dataset.asyncGetDatasetDetail(id, loading).then((res: any) => {
    detail.value = res.data
    if (detail.value.type === '1') {
      form.value = res.data.meta
    }

    application_id_list.value = res.data?.application_id_list
    datasetApi.listUsableApplication(id, loading).then((ok) => {
      application_list.value = ok.data
    })
  })
}

onMounted(() => {
  getDetail()
})
</script>
<style lang="scss" scoped>
.dataset-setting {
  width: 70%;
  margin: 0 auto;
}
</style>