import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/inner/user/login',
    method: 'post',
    data
  })
}
export function regist(data) {
  return request({
    url: '/inner/user/create',
    method: 'post',
    data
  })
}

export function getRouters() {
  return request({
    url: '/inner/user/getRouters',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/inner/user/userInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function updateUser(data) {
  return request({
    url: '/api/account/update',
    data,
    method: 'post'
  })
}

