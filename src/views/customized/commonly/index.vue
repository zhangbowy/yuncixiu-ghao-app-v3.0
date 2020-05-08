<template>
  <div class="commonly">
    <div class="topOptions">
      <transition name="van-slide-down">
        <div v-show="visible" class="operate-btn">
          <van-dropdown-menu>
            <van-dropdown-item v-model="fontType" :options="fontTypeOptions" />
            <van-dropdown-item ref="fontColor" title="颜色">
              <van-tabs type="card" color="#333" background="#fff">
                <van-tab title="标准色">
                  <div class="color-box">
                    <div class="color-title">标准色</div>
                    <div class="color-list">
                      <div v-for="(item,index) in colorList" :key="index" class="color-item" :style="{background: item.value}" @click="pickColor(item.value)" />
                    </div>
                  </div>
                </van-tab>
                <van-tab title="自定义" />
              </van-tabs>
            </van-dropdown-item>
            <van-dropdown-item v-model="fontSize" :options="sizeOptions" />
            <van-dropdown-item v-model="fontAlign" :options="alignment" />
          </van-dropdown-menu>
        </div>
      </transition>
      <transition name="van-slide-down">
        <div v-show="middleVisible" class="operate-btn">
          <van-dropdown-menu>
            <van-dropdown-item ref="itemColor" title="颜色">
              <van-tabs type="card" color="#333" background="#fff">
                <van-tab title="标准色">
                  <div class="color-box">
                    <div class="color-title">标准色</div>
                    <div class="color-list">
                      <div v-for="(item,index) in colorList" :key="index" class="color-item" :style="{background: item.value}" />
                    </div>
                  </div>
                </van-tab>
                <!-- <van-tab title="自定义" /> -->
              </van-tabs>
            </van-dropdown-item>
            <van-dropdown-item ref="imgSize" title="尺寸">
              <div>
                <van-form validate-first @failed="onFailed">
                  <van-field
                    v-model="imgSize"
                    name="imgSize"
                    label="尺寸"
                    placeholder="请输入图片尺寸"
                    clearable
                    :rules="[{ validator, message: '超出最大尺寸' }]"
                  />
                </van-form>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </transition>
      <!-- 遮罩层 -->
      <van-overlay z-index="10" class-name="top-mask" :show="visible" @click="hiddenVisible" />
      <van-overlay z-index="10" class-name="top-mask" :show="middleVisible" @click="hiddenVisible" />
    </div>
    <div class="designArea">
      <div class="bg-box">
        <img class="bg-img" :src="customInfo.item.background" :width="2*customInfo.custom_info.design_bg_width" :height="2*customInfo.custom_info.design_bg_height" alt="">
        <div class="design-box">
          <div class="top-input" :class="{'focus':topFocus==true}">
            <div v-if="topFocus==false" class="top-img-list" :style="{ textAlign: fontAlign,fontSize: `${fontSize}px`,color: `${fontColor}` }" @click="imgFocus(1)">
              <img v-for="item in topImg" :key="item" :src="item" alt="">
              <span v-if="topFocus==false && topImg.length==0">{{ topText?topText: '双击开始编辑' }}</span>
            </div>
            <van-field v-else v-model.trim="topText" :input-align="fontAlign" @blur="inpuBlur(1)" @focus="inpuFocus(1)" />
          </div>
          <div class="middle-img">
            <img :src="patternPicture[0]?patternPicture[0].content:''" width="150" height="150" alt="" @click="middleImgFocus">
          </div>
          <div class="bottom-input" :class="{'focus':bottomFocus==true}">
            <div v-if="bottomFocus==false" class="bottom-img-list" :style="{textAlign: fontAlign,fontSize: `${fontSize}px`,color: `${fontColor}`}" @click="imgFocus(2)">
              <img v-for="item in bottomImg" :key="item" :src="item" alt="">
              <span v-if="bottomFocus==false && bottomImg.length==0">{{ bottomText? bottomText: '双击开始编辑' }}</span>
            </div>
            <van-field v-else v-model.trim="bottomText" :input-align="fontAlign" @blur="inpuBlur(2)" @focus="inpuFocus(2)" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottomOptions">
      <div class="operate-btn">
        <div class="uoload-btn" @click="showUpload">
          <svg-icon icon-class="upload-img" />
          <p>上传花样</p>
        </div>
        <div class="picture-library" @click="showImgList">
          <svg-icon icon-class="picture-lib" />
          <p>花样库</p>
        </div>
      </div>
      <div class="footer-btn">
        <van-button icon="eye" color="#333" plain size="small" type="primary">预览</van-button>
        <van-button size="small" color="linear-gradient(to right, #4bb0ff, #6149f6)">完成设计</van-button>
      </div>
    </div>
    <!-- 上传图片 -->
    <van-popup v-model="uploadModal" :style="{ width: '80%', minHeight: '30%' }" round closeable>
      <div class="modal">
        <div class="modal-title">上传花样</div>
        <div class="modal-content">
          <van-uploader v-model="patternPicture" multiple :max-count="1" />
        </div>
        <div class="modal-footer">
          提示：一次只能上传一张图片
        </div>
      </div>
    </van-popup>
    <!-- 花样库 -->
    <van-popup v-model="patternModal" :style="{ width: '80%', height: '30%' }" round closeable>
      <div class="modal">
        <div class="modal-title">花样库</div>
      </div>
    </van-popup>

  </div>
</template>

<script>
// import { js_getDPI } from '@/utils' // 获取屏幕dip
import { getFontList, customDetail } from '@/api/design'
import $ from 'jquery'
import './arctext'
export default {
  data() {
    return {
      dpi: '', // 屏幕dpi
      uploadModal: false,
      patternModal: false,
      visible: false, // 顶部操作是否显示
      middleVisible: false, // 顶部图片属性是否显示
      topFocus: false, // 上输入框聚焦
      bottomFocus: false, // 底部输入框聚焦
      topText: '', // 上输入框文本
      topImg: [], // 上图片
      bottomText: '', // 底部文本
      bottomImg: [], // 底部图片
      fontType: '', // 字体类型
      fontTypeOptions: [], // 可选字体类型数组
      fontAlign: 'center', // 字体对齐方式
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
      fontColor: '#fff',
      fontSize: 12, // 字体大小
      sizeOptions: [
        { text: '12px', value: 12 },
        { text: '18px', value: 18 },
        { text: '24px', value: 24 }
      ],
      fontContent: {}, // 字体内容
      patternPicture: [], // 花样图片
      imgSize: '',
      customInfo: {
        custom_info: {
          design_bg_width: 500,
          design_bg_height: 500
        },
        item: {}
      }
    }
  },
  created() {
    // 获取字体列表
    this.getFontList()
    // 图片旋转
    this.imgRotate()
    if (this.$route.query.goods_id && this.$route.query.sku_id) {
      this.goods_id = this.$route.query.goods_id
      this.sku_id = this.$route.query.sku_id
    }
    this.customDetail(this.goods_id, this.sku_id)
  },
  methods: {
    // 获取字体列表
    getFontList() {
      getFontList().then(res => {
        res.data.map(item => {
          this.fontTypeOptions.push({
            text: item.font_name,
            value: item.font_id,
            content: item.font_content
          })
          this.fontType = res.data[0].font_id
        })
      })
    },
    // 获取定制分类模板信息
    customDetail(id, sku_id) {
      customDetail({
        id: id,
        sku_id: sku_id
      }).then(res => {
        this.customInfo = res.data
      })
    },
    middleImgFocus() {
      this.visible = false
      this.middleVisible = true
    },
    // 输入框聚焦
    inpuFocus(type) {
      this.visible = true
      this.middleVisible = false
      type === 1 ? this.topFocus = true : this.bottomFocus = true
    },
    // 文字图片点击
    imgFocus(type) {
      type === 1 ? this.topFocus = true : this.bottomFocus = true
    },
    // 输入框失焦
    inpuBlur(type) {
      // type判断图片位置 1为上 2为下
      type === 1 ? this.topFocus = false : this.bottomFocus = false
      if (type === 1) {
        this.imgRotate()
      }
    },
    // 图片旋转
    imgRotate() {
      $(function() {
        $('.top-input span').arctext({
          radius: 180,
          dir: 1,
          rotate: true,
          fitText: false
        })
      })
      $(function() {
        $('.top-input .top-img-list').arctext({
          radius: 180
        })
      })
    },
    // 显示花样图片弹框
    showImgList() {
      this.patternModal = true
    },
    // 显示上传图片弹框
    showUpload() {
      this.uploadModal = true
    },
    // 隐藏遮罩
    hiddenVisible() {
      this.visible = false
      this.middleVisible = false
    },
    // 异步校验函数返回 Promise
    validator(val) {
      return val < 150
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo)
      this.imgSize = ''
    },
    pickColor(color) {
      this.fontColor = color
      this.$refs.fontColor.toggle()
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
  // 设计区域
  .designArea{
    height:70vh;
    position: absolute;
    top: 13vh;
    width: 100%;
    left: 0;
    .bg-box{
      width: 100%;
      height: 500px;
      overflow: hidden;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
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
        font-size: 12px;
        .van-cell{
          background: none;
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
        line-height: 45px;
        span{
          padding: 0 5px;
        }
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
        border: 1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        img{
          display: block;
          margin: 0 auto;
          width: 150px;
          height: 150px;
        }
      }
    }
  }
  // 底部选项
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

  // 弹框
  .modal{
    .modal-title{
      font-size: 16px;
      padding: 18px;
      border-bottom: 1px solid #f5f5f5;
    }
    .modal-content{
      padding: 18px;
      text-align: center;
      .van-uploader{
        width: 150px;
        height: 150px;
        border: 1px solid #cccccc;
        border-radius: 0.21333rem;
        .van-uploader__upload{
          width: 150px;
          height: 150px;
          text-align: center;
          margin: 0;
          line-height: 150px;
        }
        .van-uploader__wrapper{
          height: 150px;
          align-items: center;
        }
        .van-uploader__preview{
          margin: 0 auto;
          .van-uploader__preview-image{
            width: 100%;
            height: auto;
          }
        }
      }
    }
    .modal-footer{
      font-size: 14px;
      border-top: 1px solid #f5f5f5;
      padding: 18px;
    }
  }
}
</style>
