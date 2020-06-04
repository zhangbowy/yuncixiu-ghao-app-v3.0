import wx from 'weixin-js-sdk'

/*

微信支付方法

获取微信加签信息

@param{data}:获取的微信加签

@param{cb}:成功回调

@param{errorCb}:失败回调

@param{type}:判断调用分享的微信接口类型

*/

const wechatInterface = (data, type, resolve, reject) => {
  const appId = data.data.appid

  const timestamp = data.data.timestamp

  const nonceStr = data.data.noncestr

  const signature = data.data.signature

  // const packages = data.package

  // const paySign = data.paySign

  wx.config({

    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

    appId: appId, // 必填，公众号的唯一标识

    timestamp: timestamp, // 必填，生成签名的时间戳

    nonceStr: nonceStr, // 必填，生成签名的随机串

    signature: signature, // 必填，签名，见附录1

    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

  })

  if (type === 0) {
    // 分享朋友
    wx.ready(function() {
      wx.onMenuShareAppMessage({
        title: data.shareInfo.name, // 分享标题
        desc: data.shareInfo.desc, // 分享描述
        link: `/goodsDetail?goods_id=${data.shareInfo.id}`, // 分享链接
        imgUrl: data.shareInfo.thumb_image_path, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // 用户确认分享后执行的回调函数
          console.log('分享成功')
          resolve()
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
          console.log('分享取消分享')
          reject()
        }
      })
    })
  } if (type === 1) {
    // 分享朋友圈
    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: data.shareInfo.name, // 分享标题
        link: `/goodsDetail?goods_id=${data.shareInfo.id}`, // 分享链接
        imgUrl: data.shareInfo.thumb_image_path, // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
          resolve()
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
          reject()
        }
      })
    })
  } if (type === 'scan') {
    wx.ready(function() {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          resolve(result)
        },
        cancel: function() {
          reject()
        }
      })
    })
  }

  wx.error(function(res) {
    console.log(res)

    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

    /* alert("config信息验证失败");*/
  })
}

export default wechatInterface

