<template>
  <div class="hand-drawn">
    <setting-board
      :line-width="lineWidth"
      :min-width="minWidth"
      :line-color="lineColor"
      :width="width"
      :height="height"
      :is-full-page="isFullPage"
      :is_horizontal="is_horizontal"
      @prop-change="onPropChange"
    />
    <!-- 中间画板 -->
    <div v-if="design_box.design_H" class="drawn-content">
      <!-- 设计区域  -->
      <design-area :area-info="designArea" :background="backgroundImg" :full="isFullPage" @hidden="hiddenFullPage">
        <!-- 非全屏 -->
        <div v-if="!isFullPage" slot="design-content" :style="designArea.designBoxStyle" class="design-img-box">
          <img :src="resultImg" :style="designImg" alt="">
        </div>
        <!-- 全屏画板 -->
        <VueSignaturePad
          v-show="isFullPage"
          slot="design-content"
          ref="signaturePad"
          :width="`${design_box.design_W}px`"
          :height="`${design_box.design_H}px`"
          :custom-style="designArea.designBoxStyle"
          :options="{ penColor:lineColor, maxWidth:lineWidth, minWidth:minWidth }"
          :step="100"
          @touchstart.native="onSignaturePadTouchstart"
          @last-history="onLastHistory"
        />
      </design-area>
    </div>
    <!-- 底部操作 -->
    <div class="footer-btn">
      <!-- <van-button type="default" size="small" @click="initPage(1)">{{ $t(`放大`) }}</van-button> -->
      <van-button v-if="!isFullPage" type="default" size="small" @click="showFullPage">{{ $t(`开始手绘`) }}</van-button>
      <van-button v-if="isFullPage" type="default" color="linear-gradient(to right, #ff6034,#ee0a24)" size="small" @click="initPage(0.8)">{{ $t(`完成`) }}</van-button>
      <van-button type="default" size="small" @click="handleReset">{{ $t(`清空`) }}</van-button>
      <van-button v-if="isFullPage" type="default" size="small" @click="undo">{{ $t(`撤销`) }}</van-button>
      <van-button v-if="!isFullPage && !is_beta" type="primary" color="linear-gradient(to right, #ff6034,#ee0a24)" :disabled="!resultImg" size="small" @click="handleGenerate">{{ $t(`完成绘制`) }}</van-button>
      <van-button v-if="!isFullPage && is_beta" type="primary" color="linear-gradient(to right, #ff6034,#ee0a24)" :disabled="!resultImg" size="small" @click="showGoods">{{ $t(`选择商品预览`) }}</van-button>
    </div>
    <!-- 完成设计弹出层 -->
    <confirm-modal v-model="confirmModal" :loading="loading" :img="previewImg" @dobuy="buyNow" @hidden="confirmModal=false" />
    <!-- 2021-08-29新增 -->
    <goods-modal
      v-model="goodsModal"
      :goods-list="goodsList"
      @change="choose_goods"
    />
    <van-popup v-model="isShowChooseColor" position="bottom" :style="{ height: '30%' }">
      <div style="margin:10px 10px; display: flex; flex-direction: row; flex-wrap: wrap;">
        <van-button style="margin: 10px 10px" v-for="(item, index) in currentGoods.color_hash" :key="index" type="default" @click="onClick_chooseColor(item)">
          {{ index }}
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { designApi } from '@/api/design'
import DesignArea from '@/components/Design/DesignArea'
import ConfirmModal from '../commonly/components/ConfirmModal'
import SettingBoard from './components/SettingBoard'
import GoodsModal from './../commonly/components/GoodsModal'
import store from '@/store'
import { mapState } from 'vuex'
import { Toast } from 'vant'
import { goodsApi } from '@/api/goods'
export default {
  beforeRouteLeave: (go, from, next) => {
    document.body.parentNode.setAttribute('class', 'portrait')
    next()
  },
  components: {
    'design-area': DesignArea,
    ConfirmModal,
    SettingBoard,
    'goods-modal': GoodsModal
  },
  data() {
    return {
      designArea: {},
      customInfo: {},
      design_box: {
        design_H: ''
      },
      cropInfo: {},
      backgroundImg: '',
      lineWidth: 3, // 笔画粗细
      oldLineWidthList: [], // 上一步笔画粗细
      minWidth: 1, // 笔锋粗细
      oldMinWidthList: [], // 上一步笔画粗细
      lineColor: '#fff',
      oldLineColorList: ['#fff'], // 上一步笔画颜色
      bgColor: '',
      resultImg: '', // 结果图片
      isCrop: true,
      // 颜色选择器
      colorShow: false,
      loading: false,
      confirmModal: false, // 完成设计
      canvasChange: false,
      isFullPage: false, // 显示全屏
      previewImg: '', // 预览图片
      width: '', // 手绘图宽度
      height: '', // 手绘图高度
      design_area_image: '', // 设计区域
      customStyle: {},
      canvasItem: '',
      designImg: {},
      is_horizontal: false,
      is_wilcom: 0,
      is_get_data: true,
      goodsModal: false,
      currentGoods: {},
      is_beta: false,
      goodsList: [],
      isShowChooseColor: false
    }
  },
  computed: {
    ...mapState([
      'design'
    ])
  },
  watch: {
    width(newValue, oldValue) {
      const maxWidth = this.customInfo?.custom_info.design_width || 150
      if (newValue > maxWidth) {
        Toast(`宽度不能超过${maxWidth}mm`)
        this.$nextTick(() => {
          this.width = maxWidth
        })
      }
    },
    height(newValue, oldValue) {
      const maxHeight = this.customInfo?.custom_info.design_height || 150
      if (newValue > maxHeight) {
        Toast(`宽度不能超过${maxHeight}mm`)
        this.$nextTick(() => {
          this.height = maxHeight
        })
      }
    }
  },
  created() {
    if (this.$route.query.goods_id && this.$route.query.sku_id) {
      this.goods_id = this.$route.query.goods_id
      this.sku_id = this.$route.query.sku_id
    }
    if (this.$route.query.beta) {
      this.is_beta = true
      this.getGoodsList()
    }
    // 获取定制信息
    this.customDetail(this.goods_id, this.sku_id)
    // 监测横竖屏
    const onOrientationChange = () => {
      if (window.orientation === 180 || window.orientation === 0) {
        this.is_horizontal = false
      }
      if (window.orientation === 90 || window.orientation === -90) {
        this.is_horizontal = true
      }
      this.is_get_data = false
      if (this.isFullPage) {
        this.initPage2()
      } else {
        this.initPage()
      }
    }
    window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', onOrientationChange, false)
  },
  methods: {
    onClick_chooseColor(item) {
      this.currentGoods.currentSku = item;
      console.log(item, '当前选中的颜色')
      this.handleGenerate()
    },
    showGoods() {
      this.goodsModal = true
    },
    choose_goods($item) {
      const { sku_list } = $item
      const _color_hash = {}
      try {
        $item.skuList = JSON.parse(sku_list)
        for (const sku of $item.skuList) {
          for (const skus of sku.skus) {
            if (skus.k == '颜色') {
              if (!_color_hash[skus.v]) {
                _color_hash[skus.v] = sku
              }
            }
          }
        }
        console.log(_color_hash, '_color_hash')
        $item.color_hash = _color_hash
        this.currentGoods = $item
        if (Object.keys(_color_hash).length == 0) {
          this.currentGoods.currentSku = $item.skuList[0]
          this.handleGenerate()
        } else {
          this.isShowChooseColor = true
        }
      } catch (e) {

      }
    },
    // 获取产品列表
    getGoodsList() {
      goodsApi.getGoodsList({
        pageSize: 1000
      }).then(res => {
        this.goodsList = res.data.data
      // if (this.design_id) {
      //   this.figureList.forEach(item => {
      //     if (Number(this.design_id) === item.design_id) {
      //       this.checkFigureItem(item)
      //       return
      //     }
      //   })
      // }
      })
    },
    change(key) {
      this.goodsModal = true
    },
    onLastHistory() {
      this.$toast(`${this.$t('不能再撤销啦')} ~ `)
    },
    onSignaturePadTouchstart(event) {
      this.saveSetting()
    },
    /**
     * 保存配置
     */
    saveSetting() {
      const propMap = {
        lineWidth: 'oldLineWidthList',
        minWidth: 'oldMinWidthList',
        lineColor: 'oldLineColorList'
      }
      for (const prop in propMap) {
        (this[prop] !== this[propMap[prop]][this[propMap[prop]].length - 1]) && this[propMap[prop]].unshift(this[prop])
      }
    },
    showFullPage() {
      this.isFullPage = true
      document.body.parentNode.setAttribute('class', 'full-page')
      this.initPage2()
    },
    // 获取定制分类模板信息
    customDetail(id, sku_id) {
      designApi.customDetail({
        id: id,
        sku_id: sku_id
      }).then(res => {
        this.customInfo = res.data
        // this.width = this.customInfo.custom_info?.design_width || ''
        // this.height = this.customInfo.custom_info?.design_height || ''
        this.backgroundImg = res.data.item && res.data.item.background ? res.data.item.background : res.data.custom_info.design_bg
        this.initPage()
      })
    },
    // 计算背景图位置 设计区域位置
    initPage() {
      (this.isFullPage === true) && (this.is_get_data = true)
      this.isFullPage = false
      document.body.parentNode.setAttribute('class', 'portrait')
      const SCREEN_WIDTH = window.screen.width // 获取  屏幕宽度
      const SCREEN_HEIGHT = window.screen.height // 获取屏幕高度 667
      // 计算比例 scale表示屏幕的宽度*scale
      let design_scale = 0
      // 横屏
      if (this.is_horizontal) {
        design_scale = SCREEN_HEIGHT * 0.8 / this.customInfo.custom_info.design_height
      } else { // 竖屏
        design_scale = SCREEN_WIDTH * 0.8 / this.customInfo.custom_info.design_width
      }
      // const design_scale = SCREEN_WIDTH * 0.8 / this.customInfo.custom_info.design_width
      this.design_box.design_scale = design_scale
      // 计算设计区背景实际宽高 ps:基本上是固定的
      this.design_box.design_bg_width = design_scale * this.customInfo.custom_info.design_bg_width
      this.design_box.design_bg_height = design_scale * this.customInfo.custom_info.design_bg_height
      // 设计区域实际跨高和左上对齐位置

      this.design_box.design_W = this.customInfo.custom_info.design_width * design_scale
      this.design_box.design_H = this.customInfo.custom_info.design_height * design_scale
      this.design_box.design_X = (SCREEN_WIDTH - this.design_box.design_W) / 2
      this.design_box.design_Y = (SCREEN_WIDTH - this.design_box.design_H) / 2
      // 计算设计区背景图的对齐位置
      this.design_box.design_bg_X = this.customInfo.custom_info.design_left * design_scale - this.design_box.design_X
      this.design_box.design_bg_Y = this.customInfo.custom_info.design_top * design_scale - this.design_box.design_Y
      // 背景图位置style
      this.designArea.designImgStyle = {
        position: 'absolute',
        width: `${this.design_box.design_bg_width}px`,
        height: `${this.design_box.design_bg_height}px`,
        left: `${-this.design_box.design_bg_X}px`,
        top: `${-this.design_box.design_bg_Y}px`
      }
      // 设计区域位置style
      this.designArea.designBoxStyle = {
        position: 'absolute',
        width: `${this.design_box.design_W}px`,
        height: `${this.design_box.design_H}px`,
        left: `${this.design_box.design_X}px`,
        top: '50%',
        marginTop: `${-this.design_box.design_H / 2}px`,
        background: `rgba(0, 0, 0, 0.5)`
      }
      this.getDrawImg()
      setTimeout(() => {
        // this.canvasChange = true
        // this.$refs.signaturePad.resizeCanvas()
      }, 1000)
    },
    // 全屏模式下计算背景图位置 设计区域位置
    initPage2() {
      const SCREEN_WIDTH = window.screen.width // 获取屏幕宽度 375
      const SCREEN_HEIGHT = window.screen.height // 获取屏幕高度 667
      // 计算比例 scale表示屏幕的宽度*scale
      let design_scale = 0
      // 横屏
      if (this.is_horizontal) {
        design_scale = SCREEN_HEIGHT / this.customInfo.custom_info.design_height
      } else { // 竖屏
        design_scale = SCREEN_WIDTH / this.customInfo.custom_info.design_width
      }
      this.design_box.design_scale = design_scale
      // 计算设计区背景实际宽高 ps:基本上是固定的
      this.design_box.design_bg_width = design_scale * this.customInfo.custom_info.design_bg_width
      this.design_box.design_bg_height = design_scale * this.customInfo.custom_info.design_bg_height
      // 设计区域实际宽高和左上对齐位置
      // 横屏
      if (this.is_horizontal) {
        this.design_box.design_W = this.customInfo.custom_info.design_width * design_scale // 比例*设计区域高度
        this.design_box.design_H = SCREEN_HEIGHT // 屏幕高度
        // 计算设计区背景图的对齐位置
        this.design_box.design_X = (SCREEN_WIDTH - this.design_box.design_W) / 2 // x轴位置
        this.design_box.design_Y = 0 // y轴
        if (this.design_box.design_X < 0) {
          this.design_box.design_X = 0
          this.design_box.design_W = SCREEN_WIDTH
        }
        this.design_box.design_bg_X = this.customInfo.custom_info.design_left * design_scale - this.design_box.design_X
        this.design_box.design_bg_Y = this.customInfo.custom_info.design_top * design_scale
      } else { // 竖屏
        this.design_box.design_W = SCREEN_WIDTH // 屏幕宽度
        this.design_box.design_H = this.customInfo.custom_info.design_height * design_scale // 比例*设计区域宽度
        // 计算设计区背景图的对齐位置
        this.design_box.design_X = 0 // x轴位置
        this.design_box.design_Y = (SCREEN_HEIGHT - this.design_box.design_H) / 2 // y轴
        if (this.design_box.design_Y < 0) {
          this.design_box.design_Y = 0
          this.design_box.design_H = SCREEN_HEIGHT
        }
        this.design_box.design_bg_X = this.customInfo.custom_info.design_left * design_scale
        this.design_box.design_bg_Y = this.customInfo.custom_info.design_top * design_scale - this.design_box.design_Y
      }
      // 背景图位置style
      this.designArea.designImgStyle = {
        position: 'absolute',
        width: `${this.design_box.design_bg_width}px`,
        height: `${this.design_box.design_bg_height}px`,
        left: `${-this.design_box.design_bg_X}px`,
        top: `${-this.design_box.design_bg_Y}px`
      }
      // 设计区域位置style
      this.designArea.designBoxStyle = {
        position: 'absolute',
        width: `${this.design_box.design_W}px`,
        height: `${this.design_box.design_H}px`,
        left: `${this.design_box.design_X}px`,
        top: `${this.design_box.design_Y}px`,
        background: `rgba(0, 0, 0, 0.5)`
      }
      setTimeout(() => {
        // this.canvasChange = true
        this.$refs.signaturePad.resizeCanvas()
        this.$forceUpdate()
      }, 500)
    },
    hiddenFullPage() {
      this.isFullPage = false
      this.initPage()
    },
    // 获取预览图
    getPreview() {
      this.loading = true
      const draw_height_scale = this.cropInfo.height / this.design_box.design_H
      const draw_left_scale = this.cropInfo.left / this.design_box.design_W
      const draw_top_scale = this.cropInfo.top / this.design_box.design_H
      // 请求预览图接口
      designApi.getPreview({
        id: this.currentGoods.id || this.$route.query.goods_id,
        type: 4,
        draw_image: this.resultImg,
        draw_height_scale: draw_height_scale,
        draw_left_scale: draw_left_scale,
        draw_top_scale: draw_top_scale,
        background: this.currentGoods.skuList ? this.currentGoods.skuList[0].images : this.customInfo.item?.background
      }).then(res => {
        this.loading = false
        this.previewImg = res.data.preview_image
        this.design_area_image = res.data.design_area_image
        this.is_wilcom = res.data.is_wilcom || 0
      }).catch(() => {
        this.loading = false
      })
    },
    // 清空画布
    handleReset() {
      this.$refs.signaturePad.clearSignature()
      this.resultImg = ''
      this.getDrawImg()
    },
    // 撤销
    undo() {
      this.$refs.signaturePad.undoSignature()
      this.getDrawImg()
      // 设置回到上一步
      // if (this.oldLineWidthList.length) {
      //   this.oldLineWidthList.shift()
      //   this.lineWidth = this.oldLineWidthList[0] || 3
      // }
      if (this.oldLineColorList.length) {
        this.oldLineColorList.shift()
        // this.lineColor = this.oldLineColorList[0] || '#fff'
      }
      // if (this.oldMinWidthList.length) {
      //   this.oldMinWidthList.shift()
      //   this.minWidth = this.oldMinWidthList[0] || 1
      // }
    },
    // 获取绘制的图片
    getDrawImg() {
      if (!this.$refs.signaturePad) {
        return
      }
      const { res, data, cropInfo } = this.$refs.signaturePad.saveSignature()
      if (data) {
        // const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        const CANVAS_W = res.width
        const CANVAS_H = res.height
        const IMG_W = cropInfo.width
        const IMG_H = cropInfo.height
        let scale = 1
        if (this.is_horizontal) {
          scale = (CANVAS_H * 0.8) / CANVAS_W
        } else {
          scale = 0.8
        }
        this.designImg = {
          width: `${IMG_W * scale}px`,
          height: `${IMG_H * scale}px`,
          position: 'absolute',
          left: `${cropInfo.site[0] * scale}px`,
          top: `${cropInfo.site[1] * scale}px`
        }
        this.cropInfo.left = cropInfo.site[0] * scale
        this.cropInfo.height = IMG_H * scale
        this.cropInfo.top = cropInfo.site[1] * scale
        this.cropInfo.width = IMG_W * scale
        // designImg
        this.getResultImg(data, IMG_W, IMG_H).then(res => {
          this.resultImg = res
        })
      } else {
        this.resultImg = ''
      }
    },
    getResultImg(imgUrl, width, height) {
      return new Promise(function(resolve, reject) {
        try {
          // 1. 创建图片，canvas,获取画布
          var img = new Image()
          var canvas = document.createElement('canvas')
          var ctx = canvas.getContext('2d')
          img.src = imgUrl
          // 2. 图片加载完成进行图片编辑
          img.onload = function() {
            // 2.1 设置canvas宽高
            canvas.width = width
            canvas.height = height
            // 2.4 绘制图像 图像起始点需偏移负宽高
            ctx.drawImage(img, 0, 0, width, height)
            // 2.5返回结果(base64)
            resolve(canvas.toDataURL())
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    // 完成绘制
    handleGenerate() {
      // const { isEmpty, data, cropInfo } = this.$refs.signaturePad.saveSignature()
      // if (isEmpty === true) {
      //   alert(`${this.$t('请绘制内容')}`)
      //   return false
      // }
      this.getPreview()
      this.confirmModal = true
    },
    // 颜色选择器
    handleShowColor() {
      if (this.colorShow) {
        // this.colorShow = false
      } else {
        this.colorShow = true
      }
    },
    hiddenVisible() {
      this.colorShow = false
    },
    // 画笔颜色选择
    updateValue(val) {
      this.lineColor = val.hex
      this.$forceUpdate()
      // this.initPage()
      // setTimeout(() => {
      //   this.$refs.signaturePad.resizeCanvas()
      // }, 500)
    },
    // 立即购买
    buyNow() {
      var goodsInfo = JSON.parse(this.design.goodsInfo)
      goodsInfo[0].is_beta = this.is_beta
      goodsInfo[0].shopping_type = 4
      goodsInfo[0].design_info = {
        design_width: this.width ? this.width : this.cropInfo.width / this.design_box.design_scale,
        design_height: this.height ? this.height : this.cropInfo.height / this.design_box.design_scale,
        preview_image: this.previewImg,
        draw_image: this.resultImg,
        design_area_image: this.design_area_image
      }
      store.dispatch('order/setCartList', JSON.stringify(goodsInfo)).then(() => {
        this.$router.push({ path: '/orderConfirm', query: {
          is_wilcom: this.is_wilcom,
          is_beta: this.is_beta
        }})
      })
    },
    onPropChange({ type, value }) {
      this[type] = value
    }
  }
}
</script>

<style lang="scss">
.hand-drawn{
  padding-top: 45px;
  .drawn-config{
    font-size: 14px;
    .config-box{
      display: flex;
      flex-flow: wrap;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      padding: 10px;
      position: relative;
      z-index: 9;
      .config-item{
        width: 47%;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        .slider{
          width: 48%;
          display: inline-block;
          vertical-align: middle;
        }
        span{
          display: inline-block;
          vertical-align: middle;
        }
        .color_con{
          display: inline-block;
          vertical-align: middle;
          width: 30px;
          height: 20px;
          border-radius: 3px;
          border: 1px solid #ccc;
          position: relative;
        }
        .sketch{
          position: absolute;
          left: 0;
          top: 20px;
          z-index: 10;
        }
        .input{
          display: inline-block;
          vertical-align: middle;
          input{
            width: 30px;
            outline-style: none ;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 5px;
            font-size: 12px;
            line-height: 12px;
            font-family: "Microsoft soft";
          }
          input:focus{
            border-color: #66afe9;
            outline: 0;
          }
        }
      }
    }
  }
  .design-img-box {
    overflow: hidden;
  }
  .footer-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  .confirm-modal{
    height: 100vh;
    position: relative;
    padding-top: 46px;
    box-sizing: border-box;
    .confirm-content{
      padding: 12px;
      text-align: center;
      position: absolute;
      width: 80%;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
    .confirm-footer{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 0 30px;
      height: 7vh;
      box-sizing: border-box;
      justify-content: space-between;
      button{
        width: 30%;
      }
    }
  }
}
</style>
<style lang="scss">
.portrait body{
  .navbar {
    display: block;
  }
  .drawn-config{
    display: block;
  }
}
.full-page body{
  .navbar {
    display: none;
  }
  .customized-content{
    overflow: hidden;
  }
  .drawn-config{
    display: none;
  }
  .hand-drawn{
    padding: 0
  }
  .bg-img{
    // transform: rotate(90deg);
  }
  .designArea {
    width: 100vw;
    height: 100vh;
    .bg-box{
      height: 100%;
      overflow: unset;
      position: static;
      transform: translateY(0);
    }
  }
}
// 手机横屏css
@media all and (orientation : landscape) {

  .navbar {
    display: none;
  }
  .full-page {
    .hand-drawn {
      display: flex;
      align-content: center;
      width: 100vw;
      height: 100vh;
      justify-content: space-between;
      padding: 0;
      .footer-btn {
        height: 100%;
        bottom: 0;
        left: calc(100% - 50px);
        flex-direction: column;
        align-content: center;
        justify-content: space-around;
        width: 50px;
        .van-button {
          font-size: 6px;
          height: 8px;
          padding: 6px;
        }
      }
    }
    .customized-content{
      overflow: hidden;
    }
    .drawn-config{
      display: none;
    }
    .designArea {
      .bg-box{
        height: 100%;
        overflow: unset;
        position: static;
        transform: translateY(0);
      }
       .design_box > div {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
    }
  }
}

  // 弹框
  .modal{
    position: relative;
    .modal-title{
      font-size: 16px;
      padding: 18px;
      border-bottom: 1px solid #f5f5f5;
    }
    &-hint {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #999;
      margin: 4px;
      span {
        margin-right: 6px;
      }
    }
    .modal-content{
      padding: 12px;
      text-align: center;
      .van-uploader{
        border: 1px solid #cccccc;
        border-radius: 0.21333rem;
        .van-uploader__upload{
          text-align: center;
          margin: 0;
        }
        .van-uploader__wrapper{
          align-items: center;
          padding: 10px;
          box-sizing: border-box;
        }
        .van-uploader__preview{
          background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3LjkzNyA3LjkzOCIgaGVpZ2h0PSIzMCIgd2lkdGg9IjMwIj48cGF0aCBwYWludC1vcmRlcj0ic3Ryb2tlIGZpbGwgbWFya2VycyIgZD0iTS4wMTQuMDE0SDMuOTdWMy45N0guMDE0ek0zLjk3IDMuOTY4aDMuOTU0djMuOTU1SDMuOTd6IiBmaWxsPSIjZWVlZmYwIi8+PC9zdmc+");
          margin: 0 auto;
          .van-uploader__preview-image{
            width: 100%;
            height: auto;
          }
          .van-uploader__preview-delete {
            top: -5px;
            right: -5px;
            border-radius: 50%;
          }
        }
      }
    }
    .footer-button{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5px 0 10px;
      &_message {
        display: flex;
        align-items: center;
        color: #8a8a8a;
        margin-top: 6px;
        i {
          font-size: 14px;
        }
        & > span {
          padding-top: 2px;
          font-size: 12px;
          line-height: 12px;
          margin-left: 4px;
        }
      }
      button{
        width: 70%;
      }
    }
  }
</style>
