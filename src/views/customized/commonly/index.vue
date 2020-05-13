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
                  <compact-picker v-model="fontColor" @change="imgColorChnage" />
                </van-tab>
                <van-tab title="自定义">
                  <sketch-picker v-model="fontColor" @change="imgColorChnage" />
                </van-tab></van-tabs>
            </van-dropdown-item>
            <van-dropdown-item v-model="fontSize" :options="sizeOptions" />
            <van-dropdown-item v-model="fontAlign" :options="alignment" />
          </van-dropdown-menu>
        </div>
      </transition>
      <transition name="van-slide-down">
        <div v-show="middleVisible" class="operate-btn">
          <van-dropdown-menu>
            <div class="middle-img-menu">
              <div class="menu-item">
                <van-button icon="edit" plain type="default" @click="changeMiddleImg">图片尺寸</van-button>
              </div>
              <div class="menu-item">
                <van-button icon="delete" plain type="default" @click="deleteMiddleImg">删除</van-button>
              </div>
            </div>
          </van-dropdown-menu>
        </div>
      </transition>
      <!-- 遮罩层 -->
      <van-overlay z-index="10" class-name="top-mask" :show="visible" @click="hiddenVisible" />
      <van-overlay z-index="10" class-name="top-mask" :show="middleVisible" @click="hiddenVisible" />
    </div>
    <div class="designArea">
      <div class="bg-box">
        <!-- 背景图 -->
        <img class="bg-img" :src="customInfo.item.background" :style="designImgStyle" alt="">
        <!-- 设计区域 -->
        <div class="design-box" :style="designBoxStyle">
          <!-- 上输入框  -->
          <div class="top-input" :class="{'focus':topFocus==true}">
            <div v-if="topFocus==false" class="top-img-list" :style="{ textAlign: form.topText.align,fontSize: `${form.topText.fontSize}px`,color: `${form.topText.fontColor}` }" @click="imgFocus(1)">
              <span v-if="topFocus==false && topInput==false && topImg.length==0">{{ form.topText.content?form.topText.content: '双击开始编辑' }}</span>
              <img v-for="(item,index) in topImg" v-else :key="index" :height="form.topText.fontSize" :src="item" alt="">
            </div>
            <van-field v-if="topFocus==true" v-model="form.topText.content" maxlength="15" :input-align="form.topText.align" @input="getFontTop()" @blur="inputBlur(1)" @focus="inpuFocus(1)" />
          </div>
          <!-- 中间图片 -->
          <div class="middle-img">
            <img v-if="patternPicture[0]" :src="patternPicture[0]?patternPicture[0].content: ''" alt="" @click="showMiddleMemu(1)">
            <img v-if="!patternPicture[0] && form.middleImg.prev_png_path" :src="form.middleImg.prev_png_path" alt="" @click="showMiddleMemu(2)">
          </div>
          <!-- 下输入框 -->
          <div class="bottom-input" :class="{'focus':bottomFocus==true}">
            <div v-if="bottomFocus==false" class="bottom-img-list" :style="{textAlign: form.bottomText.align,fontSize: `${form.bottomText.fontSize}px`,color: `${form.bottomText.fontColor}`}" @click="imgFocus(2)">
              <span v-if="bottomFocus==false && bottomFocus==false && bottomImg.length==0">{{ form.bottomText.content? form.bottomText.content: '双击开始编辑' }}</span>
              <img v-for="(item,index) in bottomImg" v-else :key="index" :height="form.bottomText.fontSize" :src="item" alt="">
            </div>
            <van-field v-if="bottomFocus==true" v-model="form.bottomText.content" maxlength="15" :input-align="form.bottomText.align" @input="getFontBottom()" @blur="inputBlur(2)" @focus="inpuFocus(2)" />
          </div>
        </div>
        <!-- 设计区域结束 -->
      </div>
    </div>
    <!-- 底部操作 -->
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
        <van-button icon="eye" color="#333" plain size="small" type="primary" @click="preview">预览</van-button>
        <van-button size="small" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="complete">完成设计</van-button>
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
          一次只能上传一张图片
        </div>
      </div>
    </van-popup>
    <!-- 花样库 -->
    <van-popup v-model="patternModal" :style="{ width: '80%', height: '60vh' }" round closeable>
      <div class="modal">
        <div class="modal-title">花样库</div>
        <div class="modal-content figure-content">
          <div class="figure-list">
            <div v-for="(item,index) in figureList" :key="index" class="figure-item">
              <img :src="item.prev_png_path" alt="" @click="checkFigureItem(item)">
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 预览设计 -->
    <van-popup v-model="previewModal" :style="{ width: '80%' }" round closeable>
      <div class="modal">
        <div class="modal-title">预览</div>
        <div v-loading="loading" class="modal-content preview-content">
          <img :src="previewImg" alt="" width="100%">
        </div>
        <div class="modal-footer">
          <van-button size="small" style="width: 50%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="complete">完成设计</van-button>
        </div>
      </div>
    </van-popup>
    <!-- 完成设计 -->
    <van-popup v-model="confirmModal" :style="{ width: '100%',height: '100vh' }">
      <div class="confirm-modal">
        <div class="confirm-content">
          <img :src="previewImg" alt="" width="100%">
        </div>
        <div class="confirm-footer">
          <van-button size="small" color="#333" plain type="primary" @click="confirmModal=false">返回修改</van-button>
          <van-button size="small" color="linear-gradient(to right, #ffd01e,#ff8917)">加入购物车</van-button>
          <van-button size="small" color="linear-gradient(to right, #ff6034,#ee0a24)">立即购买</van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
import { designApi } from '@/api/design'
import Sketch from '@/components/VueColorPicker/Sketch'
import Compact from '@/components/VueColorPicker/Compact'
import { debounce } from '@/utils'
import $ from 'jquery'
import './arctext'
import { Toast } from 'vant'
export default {
  components: {
    'sketch-picker': Sketch,
    'compact-picker': Compact
  },
  data() {
    return {
      uploadModal: false, // 上传图片弹框是否显示
      patternModal: false, // 花样弹框是否显示
      previewModal: false, // 预览弹框是否显示
      confirmModal: false, // 完成设计
      visible: false, // 顶部操作是否显示
      middleVisible: false, // 顶部图片属性是否显示
      topFocus: false, // 上输入框聚焦
      bottomFocus: false, // 底部输入框聚焦
      topInput: false,
      bottomInput: false,
      loading: false,
      figureList: [], // 花样库
      topText: '', // 上输入框文本
      topImg: [], // 上图片
      bottomText: '', // 底部文本
      bottomImg: [], // 底部图片
      fontType: '', // 字体类型
      fontTypeOptions: [], // 可选字体
      fontAlign: 'center', // 字体对齐方式
      alignment: [{
        text: '左对齐', value: 'left'
      }, {
        text: '居中对齐', value: 'center'
      }, {
        text: '右对齐', value: 'right'
      }],
      fontColor: {},
      fontSize: 12, // 字体大小
      sizeOptions: [
        { text: '12px', value: 12 },
        { text: '18px', value: 18 },
        { text: '24px', value: 24 }
      ],
      form: {
        topText: {
          content: '',
          fontSize: '12',
          fontColor: '#fff',
          fontType: '',
          align: 'center'
        },
        middleImg: {},
        bottomText: {
          content: '',
          fontSize: '12',
          fontColor: '#fff',
          fontType: '',
          align: 'center'
        }
      },
      patternPicture: [], // 花样图片库
      imgSize: '', // 图片大小
      customInfo: {
        custom_info: {
          design_width: 0,
          disign_height: 0,
          design_top: 0,
          design_left: 0,
          design_bg: '',
          design_bg_width: 0,
          design_bg_height: 0
        },
        item: {}
      },
      // 提交表单
      design_box: {
        design_bg_width: 0, // 设计背景宽度
        design_bg_height: 0, // 设计背景高度
        design_bg_X: 0, // 设计背景x轴距离
        design_bg_Y: 0, // 设计背景y轴距离
        design_W: 0, // 设计区域宽
        design_H: 0, // 设计区域高
        design_X: 0, // 设计区域x轴距离
        design_Y: 0, // 设计区域y轴距离
        design_scale: 1 // 缩放量
      },
      designImgStyle: {}, // 设计背景style
      designBoxStyle: {}, // 设计区域style
      previewImg: '' // 预览图片
    }
  },
  watch: {
    fontType(newValue, oldValue) {
      if (this.topInput === true) {
        this.form.topText.fontType = newValue
      }
      if (this.bottomFocus === true) {
        this.form.bottomInput.fontType = newValue
      }
    },
    fontSize(newValue, oldValue) {
      if (this.topInput === true) {
        this.form.topText.fontSize = newValue
      }
      if (this.bottomFocus === true) {
        this.form.bottomInput.fontSize = newValue
      }
    },
    fontAlign(newValue, oldValue) {
      if (this.topInput === true) {
        this.form.topText.align = newValue
      }
      if (this.bottomFocus === true) {
        this.form.bottomInput.align = newValue
      }
    },
    fontColor(newValue, oldValue) {
      if (this.topInput === true) {
        this.form.topText.fontColor = newValue.hex
      }
      if (this.bottomFocus === true) {
        this.form.bottomInput.fontColor = newValue.hex
      }
    }
  },
  created() {
    // 获取字体列表
    this.getFontList()
    // 弧形文字
    this.imgRotate()
    if (this.$route.query.goods_id && this.$route.query.sku_id) {
      this.goods_id = this.$route.query.goods_id
      this.sku_id = this.$route.query.sku_id
    }
    // 获取定制信息
    this.customDetail(this.goods_id, this.sku_id)
    this.getFigureList()
  },
  methods: {
    // 获取字体列表
    getFontList() {
      designApi.getFontList().then(res => {
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
    // 获取花样库列表
    getFigureList() {
      designApi.getFigure({
      }).then(res => {
        this.figureList = res.data.data
      })
    },
    // 获取定制分类模板信息
    customDetail(id, sku_id) {
      designApi.customDetail({
        id: id,
        sku_id: sku_id
      }).then(res => {
        this.customInfo = res.data
        this.initPage(res.data)
      })
    },
    // 初始化页面方法
    // 计算背景图位置 设计区域位置
    initPage(item) {
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
      this.designImgStyle = {
        position: 'absolute',
        width: `${this.design_box.design_bg_width}px`,
        height: `${this.design_box.design_bg_height}px`,
        left: `-${this.design_box.design_bg_X}px`,
        top: `-${this.design_box.design_bg_Y}px`
      }
      // 设计区域位置style
      this.designBoxStyle = {
        position: 'absolute',
        width: `${this.design_box.design_W}px`,
        height: `${this.design_box.design_H}px`,
        left: `${this.design_box.design_X}px`,
        top: '50%',
        marginTop: `-${this.design_box.design_H / 2}px`
      }
    },
    // 输入框输入
    inpuFocus(type) {
      this.visible = true
      this.middleVisible = false
      type === 1 ? this.topFocus = true : this.bottomFocus = true
    },
    inputBlur(type) {
      type === 1 ? this.topFocus = false : this.bottomFocus = false
    },
    // 文字图片点击
    imgFocus(type) {
      type === 1 ? this.topFocus = true : this.bottomFocus = true
      type === 1 ? this.topInput = true : this.bottomInput = true
      // this.visible = true
      // this.middleVisible = false
    },
    getFontTop: debounce(function() {
      let arr = []
      const text = this.form.topText.content
      arr = text.split('')
      designApi.getTextImage({
        font_id: this.fontType,
        font_list: JSON.stringify(arr)
      }).then(res => {
        if (res.code === 0) {
          this.topImg = res.data
          this.imgRotate()
        } else {
          Toast(res.msg)
        }
      })
    }, 1000),
    getFontBottom: debounce(function() {
      let arr = []
      const text = this.form.bottomText.content
      arr = text.split('')
      designApi.getTextImage({
        font_id: this.fontType,
        font_list: JSON.stringify(arr)
      }).then(res => {
        if (res.code === 0) {
          this.bottomImg = res.data
        } else {
          Toast(res.msg)
        }
      })
    }, 1000),
    showMiddleMemu(type) {
      // type==1个人上传，type==2花样库选择
      this.middleVisible = true
    },
    // 删除中间图片
    deleteMiddleImg() {
      this.patternPicture = []
      this.form.middleImg = {}
      this.middleVisible = false
    },
    // 修改图片尺寸
    changeMiddleImg() {},
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
        $('.top-img-list').arctext({
          radius: 180,
          dir: 1,
          rotate: true,
          fitText: false
        })
      })
    },
    // 图片颜色选择
    imgColorChnage(e) {
      if (this.topInput === true) {
        this.form.topText.fontColor = e.hex
        designApi.reColor({
          color: e.hex,
          image: this.topImg
        }).then(res => {
          this.topImg = res.data
        })
      } else {
        this.form.bottomText.fontColor = e.hex
        designApi.reColor({
          color: e.hex,
          image: this.bottomImg
        }).then(res => {
          this.bottomImg = res.data
        })
      }
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
      this.topFocus = false
      this.bottomFocus = false
      this.topInput = false
      this.bottomInput = false
    },
    // 异步校验函数返回 Promise
    validator(val) {
      return val < 150
    },
    checkFigureItem(item) {
      this.form.middleImg = item
      this.middleImg = item.prev_png_path
      this.patternModal = false
    },
    // 点击预览
    preview() {
      this.getPreview()
      this.previewModal = true
    },
    // 获取预览图
    getPreview() {
      this.loading = true
      designApi.getPreview({
        id: this.$route.query.goods_id,
        font_list: JSON.stringify([1, 2, 3, 4]),
        font_id: this.fontType
      }).then(res => {
        this.loading = false
        this.previewImg = res.data
      })
    },
    // 完成定制
    complete() {
      this.previewModal = false
      if (!this.previewImg) {
        this.getPreview()
      }
      this.confirmModal = true
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
      .middle-img-menu{
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-around;
      }
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
      height: 375px;
      overflow: hidden;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .design-box{
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
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
        img{
          margin: 0 2px;
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
    position: relative;
    .modal-title{
      font-size: 16px;
      padding: 18px;
      border-bottom: 1px solid #f5f5f5;
    }
    .modal-content{
      padding: 12px;
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

      .figure-list{
        display: flex;
        flex-flow: wrap;
        .figure-item{
          width: 30%;
          margin-right: 5%;
          margin-bottom: 10px;
          border-radius: 10px;
          box-shadow: 0px 0px 20px #f5f5f5;
          img{
            width: 100%;
            height: 70px;
          }
        }
        .figure-item:nth-child(3n){
          margin-right: 0;
        }
      }
    }
    .figure-content{
      height: calc(60vh - 120px);
      margin: 10px;
      overflow: auto;
    }
    .preview-content{
      position: relative;
      min-height: 120px;
    }
    .modal-footer{
      font-size: 14px;
      border-top: 1px solid #f5f5f5;
      padding: 18px;
      text-align: center;
    }
  }
  .confirm-modal{
    height: 100vh;
    position: relative;
    .confirm-content{
      padding: 12px;
      text-align: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
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
