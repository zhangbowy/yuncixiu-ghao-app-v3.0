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

  wx.config({

    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

    appId: appId, // 必填，公众号的唯一标识

    timestamp: timestamp, // 必填，生成签名的时间戳

    nonceStr: nonceStr, // 必填，生成签名的随机串

    signature: signature, // 必填，签名，见附录1

    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

  })
  // 由于微信不让诱导分享，所以只能点击右上角三个点中的分享按钮
  // 这里的分享只是修改了分享内容
  if (type === 'share') {
    // const paySign = data.paySign
    const url = window.location.href.split('#')[0] // 获取锚点之前的链接
    // let links = url+'#/Food/' + this.$route.params.id;
    const links = url + '#/goodsDetail?goods_id=' + data.shareInfo.id
    // 分享朋友
    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
    wx.ready(function() {
      wx.updateAppMessageShareData({
        title: `${data.shareInfo.name}`, // 分享标题
        desc: data.shareInfo.desc, // 分享描述
        link: links, // 分享链接
        imgUrl: data.shareInfo.thumb_image_path, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
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
    // 定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
    wx.ready(function() { // 需在用户可能点击分享按钮前就先调用
      wx.updateTimelineShareData({
        title: `${data.shareInfo.name}`, // 分享标题
        link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
  }
  if (type === 'scan') {
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

