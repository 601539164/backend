import request from '@/utils/request'

export function getActivityPage(params) {
  return request({
    url: '/manager/creditCampaign/pages',
    method: 'get',
    params
  })
}

export function getRecordPage(params) {
  return request({
    url: `/manager/creditCampaign/record/pages`,
    method: 'get',
    params
  })
}
// 导出

export function exportRecord(data) {
  return request({
    url: `/manager/creditCampaign/down/records/${data.id}`,
    method: 'post',
    responseType: 'blob',
    data
  })
}

//
export function getActivity(params) {
  return request({
    url: '/manager/creditCampaign/page',
    method: 'get',
    params
  })
}

// 创建活动
export function createActivity(data) {
  return request({
    url: '/manager/creditCampaign/add',
    method: 'post',
    data
  })
}

// 删
export function deleteActivity(data) {
  return request({
    url: `/manager/creditCampaign/${data}`,
    method: 'delete',
    data
  })
}

// 更新状态
export function changeStatus(data) {
  return request({
    url: `/manager/creditCampaign/status/${data.id}`,
    method: 'post',
    data
  })
}

export function updateActivity(data) {
  return request({
    url: `/manager/creditCampaign/update/${data.id}`,
    method: 'post',
    data
  })
}
