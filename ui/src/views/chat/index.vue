<template>
  <component :is="currentTemplate" :key="route.fullPath" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 引入所有可能的组件
import BaseChat from '@/views/chat/base/index.vue'
import EmbedChat from '@/views/chat/embed/index.vue'
import PcChat from '@/views/chat/pc/index.vue'

const route = useRoute()
const {
  query: { mode }
} = route as any

// 根据模式选择组件
const currentTemplate = computed(() => {
  switch (mode) {
    case 'embed':
      return EmbedChat
    case 'base':
      return BaseChat
    case 'pc':
    default:
      return PcChat
  }
})
</script>

<style lang="scss"></style>