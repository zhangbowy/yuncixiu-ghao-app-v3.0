<template>
  <div class="commonly">
    <div class="topOptions">
      <transition name="van-slide-down">
        <div v-show="visible" class="operate-btn">
          <van-dropdown-menu>
            <!-- <van-dropdown-item v-model="fontType" :options="fontTypeOptions" @change="fontChange" /> -->
            <van-dropdown-item ref="fontType" :title="fontType.font_name">
              <van-cell
                v-for="item in fontTypeOptions"
                :key="item.font_id"
                clickable
                class="font-dropdown"
                @click="fontChange(item)"
              >
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template #title>
                  <span class="custom-title" :class="{'active':fontType==item }">{{ item.font_name }}</span>
                  <img :src="item.preview_image" alt="" class="font-icon">
                </template>
                <template #right-icon>
                  <van-icon :name="fontType==item?'success': ''" color="#1989fa" style="line-height: inherit;" />
                </template>
              </van-cell>
            </van-dropdown-item>
            <van-dropdown-item ref="fontColor" :title="`${$t('颜色')}`">
              <van-tabs type="card" color="#333" background="#fff">
                <van-tab :title="`${$t('标准色')}`">
                  <compact-picker v-model="fontColor" @change="imgColorChnage" />
                </van-tab>
                <van-tab :title="`${$t('自定义')}`">
                  <sketch-picker v-model="fontColor" @change="imgColorChnage" />
                </van-tab></van-tabs>
            </van-dropdown-item>
            <van-dropdown-item ref="fontSize" :title="`${fontSize}mm`">
              <!-- <number-input
                v-model="fontSize"
                width="100%"
                :value="fontSize"
                :label="`${$t('字体高度')}`"
                :min="fontType.min_height"
                :max="fontType.max_height"
                :placeholder="`${$t('请输入字体高度')}`"
                unit="mm"
              /> -->
              <van-cell :title="`${$t('字体高度')}`">
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template #right-icon>
                  <van-stepper v-model="fontSize" :min="fontType.min_height" :max="fontType.max_height" />
                </template>
              </van-cell>

              <span style="font-size: 14px; color:#999;display: block;padding: 16px;">当前字体高度在{{ fontType.min_height }}mm至{{ fontType.max_height }}mm之间</span>
            </van-dropdown-item>
            <van-dropdown-item v-model="fontAlign" :options="alignment" />
            <van-dropdown-item v-if="topInput==true" ref="item" :title="`${$t('弧形')}`">
              <van-switch-cell v-model="openArc" :title="`${$t('是否开启')}`" />
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </transition>
      <transition name="van-slide-down">
        <div v-show="middleVisible" class="operate-btn">
          <van-dropdown-menu>
            <div class="middle-img-menu">
              <div class="menu-item">
                <van-button icon="edit" size="small" plain type="default" @click="showInput=true">{{ $t(`尺寸`) }}</van-button>
              </div>
              <div class="menu-item">
                <van-button icon="delete" size="small" plain type="default" @click="deleteMiddleImg">{{ $t(`删除`) }}</van-button>
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
      <div class="bg-box" @click.stop="hiddenVisible">
        <!-- 背景图 -->
        <img
          class="bg-img"
          :src="customInfo.item && customInfo.item.background ?customInfo.item.background: customInfo.custom_info.design_bg"
          :style="designImgStyle"
          alt=""
        >
        <!-- 设计区域 -->
        <div class="design-box" :style="designBoxStyle">
          <!-- 上输入框  -->
          <div
            v-if="currentTemplate.emb_template_id!==2"
            class="top-input"
            :class="{'focus':topFocus==true, 'middle':currentTemplate.emb_template_id==1, 'topBottom': currentTemplate.emb_template_id==3}"
          >
            <div
              v-if="topFocus==false"
              class="top-img-list"
              :style="{ textAlign: form.topText.align,fontSize: `${form.topText.fontSize}px`,color: `${form.topText.fontColor}`}"
              @click.stop="imgFocus(1)"
            >
              <span
                v-if="topFocus==false && topInput==false && topImg.length==0"
              >{{ form.topText.content?form.topText.content: '双击开始编辑' }}</span>
              <div v-else ref="topImgContent" class="top-img-content">
                <img v-for="(item,index) in topImg" :key="index" :height="form.topText.fontSize" :src="item" alt="">
              </div>
            </div>
            <div v-if="topFocus==true" class="input-box">
              <input
                v-model="form.topText.content"
                :placeholder="`${$t('点击输入文字')}`"
                type="text"
                :style="{ textAlign: form.topText.align,fontSize: `${form.topText.fontSize}px`,color: `${form.topText.fontColor}`}"
                @input="getFontTop()"
                @blur="inputBlur(1)"
                @focus="inpuFocus(1)"
              >
            </div>
          </div>
          <!-- 中间图片 -->
          <div v-if="currentTemplate.emb_template_id!==1" class="middle-img">
            <img
              v-if="patternPicture[0] || form.middleImg.prev_png_path"
              :src="patternPicture[0]?patternPicture[0].content: form.middleImg.prev_png_path"
              alt=""
              :style="{maxWidth:`${form.middleImg.width*design_box.design_scale}px`,height: `${form.middleImg.height*design_box.design_scale}px`}"
              @click.stop="showMiddleMemu()"
            >
          </div>
          <!-- 下输入框 -->
          <div
            v-if="currentTemplate.emb_template_id==3"
            class="bottom-input"
            :class="{'focus':bottomFocus==true,'topBottom': currentTemplate.emb_template_id==3}"
          >
            <div
              v-if="bottomFocus==false"
              class="bottom-img-list"
              :style="{textAlign: form.bottomText.align,fontSize: `${form.bottomText.fontSize}px`,color: `${form.bottomText.fontColor}`}"
              @click.stop="imgFocus(2)"
            >
              <span
                v-if="bottomFocus==false && bottomFocus==false && bottomImg.length==0"
              >{{ form.bottomText.content? form.bottomText.content: '双击开始编辑' }}</span>
              <div v-else ref="bottomImgContent" class="bottom-img-content">
                <img
                  v-for="(item,index) in bottomImg"
                  :key="index"
                  :height="form.bottomText.fontSize"
                  :src="item"
                  alt=""
                >
              </div>
            </div>
            <div v-if="bottomFocus==true" class="input-box">
              <input
                v-model="form.bottomText.content"
                :placeholder="`${$t('点击输入文字')}`"
                type="text"
                :style="{textAlign: form.bottomText.align,fontSize: `${form.bottomText.fontSize}px`,color: `${form.bottomText.fontColor}`}"
                @input="getFontBottom()"
                @blur="inputBlur(2)"
                @focus="inpuFocus(2)"
              >
            </div>
          </div>
        </div>
        <!-- 设计区域结束 -->
      </div>
    </div>
    <!-- 底部操作 -->
    <bottom-options
      :current-template="currentTemplate"
      @change="bottomBtn"
    />
    <!-- 选择定制模板 -->
    <template-modal
      v-model="templateModal"
      :data-list="templateList"
      :current-template="currentTemplate"
      @change="checkTeplateItem"
    />
    <!-- 上传图片 -->
    <van-popup v-model="uploadModal" :style="{ width: '80%', minHeight: '30%' }" round closeable>
      <div class="modal">
        <div class="modal-title">{{ $t(`上传图片`) }}</div>
        <div class="modal-content">
          <van-uploader v-model="patternPicture" multiple :max-count="1" />
        </div>
        <div class="footer-button">
          <van-button size="small" round color="linear-gradient(to right, #ff6034,#ee0a24)" @click="uploadModal=false">{{ $t(`确定`) }}</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 花样库 -->
    <pattern-modal
      v-model="patternModal"
      :figure-list="figureList"
      :form="form"
      @change="checkFigureItem"
    />
    <!-- 预览设计 -->
    <preview-modal
      v-model="previewModal"
      :loading="loading"
      :img="previewImg"
      @complete="complete"
    />
    <!-- 完成设计弹出层 -->
    <confirm-modal
      v-model="confirmModal"
      :loading="loading"
      :img="previewImg"
      @dobuy="buyNow"
      @hidden="confirmModal=false"
    />
    <!-- 修改图片尺寸 -->
    <van-popup v-model="showInput" :style="{ width: '100%' }" position="bottom" round closeable>
      <div class="modal">
        <div class="modal-title">{{ $t(`修改图片尺寸`) }}</div>
        <div class="modal-content" style="text-align: left">
          <div class="img-size">
            <!-- <number-input
              v-model="form.middleImg.height"
              width="100%"
              :value="form.middleImg.height"
              :label="`${$t('图片高度')}`"
              :max="middleImgHeight"
              :placeholder="`${$t('请输入高度')}`"
              unit="mm"
            /> -->
            <van-cell :title="`${$t('图片高度')}`">
              <template #right-icon>
                <van-stepper v-model="form.middleImg.height" :min="0" :max="middleImgHeight" />
              </template>
            </van-cell>
            <span style="font-size: 14px; color:#999;display: block;padding: 10px 16px;">注：当前图片高度在0mm至{{ middleImgHeight }}mm之间</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { designApi } from '@/api/design'
import Sketch from '@/components/VueColorPicker/Sketch'
import Compact from '@/components/VueColorPicker/Compact'
import ConfirmModal from './components/ConfirmModal'
import PreviewModal from './components/PreviewModal'
import TemplateModal from './components/TemplateModal'
import PatternModal from './components/PatternModal'
import BottomOptions from './components/BottomOptions'
import { debounce, getNaturalImgSize } from '@/utils'
import { mapState } from 'vuex'
import $ from 'jquery'
import './arctext'
import { Toast } from 'vant'
import store from '@/store'
export default {
  components: {
    'sketch-picker': Sketch,
    'compact-picker': Compact,
    'preview-modal': PreviewModal,
    'confirm-modal': ConfirmModal,
    'template-modal': TemplateModal,
    'pattern-modal': PatternModal,
    'bottom-options': BottomOptions
  },

  data() {
    return {
      uploadModal: false, // 上传图片弹框是否显示
      patternModal: false, // 花样弹框是否显示
      templateModal: false, // 模板选择弹框
      previewModal: false, // 预览弹框是否显示
      confirmModal: false, // 完成设计

      visible: false, // 顶部操作是否显示
      middleVisible: false, // 顶部图片属性是否显示
      topFocus: false, // 上输入框聚焦
      bottomFocus: false, // 底部输入框聚焦
      topInput: false,
      bottomInput: false,
      loading: false, // 加载动画
      showInput: false, // 显示上传图片弹框
      openArc: false, // 是否开启弧形
      figureList: [], // 花样库
      templateList: [], // 模板列表
      currentTemplate: {}, // 当前模板
      topText: '', // 上输入框文本
      topImg: [], // 上图片
      bottomText: '', // 底部文本
      bottomImg: [], // 底部图片
      fontType: {}, // 字体类型
      fontTypeOptions: [], // 可选字体
      fontAlign: 'center', // 字体对齐方式
      alignment: [{
        text: `${this.$t('左对齐')}`, value: 'left'
      }, {
        text: `${this.$t('居中')}`, value: 'center'
      }, {
        text: `${this.$t('右对齐')}`, value: 'right'
      }],
      fontColor: {
        hex: 'fff'
      },
      fontSize: 12, // 字体高度
      form: {
        topText: {
          content: '',
          fontSize: 12,
          fontColor: '#fff',
          fontType: '',
          align: 'center'
        },
        middleImg: {
          width: 0,
          height: 0,
          design_id: ''
        },
        bottomText: {
          content: '',
          fontSize: 12,
          fontColor: '#fff',
          fontType: '',
          align: 'center'
        }
      },
      middleImgWidth: 0, // 中间图片的最大宽度
      middleImgHeight: 0, // 中间图片的最大高度
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
      previewImg: '', // 预览图片
      design_area_image: '' // 设计区域整体图片
    }
  },
  computed: {
    ...mapState([
      'design'
    ])
  },
  watch: {
    fontSize(newValue, oldValue) {
      if (this.topInput === true) {
        this.form.topText.fontSize = newValue
      }
      if (this.bottomInput === true) {
        this.form.bottomText.fontSize = newValue
      }
    },
    fontAlign(newValue, oldValue) {
      if (this.topInput === true) {
        this.form.topText.align = newValue
      }
      if (this.bottomInput === true) {
        this.form.bottomText.align = newValue
      }
    },
    patternPicture(newValue, oldValue) {
      if (newValue[0]) {
        this.form.middleImg.design_id = ''
        this.form.middleImg.prev_png_path = ''
      }
    },
    // 是否启用弧形文字
    openArc(newValue, oldValue) {
      if (newValue === true) {
        this.imgRotate()
      }
    },
    // 监听当前模板变化
    currentTemplate: {
      handler(newValue, old) {
        const type = newValue.emb_template_id
        if (type === 1) {
          this.form.middleImg = {}
          this.form.bottomText.content = ''
          this.bottomImg = []
          this.deleteMiddleImg()
        }
        if (type === 2) {
          this.topImg = []
          this.bottomImg = []
          this.form.middleImg.width = this.design_box.design_W / this.design_box.design_scale
          this.form.middleImg.height = this.design_box.design_H / this.design_box.design_scale
          this.middleImgHeight = (this.design_box.design_H / this.design_box.design_scale).toFixed(2)
          this.middleImgWidth = (this.design_box.design_W / this.design_box.design_scale).toFixed(2)
        }
        if (type === 3) {
          this.middleImgHeight = (this.design_box.design_H / this.design_box.design_scale) - (90 / this.design_box.design_scale)
          this.form.middleImg.height = this.middleImgHeight
        }
      }
    }
  },
  created() {
    // 获取字体列表
    this.getFontList()
    // 弧形文字
    if (this.$route.query.goods_id && this.$route.query.sku_id) {
      this.goods_id = this.$route.query.goods_id
      this.sku_id = this.$route.query.sku_id
    }
    // 获取定制信息
    this.customDetail(this.goods_id, this.sku_id)
    this.getFigureList() // 获取花样库
    this.getTemplate() // 获取定制模板

    // 初始化页面显示模板弹框
    this.templateModal = true
  },

  methods: {
    // 获取字体列表
    getFontList() {
      designApi.getFontList().then(res => {
        this.fontTypeOptions = res.data
        this.fontType = res.data[0]
        this.form.topText.fontType = res.data[0].font_id
        this.form.bottomText.fontType = res.data[0].font_id
        this.form.topText.fontSize = res.data[0].min_height
        this.form.bottomText.fontSize = res.data[0].min_height
      })
    },
    // 获取定制模板
    getTemplate() {
      designApi.getEmbTemplate({
        template_type: 1 // 1 一般定制 2 特殊定制
      }).then(res => {
        this.templateList = res.data
        this.currentTemplate = this.templateList[2]
        this.form.middleImg.height = this.middleImgHeight
      })
    },
    // 获取花样库列表
    getFigureList() {
      designApi.getFigure({
        pageSize: 1000
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
      // 中间图片的最大宽高 单位毫米
      this.middleImgWidth = (this.design_box.design_W / design_scale).toFixed(2)
      this.middleImgHeight = (this.design_box.design_H / design_scale - 90 / design_scale).toFixed(2)
      this.form.middleImg.width = this.design_box.design_W / this.design_box.design_scale
      this.form.middleImg.height = this.middleImgHeight
    },
    // 输入框聚焦
    inpuFocus(type) {
      this.visible = true
      this.middleVisible = false
      if (type === 1) {
        this.fontSize = this.form.topText.fontSize
        this.topFocus = true
      } else {
        this.fontSize = this.form.bottomText.fontSize
        this.bottomFocus = true
      }
    },
    // 输入框失去焦点
    inputBlur(type) {
      type === 1 ? this.topFocus = false : this.bottomFocus = false
      if (this.openArc === true) {
        this.imgRotate()
      }
    },
    // 文字图片点击
    imgFocus(type) {
      if (type === 1) {
        this.topFocus = true
        this.topInput = true
        this.bottomFocus = false
        this.bottomInput = false
      } else {
        this.topFocus = false
        this.topInput = false
        this.bottomFocus = true
        this.bottomInput = true
      }
    },
    getFontTop: debounce(function() {
      let arr = []
      const text = this.form.topText.content
      arr = text.split('')
      designApi.getTextImage({
        font_id: this.form.topText.fontType,
        font_list: JSON.stringify(arr),
        color: this.form.topText.fontColor
      }).then(res => {
        if (res.code === 0) {
          this.topImg = res.data
          this.imgRotate()
        } else {
          Toast(this.$t(...res.msg))
        }
      })
    }, 500),
    getFontBottom: debounce(function() {
      let arr = []
      const text = this.form.bottomText.content
      arr = text.split('')
      designApi.getTextImage({
        font_id: this.form.bottomText.fontType,
        font_list: JSON.stringify(arr),
        color: this.form.bottomText.fontColor
      }).then(res => {
        if (res.code === 0) {
          this.bottomImg = res.data
        } else {
          Toast(this.$t(...res.msg))
        }
      })
    }, 500),
    showMiddleMemu(type) {
      // type==1个人上传，type==2花样库选择
      this.middleVisible = true
    },
    // 删除中间图片
    deleteMiddleImg() {
      this.patternPicture = []
      this.form.middleImg = {
        width: this.middleImgWidth,
        height: this.middleImgHeight,
        design_id: '',
        prev_png_path: ''
      }
      this.middleVisible = false
    },
    // 图片旋转
    imgRotate() {
      $(function() {
        $('.top-input span').arctext({
          radius: 360,
          dir: 1,
          rotate: true,
          fitText: true
        })
      })
      $(function() {
        $('.top-img-list .topImgContent').arctext({
          radius: 180,
          dir: 1,
          rotate: true,
          fitText: false
        })
      })
    },
    // 字体选择
    fontChange(item) {
      this.fontType = item
      this.fontSize = item.min_height
      if (this.topInput === true) {
        this.form.topText.fontType = item.font_id
        this.form.topText.fontSize = item.min_height
        this.getFontTop()
      }
      if (this.bottomInput === true) {
        this.form.bottomText.fontType = item.font_id
        this.form.bottomText.fontSize = item.min_height
        this.getFontBottom()
      }
      this.$refs.fontType.toggle()
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
    // 底部按钮组件 点击事件
    bottomBtn(name) {
      if (name === 'showImgList') this.patternModal = true // 显示花样库
      if (name === 'showUpload') this.uploadModal = true // 显示上传图片弹框
      if (name === 'showTemplate') this.templateModal = true // 显示模板弹框
      if (name === 'preview') this.preview()
      if (name === 'complete') this.complete()
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
    // 选中花样图片
    checkFigureItem(item) {
      this.form.middleImg.design_id = item.design_id
      this.form.middleImg.prev_png_path = item.prev_png_path
      // 获取花样宽高
      if (this.currentTemplate.emb_template_id === 2) {
        getNaturalImgSize(item.prev_png_path, (res) => {
          console.log(res)
          if ((res.w / res.h) > (this.design_box.design_W / this.design_box.design_H)) {
            this.middleImgHeight = res.h / (res.w / this.design_box.design_W) / this.design_box.design_scale
            this.form.middleImg.height = this.middleImgHeight
          } else {
            this.middleImgHeight = this.design_box.design_H / this.design_box.design_scale
            this.form.middleImg.height = this.middleImgHeight
          }
        })
      }
      this.form.middleImg.width = this.middleImgWidth
      this.patternModal = false
      this.patternPicture = [] // 上传的花样图片设为空
    },
    // checked定制模板
    checkTeplateItem(item) {
      this.currentTemplate = item
      this.templateModal = false
    },
    // 点击预览
    preview() {
      this.getPreview()
      this.previewModal = true
    },
    // 获取预览图
    getPreview() {
      this.loading = true
      // 计算文字输入框和设计区的比例 当前输入框高度默认为45px
      const top_scale = this.form.topText.fontSize > 45 ? this.form.topText.fontSize / this.design_box.design_H : 45 / this.design_box.design_H
      const bottom_scale = this.form.bottomText.fontSize > 45 ? this.form.bottomText.fontSize / this.design_box.design_H : 45 / this.design_box.design_H
      // 计算文字图片和文字输入框的比例
      const top_font_scale = this.form.topText.fontSize > 45 ? 1 : this.form.topText.fontSize / 45
      const bottom_font_scale = this.form.bottomText.fontSize > 45 ? 1 : this.form.bottomText.fontSize / 45
      // 计算图片高度和设计区的比例
      const middle_scale = (this.form.middleImg.height * this.design_box.design_scale) / this.design_box.design_H
      // 请求预览图接口
      designApi.getPreview({
        id: this.$route.query.goods_id,
        design_id: this.form.middleImg.design_id,
        top_scale: top_scale,
        top_font_scale: top_font_scale,
        top_font_content: this.topImg,
        top_font_color: this.form.topText.fontColor,
        font_id: this.fontType,
        middle_scale: middle_scale,
        bottom_scale: bottom_scale,
        bottom_font_scale: bottom_font_scale,
        bottom_font_content: this.bottomImg,
        bottom_font_color: this.form.bottomText.fontColor,
        custom_template_id: this.currentTemplate.emb_template_id,
        custom_image: this.patternPicture[0] ? this.patternPicture[0].content : '',
        background: this.customInfo.item?.background
      }).then(res => {
        this.loading = false
        this.previewImg = res.data.preview_image
        this.design_area_image = res.data.design_area_image
      }).catch(() => {
        this.loading = false
      })
    },
    // 完成定制
    complete() {
      this.previewModal = false
      this.getPreview()
      this.confirmModal = true
    },
    // 立即购买
    buyNow() {
      let top_w, bottom_w
      if (this.currentTemplate.emb_template_id !== 2) {
        if (this.topImg.length > 0) {
          top_w = this.$refs.topImgContent.offsetWidth
        } else {
          top_w = 0
        }
      }
      if (this.currentTemplate.emb_template_id === 3) {
        if (this.bottomImg.length > 0) {
          bottom_w = this.$refs.bottomImgContent.offsetWidth
        }
      }
      // 获取vuex->design->state->goodsInfo
      var goodsInfo = JSON.parse(this.design.goodsInfo)
      goodsInfo[0].design_info = {
        design_id: this.form.middleImg.design_id,
        top_font_width: top_w,
        top_font_height: this.form.topText.fontSize,
        top_font_content: this.form.topText.content,
        top_font_color: this.form.topText.fontColor,
        bottom_font_width: bottom_w,
        bottom_font_height: this.form.bottomText.fontSize,
        bottom_font_content: this.form.bottomText.content,
        bottom_font_color: this.form.bottomText.fontColor,
        font_id: this.fontType,
        font_family: this.fontType,
        design_width: this.form.middleImg.width,
        design_height: this.form.middleImg.height,
        is_choose_design: this.form.middleImg.design_id ? '1' : '0',
        custom_image: this.patternPicture[0] ? this.patternPicture[0].content : '',
        custom_template_id: this.currentTemplate.emb_template_id,
        preview_image: this.previewImg,
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
      .font-dropdown{
        .custom-title{
          display: inline-block;
          width: 130px
        }
        .custom-title.active{
          color: #1989fa;
        }
        .font-icon{
          height: 30px;
          margin-left: 10px;
          display: inline-block;
          vertical-align: middle;
        }
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
    .img-size{
      background: #fff;
    }
    .van-dropdown-menu{
      line-height: 0;
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
      z-index: 999;
      .top-input,.bottom-input{
        font-size: 12px;
        z-index: 1;
        .input-box{
          border: 1px solid #4bb1ff00;
          input{
            background: none;
            width: 100%;
            border: none;
            outline: none;
          }
        }
        &.focus{
          .input-box{
            border: 1px solid #4bb0ff;
          }
        }
        &.topBottom{
          height: 45px;
          line-height: 45px;
          input{
            height: 45px;
            line-height: 45px;
          }
          .top-img-list,.bottom-img-list{
            height: 45px;
            line-height: 45px;
          }
        }
        .top-img-content,.bottom-img-content{
          display: inline;
        }
      }
      .top-img-list,.bottom-img-list{
        width: 100%;
        span{
          padding: 0 5px;
        }
      }
      .top-input{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        &.middle{
          min-height: 45px;
          top: 50%;
          transform: translateY(-50%);
          input{
            min-height: 45px;
          }
          .top-img-list,.bottom-img-list{
            min-height: 45px;
            line-height: 45px;
          }
        }

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
        }
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
        border: 1px solid #cccccc;
        border-radius: 0.21333rem;
        .van-uploader__upload{
          text-align: center;
          margin: 0;
        }
        .van-uploader__wrapper{
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
    .footer-button{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 0 10px;
      button{
        width: 70%;
      }
    }
  }
}
</style>
