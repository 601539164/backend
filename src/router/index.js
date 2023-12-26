import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/resourceManagement',
    component: Layout,
    meta: { title: '资源位管理', icon: 'documentation' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/ResourceManagement/list'),
        name: 'rmList',
        meta: { title: '资源位列表', icon: 'list' }
      }, {
        path: 'setting',
        component: () => import('@/views/ResourceManagement/setting'),
        name: 'rmSetting',
        meta: { title: '类型规则配置', icon: 'edit' }
      }, {
        path: 'listing',
        component: () => import('@/views/ResourceManagement/listing'),
        name: 'rmListing',
        meta: { title: 'Listing资源位页面', icon: 'listing' }
      }, {
        path: 'advertising',
        component: () => import('@/views/ResourceManagement/advertising'),
        name: 'advertising',
        meta: { title: '广告位列表', icon: 'advertising' }
      }
    ]
  },
  {
    path: '/productsManagement',
    component: Layout,
    meta: { title: '商品', icon: 'product' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/ProductsManagement/list'),
        name: 'pmList',
        meta: { title: '商品列表', icon: 'productList' }
      }, {
        path: 'tags',
        component: () => import('@/views/ProductsManagement/tags'),
        name: 'pmTags',
        meta: { title: '标记管理', icon: 'productTags' }
      }
    ]
  },
  // {
  //   path: '/order',
  //   component: Layout,
  //   name: 'Order',
  //   meta: {
  //     title: 'Order',
  //     icon: 'lock'
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/Gift/Index'),
  //       name: 'Gift',
  //       meta: { title: '分享拉新奖励', icon: 'dollar' }
  //     }
  //   ]
  // },
  {
    path: '/marketing',
    component: Layout,
    meta: { title: '营销', icon: 'marketing' },
    children: [
      {
        path: 'creditactivity',
        component: () => import('@/views/creditactivity/Index'),
        name: 'creditactivity',
        meta: { title: 'Credit活动列表', icon: 'dollar' }
      },
      {
        path: 'creditActivityDetail/:id',
        component: () => import('@/views/creditactivity/creditActivityDetail'),
        name: 'creditActivityDetail/:id',
        meta: {
          title: 'Credit Activity Detail',
          icon: 'lock',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'creditOfChanges/:id',
        component: () => import('@/views/creditactivity/creditOfChanges'),
        name: 'creditOfChanges/:id',
        meta: {
          title: 'creditOfChanges',
          icon: 'lock',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'gift',
        component: () => import('@/views/Gift/Index'),
        name: 'Gift',
        meta: { title: '分享拉新奖励', icon: 'dollar' }
      },
      {
        path: 'incentiveList',
        component: () => import('@/views/Operation/incentiveList'),
        name: 'incentiveList',
        meta: { title: '激励活动列表', icon: 'incentive' }
      },
      {
        path: 'activitylinkList/:id',
        component: () => import('@/views/Operation/activitylinkList'),
        name: 'activitylinkList/:id',
        meta: { title: '活动关联用户列表', icon: 'incentive' },
        hidden: true
      },
      {
        path: 'groupDetailList/:id',
        component: () => import('@/views/Operation/groupDetailList'),
        name: 'groupDetailList/:id',
        meta: { title: '参团列表', icon: 'group' },
        hidden: true
      },
      {
        path: 'fissileDetailList/:id',
        component: () => import('@/views/Operation/fissileDetailList'),
        name: 'fissileDetailList/:id',
        meta: { title: '裂变详情', icon: 'group' },
        hidden: true
      },
      {
        path: 'couponClaim',
        component: () => import('@/views/Marketing/couponClaim'),
        name: 'CouponClaim',
        meta: { title: '优惠券领取活动', icon: 'couponClaim', noCache: true }
      },
      {
        path: 'couponClaimSetting/:id',
        component: () => import('@/views/Marketing/couponClaimSetting'),
        name: 'couponClaimSetting/:id',
        meta: { title: '优惠券领取活动配置', icon: 'couponClaim' },
        hidden: true
      },
      {
        path: 'couponClaimDetails/:id',
        component: () => import('@/views/Marketing/couponClaimDetails'),
        name: 'couponClaimDetails/:id',
        meta: { title: '优惠券活动领取详情', icon: 'couponClaim' },
        hidden: true
      },
      {
        path: 'emailTemplateList',
        component: () => import('@/views/Global/templateList'),
        name: 'EmailTemplateList',
        meta: { title: '邮件模板列表', icon: 'list' }
      },
      {
        path: 'emailTemplateDetails/:id(\\d+)',
        component: () => import('@/views/Global/templateDetails'),
        name: 'details/:id(\\d+)',
        meta: { title: '邮件模板详情', icon: 'emailDetails', noCache: true },
        hidden: true
      },
      {
        path: 'countdown',
        component: () => import('@/views/Global/countdown'),
        name: 'Countdown',
        meta: { title: '倒计时', icon: 'cutdown' }
      }
    ]
  },
  {
    path: '/universal',
    component: Layout,
    meta: { title: '通用', icon: 'common' },
    children: [
      {
        path: 'coupon',
        component: () => import('@/views/Common/coupon'),
        name: 'coupon',
        meta: { title: '优惠券', icon: 'coupon' }
      },
      {
        path: 'couponSetting/:id',
        component: () => import('@/views/Common/couponSetting'),
        name: 'couponSetting/:id',
        meta: { title: '优惠券配置', icon: 'coupon', noCache: true },
        hidden: true
      },
      {
        path: 'holidays',
        component: () => import('@/views/Common/holiday'),
        name: 'Holidays',
        meta: { title: '节假日', icon: 'holiday' }
      },
      {
        path: 'Installer',
        component: () => import('@/views/Common/installerLocator'),
        name: 'Authorized Installer',
        meta: { title: 'Authorized Installer', icon: 'locator' }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    name: 'Settings',
    meta: {
      title: '设置',
      icon: 'lock'
    },
    children: [
      {
        path: 'account',
        component: () => import('@/views/PermissionM/account'),
        name: 'account management',
        meta: {
          title: 'account management',
          icon: 'user'
        }
      },
      {
        path: 'details/:id',
        component: () => import('@/views/PermissionM/accountDetails'),
        name: 'accountDetails/:id',
        meta: {
          title: 'account details',
          icon: 'lock',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'role',
        component: () => import('@/views/PermissionM/roles'),
        name: 'role Management',
        meta: {
          title: 'role Management',
          icon: 'lock'
        }
      },
      {
        path: 'right',
        component: () => import('@/views/PermissionM/right'),
        name: 'rights management',
        meta: {
          title: 'rights management',
          icon: 'lock'
        }
      }
    ]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
