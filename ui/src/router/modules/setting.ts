import { hasPermission } from '@/utils/permission/index'
import Layout from '@/layout/main-layout/index.vue'
import { Role } from '@/utils/permission/type'

import { t } from '@/locales'

const settingRouter = {
  path: '/setting',
  name: 'setting',
  meta: { icon: 'Setting', title: t('systemSettings'), permission: 'SETTING:READ' },
  redirect: () => {
    if (hasPermission(new Role('ADMIN'), 'AND')) {
      return '/user'
    }
    return '/team'
  },
  component: Layout,
  children: [
    {
      path: '/user',
      name: 'user',
      meta: {
        icon: 'User',
        iconActive: 'UserFilled',
        title: t('userManagement'),
        activeMenu: '/setting',
        parentPath: '/setting',
        parentName: 'setting',
        permission: new Role('ADMIN')
      },
      component: () => import('@/views/user-manage/index.vue')
    },
    {
      path: '/team',
      name: 'team',
      meta: {
        icon: 'app-team',
        iconActive: 'app-team-active',
        title: t('teamMembers'),
        activeMenu: '/setting',
        parentPath: '/setting',
        parentName: 'setting'
      },
      component: () => import('@/views/team/index.vue')
    },
    {
      path: '/template',
      name: 'template',
      meta: {
        icon: 'app-template',
        iconActive: 'app-template-active',
        title: t('modelSettings'),
        activeMenu: '/setting',
        parentPath: '/setting',
        parentName: 'setting'
      },
      component: () => import('@/views/template/index.vue')
    },
    {
      path: '/email',
      name: 'email',
      meta: {
        icon: 'Message',
        title: t('emailSettings'),
        activeMenu: '/setting',
        parentPath: '/setting',
        parentName: 'setting',
        permission: new Role('ADMIN')
      },
      component: () => import('@/views/email/index.vue')
    }
  ]
}

export default settingRouter