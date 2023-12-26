import request from '@/utils/request'

// couponClaim start
export function getCouponClaimPage(data) {
  return request({
    url: '/manager/coupon/activity/page',
    method: 'post',
    data
  })
}

export function saveCouponClaim(data) {
  return request({
    url: '/manager/coupon/activity/save',
    method: 'post',
    data
  })
}

export function getCouponClaimDetail(params) {
  return request({
    url: '/manager/coupon/activity/detail',
    method: 'get',
    params
  })
}

export function changeStatusCouponClaim(data) {
  return request({
    url: '/manager/coupon/activity/changeStatus',
    method: 'post',
    data
  })
}

export function getClaimRecords(params) {
  return request({
    url: '/manager/coupon/activity/claimRecords',
    method: 'get',
    params
  })
}

// couponClaim start
