import request from '@/utils/request'
// 获取产品列表
export function getPList(params) {
  return request({
    url: '/manager/product/list',
    method: 'get',
    params
  })
}
// 获取活动Act列表
export function getPActivityList(params) {
  return request({
    url: '/manager/product/activity/list',
    method: 'get',
    params
  })
}
// 获取标签Tag列表
export function getPTagList(params) {
  return request({
    url: '/manager/product/tag/list',
    method: 'get',
    params
  })
}
// 新增或更新活动Act
export function refreshAct(data) {
  return request({
    url: '/manager/product/activity',
    method: 'post',
    data
  })
}
// 新增或更新标签Tag
export function refreshTag(data) {
  return request({
    url: '/manager/product/tag',
    method: 'post',
    data
  })
}

// Listing传值获取SKU
export function getSKUForListing(params) {
  return request({
    url: '/manager/product/getSkusForListing',
    method: 'get',
    params
  })
}

// Tag传值获取SKU
export function getSkusForTag(params) {
  return request({
    url: '/manager/product/getSkusForTag',
    method: 'get',
    params
  })
}
