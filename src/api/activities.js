import request from '@/utils/request'

// 创建活动
export function addActive(data) {
  return request({
    url: '/manager/active/add',
    method: 'post',
    data
  })
}
// 获取活动详情
export function getActive(id) {
  return request({
    url: `/manager/active/get/${id}`,
    method: 'get'
  })
}
//
// 分页获取活动列表
export function getActivePages(params) {
  return request({
    url: `/manager/active/pages`,
    method: 'get',
    params
  })
}
// 修改活动
export function updateActive(data) {
  return request({
    url: '/manager/active/update',
    method: 'post',
    data
  })
}
// 创建活动日志
export function addActiveLog(data) {
  return request({
    url: '/manager/active/log/add',
    method: 'post',
    data
  })
}
// 获取活动日志详情
export function getActiveLogDetail(params) {
  return request({
    url: `/manager/active/log/list/${params.id}`,
    method: 'get',
    params
  })
}
// 创建活动关联记录
export function createActiveLink(data) {
  return request({
    url: `/manager/active/link/user/add`,
    method: 'post',
    data
  })
}
// 创建活动关联记录详情
export function getActiveLink(id) {
  return request({
    url: `/manager/active/link/user/get/${id}`,
    method: 'get'
  })
}
// 分页获取活动关联用户列
export function getActiveLinkUser(params) {
  return request({
    url: `/manager/active/link/user/pages`,
    method: 'get',
    params
  })
}
// 活动链接用户活动修改 ？
export function updateActiveLinkUser(data) {
  return request({
    url: `/manager/active/link/user/update`,
    method: 'post',
    data
  })
}

// 导出活动日志详情
export function exportActiveLogDetail(id) {
  return request({
    url: `/manager/active/log/list/export/${id}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 审批购后分享奖励
export function approvalRewards(data) {
  return request({
    url: `/manager/active/audit/epb`,
    method: 'post',
    data
  })
}

// 分页获取购后分享奖励列表
export function getApprovalRewards(params) {
  return request({
    url: `/manager/active/audit/epb/pages`,
    method: 'get',
    params
  })
}

// 购后分享详情

export function getRewardsDetail(id) {
  return request({
    url: `/manager/active/audit/epb/${id}`,
    method: 'get'
  })
}

// 分页获取拼团活动详情列表
export function getgroupBuylist(params) {
  return request({
    url: `/manager/active/groupBuy/group/list`,
    method: 'get',
    params
  })
}

// 查看裂变明细
export function fissionDetailList(params) {
  return request({
    url: `/manager/active/fission/detail/list`,
    method: 'get',
    params
  })
}
