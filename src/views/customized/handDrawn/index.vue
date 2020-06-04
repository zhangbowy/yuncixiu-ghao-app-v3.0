<template>
  <div class="hand-drawn">
    <!-- 画笔配置 -->
    <div class="drawn-config">
      <div class="config-box">
        <div class="config-item">
          <span>笔画粗细：</span>
          <div class="slider">
            <van-stepper v-model="lineWidth" input-width="25px" button-size="22" min="1" max="50" />
          </div>
        </div>
        <div class="config-item">
          <span>笔锋粗细：</span>
          <div class="slider">
            <van-stepper v-model="minWidth" input-width="25px" button-size="22" min="1" max="5" />
          </div>
        </div>
        <div class="config-item">
          <span>笔画颜色：</span>
          <div class="color_con" :style="{background:lineColor}" @click="handleShowColor">
            <div v-show="colorShow" class="sketch">
              <sketch-picker v-model="lineColor" style="z-index: 10" @input="updateValue" />
              <van-overlay z-index="1" class-name="top-mask" :show="colorShow" @click.stop="hiddenVisible" />
            </div>
          </div>
        </div>
        <div class="config-item">
          <span>宽(mm)：</span>
          <div class="input">
            <input v-model.number="width" type="number" step="1" max="150" placeholder="宽度">
          </div>
        </div>
        <div class="config-item">
          <span>高(mm)：</span>
          <div class="input">
            <input v-model.number="height" type="number" step="1" max="150" placeholder="高度">
          </div>
        </div>
      </div>
    </div>
    <!-- 中间画板 -->
    <div v-if="design_box.design_H" class="drawn-content">
      <!-- 设计区域  -->
      <design-area :area-info="designArea" :background="backgroundImg">
        <!-- 画板 -->
        <VueSignaturePad
          slot="design-content"
          ref="signaturePad"
          :width="`${design_box.design_W}px`"
          :height="`${design_box.design_H}px`"
          :options="{ penColor:lineColor,maxWidth:lineWidth, minWidth:minWidth }"
        />
      </design-area>
    </div>
    <!-- 底部操作 -->
    <div class="footer-btn">
      <van-button type="default" size="small" @click="fangda">放大</van-button>
      <van-button type="default" size="small" @click="initPage(customInfo)">还原</van-button>
      <van-button type="default" size="small" @click="handleReset">清空画板</van-button>
      <van-button type="default" size="small" @click="undo">撤销</van-button>
      <van-button type="primary" color="linear-gradient(to right, #ff6034,#ee0a24)" size="small" @click="handleGenerate">完成绘制</van-button>
    </div>
    <!-- 完成设计弹出层 -->
    <confirm-modal v-model="confirmModal" :loading="loading" :img="previewImg" @dobuy="buyNow" @hidden="confirmModal=false" />
  </div>
</template>

<script>
import { Sketch } from 'vue-color' // 颜色选择器
import { designApi } from '@/api/design'
import DesignArea from '@/components/Design/DesignArea'
import ConfirmModal from '../commonly/components/ConfirmModal'
import store from '@/store'
import { mapState } from 'vuex'
import { Toast } from 'vant'
export default {
  components: {
    'sketch-picker': Sketch,
    'design-area': DesignArea,
    ConfirmModal
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
      lineWidth: 6, // 笔画粗细
      minWidth: 1, // 笔锋粗细
      lineColor: '#fff',
      bgColor: '',
      resultImg: '', // 结果图片
      isCrop: true,
      // 颜色选择器
      colorShow: false,
      loading: false,
      confirmModal: false, // 完成设计
      canvasChange: false,
      previewImg: '', // 预览图片
      width: '', // 手绘图宽度
      height: '', // 手绘图高度
      design_area_image: '' // 设计区域
    }
  },
  computed: {
    ...mapState([
      'design'
    ])
  },
  watch: {
    width(newValue, oldValue) {
      if (newValue > 150) {
        Toast('宽度不能超过150mm')
        this.width = 150
      }
    },
    height(newValue, oldValue) {
      if (newValue > 150) {
        Toast('高度不能超过150mm')
        this.height = 150
      }
    }
  },
  created() {
    if (this.$route.query.goods_id && this.$route.query.sku_id) {
      this.goods_id = this.$route.query.goods_id
      this.sku_id = this.$route.query.sku_id
    }

    // 获取定制信息
    this.customDetail(this.goods_id, this.sku_id)
  },
  methods: {
    // 撤销
    undo() {
      this.$refs.signaturePad.undoSignature()
    },
    // 获取定制分类模板信息
    async customDetail(id, sku_id) {
      await designApi.customDetail({
        id: id,
        sku_id: sku_id
      }).then(res => {
        this.customInfo = res.data
        this.backgroundImg = res.data.item && res.data.item.background ? res.data.item.background : res.data.custom_info.design_bg
        this.initPage(res.data)
      })
    },
    async fangda() {
      const SCREEN_WIDTH = window.screen.width // 获取屏幕宽度
      const design_scale = SCREEN_WIDTH / this.customInfo.custom_info.design_width
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
        left: `-${this.design_box.design_bg_X}px`,
        top: `-${this.design_box.design_bg_Y}px`
      }
      // 设计区域位置style
      this.designArea.designBoxStyle = {
        position: 'absolute',
        width: `${this.design_box.design_W}px`,
        height: `${this.design_box.design_H}px`,
        left: `${this.design_box.design_X}px`,
        top: '50%',
        marginTop: `-${this.design_box.design_H / 2}px`
      }
      const that = this
      setTimeout(() => {
        // this.canvasChange = true
        that.$refs.signaturePad.resizeCanvas()
      }, 500)
    },
    // 计算背景图位置 设计区域位置
    async initPage(item) {
      const SCREEN_WIDTH = window.screen.width // 获取屏幕宽度
      // 计算比例 * 0.8表示屏幕的宽度80%
      const design_scale = SCREEN_WIDTH * 0.8 / item.custom_info.design_width
      this.design_box.design_scale = design_scale
      // 计算设计区背景实际宽高 ps:基本上是固定的
      this.design_box.design_bg_width = design_scale * item.custom_info.design_bg_width
      this.design_box.design_bg_height = design_scale * item.custom_info.design_bg_height
      // 设计区域实际跨高和左上对齐位置
      this.design_box.design_W = item.custom_info.design_width * design_scale
      this.design_box.design_H = item.custom_info.design_height * design_scale
      this.design_box.design_X = (SCREEN_WIDTH - this.design_box.design_W) / 2
      this.design_box.design_Y = (SCREEN_WIDTH - this.design_box.design_H) / 2
      // 计算设计区背景图的对齐位置
      this.design_box.design_bg_X = item.custom_info.design_left * design_scale - this.design_box.design_X
      this.design_box.design_bg_Y = item.custom_info.design_top * design_scale - this.design_box.design_Y

      // 背景图位置style
      this.designArea.designImgStyle = {
        position: 'absolute',
        width: `${this.design_box.design_bg_width}px`,
        height: `${this.design_box.design_bg_height}px`,
        left: `-${this.design_box.design_bg_X}px`,
        top: `-${this.design_box.design_bg_Y}px`
      }
      // 设计区域位置style
      this.designArea.designBoxStyle = {
        position: 'absolute',
        width: `${this.design_box.design_W}px`,
        height: `${this.design_box.design_H}px`,
        left: `${this.design_box.design_X}px`,
        top: '50%',
        marginTop: `-${this.design_box.design_H / 2}px`
      }
      setTimeout(() => {
        // this.canvasChange = true
        this.$refs.signaturePad.resizeCanvas()
      }, 500)
    },
    // 获取预览图
    getPreview() {
      this.loading = true
      const draw_height_scale = this.cropInfo.height / this.design_box.design_H
      const draw_left_scale = this.cropInfo.site[0] / this.design_box.design_W
      const draw_top_scale = this.cropInfo.site[1] / this.design_box.design_H
      // 请求预览图接口
      designApi.getPreview({
        id: this.$route.query.goods_id,
        type: 4,
        draw_image: this.resultImg,
        draw_height_scale: draw_height_scale,
        draw_left_scale: draw_left_scale,
        draw_top_scale: draw_top_scale
      }).then(res => {
        this.loading = false
        this.previewImg = res.data.preview_image
        this.design_area_image = res.data.design_area_image
      }).catch(() => {
        this.loading = false
      })
    },
    // 清空画布
    handleReset() {
      this.$refs.signaturePad.clearSignature()
    },
    // 完成绘制
    handleGenerate() {
      const { isEmpty, data, cropInfo } = this.$refs.signaturePad.saveSignature()
      if (isEmpty === true) {
        alert('请绘制内容')
        return false
      }
      this.resultImg = data
      this.cropInfo = cropInfo
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
    },
    onChange(value) {
    },
    // 立即购买
    buyNow() {
      var goodsInfo = JSON.parse(this.design.goodsInfo)
      goodsInfo[0].shopping_type = 4
      goodsInfo[0].design_info = {
        design_width: this.width ? this.width : this.cropInfo.width,
        design_height: this.height ? this.height : this.cropInfo.height,
        preview_image: this.previewImg,
        draw_image: this.resultImg,
        design_area_image: this.design_area_image
      }
      store.dispatch('order/setCartList', JSON.stringify(goodsInfo)).then(() => {
        this.$router.push({ path: '/orderConfirm' })
      })
    }
  }
}
</script>

<style lang="scss">
.hand-drawn{
  padding-top: 45px;
  .drawn-config{
    font-size: 14px;
    padding: 10px;
    .config-box{
      display: flex;
      flex-flow: wrap;
      align-items: center;
      justify-content: space-between;
      .config-item{
        width: 48%;
        margin-bottom: 10px;
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
          width: 60px;
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
            width: 60px;
            outline-style: none ;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 5px;
            font-size: 12px;
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
  .drawn-content{
    padding: 10px;
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
