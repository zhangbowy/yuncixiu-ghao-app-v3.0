<template>
  <div class="hand-drawn">
    <!-- 画笔配置 -->
    <div class="drawn-config">
      <div class="config-box">
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
          <span>笔画粗细：</span>
          <div class="slider">
            <van-slider v-model="lineWidth" bar-height="10px" button-size="18px" :min="1" :max="40" @change="onChange" />
          </div>
          <span style="margin-left:10px">{{ lineWidth }}</span>
        </div>
      </div>
    </div>
    <!-- 中间画板 -->
    <div v-if="design_box.design_H" class="drawn-content">
      <design-area :area-info="designArea" :background="backgroundImg">
        <vue-sign slot="design-content" ref="esign" :width="design_box.design_W" :height="design_box.design_H" :is-crop="isCrop" :line-width="lineWidth" :line-color="lineColor" :bg-color.sync="bgColor" />
      </design-area>
    </div>
    <!-- 底部操作 -->
    <div class="footer-btn">
      <van-button type="default" size="small" @click="handleReset">清空画板</van-button>
      <van-button type="primary" color="linear-gradient(to right, #ff6034,#ee0a24)" size="small" @click="handleGenerate">生成图片</van-button>
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
import VueSign from '@/components/VueSign'
import store from '@/store'
import { mapState } from 'vuex'
export default {
  components: {
    'sketch-picker': Sketch,
    'design-area': DesignArea,
    'vue-sign': VueSign,
    ConfirmModal
  },
  data() {
    return {
      designArea: {},
      customInfo: {},
      design_box: {
        design_H: ''
      },
      backgroundImg: '',
      lineWidth: 6, // 笔画粗细
      lineColor: '#fff',
      bgColor: '#000000',
      resultImg: '', // 结果图片
      isCrop: true,
      // 颜色选择器
      colorShow: false,
      loading: false,
      confirmModal: false, // 完成设计
      previewImg: '' // 预览图片
    }
  },
  computed: {
    ...mapState([
      'design'
    ])
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
    // 获取定制分类模板信息
    async customDetail(id, sku_id) {
      await designApi.customDetail({
        id: id,
        sku_id: sku_id
      }).then(res => {
        this.customInfo = res.data
        this.backgroundImg = res.data.item.background
        this.initPage(res.data)
      })
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
    },
    // 获取预览图
    getPreview() {
      this.loading = true
      // 请求预览图接口
      designApi.getPreview({
        id: this.$route.query.goods_id,
        type: 3,
        draw_image: this.resultImg
      }).then(res => {
        this.loading = false
        this.previewImg = res.data
      })
    },
    // 清空画布
    handleReset() {
      this.$refs.esign.reset()
    },
    // 生成图片
    handleGenerate() {
      this.$refs.esign.generate().then(res => {
        console.log(res)
        this.resultImg = res.resultImg
        this.getPreview()
        this.confirmModal = true
      }).catch(err => {
        alert(err) // 画布没有签字时会执行这里 'Not Signned'
      })
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
      goodsInfo[0].design_info = {
        design_width: this.form.middleImg.width,
        design_height: this.form.middleImg.height,
        preview_image: this.previewImg
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
          width: 40%;
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
          width: 40px;
          height: 14px;
          border: 1px solid #f5f5f5;
          position: relative;
        }
        .sketch{
          position: absolute;
          left: 0;
          top: 20px;
          z-index: 10;
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
    padding: 10px 50px;
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
