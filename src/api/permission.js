import request from '@/utils/request'

export function getRoutesPage(params) {
  return request({
    url: '/manager/role/page',
    method: 'get',
    params
  })
}

export function getRoutesList(params) {
  return request({
    url: '/manager/role/list',
    method: 'get',
    params
  })
}

export function createRole(data) {
  return request({
    url: '/manager/role/create',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/manager/role/${id}`,
    method: 'put',
    data
  })
}

export function getUserPage(params) {
  return request({
    url: '/manager/user/page',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return request({
    url: '/manager/user/create',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/manager/user/${id}`,
    method: 'put',
    data
  })
}

export function changePassword(data) {
  return request({
    url: `/manager/user/changePassword`,
    method: 'post',
    data
  })
}

export function resetPassword(id) {
  return request({
    url: `/manager/user/resetPassword/${id}`,
    method: 'post'
  })
}

export function updateUserName(params) {
  return request({
    url: '/manager/user/updateName',
    method: 'put',
    params
  })
}

export function getMenuPage(params) {
  return request({
    url: '/manager/menu/page',
    method: 'get',
    params
  })
}

export function getMenuTreeForRoleCreate(params) {
  return request({
    url: '/manager/menu/getMenuForRoleCreate',
    method: 'get',
    params
  })
}

export function getMenuTree(params) {
  return request({
    url: '/manager/menu/tree',
    method: 'get',
    params
  })
}

export function createMenu(data) {
  return request({
    url: '/manager/menu/create',
    method: 'post',
    data
  })
}

export function updateMenu(id, data) {
  return request({
    url: `/manager/menu/${id}`,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/manager/menu/${id}`,
    method: 'delete'
  })
}
