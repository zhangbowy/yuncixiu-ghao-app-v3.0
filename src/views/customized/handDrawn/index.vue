<template>
  <div class="hand-drawn">
    <div class="drawn-config">
      <div class="config-box">
        <div class="config-item">
          <span>画笔颜色：</span>
          <div class="color_con" :style="{background:lineColor}" @click="handleShowColor">
            <div v-show="colorShow" class="sketch">
              <sketch-picker v-model="lineColor" @input="updateValue" />
            </div>
          </div>
        </div>
        <div class="config-item">
          <span>画笔粗细：</span>
          <div class="slider">
            <van-slider v-model="lineWidth" bar-height="10px" button-size="18px" :min="1" :max="40" @change="onChange" />
          </div>
          <span style="margin-left:10px">{{ lineWidth }}</span>
        </div>
        <div class="config-item">
          <span>背景颜色：</span>
          <div class="color_con" :style="{background:bgColor}" @click="ShowBgColor">
            <div v-show="bgColorShow" class="sketch">
              <sketch-picker v-model="bgColor" @input="updatebg" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawn-content">
      <vue-esign ref="esign" :width="800" :height="500" :is-crop="isCrop" :line-width="lineWidth" :line-color="lineColor" :bg-color.sync="bgColor" />
    </div>
    <div class="footer-btn">
      <van-button type="default" size="small" @click="handleReset">清空画板</van-button>
      <van-button type="primary" size="small" @click="handleGenerate">生成图片</van-button>
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'
export default {
  components: {
    'sketch-picker': Sketch
  },
  data() {
    return {
      lineWidth: 6,
      lineColor: '#000000',
      bgColor: '', // 背景颜色
      resultImg: '', // 结果图片
      isCrop: false,
      // 颜色选择器
      colorShow: false,
      bgColorShow: false
    }
  },
  methods: {
    handleReset() {
      this.$refs.esign.reset()
    },
    handleGenerate() {
      this.$refs.esign.generate().then(res => {
        this.resultImg = res
      }).catch(err => {
        alert(err) // 画布没有签字时会执行这里 'Not Signned'
      })
    },
    // 颜色选择器
    handleShowColor() {
      if (this.colorShow) {
        this.colorShow = false
      } else {
        this.colorShow = true
      }
    },
    // 显示背景
    ShowBgColor() {
      if (this.bgColorShow) {
        this.bgColorShow = false
      } else {
        this.bgColorShow = true
      }
    },
    updateValue(val) {
      this.lineColor = val.hex
    },
    updatebg(val) {
      this.bgColor = val.hex
    },
    onChange(value) {
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
    border: 1px solid #f5f5f5;
  }
  .footer-btn{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 50px;
  }
}
</style>
