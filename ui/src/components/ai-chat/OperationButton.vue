<template>
  <div>
    <el-text type="info">
      <span class="ml-4">{{ datetimeFormat(data.create_time) }}</span>
    </el-text>
  </div>
  <div>
    <el-tooltip effect="dark" :content="$t('changeAnswer')" placement="top">
      <el-button :disabled="chat_loading" text @click="regeneration">
        <AppIcon iconName="VideoPlay"></AppIcon>
      </el-button>
    </el-tooltip>
    <el-divider direction="vertical" />
    <el-tooltip effect="dark" :content="$t('copy')" placement="top">
      <el-button text @click="copyClick(data?.answer_text)">
        <AppIcon iconName="app-copy"></AppIcon>
      </el-button>
    </el-tooltip>
    <el-divider direction="vertical" />
    <el-tooltip
      effect="dark"
      :content="$t('agree')"
      placement="top"
      v-if="buttonData?.vote_status === '-1'"
    >
      <el-button text @click="voteHandle('0')" :disabled="loading">
        <AppIcon iconName="app-like"></AppIcon>
      </el-button>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      :content="$t('cancelAgree')"
      placement="top"
      v-if="buttonData?.vote_status === '0'"
    >
      <el-button text @click="voteHandle('-1')" :disabled="loading">
        <AppIcon iconName="app-like-color"></AppIcon>
      </el-button>
    </el-tooltip>
    <el-divider direction="vertical" v-if="buttonData?.vote_status === '-1'" />
    <el-tooltip
      effect="dark"
      :content="$t('oppose')"
      placement="top"
      v-if="buttonData?.vote_status === '-1'"
    >
      <el-button text @click="voteHandle('1')" :disabled="loading">
        <AppIcon iconName="app-oppose"></AppIcon>
      </el-button>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      :content="$t('cancelOppose')"
      placement="top"
      v-if="buttonData?.vote_status === '1'"
    >
      <el-button text @click="voteHandle('-1')" :disabled="loading">
        <AppIcon iconName="app-oppose-color"></AppIcon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { copyClick } from '@/utils/clipboard';
import applicationApi from '@/api/application';
import { datetimeFormat } from '@/utils/time';
import { t } from '@/locales'; // 导入国际化配置

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  applicationId: {
    type: String,
    default: ''
  },
  chatId: {
    type: String,
    default: ''
  },
  chat_loading: {
    type: Boolean
  },
  log: Boolean
});

const emit = defineEmits(['update:data', 'regeneration']);

const buttonData = ref(props.data);
const loading = ref(false);

function regeneration() {
  emit('regeneration');
}

function voteHandle(val: string) {
  applicationApi
    .putChatVote(props.applicationId, props.chatId, props.data.record_id, val, loading)
    .then(() => {
      buttonData.value['vote_status'] = val;
      emit('update:data', buttonData.value);
    });
}
</script>

<style lang="scss" scoped></style>