import request from '@/utils/request'
// 获取资源位配置列表
export function getResourcesSettingList(params) {
  return request({
    url: '/manager/resources/location/rule/list',
    method: 'get',
    params
  })
}

// 获取资源位类型列表
export function getResourcesTypeList() {
  return request({
    url: '/manager/resources/location/type/list',
    method: 'get'
  })
}
// 获取用户站点列表
export function getUserSiteList() {
  return request({
    url: '/manager/resources/location/site/list',
    method: 'get'
  })
}
//  添加资源位规则
export function addResourcesSetting(data) {
  return request({
    url: '/manager/resources/location/rule',
    method: 'post',
    data
  })
}
// 更新资源位规则
export function updateResourcesSetting(data) {
  return request({
    url: '/manager/resources/location/rule/' + data.id,
    method: 'post',
    data
  })
}

// 获取资源位列表
export function getResourcesList(params) {
  return request({
    url: '/manager/resources/location/list',
    method: 'get',
    params
  })
}
// 获取可用的资源规则
export function getAvailableResourcesRule() {
  return request({
    url: '/manager/resources/location/availableRule',
    method: 'get'
  })
}

// 上传资源位图片
export function uploadResourcesImg(data) {
  return request({
    url: '/manager/resources/file/upload',
    method: 'post',
    data
  })
}

// 添加资源位
export function addResources(data) {
  return request({
    url: '/manager/resources/location',
    method: 'post',
    data
  })
}
// 更新资源位
export function updateResources(data) {
  return request({
    url: '/manager/resources/location/' + data.id,
    method: 'post',
    data
  })
}

// listing resources start
// 获取Listing列表
export function getListingResources(data) {
  return request({
    url: '/manager/resources/listing/ListingConfig/page',
    method: 'post',
    data
  })
}

// 新增&编辑页面
export function addListingPage(data) {
  return request({
    url: '/manager/resources/listing/ListingConfig/save',
    method: 'post',
    data
  })
}

// 获取页面详情
export function getListingDetail(params) {
  return request({
    url: '/manager/resources/listing/ListingConfig/detail',
    method: 'get',
    params
  })
}

// listing配置SKU校验
export function listingSKUCheck(data) {
  return request({
    url: '/manager/resources/listing/ListingConfig/Check',
    method: 'post',
    data
  })
}
// listing resources end

// advertising resources start
// 获取广告位列表
export function getAdvListing(params) {
  return request({
    url: '/manager/resources/advertisement/list',
    method: 'get',
    params
  })
}

// 新增广告位
export function addAdv(data) {
  return request({
    url: '/manager/resources/advertisement',
    method: 'post',
    data
  })
}

// 编辑广告位
export function updateAdv(data) {
  return request({
    url: '/manager/resources/advertisement/' + data.id,
    method: 'post',
    data
  })
}

// 获取广告位类型列表
export function getAdvType() {
  return request({
    url: '/manager/resources/advertisement/type/list',
    method: 'get'
  })
}

// 批量删除广告位
export function deleteAdv(data) {
  return request({
    url: `/manager/resources/advertisement`,
    method: 'delete',
    data
  })
}
// advertising resources end
