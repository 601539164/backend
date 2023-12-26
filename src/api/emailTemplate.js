import request from '@/utils/request'
// 获取邮件模板列表
export function getEmailTemplatelist(params) {
  return request({
    url: '/manager/mail/template/list',
    method: 'get',
    params
  })
}
// 更新邮件模板
export function refreshEmailTemplate(req) {
  return request({
    url: '/manager/mail/template/update',
    method: 'post',
    data: req
  })
}
