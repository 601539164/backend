import request from '@/utils/request'

// Holiday start
// 获取节假日分页列表
export function getHolidatPage(data) {
  return request({
    url: '/manager/timesConfig/holidayConfig/page',
    method: 'post',
    data
  })
}

// 新增、修改节假日
export function addHoliday(data) {
  return request({
    url: '/manager/timesConfig/holidayConfig/save',
    method: 'post',
    data
  })
}

// 返回节假日列表
export function getHolidayList(params) {
  return request({
    url: '/manager/timesConfig/holidayConfig/list',
    method: 'get',
    params
  })
}
// Holiday end

//  Locator start
export function getinstallerList(data) {
  return request({
    url: '/manager/installer/page',
    method: 'post',
    data
  })
}

export function updateInstallerInfo(data) {
  return request({
    url: '/manager/installer/save',
    method: 'post',
    data
  })
}

export function updateInstallerStatus(data) {
  return request({
    url: '/manager/installer/changeStatus',
    method: 'post',
    data
  })
}

export function exportInstaller(data) {
  return request({
    url: '/manager/installer/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function importInstaller(data) {
  return request({
    url: '/manager/installer/import',
    method: 'post',
    data
  })
}

//  Locator end

// 字典管理start
export function getTypeList(params) {
  return request({
    url: '/dict/getByType',
    method: 'get',
    params
  })
}
// 字典管理end

// counpon start
export function getCouponPage(data) {
  return request({
    url: '/manager/coupon/config/page',
    method: 'post',
    data
  })
}

export function saveCoupon(data) {
  return request({
    url: '/manager/coupon/config/save',
    method: 'post',
    data
  })
}

export function getCouponDetail(params) {
  return request({
    url: '/manager/coupon/config/detail',
    method: 'get',
    params
  })
}

export function changeStatusCoupon(data) {
  return request({
    url: '/manager/coupon/config/changeStatus',
    method: 'post',
    data
  })
}
// counpon end

