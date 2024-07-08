<template>
  <NodeContainer :nodeModel="nodeModel">
    <h5 class="title-decoration-1 mb-8">{{ $t('globalVariables') }}</h5>
    <div
      class="flex-between border-r-4 p-8-12 mb-8 layout-bg lighter"
      @mouseenter="showicon = true"
      @mouseleave="showicon = false"
    >
      <span>{{ $t('currentTime') }} {time}</span>
      <el-tooltip effect="dark" :content="$t('copyParameter')" placement="top" v-if="showicon === true">
        <el-button link @click="copyClick(globeLabel)" style="padding: 0">
          <AppIcon iconName="app-copy"></AppIcon>
        </el-button>
      </el-tooltip>
    </div>
  </NodeContainer>
</template>
<script setup lang="ts">
import { set } from 'lodash'
import NodeContainer from '@/workflow/common/NodeContainer.vue'
import { copyClick } from '@/utils/clipboard'
import { ref, computed, onMounted } from 'vue'
import { t } from '@/locales' // 导入国际化配置

const props = defineProps<{ nodeModel: any }>()

const globeLabel = '{{globalVariables.time}}'

const showicon = ref(false)

// onMounted(() => {
//   set(props.nodeModel, 'validate', validate)
// })
</script>
<style lang="scss" scoped></style>