<template>

  <login-layout v-loading="loading">
    <LoginContainer :subTitle="$t('views.login.welcomeMessage')">
      <h2 class="mb-24"> {{$t('views.login.normalLogin')}}
        <el-dropdown trigger="click" type="primary">
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(lang, index) in langList"
                :key="index"
                :value="lang.value"
                @click="changeLang(lang.value)"
              >
                {{ lang.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
          <div class="dropdown-content">
            <AppIcon
              iconName="app-translate"
              class="cursor color-secondary ml-8"
              style="font-size: 20px"
            >
            </AppIcon>
            {{ currentLangLabel }}

          </div>
        </el-dropdown>
        </h2>
      <el-form
        class="login-form"
        :rules="rules"
        :model="loginForm"
        ref="loginFormRef"
        @keyup.enter="login"
      >
        <div class="mb-24">
          <el-form-item prop="username">
            <el-input
              size="large"
              class="input-item"
              v-model="loginForm.username"
               :placeholder="$t('views.login.requiredUsername')"
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="mb-24">
          <el-form-item prop="password">
            <el-input
              type="password"
              size="large"
              class="input-item"
              v-model="loginForm.password"
              :placeholder="$t('views.login.requiredPassword')"
              show-password
            >
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-button size="large" type="primary" class="w-full" @click="login">         {{$t('views.login.loginButton')}}</el-button>
      <div class="operate-container flex-between mt-12">
        <!-- <el-button class="register" @click="router.push('/register')" link type="primary">
          注册
        </el-button> -->
        <el-button
          class="forgot-password"
          @click="router.push('/forgot_password')"
          link
          type="primary"
        >
           {{$t('views.login.forgotPassword')}}
        </el-button>
      </div>
    </LoginContainer>
  </login-layout>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LoginRequest } from '@/api/type/user'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import useStore from '@/stores'
import { useI18n } from 'vue-i18n'



import { langList as computedLangList } from '@/locales/index'
import { useLocale } from '@/locales/useLocale'

const { t ,locale } = useI18n()
const { changeLocale } = useLocale()
// 获取当前语言的标签
// 解包 langList 并查找当前语言的标签
const langList = computedLangList.value
const currentLangLabel = computed(() => {
  const currentLang = locale.value
  const lang = langList.find((l: any)  => l.value === currentLang)
  return lang ? lang.label : ''
})

const changeLang = (lang: string) => {
  changeLocale(lang)
}

const loading = ref<boolean>(false)
const { user } = useStore()
const router = useRouter()
const loginForm = ref<LoginRequest>({
  username: '',
  password: ''
})



const rules = computed<FormRules>(() => ({
  username: [
    {
      required: true,
      message: t('views.login.requiredUsername'),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('views.login.requiredPassword'),
      trigger: 'blur'
    }
  ]
}))


const loginFormRef = ref<FormInstance>()

const login = () => {
  loginFormRef.value?.validate().then(() => {
    loading.value = true
    user
      .login(loginForm.value.username, loginForm.value.password)
      .then(() => {
        router.push({ name: 'home' })
      })
      .finally(() => (loading.value = false))
  })
}
</script>
<style lang="scss" scope>
.el-dropdown {float:right;}
.dropdown-content {
  display: flex;
  align-items: center;
  color:#666666;
}

</style>
