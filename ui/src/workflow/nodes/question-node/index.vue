<template>
  <NodeContainer :nodeModel="nodeModel">
    <h5 class="title-decoration-1 mb-8">{{ $t('nodeSettings') }}</h5>
    <el-card shadow="never" class="card-never" style="--el-card-padding: 12px">
      <el-form
        @submit.prevent
        @mousemove.stop
        @mousedown.stop
        @keydown.stop
        @click.stop
        :model="form_data"
        label-position="top"
        require-asterisk-position="right"
        class="mb-24"
        label-width="auto"
        ref="questionNodeFormRef"
      >
        <el-form-item
          :label="$t('aiModel')"
          prop="model_id"
          :rules="{
            required: true,
            message: $t('selectAIModel'),
            trigger: 'change'
          }"
        >
          <el-select
            @wheel="wheel"
            @keydown="isKeyDown = true"
            @keyup="isKeyDown = false"
            :teleported="false"
            v-model="form_data.model_id"
            :placeholder="$t('selectAIModel')"
            class="w-full"
            popper-class="select-model"
            :clearable="true"
          >
            <el-option-group
              v-for="(value, label) in modelOptions"
              :key="value"
              :label="relatedObject(providerOptions, label, 'provider')?.name"
            >
              <el-option
                v-for="item in value.filter((v: any) => v.status === 'SUCCESS')"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                class="flex-between"
              >
                <div class="flex">
                  <span
                    v-html="relatedObject(providerOptions, label, 'provider')?.icon"
                    class="model-icon mr-8"
                  ></span>
                  <span>{{ item.name }}</span>
                </div>
                <el-icon class="check-icon" v-if="item.id === form_data.model_id"
                ><Check
                /></el-icon>
              </el-option>
              <!-- 不可用 -->
              <el-option
                v-for="item in value.filter((v: any) => v.status !== 'SUCCESS')"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                class="flex-between"
                disabled
              >
                <div class="flex">
                  <span
                    v-html="relatedObject(providerOptions, label, 'provider')?.icon"
                    class="model-icon mr-8"
                  ></span>
                  <span>{{ item.name }}</span>
                  <span class="danger">{{ $t('modelUnavailable') }}</span>
                </div>
                <el-icon class="check-icon" v-if="item.id === form_data.model_id"
                ><Check
                /></el-icon>
              </el-option>
            </el-option-group>
            <template #footer>
              <div class="w-full text-left cursor" @click="openCreateModel()">
                <el-button type="primary" link>
                  <el-icon class="mr-4"><Plus /></el-icon>
                  {{ $t('addModel') }}
                </el-button>
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('roleSetting')">
          <el-input
            v-model="form_data.system"
            :placeholder="$t('roleSetting')"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3 }"
          />
        </el-form-item>
        <el-form-item :label="$t('prompt')" prop="prompt">
          <template #label>
            <div class="flex align-center">
              <div class="mr-4">
                <span>{{ $t('prompt') }}<span class="danger">*</span></span>
              </div>
              <el-tooltip effect="dark" placement="right" popper-class="max-w-200">
                <template #content>
                  {{ $t('promptTooltip') }}
                </template>
                <AppIcon iconName="app-warning" class="app-warning-icon"></AppIcon>
                <el-icon><EditPen /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input
            v-model="form_data.prompt"
            :rows="6"
            type="textarea"
            maxlength="2048"
            :placeholder="defaultPrompt"
          />
        </el-form-item>
        <el-form-item :label="$t('historyChatRecords')">
          <el-input-number
            v-model="form_data.dialogue_number"
            :min="0"
            :value-on-clear="0"
            controls-position="right"
            class="w-full"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 添加模版 -->
    <CreateModelDialog
      ref="createModelRef"
      @submit="getModel"
      @change="openCreateModel($event)"
    ></CreateModelDialog>
    <SelectProviderDialog ref="selectProviderRef" @change="openCreateModel($event)" />
  </NodeContainer>
</template>
<script setup lang="ts">import { set, groupBy } from 'lodash'
import { app } from '@/main'
import NodeContainer from '@/workflow/common/NodeContainer.vue'
import CreateModelDialog from '@/views/template/component/CreateModelDialog.vue'
import SelectProviderDialog from '@/views/template/component/SelectProviderDialog.vue'
import type { FormInstance } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import applicationApi from '@/api/application'
import useStore from '@/stores'
import { relatedObject } from '@/utils/utils'
import type { Provider } from '@/api/type/model'
import { t } from '@/locales' // 导入国际化配置

const { model } = useStore()
const isKeyDown = ref(false)
const wheel = (e: any) => {
  if (isKeyDown.value) {
    e.preventDefault()
  } else {
    e.stopPropagation()
    return true
  }
}
const {
  params: { id }
} = app.config.globalProperties.$route as any

// @ts-ignore
const defaultPrompt = t('questionnodedefaultPrompt')
const form = {
  model_id: '',
  system: t('youAreAQuestionOptimizationMaster'),
  prompt: defaultPrompt,
  dialogue_number: 1
}

const form_data = computed({
  get: () => {
    if (props.nodeModel.properties.node_data) {
      return props.nodeModel.properties.node_data
    } else {
      set(props.nodeModel.properties, 'node_data', form)
    }
    return props.nodeModel.properties.node_data
  },
  set: (value) => {
    set(props.nodeModel.properties, 'node_data', value)
  }
})
const props = defineProps<{ nodeModel: any }>()

const questionNodeFormRef = ref<FormInstance>()
const createModelRef = ref<InstanceType<typeof CreateModelDialog>>()
const selectProviderRef = ref<InstanceType<typeof SelectProviderDialog>>()

const modelOptions = ref<any>(null)
const providerOptions = ref<Array<Provider>>([])

const validate = () => {
  return questionNodeFormRef.value?.validate().catch((err) => {
    return Promise.reject({ node: props.nodeModel, errMessage: err })
  })
}

function getModel() {
  if (id) {
    applicationApi.getApplicationModel(id).then((res: any) => {
      modelOptions.value = groupBy(res?.data, 'provider')
    })
  } else {
    model.asyncGetModel().then((res: any) => {
      modelOptions.value = groupBy(res?.data, 'provider')
    })
  }
}

function getProvider() {
  model.asyncGetProvider().then((res: any) => {
    providerOptions.value = res?.data
  })
}

const openCreateModel = (provider?: Provider) => {
  if (provider && provider.provider) {
    createModelRef.value?.open(provider)
  } else {
    selectProviderRef.value?.open()
  }
}

onMounted(() => {
  getProvider()
  getModel()
  set(props.nodeModel, 'validate', validate)
})
</script>
<style lang="scss" scoped></style>
