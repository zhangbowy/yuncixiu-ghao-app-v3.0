// 计算每个sku后面有多少项
export function getLevels(tree) {
  const level = []
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].leaf) {
      level[i] = tree[i + 1].leaf.length * level[i + 1] || 1
    } else {
      level[i] = 1
    }
  }
  return level
}

/**
 * 笛卡尔积运算
 * @param  {[type]} tree   [description]
 * @param  {Array}  stocks [description]
 * @return {[type]}        [description]
 */
export function flatten(tree, stocks = [], options) {
  const { optionValue = 'id', optionText = 'value' } = options || {}
  const result = []
  let skuLen = 0
  const stockMap = {} // 记录已存在的stock的数据
  const level = getLevels(tree)
  if (tree.length === 0) return result
  tree.forEach(sku => {
    const { leaf } = sku
    if (!leaf || leaf.length === 0) return true
    skuLen = (skuLen || 1) * leaf.length
  })
  // 根据已有的stocks生成一个map
  stocks.forEach(stock => {
    const { skus, ...attr } = stock
    stockMap[skus.map(item => `${item.k_id}_${item.v_id}`).join('|')] = attr
  })
  for (let i = 0; i < skuLen; i++) {
    const skus = []
    const mapKey = []
    tree.forEach((sku, column) => {
      const { leaf } = sku
      let item = {}
      if (!leaf || leaf.length === 0) return true
      if (leaf.length > 1) {
        const row = parseInt(i / level[column], 10) % leaf.length
        item = tree[column].leaf[row]
      } else {
        item = tree[column].leaf[0]
      }
      if (!sku[optionValue] || !item[optionValue]) return
      mapKey.push(`${sku[optionValue]}_${item[optionValue]}`)
      skus.push({
        k_id: sku[optionValue],
        k: sku[optionText],
        v_id: item[optionValue],
        v: item[optionText]
      })
    })
    const { ...data } = stockMap[mapKey.join('|')] || {}
    // 从map中找出存在的sku并保留其值
    result.push({ ...data, skus })
  }
  return result
}

/**
 * 判断两个sku是否相同
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {Boolean}         [description]
 */
export function isEqual(prevSKU, nextSKU, options) {
  const { optionValue = 'id' } = options || {}
  return (
    nextSKU.length === prevSKU.length &&
    nextSKU.every(({ leaf = [] }, index) => {
      const prevLeaf = prevSKU[index].leaf || []
      return (
        prevSKU[index][optionValue] === nextSKU[index][optionValue] &&
        leaf.length === prevLeaf.length &&
        leaf.map(item => item[optionValue]).join(',') ===
          prevLeaf.map(item => item[optionValue]).join(',')
      )
    })
  )
}

// 获取url上的参数
export const getUrlParams = () => {
  var url = location.search // 获取url携带的参数
  var urlParams = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      urlParams[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return urlParams
}

// 判断是否为微信浏览器
export const isWeiXin = () => {
  var ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
    return true // 是微信端
  } else {
    return false
  }
}

// 获取屏幕dpi arr[宽，高]
export function js_getDPI() {
  var arrDPI = []
  if (window.screen.deviceXDPI !== undefined) {
    arrDPI[0] = window.screen.deviceXDPI
    arrDPI[1] = window.screen.deviceYDPI
  } else {
    var tmpNode = document.createElement('DIV')
    tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
    document.body.appendChild(tmpNode)
    arrDPI[0] = parseInt(tmpNode.offsetWidth)
    arrDPI[1] = parseInt(tmpNode.offsetHeight)
    tmpNode.parentNode.removeChild(tmpNode)
  }
  return arrDPI
}

// 像素转mm
export function px2mm(pxValue, dpi) {
  const mm = pxValue / dpi * 2.54 * 10// dpi为上面获取的，自己对应XY轴
  return mm
}

// mm像素
export function mm2px(mm, dpi) {
  const px = mm / (2.54 * 10) * dpi
  return px
}

/**
 * 已知毫米和比例 转换毫米对等的像素
 * @param {*} mm
 * @param {*} Proportion
 */
export function mmTopx(mm, Proportion) {
  const px = mm / Proportion
  return px
}

/**
 * 已知像素和比例 转换像素对等的毫米
 * @param {*} px
 * @param {*} Proportion
 */
export function pxTomm(px, Proportion) {
  const mm = px * Proportion
  return mm
}

// 只提取汉字
export function GetChinese(strValue) {
  if (strValue != null && strValue !== '') {
    var reg = /[\u4e00-\u9fa5]/g
    return strValue.match(reg).join('')
  } else { return '' }
}

// 去掉汉字
export function RemoveChinese(strValue) {
  if (strValue != null && strValue !== '') {
    var reg = /[\u4e00-\u9fa5]/g
    return strValue.replace(reg, '')
  } else { return '' }
}

export function imageUrlToBase64(url) {
  console.log(url)
  // 一定要设置为let，不然图片不显示
  const image = new Image()

  // 解决跨域问题
  image.setAttribute('crossOrigin', 'anonymous')

  const imageUrl = url
  image.src = imageUrl

  // image.onload为异步加载
  image.onload = () => {
    var canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)

    var quality = 1
    // 这里的dataurl就是base64类型
    var dataURL = canvas.toDataURL('image/png', quality)// 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
    return dataURL
  }
}

// 函数防抖
export function debounce(fn, wait) {
  let timeout = null
  wait = wait || 600
  return function() {
    const that = this
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(that)
    }, wait)
  }
}

// 获取图片原始宽高
export function getNaturalImgSize(img, callback) {
  /**
  * img元素
  * callback 回调函数
  **/
  var nWidth, nHeight
  if (img.naturalWidth) { // 现代浏览器
    nWidth = img.naturalWidth
    nHeight = img.naturalHeight
    callback({
      w: nWidth,
      h: nHeight
    })
  } else { // IE6/7/8
    var image = new Image()
    image.src = img
    image.onload = function() {
      callback({
        w: image.width,
        h: image.height
      })
    }
  }
}
