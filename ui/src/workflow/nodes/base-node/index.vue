<template>
  <NodeContainer :nodeModel="nodeModel">
    <el-form
      @submit.prevent
      @mousedown.stop
      @keydown.stop
      @click.stop
      :model="form_data"
      label-position="top"
      require-asterisk-position="right"
      class="mb-24"
      label-width="auto"
      ref="baseNodeFormRef"
    >
      <el-form-item
        :label="$t('appName')"
        prop="name"
        :rules="{
          message: $t('appNameRequired'),
          trigger: 'blur',
          required: true
        }"
      >
        <el-input
          v-model="form_data.name"
          maxlength="64"
          :placeholder="$t('appNamePlaceholder')"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t('appDesc')">
        <el-input
          v-model="form_data.desc"
          :placeholder="$t('appDescPlaceholder')"
          :rows="3"
          type="textarea"
          maxlength="256"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t('appPrologue')">
        <MdEditor
          style="height: 150px"
          v-model="form_data.prologue"
          :preview="false"
          :toolbars="[]"
          :footers="[]"
        />
      </el-form-item>
    </el-form>
  </NodeContainer>
</template>

<script setup lang="ts">
        import { set } from 'lodash'
        import NodeContainer from '@/workflow/common/NodeContainer.vue'
        import type { FormInstance } from 'element-plus'
        import { ref, computed, onMounted } from 'vue'
        import { t } from '@/locales' // 导入国际化配置

        const props = defineProps<{ nodeModel: any }>()

        const form = {
        name: '',
        desc: '',
        prologue: t('appPrologueDefault')
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

        const baseNodeFormRef = ref<FormInstance>()

        const validate = () => {
        return baseNodeFormRef.value?.validate().catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err })
        })
        }

        onMounted(() => {
        set(props.nodeModel, 'validate', validate)
        })
        </script>

        <style lang="scss" scoped></style>