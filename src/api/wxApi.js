import request from '@/utils/request'

export function getSignature(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export const wxLogin = (appid, url) => {
  const redirect_uri = encodeURIComponent(url)
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATUS#wechat_redirect`
}

