import request from '@/utils/request'
// 获取用户列表
export function getList(params) {
  return request({
    url: '/manager/fission/list',
    method: 'get',
    params
  })
}
// 增加credit
export function addCredit(data) {
  return request({
    url: '/manager/fission/credit/add',
    method: 'post',
    data
  })
}
// 减少credit
export function reducedCredit(data) {
  return request({
    url: '/manager/fission/credit/deduct',
    method: 'post',
    data
  })
}
// 刷新credit
export function refreshCredit(data) {
  return request({
    url: '/manager/fission/credit/refresh',
    method: 'post',
    data
  })
}
// 下载excel
export function downloadExcel(data) {
  return request({
    url: '/manager/fission/down/excel',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
