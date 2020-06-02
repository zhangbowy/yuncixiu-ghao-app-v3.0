import wx from 'weixin-js-sdk'

/*

微信支付方法

获取微信加签信息

@param{data}:获取的微信加签

@param{cb}:成功回调

@param{errorCb}:失败回调

@param{type}:判断调用分享的微信接口类型

*/

const wechatInterface = (data, shareInfo, type) => {
  const appId = data.appId || 'wx282ce15fcad766e7'

  const timestamp = data.timestamp || '1590980227'

  const nonceStr = data.nonceStr || '2121212'

  const signature = data.signature || '36236194535cea4ba07ed02586de0d862668beee'

  // const packages = data.package

  // const paySign = data.paySign

  wx.config({

    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

    appId: appId, // 必填，公众号的唯一标识

    timestamp: timestamp, // 必填，生成签名的时间戳

    nonceStr: nonceStr, // 必填，生成签名的随机串

    signature: signature, // 必填，签名，见附录1

    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

  })

  if (type === 0) {
    // 分享朋友
    wx.ready(function() {
      wx.onMenuShareAppMessage({
        title: shareInfo.name, // 分享标题
        desc: shareInfo.desc, // 分享描述
        link: `/goodsDetail?goods_id=${shareInfo.id}`, // 分享链接
        imgUrl: shareInfo.thumb_image_path, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // 用户确认分享后执行的回调函数
          console.log('分享成功')
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
          console.log('分享取消分享')
        }
      })
    })
  } if (type === 1) {
    // 分享朋友圈
    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: shareInfo.name, // 分享标题
        link: `/goodsDetail?goods_id=${shareInfo.id}`, // 分享链接
        imgUrl: shareInfo.thumb_image_path, // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
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

