<template>
  <div class="commonly">
    <div class="topOptions">
      <transition name="van-slide-down">
        <div v-show="visible" class="operate-btn">
          <van-dropdown-menu>
            <van-dropdown-item v-model="fontType" title="字体" :options="fontTypeOptions" />
            <van-dropdown-item ref="item" title="颜色">
              <div class="color-box">
                <div class="color-title">标准色</div>
                <div class="color-list">
                  <div v-for="(item,index) in colorList" :key="index" class="color-item" :style="{background: item.value}" />
                </div>
              </div>
            </van-dropdown-item>
            <van-dropdown-item v-model="fontSize" title="字号" :options="sizeOptions" />
            <van-dropdown-item v-model="fontAlign" title="对齐" :options="alignment" />
          </van-dropdown-menu>
        </div>
      </transition>
      <van-overlay z-index="10" class-name="top-mask" :show="visible" @click="hiddenVisible" />
    </div>
    <div class="designArea">
      <div class="bg-box" :style="{backgroundImage: 'url(' + design_bg + ')', backgroundSize:'130%',backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'}">
        <!-- <img :src="design_bg" class="bg-img" alt="" width="100%"> -->
        <div class="design-box">
          <div class="top-input" :class="{'focus':topFocus==true}">
            <div v-if="topFocus==false" class="top-img-list" @click="imgFocus(1)">
              <img v-for="item in topImg" :key="item" :src="item" alt="">
            </div>
            <van-field v-else v-model.trim="topText" :input-align="fontAlign" placeholder="文本" @blur="inpuBlur(1)" @focus="inpuFocus(1)" />
          </div>
          <div class="middle-img">
            <div />
          </div>
          <div class="bottom-input" :class="{'focus':bottomFocus==true}" @click="imgFocus(2)">
            <div v-if="bottomFocus==false" class="bottom-img-list">
              <img v-for="item in bottomImg" :key="item" :src="item" alt="">
            </div>
            <van-field v-else v-model.trim="bottomText" :input-align="fontAlign" placeholder="文本" @blur="inpuBlur(2)" @focus="inpuFocus(2)" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottomOptions">
      <div class="operate-btn">
        <div class="uoload-btn">
          <svg-icon icon-class="upload-img" />
          <p>上传花样</p>
        </div>
        <div class="picture-library" @click="showImgList">
          <svg-icon icon-class="picture-lib" />
          <p>花样选择</p>
        </div>
      </div>
      <div class="footer-btn">
        <van-button icon="eye" color="#333" plain size="small" type="primary">预览</van-button>
        <van-button size="small" color="linear-gradient(to right, #4bb0ff, #6149f6)">完成设计</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { js_getDPI } from '@/utils' // 获取屏幕dip
import { getFontList } from '@/api/design'
export default {
  components: {
  },
  data() {
    return {
      dpi: '',
      visible: false,
      topFocus: false,
      bottomFocus: false,
      topText: '',
      topImg: [],
      bottomText: '',
      bottomImg: [],
      fontType: '',
      fontTypeOptions: [],
      current: 0,
      checkedArr: [{
        type: 1,
        value: '',
        color: '',
        size: '',
        align: ''
      }, {
        type: 2,
        value: '',
        color: '',
        size: '',
        width: '',
        height: ''
      }, {
        type: 3,
        value: '',
        color: '',
        size: '',
        align: ''
      }],
      fontAlign: '',
      alignment: [{
        text: '左对齐', value: 'left'
      }, {
        text: '居中对齐', value: 'center'
      }, {
        text: '右对齐', value: 'right'
      }],
      colorList: [{
        name: 1,
        value: '#ffffff'
      }, {
        name: 2,
        value: '#000000'
      }, {
        name: 3,
        value: '#f1f2f3'
      }, {
        name: 4,
        value: '#FDB500'
      }, {
        name: 5,
        value: '#6D4A2F'
      }, {
        name: 1,
        value: '#999999'
      }, {
        name: 2,
        value: '#B8E4DD'
      }, {
        name: 3,
        value: '#43B5CD'
      }, {
        name: 4,
        value: '#F66B29'
      }, {
        name: 5,
        value: '#B92860'
      }],
      fontSize: '',
      sizeOptions: [{ text: '12px', value: 12 },
        { text: '18px', value: 18 },
        { text: '24px', value: 24 }],
      design_bg: 'https://origin-rendering.yinshida.com.cn/v1/dcl/preview?format=png&width=2048&scene=https%3A%2F%2Fscene.yinshida.com.cn%2Fv1%2Fscenes%2F0439333f-14e0-4f49-b4ad-1c78749d8e93',
      fontContent: {}
    }
  },
  created() {
    this.dpi = js_getDPI()
    this.getFontList()
  },
  methods: {
    // 获取字体列表
    getFontList() {
      getFontList().then(res => {
        res.data.map(item => {
          this.fontTypeOptions.push({
            text: item.font_name,
            value: item.font_id,
            content: item.fontContent
          })
        })
      })
    },
    // 输入框聚焦
    inpuFocus(type) {
      this.visible = true
      type === 1 ? this.topFocus = true : this.bottomFocus = true
    },
    // 图片点击
    imgFocus(type) {
      type === 1 ? this.topFocus = true : this.bottomFocus = true
    },
    // 输入框失焦
    inpuBlur(type) {
      type === 1 ? this.topFocus = false : this.bottomFocus = false
    },
    // 显示花样图片弹框
    showImgList() {},
    // 隐藏遮罩
    hiddenVisible() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.commonly{
  position: relative;
  height: 100%;
  .topOptions{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 13vh;
    padding-top: 46px;
    box-sizing: border-box;
    .operate-btn{
      position: relative;
      z-index: 999;
    }
    .color-box{
      padding: 10px;
      .color-title{
        font-size: 14px;
      }
      .color-list{
        display: flex;
        flex-flow: wrap;
        align-items: center;
        padding: 10px;
        justify-content: space-between;
        .color-item{
          width: 18%;
          height: 40px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .designArea{
    height:70vh;
    position: absolute;
    top: 13vh;
    width: 100%;
    left: 0;
    .bg-box{
      width: 100%;
      height: 100%;
      overflow: hidden;
      .bg-img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .design-box{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 300px;
      transform: translate(-50%,-50%);
      background: rgba(0, 0, 0, 0.5);
      position: relative;
      border: 5px solid rgba(192, 192, 192, 0.5);
      .top-input,.bottom-input{
        .van-cell{
          background: none;
          border: 1px solid rgba(255,255,255,0);
          .van-field__control{
            color: #fff;
          }
        }
        &.focus{
          .van-cell{
            border: 1px solid #4bb0ff;
            .van-field__control{
              color: #fff;
            }
          }
        }
      }
      .top-img-list, .bottom-img-list{
        width: 100%;
        height: 45px;
      }
      .top-input{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
      .bottom-input{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      }
      .middle-img{
        position: absolute;
        top: 46px;
        bottom: 46px;
        left: 0;
        width: 99.2%;
        border: 1px solid rgba(255,255,255,0);
      }
    }
  }
  .bottomOptions{
    height: 15vh;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    .operate-btn{
      height: 8vh;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      font-size: 26px;
      border-top: 1px solid #f4f5f9;
      box-sizing: border-box;
      background: #ffffff;
      p{
        font-size: 12px;
        margin: 3px 0;
      }
      .uoload-btn{
        width: 50%;
        border-right: 1px solid #f5f5f5;
      }
      .picture-library{
        width: 50%;
      }
    }
    .footer-btn{
      background: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 0 30px;
      height: 7vh;
      justify-content: space-between;
      button{
        width: 40%;
      }
    }
  }
  .top-mask{
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
