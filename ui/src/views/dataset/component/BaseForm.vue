<template>
  <h4 class="title-decoration-1 mb-16">{{ $t('basicInformation') }}</h4>
  <el-form
    ref="FormRef"
    :model="form"
    :rules="rules"
    label-position="top"
    require-asterisk-position="right"
  >
    <el-form-item :label="$t('knowledgeBaseName')" prop="name">
      <el-input
        v-model="form.name"
        :placeholder="$t('enterKnowledgeBaseName')"
        maxlength="64"
        show-word-limit
        @blur="form.name = form.name.trim()"
      />
    </el-form-item>
    <el-form-item :label="$t('knowledgeBaseDescription')" prop="desc">
      <el-input
        v-model="form.desc"
        type="textarea"
        :placeholder="$t('knowledgeBaseDescriptionPlaceholder')"
        maxlength="256"
        show-word-limit
        :autosize="{ minRows: 3 }"
        @blur="form.desc = form.desc.trim()"
      />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import useStore from '@/stores'
import type { datasetData } from '@/api/type/dataset'
import { isAllPropertiesEmpty } from '@/utils/utils'
import { useI18n } from 'vue-i18n' // 导入国际化

const { t } = useI18n() // 使用国际化

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const route = useRoute()
const {
  params: { type }
} = route
const isCreate = type === 'create'
const { dataset } = useStore()
const baseInfo = computed(() => dataset.baseInfo)
const form = ref<datasetData>({
  name: '',
  desc: ''
})

const rules = reactive({
  name: [{ required: true, message: t('enterKnowledgeBaseName'), trigger: 'blur' }],
  desc: [{ required: true, message: t('enterKnowledgeBaseDescription'), trigger: 'blur' }]
})
const FormRef = ref()

watch(
  () => props.data,
  (value) => {
    if (value && JSON.stringify(value) !== '{}') {
      form.value.name = value.name
      form.value.desc = value.desc
    }
  },
  {
    immediate: true
  }
)

watch(form.value, (value) => {
  if (isAllPropertiesEmpty(value)) {
    dataset.saveBaseInfo(null)
  } else {
    if (isCreate) {
      dataset.saveBaseInfo(value)
    }
  }
})

/*
  表单校验
*/
function validate() {
  if (!FormRef.value) return
  return FormRef.value.validate((valid: any) => {
    return valid
  })
}

onMounted(() => {
  if (baseInfo.value) {
    form.value = baseInfo.value
  }
})
onUnmounted(() => {
  form.value = {
    name: '',
    desc: ''
  }
})

defineExpose({
  validate,
  form
})
</script>
<style scoped lang="scss"></style>
