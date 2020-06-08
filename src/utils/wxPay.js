// // 微信支付
export const wxPay = (data, callback, reject) => {
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
        try {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            callback('支付成功')
          }
          if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            callback('支付取消')
          }
          if (res.err_msg === 'get_brand_wcpay_request:fail') {
            callback('支付失败')
          }
        } catch (error) {
          reject(error)
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

// import wx from 'weixin-js-sdk'
// // 微信支付2
// export const wxPay = (data, callback, reject) => {
//   wx.config({
//     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//     appId: data.appId, // 必填，公众号的唯一标识
//     timestamp: data.timeStamp, // 必填，生成签名的时间戳
//     nonceStr: data.nonceStr, // 必填，生成签名的随机串
//     package: data.package,
//     signType: 'MD5',
//     paySign: data.paySign, // 微信签名

//     jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//   })
//   wx.ready(function() {
//     wx.chooseWXPay({
//       timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
//       nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
//       package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
//       signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
//       paySign: data.paySign, // 支付签名
//       success: function(res) {
//         // 支付成功后的回调函数
//         callback(res)
//       }
//     })
//   })
// }
