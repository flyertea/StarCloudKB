<template>
  <div>
    <el-button v-hasPermission="'USER:DELETE'">{{ $t('userDeletePermission') }}</el-button>
    <el-button v-hasPermission="'USER:READ'">{{ $t('userReadPermission') }}</el-button>
    <el-button v-hasPermission="new Role('USER')">{{ $t('normalUserRole') }}</el-button>
    <el-button v-hasPermission="[new Role('ADMIN'), new Role('USER')]">{{ $t('normalUserOrAdmin') }}</el-button>
    <el-button v-hasPermission="{ permission: ['USER:READ', new Role('USER')], compare: 'AND' }">{{ $t('normalRoleAndUserReadPermission') }}</el-button>

    {{ $t('homepage') }}
  </div>
</template>

<script setup lang="ts">
import { Role } from '@/utils/permission/type'
</script>

<style lang="scss" scoped></style>