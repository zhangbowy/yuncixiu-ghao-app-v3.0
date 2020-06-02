// 微信支付
export const wxPay = (data, callback, error) => {
  function onBridgeReady() {
    // eslint-disable-next-line no-undef
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        'appId': data.appId, // 公众号名称，由商户传入
        'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
        'nonceStr': data.nonceStr, // 随机串
        'package': data.package,
        'signType': 'MD5', // 微信签名方式：
        'paySign': data.paySign // 微信签名
      },
      function(res) {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          callback('success')
        } else {
          error('error')
        }
      })
  }
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
    }
  } else {
    onBridgeReady()
  }
}
