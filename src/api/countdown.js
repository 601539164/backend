import request from '@/utils/request'
// 获取倒计时数据返回
export function getCDInfo() {
  return request({
    url: '/manager/flashSale/config',
    method: 'get'
  })
}
// 修改倒计时信息
export function refreshCDInfo(data) {
  return request({
    url: '/manager/flashSale/config',
    method: 'post',
    data
  })
}
