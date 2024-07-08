import { t } from '@/locales'
import Layout from '@/layout/main-layout/index.vue'

const applicationRouter = {
  path: '/application',
  name: 'application',
  meta: { title: t('application'), permission: 'APPLICATION:READ' },
  redirect: '/application',
  children: [
    {
      path: '/application',
      name: 'application',
      component: () => import('@/views/application/index.vue')
    },
    {
      path: '/application/create',
      name: 'CreateApplication',
      meta: { activeMenu: '/application' },
      component: () => import('@/views/application/CreateAndSetting.vue'),
      hidden: true
    },
    {
      path: '/application/:id/:type',
      name: 'ApplicationDetail',
      meta: { title: t('applicationDetail'), activeMenu: '/application' },
      component: Layout,
      hidden: true,
      children: [
        {
          path: 'overview',
          name: 'AppOverview',
          meta: {
            icon: 'app-all-menu',
            iconActive: 'app-all-menu-active',
            title: t('overview'),
            active: 'overview',
            parentPath: '/application/:id/:type',
            parentName: 'ApplicationDetail'
          },
          component: () => import('@/views/application-overview/index.vue')
        },
        {
          path: 'setting',
          name: 'AppSetting',
          meta: {
            icon: 'app-setting',
            iconActive: 'app-setting-active',
            title: t('setting'),
            active: 'setting',
            parentPath: '/application/:id/:type',
            parentName: 'ApplicationDetail'
          },
          component: () => import('@/views/application/ApplicationSetting.vue')
        },
        {
          path: 'hit-test',
          name: 'AppHitTest',
          meta: {
            icon: 'app-hit-test',
            title: t('hitTest'),
            active: 'hit-test',
            parentPath: '/application/:id/:type',
            parentName: 'ApplicationDetail'
          },
          component: () => import('@/views/hit-test/index.vue')
        },
        {
          path: 'log',
          name: 'Log',
          meta: {
            icon: 'app-document',
            iconActive: 'app-document-active',
            title: t('log'),
            active: 'log',
            parentPath: '/application/:id/:type',
            parentName: 'ApplicationDetail'
          },
          component: () => import('@/views/log/index.vue')
        }
      ]
    }
  ]
}

export default applicationRouter