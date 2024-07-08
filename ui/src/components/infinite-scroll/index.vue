<template>
  <div v-infinite-scroll="loadDataset" :infinite-scroll-disabled="disabledScroll">
    <slot />
  </div>
  <div style="padding: 16px 10px">
    <el-divider v-if="size > 0 && loading">
      <el-text type="info"> {{ $t('loading') }} </el-text>
    </el-divider>
    <el-divider v-if="noMore">
      <el-text type="info"> {{ $t('noMore') }} </el-text>
    </el-divider>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
//import { t } from '@/locales' // 导入国际化配置

defineOptions({ name: 'InfiniteScroll' })
const props = defineProps({
  /**
   * 对象数量
   */
  size: {
    type: Number,
    default: 0
  },
  /**
   * 总数
   */
  total: {
    type: Number,
    default: 0
  },
  /**
   * 总数
   */
  page_size: {
    type: Number,
    default: 0
  },
  current_page: {
    type: Number,
    default: 0
  },
  loading: Boolean
})

const emit = defineEmits(['update:current_page', 'load'])
const current = ref(props.current_page)

const noMore = computed(
  () =>
    props.size > 0 && props.size === props.total && props.total > props.page_size && !props.loading
)
const disabledScroll = computed(() => props.size > 0 && (props.loading || noMore.value))

function loadDataset() {
  if (props.total > props.page_size) {
    current.value += 1
    emit('update:current_page', current.value)
    emit('load')
  }
}
</script>
<style lang="scss" scoped></style>