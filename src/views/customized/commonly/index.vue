<template>
  <div ref="commonly" class="commonly">
    <div class="topOptions">
      <transition name="van-slide-down">
        <div v-show="visible" class="operate-btn">
          <van-dropdown-menu>
            <!-- <van-dropdown-item v-model="fontType" :options="fontTypeOptions" @change="fontChange" /> -->
            <van-dropdown-item ref="fontType" :title="`${$t('字体')}`" @opened="onDropdownMenuOpen" @close="onDropdownMenuClose">
              <van-cell
                v-for="item in filtterFontTypeList"
                :key="item.font_id"
                clickable
                class="font-dropdown"
                @click.prevent="fontChange(item)"
              >
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template #title>
                  <span class="custom-title" :class="{'active':fontType==item.font_id }">{{ item.font_name }}</span>
                  <img :src="item.preview_image" alt="" class="font-icon">
                </template>
                <template #right-icon>
                  <van-icon :name="fontType==item.font_id?'success': ''" color="#1989fa" style="line-height: inherit;" />
                </template>
              </van-cell>
            </van-dropdown-item>
            <van-dropdown-item ref="fontColor" :title="`${$t('颜色')}`" @opened="onDropdownMenuOpen" @close="onDropdownMenuClose">
              <van-tabs type="card" color="#333" background="#fff">
                <van-tab :title="`${$t('标准色')}`">
                  <compact-picker v-model="fontColor" @change="imgColorChange" />
                </van-tab>
                <van-tab :title="`${$t('自定义')}`">
                  <sketch-picker v-model="fontColor" @change="imgColorChange" />
                </van-tab></van-tabs>
            </van-dropdown-item>
            <van-dropdown-item :title="`${fontHeight}mm`" @opened="onDropdownMenuOpen" @close="onDropdownMenuClose">
              <van-cell :title="`${$t('字体高度')}`">
                <van-stepper v-model="fontHeight" button-size="32px" :min="minFontHeight" :max="maxFontHeight" @change="fontSizeChange" />
              </van-cell>
            </van-dropdown-item>
            <van-dropdown-item v-if="currentTemplate.emb_template_id !== 1 || (currentTemplate.emb_template_id === 3 && !openArc)" v-model="fontAlign" :options="alignment" @opened="onDropdownMenuOpen" @close="onDropdownMenuClose" />
            <van-dropdown-item v-if="topWrapperFocus" ref="item" :title="`${$t('弧形')}`" @opened="onDropdownMenuOpen" @close="onDropdownMenuClose">
              <van-switch-cell v-model="openArc" :title="`${$t('是否开启')}`" @change="changeOpenArc" />
              <template v-if="currentTemplate.emb_template_id === 1">
                <van-cell :title="`${$t('弧度')}`">
                  <van-stepper v-model="radian" button-size="32px" :min="120" :max="360" />
                </van-cell>
                <van-cell :title="`${$t('半径')}`">
                  <van-stepper v-model="radiusWidth" button-size="32px" :max="maxRadiusWidth" />
                </van-cell>
              </template>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </transition>
      <transition name="van-slide-down">
        <div v-show="middleVisible" class="operate-btn img-btns">
          <van-dropdown-menu>
            <div class="middle-img-menu" :overlay="false">
              <div class="menu-item  img-btn">
                <van-button icon="edit" size="small" plain type="default" @click="showInput=true">{{ $t(`尺寸`) }}</van-button>
              </div>
              <div class="menu-item  img-btn">
                <van-button icon="delete" size="small" plain type="default" @click="deleteMiddleImg">{{ $t(`删除`) }}</van-button>
              </div>
            </div>
          </van-dropdown-menu>
        </div>
      </transition>
      <transition name="van-slide-down">
        <div v-show="showTextOperate" class="operate-btn text-btns">
          <van-dropdown-menu>
            <div class="middle-img-menu" :overlay="false">
              <div class="menu-item  img-btn">
                <van-button class="text-btn" icon="replay" size="small" plain type="default" @click.self="onTextInputReplay">{{ $t(`重新输入`) }}</van-button>
              </div>
              <div v-if="currentTemplate.emb_template_id !== 1" class="menu-item  img-btn">
                <van-button class="text-btn" icon="delete" size="small" plain type="default" @click="onTextInputDelete">{{ $t(`删除`) }}</van-button>
              </div>
            </div>
          </van-dropdown-menu>
        </div>
      </transition>
      <!-- 遮罩层 -->
      <!-- <van-overlay z-index="10" class-name="top-mask" :show="visible" @click="hiddenVisible" /> -->
      <!-- <van-overlay z-index="10" class-name="tsop-mask" :show="middleVisible" @click="hiddenVisible" /> -->
    </div>
    <div class="designArea">
      <div class="commonly-bg-box" @click="hiddenVisible">
        <!-- 背景图 -->
        <img
          v-if="!is_beta"
          class="bg-img"
          :src="customInfo.item && customInfo.item.background ? customInfo.item.background : customInfo.custom_info.design_bg"
          :style="designImgStyle"
          alt=""
        >
        <!-- 设计区域 -->
        <div ref="designBox" class="design-box" :style="designBoxStyle">
          <!-- 上输入框  -->
          <div
            v-if="currentTemplate.emb_template_id!==2 && showTopText"
            class="top-input"
            :class="{'focus':topWrapperFocus==true, 'middle':currentTemplate.emb_template_id==1, 'topBottom': currentTemplate.emb_template_id==3}"
          >
            <div
              v-if="!topWrapperFocus"
              class="top-img-list"
              :style="{ textAlign: form.topText.align,fontSize: `${getFontSize(form.topText.fontSize)}px`,color: `${form.topText.fontColor}`, fontFamily: 'font'}"
              @click.stop="inputWrapperFocus(1)"
            >
              <span v-if="topFocus==false && topImg.length === 0 && topTextList.length === 0">{{ form.topText.content ? form.topText.content : $t('双击开始编辑') }}</span>
              <div v-else class="top-img-content">
                <span v-if="form.topText.inputMode === 'en'" id="img" ref="topImgContent" :class="openArc && 'arc'">
                  <img v-for="(item,index) in topImg" ref="topImg" :key="`${index}${openArc}`" :height="getFontSize(form.topText.fontSize)" :src="item" alt="">
                </span>
                <span v-if="form.topText.inputMode === 'zh'" id="text" ref="topImgContent" :class="openArc && 'arc'">
                  <span v-for="(item,index) in topTextList" ref="topImg" :key="`${index}${openArc}`">{{ item }}</span>
                </span>
              </div>
            </div>
            <div v-if="topWrapperFocus" class="input-box">
              <input
                ref="topInput"
                v-model="form.topText.content"
                :placeholder="`${$t('点击输入文字')}`"
                type="text"
                :style="{ textAlign: form.topText.align,fontSize: `${getFontSize(form.topText.fontSize)}px`,color: `${form.topText.fontColor}`, fontFamily: 'font'}"
                @blur="inputBlur(1, $event)"
                @focus="inputFocus(1)"
              >
            </div>
          </div>
          <!-- 中间图片 -->
          <div v-if="currentTemplate.emb_template_id!==1" class="middle-img">
            <img
              v-if="patternPicture[0] || form.middleImg.prev_png_path"
              :src="patternPicture[0]?patternPicture[0].content: form.middleImg.prev_png_path"
              alt=""
              :style="{
                maxWidth: `${form.middleImg.width*design_box.design_scale || 300}px`,
                height: `${Math.min(form.middleImg.height*design_box.design_scale, customInfo.custom_info.design_height *design_box.design_scale)}px`
              }"
              @click.stop="showMiddleMemu()"
            >
          </div>
          <!-- <div v-if="currentTemplate.emb_template_id!==1" class="middle-img">
            <img
              src="https://cos-cx-n1-1257124629.cos.ap-guangzhou.myqcloud.com/design/15/7/2020-05-28-17:15:33/Car2.PNG"
              alt=""
              width="100"
              @click.stop="showMiddleMemu()"
            >
          </div> -->
          <!-- 下输入框 -->
          <div
            v-if="currentTemplate.emb_template_id==3 && showBottomText"
            class="bottom-input"
            :class="{'focus':bottomWrapperFocus==true,'topBottom': currentTemplate.emb_template_id==3}"
          >
            <div
              v-if="bottomWrapperFocus==false"
              class="bottom-img-list"
              :style="{textAlign: form.bottomText.align,fontSize: `${getFontSize(form.bottomText.fontSize)}px`,color: `${form.bottomText.fontColor}`, fontFamily: 'font_b'}"
              @click.stop="inputWrapperFocus(2)"
            >
              <span
                v-if="bottomFocus==false && bottomImg.length==0"
              >{{ form.bottomText.content? form.bottomText.content: $t('双击开始编辑') }}</span>
              <div v-else class="bottom-img-content">
                <span ref="bottomImgContent" :class="openArc && 'arc'">
                  <img v-for="(item,index) in bottomImg" :key="index" :height="getFontSize(form.bottomText.fontSize)" :src="item">
                </span>
              </div>
            </div>
            <div v-if="bottomWrapperFocus" class="input-box">
              <input
                ref="bottomInput"
                v-model="form.bottomText.content"
                :placeholder="`${$t('点击输入文字')}`"
                type="text"
                :style="{textAlign: form.bottomText.align,fontSize: `${getFontSize(form.bottomText.fontSize)}px`,color: `${form.bottomText.fontColor}`, fontFamily: 'font_b'}"
                @input="getFontBottom()"
                @blur="inputBlur(2, $event)"
                @focus="inputFocus(2)"
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
      :is-beta="is_beta"
      :is-zh="topWrapperFocus ? form.topText.inputMode === 'zh' : form.bottomText.inputMode === 'zh'"
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
          <van-uploader v-model="patternPicture" multiple :max-count="1" :after-read="onUploadImg" />
        </div>
        <div class="footer-button">
          <van-button size="small" round color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onUploadImgConfirm">{{ $t(`确定`) }}</van-button>
        </div>
        <div v-if="patternPicture.length" class="footer-button">
          <van-button size="small" round color="linear-gradient(to right, #ff6034,#ee0a24)" @click="removeBG">{{ $t(`去除背景`) }}</van-button>
          <div class="footer-button_message">
            <van-icon name="info-o" />
            <span>{{ $t(`仅限白色背景`) }}</span>
          </div>
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
      :goods-info="customInfo"
      @complete="complete"
      @change="value => previewModal = value"
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
        <div class="modal-content">
          <div v-if="currentBestHeight" class="modal-hint">
            <span>最佳尺寸</span>
            <span>{{ currentBestHeight }}</span>
          </div>
          <div class="img-size">
            <number-input
              v-model="form.middleImg.height"
              width="100%"
              :value="form.middleImg.height"
              :label="`${$t('图片高度')}`"
              :max="middleImgMaxHeght || middleImgHeight"
              :min="middleImgMinHeight"
              :placeholder="`${$t('请输入高度')}`"
              unit="mm"
            />
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 输入模式 -->
    <van-dialog v-model="inputModeModel" :title="`${$t('选择输入模式')}`" :show-cancel-button="false" :show-confirm-button="false" :close-on-click-overlay="true">
      <div class="input-mode-btns">
        <div class="icon-wrapper" @click="onInputModeChange('en')">
          <svg-icon class="mode-en" icon-class="cx" />
          <span>{{ $t(`刺绣字体`) }}</span>
        </div>
        <div class="icon-wrapper" @click="onInputModeChange('zh')">
          <svg-icon class="mode-zh" icon-class="text" />
          <span>{{ $t(`中文字体`) }}</span>
        </div>
      </div>
    </van-dialog>

    <!-- 2021-08-29新增 -->
    <goods-modal
      v-model="goodsModal"
      :goods-list="goodsList"
      :form="form"
      @change="choose_goods"
    />
  </div>
</template>

<script>
import { designApi } from '@/api/design'
import { goodsApi } from '@/api/goods'
import { commonApi } from '@/api/common'
import Sketch from '@/components/VueColorPicker/Sketch'
import Compact from '@/components/VueColorPicker/Compact'
import NumberInput from '@/components/Input/NumberInput'
import ConfirmModal from './components/ConfirmModal'
import PreviewModal from './components/PreviewModal'
import TemplateModal from './components/TemplateModal'
import PatternModal from './components/PatternModal'
import GoodsModal from './components/GoodsModal'
import BottomOptions from './components/BottomOptions'
import { debounce } from '@/utils'
import { mapState } from 'vuex'
import html2canvas from 'html2canvas'
import $ from 'jquery'
import './imgRotate'
import { Toast, Dialog } from 'vant'
import store from '@/store'
export default {
  components: {
    'sketch-picker': Sketch,
    'compact-picker': Compact,
    'number-input': NumberInput,
    'preview-modal': PreviewModal,
    'confirm-modal': ConfirmModal,
    'template-modal': TemplateModal,
    'pattern-modal': PatternModal,
    'bottom-options': BottomOptions,
    'goods-modal': GoodsModal,
    [Dialog.Component.name]: Dialog.Component
  },

  data() {
    return {
      uploadModal: false, // 上传图片弹框是否显示
      patternModal: false, // 花样弹框是否显示
      templateModal: false, // 模板选择弹框
      previewModal: false, // 预览弹框是否显示
      inputModeModel: false, // 输入模式弹框
      confirmModal: false, // 完成设计
      visible: false, // 顶部操作是否显示
      middleVisible: false, // 顶部图片属性是否显示
      topFocus: false, // 上输入框聚焦
      topWrapperFocus: false,
      bottomFocus: false, // 底部输入框聚焦
      bottomWrapperFocus: false,
      loading: false, // 加载动画
      showInput: false, // 显示上传图片弹框
      openArc: true, // 是否开启弧形
      showTopText: true, // 展示上文字
      showBottomText: true, // 展示下文字
      showTextOperate: false, // 展示输入框操作按钮
      radian: 120, // 弧度，最小值120
      maxRadiusWidth: 120, // 最大半径
      radiusWidth: 0, // 半径
      is_wilcom: 0,
      // minHeight: 812,
      goods_id: '',
      figureList: [], // 花样库
      currentBestHeight: 0, // 当前花样最佳高度
      templateList: [], // 模板列表
      topImg: [], // 上图片
      bottomImg: [], // 底部图片
      fontTypeOptions: [], // 可选字体
      filtterFontTypeList: [], // 过滤后的可选字体
      minFontHeight: 12, // 最大字体高度
      maxFontHeight: 12, // 最小子体高度
      fontHeight: 12, // 字体高度 mm
      currentTemplate: {
        emb_template_id: 2
      }, // 当前模板
      topTextList: [], // 字体列表
      inputMode: '', // 输入模式
      topText: '', // 上输入框文本
      bottomText: '', // 底部文本
      fontType: '', // 字体类型
      fontAlign: 'center', // 字体对齐方式
      design_id: '', // 当前选中的花样id
      currentFigure: {}, // 当前花样
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
      form: {
        topText: {
          content: '',
          fontSize: 12,
          fontColor: '#fff',
          fontType: '',
          align: 'center',
          inputMode: 'en'
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
          align: 'center',
          inputMode: 'en'
        }
      },
      middleImgWidth: 0, // 中间图片的最大宽度
      middleImgHeight: 0, // 中间图片的最大高度
      middleImgMaxHeght: 0, // 中间图片的最大高度
      middleImgMinHeight: 0, // 中间图片的最小高度
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
      design_area_image: '', // 设计区域整体图片
      design_image: '', // 设计区域整体图片

      isFirstClickTop: 1,
      isFirstClickBom: 1,
      is_beta: false, // 是否简易版云易绣
      goodsModal: false, // 是否显示商品列表弹窗的开关
      goodsList: [], // 商品列表,
      currentGoods: {},
      subMenu: false
    }
  },
  computed: {
    ...mapState([
      'design'
    ])
  },
  watch: {
    radiusWidth: {
      handler(newValue, oldValue) {
        this.imgRotate()
      }
    },
    'form.bottomText.content': {
      handler(newValue, oldValue) {
        const reg = /[\u4e00-\u9fa5]+/g
        if (this.form.bottomText.inputMode === 'en' && reg.test(newValue)) {
          this.$toast({
            message: `${this.$t('该模式下无法输入中文')}!`
          })
          this.form.bottomText.content = newValue.replace(reg, '')
        }
      }
    },
    'form.topText.content': {
      handler(newValue, oldValue) {
        const reg = /[\u4e00-\u9fa5]+/g
        if (this.form.topText.inputMode === 'en' && reg.test(newValue)) {
          this.$toast({
            message: `${this.$t('该模式下无法输入中文')}!`
          })
          this.form.topText.content = newValue.replace(reg, '')
        }
      }
    },
    radian: {
      handler(newValue, oldValue) {
        if (this.openArc) {
          const fontHeight = this.form.topText.fontSize
          if (newValue > 180) {
            this.maxRadiusWidth = (Math.min(this.design_box.design_W, this.design_box.design_H) - this.getFontSize(fontHeight) || 0) / 2
          } else {
            this.maxRadiusWidth = (Math.max(this.design_box.design_W, this.design_box.design_H) - this.getFontSize(fontHeight) || 0) / 2
          }
          this.imgRotate()
        }
      }
    },
    fontAlign(newValue, oldValue) {
      if (this.topWrapperFocus === true) {
        this.form.topText.align = newValue
      }
      if (this.bottomWrapperFocus === true) {
        this.form.bottomText.align = newValue
      }
    },
    patternPicture(newValue, oldValue) {
      if (newValue[0]) {
        this.cutImage(newValue[0].content)
        this.form.middleImg.design_id = ''
        this.form.middleImg.prev_png_path = ''
      }
    },
    // 监听当前模板变化
    currentTemplate: {
      deep: true,
      immediate: true,
      handler(newValue, old) {
        const type = newValue.emb_template_id
        this.init(type, this.design_box)
      }
    },
    design_box: {
      deep: true,
      handler(newValue) {
        const type = this.currentTemplate.emb_template_id
        this.init(type, newValue)
      }
    },
    previewModal: {
      handler(newValue, old) {
        if (newValue) {
          document.getElementsByClassName('navbar')[0].style.display = 'none'
        } else {
          document.getElementsByClassName('navbar')[0].style.display = 'block'
        }
      }
    }
    // ,
    // topFocus: {
    //   handler(newValue, old) {
    //     if (newValue) {
    //       this.showTextOperate = true
    //       this.middleVisible = false
    //       this.visible = true
    //     } else {
    //       this.showTextOperate = false
    //       // this.visible = false
    //       if (this.currentTemplate.emb_template_id === 3) {
    //         this.middleVisible = true
    //       }
    //     }
    //   }
    // },
    // bottomFocus: {
    //   handler(newValue, old) {
    //     if (newValue) {
    //       console.log(newValue)
    //     } else {
    //       this.showTextOperate = false
    //       // this.visible = false
    //       if (this.currentTemplate.emb_template_id === 3) {
    //         this.middleVisible = false
    //       }
    //     }
    //   }
    // },
    // topWrapperFocus: {
    //   handler(newValue, old) {
    //     if (newValue) {
    //       this.visible = true
    //       this.middleVisible = false
    //       this.showTextOperate = true
    //     } else {
    //       this.showTextOperate = false
    //       this.visible = false
    //       if (this.currentTemplate.emb_template_id === 3) {
    //         this.middleVisible = false
    //       }
    //     }
    //   }
    // },
    // bottomWrapperFocus: {
    //   handler(newValue, old) {
    //     if (newValue) {
    //       this.visible = true
    //     } else {
    //       this.visible = false
    //     }
    //   }
    // }
  },
  created() {
    this.is_beta = !!this.$route.query.beta
    // 获取字体列表
    // 弧形文字
    if (this.$route.query.goods_id && this.$route.query.sku_id) {
      this.goods_id = this.$route.query.goods_id
      this.sku_id = this.$route.query.sku_id
    }
    const { design_id } = this.$route.query || {}
    this.design_id = design_id
    // 获取定制信息
    this.customDetail(this.goods_id, this.sku_id)
    this.getFigureList() // 获取花样库
    this.getTemplate() // 获取定制模板
    // 如果是简易版
    if (this.is_beta) {
      if (this.$route.query?.template_id == 1) {
        this.currentTemplate.emb_template_id = 1
      }
      this.getGoodsList()
    } else {
      // 初始化页面显示模板弹框
      this.templateModal = true
    }
  },
  mounted() {
    // 696
    this.$refs.commonly && (this.$refs.commonly.style.minHeight = document.body.offsetHeight + 'px')

    // 模拟失焦
    this.$refs.commonly && this.$refs.commonly.addEventListener('click', (e) => {
      if (!this.topWrapperFocus && !this.bottomWrapperFocus) return
      // if (!this.subMenu) return
      const target = e.target
      console.dir(target)

      if (
        target.nodeName !== 'INPUT' &&
        target.nodeName !== 'svg' &&
        target.nodeName !== 'P' &&
        !target.classList.contains('model-btn') &&
        !target.classList.contains('van-ellipsis') &&
        !target.classList.contains('van-dropdown-menu__item') &&
        !target.classList.contains('text-btn') &&
        !target.classList.contains('van-dropdown-menu__title') &&
        !target.classList.contains('van-stepper__plus') &&
        !target.classList.contains('van-stepper__minus')) {
        this.inputWrapperBlur()
      }
    })
  },
  methods: {
    // 获取文字真实高度（px）
    getFontSize(height) {
      const design_height = this.customInfo?.custom_info.design_height || 150
      const box_height = parseFloat(this.designBoxStyle.height) || 300
      return (height / design_height) * box_height
    },
    onUploadImgConfirm() {
      this.uploadModal = false
    },
    onUploadImg(file) {
      const fileData = new FormData()
      fileData.append('image', file.file)
      designApi.uploadImg(fileData).then(({ data, code, msg }) => {
        if (code === 0) {
          this.patternPicture[0].url = data
          this.currentBestHeight = 0
          this.$toast.success(`${this.$t(...msg)}`)
        }
      }).catch(err => {
        console.log(err)
        this.$toast.fail(`${this.$t('上传失败!')}`)
      })
    },
    init(type, design_box) {
      if (type === 1) {
        this.form.middleImg = {}
        this.form.bottomText.content = ''
        this.bottomImg = []
        this.deleteMiddleImg()
        if (this.form.topText.content) {
          this.inputFocus(1).then(() => {
            this.inputBlur(1)
          })
        }
      }
      if (type === 2) {
        this.topImg = []
        this.bottomImg = []
        this.form.middleImg.width = this.formatNumber(design_box.design_W / design_box.design_scale)
        this.middleImgHeight = this.formatNumber(design_box.design_H / design_box.design_scale)
        this.form.middleImg.height = this.middleImgHeight
        this.middleImgWidth = this.formatNumber(design_box.design_W / design_box.design_scale)
      }
      if (type === 3) {
        this.$nextTick(() => {
          const bottomInput = document.getElementsByClassName('bottom-input')[0]
          const topInput = document.getElementsByClassName('top-input')[0]
          const fontHeight = (bottomInput ? bottomInput.offsetHeight : 0) + (topInput ? topInput.offsetHeight : 0) + 20
          this.middleImgHeight = this.formatNumber((design_box.design_H - fontHeight) / design_box.design_scale)
          this.form.middleImg.height = this.middleImgHeight
          if (this.form.topText.content) {
            this.getFontTop()
          }
        })
      }
      this.setFigureItemSizeRange(this.currentFigure)
    },
    removeBG() {
      // if (this.patternPicture[0].oldContent) {
      //   return
      // }
      this.$toast.loading({
        duration: 0,
        forbidClick: true
      })
      designApi.removeBackground({ image: this.patternPicture[0].content }).then((res) => {
        if (res.code === 0 && res.data) {
          this.cutImage(res.data)
          this.patternPicture[0] = Object.assign(this.patternPicture[0], { content: res.data, oldContent: this.patternPicture[0].content })
        } else {
          this.$toast.fail(`${this.$t('去除背景失败')}!`)
        }
      }).catch(() => {
        this.$toast.fail(`${this.$t('去除背景失败')}!`)
      })
    },
    /**
     * 裁剪图片，去除透明部分
     * @param {base64} imgUrl
     */
    cutImage(imgUrl) {
      if (!imgUrl) return
      // 创建一个image 计算图片真实大小
      const img = new Image()
      img.src = imgUrl
      img.onload = () => {
        // 创建一个canva 计算不透明图片区域大小
        const imgWidth = img.width
        const imgHeight = img.height
        const canvas = document.createElement('canvas')
        canvas.width = imgWidth
        canvas.height = imgHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
        const imgData = ctx.getImageData(0, 0, imgWidth, imgHeight).data
        const [x1, x2, y1, y2] = this.getCropArea(imgData, imgWidth, imgHeight)
        const [resultImgWidth, resultImgHeight] = [x2 - x1, y2 - y1]
        // 创建一个canvas 导出去除透明背景后的图片
        const crop_canvas = document.createElement('canvas')
        const crop_ctx = crop_canvas.getContext('2d')
        crop_canvas.width = resultImgWidth
        crop_canvas.height = resultImgHeight
        const crop_imgData = ctx.getImageData(x1, y1, resultImgWidth, resultImgHeight)
        // 设置图片大小
        this.form.middleImg.width = resultImgWidth > this.middleImgWidth ? this.middleImgWidth : resultImgWidth
        this.form.middleImg.height = resultImgHeight > this.middleImgHeight ? this.middleImgHeight : resultImgHeight
        crop_ctx.globalCompositeOperation = 'destination-over'
        crop_ctx.putImageData(crop_imgData, 0, 0)
        const newImgUrl = crop_canvas.toDataURL()
        if (newImgUrl) {
          this.patternPicture[0].content = newImgUrl
        }
        this.$toast.clear()
      }
    },
    /**
     * 获取非透明区域x 轴和y
     * @param {imageData} imgData
     * @param {number} imgWidth
     * @param {number} imgHeight
     */
    getCropArea(imgData, imgWidth, imgHeight) {
      let [x1, x2, y1, y2] = [imgWidth, 0, imgHeight, 0]
      for (let x = 0; x < imgWidth; x++) {
        for (let y = 0; y < imgHeight; y++) {
          var position = (x + imgWidth * y) * 4
          if (imgData[position] > 0 || imgData[position + 1] > 0 || imgData[position + 2] || imgData[position + 3] > 0) {
            x1 = Math.min(x, x1)
            x2 = Math.max(x, x2)
            y1 = Math.min(y, y1)
            y2 = Math.max(y, y2)
          }
        }
      }
      return [x1, x2, y1, y2]
    },
    onTextInputDelete() {
      const type = this.topWrapperFocus ? 'top' : 'bottom'
      this.$nextTick(() => {
        this.$refs[type + 'Input'].value = ''
        this.form[type + 'Text'].content = ''
        this[type + 'Img'] = []
        this[`show${this.topWrapperFocus ? 'Top' : 'Bottom'}Text`] = false
        if (!this.showBottomText && !this.showTopText) {
          this.currentTemplate = this.templateList[1]
        }
      })
      this.showTextOperate = false
    },
    onTextInputReplay() {
      if (this.topWrapperFocus) {
        this.$refs.topInput.value = ''
        this.form.topText.content = ''
        this.topImg = []
      } else if (this.bottomFocus) {
        this.$refs.bottomInput.value = ''
        this.form.bottomText.content = ''
        this.bottomImg = []
      }
    },
    onInputModeChange(mode) {
      if (this.topWrapperFocus) {
        this.form.topText.inputMode = mode
        this.getFontTop()
      } else {
        this.form.bottomText.inputMode = mode
        this.getFontBottom()
      }
      const type = mode === 'en' ? 1 : 2
      this.filtterFontTypeList = this.fontTypeOptions.filter(item => (item.font_type === type))
      this.fontType = this.filtterFontTypeList[0]?.font_id || ''
      this.inputModeModel = false
    },
    // 数字同一位小数点后两位
    formatNumber(number) {
      if (typeof number !== 'number') return number
      return parseFloat(number.toFixed(2))
    },
    // 获取字体列表
    getFontList() {
      designApi.getFontList().then(res => {
        this.fontTypeOptions = res.data
        this.fontType = res.data[0].font_id
        this.fontChange(res.data[0])
        this.onInputModeChange('en')
      })
    },
    // 获取定制模板
    getTemplate() {
      designApi.getEmbTemplate({
        template_type: 1 // 1 一般定制 2 特殊定制
      }).then(res => {
        this.templateList = res.data
        if (this.is_beta) {
          if (this.$route.query?.template_id == 1) {
            this.currentTemplate = this.templateList.find(item => item.emb_template_id === 1)
          } else {
            this.currentTemplate = this.templateList[1]
          }
        } else {
          this.currentTemplate = this.templateList[1]
        }
      })
    },
    // 获取花样库列表
    getFigureList() {
      designApi.getFigure({
        pageSize: 1000,
        goods_id: !this.is_beta && this.goods_id
      }).then(res => {
        this.figureList = res.data.data
        if (this.design_id) {
          this.figureList.forEach(item => {
            if (Number(this.design_id) === item.design_id) {
              this.checkFigureItem(item)
              return
            }
          })
        }
      })
    },
    // 获取产品列表
    getGoodsList() {
      goodsApi.getGoodsList({
        pageSize: 1000,
        design_id: this.form.middleImg.design_id || this.design_id
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
    // 获取定制分类模板信息
    customDetail(id, sku_id) {
      designApi.customDetail({
        id: id,
        sku_id: sku_id
      }).then(res => {
        this.customInfo = res.data
        this.initPage(res.data)
        this.getFontList()
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

      // 中间图片的最大宽高 单位毫米
      this.middleImgWidth = this.design_box.design_W / design_scale
      this.middleImgHeight = this.design_box.design_H / design_scale - 90 / design_scale
      // 背景图位置style
      this.designImgStyle = {
        position: 'absolute',
        width: `${this.design_box.design_bg_width}px`,
        height: `${this.design_box.design_bg_height}px`,
        left: `${-this.design_box.design_bg_X}px`,
        top: `${-this.design_box.design_bg_Y}px`
      }
      // 设计区域位置style
      this.designBoxStyle = {
        position: 'absolute',
        width: `${this.design_box.design_W}px`,
        height: `${this.design_box.design_H}px`,
        left: `${this.design_box.design_X}px`,
        top: '50%',
        marginTop: `${-this.design_box.design_H / 2}px`
      }
      // 计算最大最小半径
      this.maxRadiusWidth = (Math.max(this.design_box.design_W, this.design_box.design_H) - this.form.topText.fontSize || 0) / 2
      !this.radiusWidth && (this.radiusWidth = this.maxRadiusWidth)
    },
    // 输入框外层聚焦
    inputWrapperFocus(type) {
      this.middleVisible = false
      this.visible = true
      this.showTextOperate = true
      if (type === 1) {
        this.fontHeight = this.form.topText.fontSize
        this.topWrapperFocus = true
        this.bottomWrapperFocus = false
        if (this.isFirstClickTop) {
          console.log('-----------')
          this.$nextTick(() => {
            this.bottomBtn('showInputMode')
            this.isFirstClickTop = 0
          })
        }
      } else {
        this.fontHeight = this.form.bottomText.fontSize
        this.topWrapperFocus = false
        this.bottomWrapperFocus = true
        if (this.isFirstClickBom) {
          this.$nextTick(() => {
            this.bottomBtn('showInputMode')
            this.isFirstClickBom = 0
          })
        }
      }
      this.imgRotate()
    },
    // 输入框聚焦
    inputFocus(type) {
      return new Promise((resolve, reject) => {
        if (type === 1) {
          this.fontHeight = this.form.topText.fontSize
          this.topFocus = true
        } else {
          this.fontHeight = this.form.bottomText.fontSize
          this.bottomFocus = true
        }
        resolve()
      })
    },
    // 输入框外层失去焦点
    inputWrapperBlur() {
      this.topWrapperFocus = false
      this.bottomWrapperFocus = false
      this.visible = false
      this.showTextOperate = false
      if (this.currentTemplate.emb_template_id === 3) {
        this.middleVisible = true
      }
      if (this.openArc === true) {
        this.imgRotate()
      }
    },
    // 输入框失去焦点
    inputBlur(type, event) {
      return new Promise((resolve, reject) => {
        type === 1 ? this.topFocus = false : this.bottomFocus = false
        if (this.openArc === true) {
          this.imgRotate()
        }
        if (type === 1) {
          this.getFontTop()
        } else {
          this.getFontBottom()
        }
        resolve()
      })
    },
    async fontSizeChange(value) {
      debugger
      if (this.topWrapperFocus === true) {
        this.form.topText.fontSize = value
        this.getFontTop()
      }
      if (this.bottomWrapperFocus === true) {
        this.form.bottomText.fontSize = value
        this.getFontBottom()
      }
      const bottomInput = document.getElementsByClassName('bottom-input')[0]
      const topInput = document.getElementsByClassName('top-input')[0]
      const fontHeight = (bottomInput ? bottomInput.offsetHeight : 0) + (topInput ? topInput.offsetHeight : 0) + 20
      console.log(fontHeight)
      this.middleImgHeight = Math.max(this.formatNumber((this.design_box.design_H - fontHeight) / this.design_box.design_scale), 0)
      this.visible = true
    },
    // 是否弧形
    changeOpenArc() {
      // if (this.openArc === true) {
      //   this.imgRotate()
      //   this.inputFocus(1).then(() => {
      //     this.inputBlur(1).then(() => {
      //     })
      //   })
      // } else {
      //   this.inputFocus(1).then(() => {
      //     this.inputBlur(1).then(() => {
      //       })
      //   })
      // }
      this.fontAlign = 'center'
      this.inputFocus(1).then(() => {
        this.inputBlur(1).then(() => {
          this.getFontTop()
        })
      })
    },
    getFontTop: function() {
      let arr = []
      const text = this.form.topText.content
      if (text.trim() === '') return
      arr = text.split('')
      if (this.form.topText.inputMode === 'zh') {
        this.topTextList = arr
        if (this.openArc === true) {
          this.imgRotate()
        }
        return
      }
      designApi.getTextImage({
        font_id: this.fontType,
        font_list: JSON.stringify(arr),
        color: this.form.topText.fontColor
      }).then(res => {
        if (res.code === 0) {
          this.topImg = res.data
          if (this.openArc === true) {
            this.imgRotate()
          }
        } else {
          Toast(this.$t(...res.msg))
        }
      })
    },
    getFontBottom: debounce(function() {
      let arr = []
      const text = this.form.bottomText.content
      if (text.trim() === '') return
      arr = text.split('')
      if (this.form.bottomText.inputMode === 'zh') {
        this.bottomImg = []
        return
      }
      designApi.getTextImage({
        font_id: this.fontType,
        font_list: JSON.stringify(arr),
        color: this.form.bottomText.fontColor
      }).then(res => {
        if (res.code === 0) {
          this.bottomImg = res.data
        } else {
          Toast(this.$t(...res.msg))
        }
      })
    }, 100),
    showMiddleMemu(type) {
      // type==1个人上传，type==2花样库选择
      this.middleVisible = true
      this.showTextOperate = false
      this.topFocus = false
      this.topWrapperFocus = false
      this.bottomFocus = false
      this.bottomWrapperFocus = false
      this.visible = false
      if (this.currentTemplate.emb_template_id === 3) {
        this.imgRotate()
      }
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
      const _self = this
      // 文字旋转
      // $(function() {
      //   $('.top-input span').arctext({
      //     radius: 120,
      //     dir: 1,
      //     rotate: true,
      //     fitText: true
      //   })
      // })
      // 图片旋转
      $(function() {
        const topImgList = Array.isArray(_self.$refs['topImg']) ? _self.$refs['topImg'] : (_self.$refs['topImg'] ? [_self.$refs['topImg']] : [])
        if (_self.currentTemplate?.emb_template_id === 1) {
          const radiusWidth = _self.radiusWidth
          const count = topImgList.length
          const radius = _self.radian / (count - (_self.radian === 360 ? 0 : 1)) // 平均角度)
          // 算出弧形高度， 让弧形居中
          let arcHeight = 0
          if (_self.radian <= 180) {
            arcHeight = radiusWidth * (1 + Math.sin(2 * Math.PI / 360 * (90 - _self.radian / 2))) / 2
          } else {
            arcHeight = radiusWidth * (1 - Math.sin(2 * Math.PI / 360 * (_self.radian / 2 - 90))) / 2
          }
          if (count <= 1) return
          topImgList.forEach((item, index) => {
            // 根据角度， 半径计算位置
            const currentRadius = -(_self.radian / 2) + radius * index
            const offsetX = radiusWidth * Math.sin(2 * Math.PI / 360 * currentRadius)
            let offsetY = radiusWidth * Math.cos(2 * Math.PI / 360 * currentRadius)
            offsetY = offsetY - arcHeight
            item.style.transform = ` translate(calc( -50% + ${offsetX}px), calc( -50% + ${-offsetY}px)) rotate(${currentRadius}deg)`
          })
        } else {
          // /**
          // *  45： 上文字框高度
          // *  _self.radiusWidth 上文字框二分之一宽
          // *  45 + x = r
          // *  x^2 + 150^2 = r^2
          // *  (r - 45)^2 + 150^2 = r^2
          // *  r^2 - 90r + 45^2 + 150^2 = r^2
          // *  r = (45^2 + 150^2) / 90
          // */
          const fontHeight = Math.max(_self.form.topText.fontSize || 0, 45)
          const radiusWidth = (Math.pow(_self.radiusWidth, 2) + Math.pow(Math.max(fontHeight, 45), 2)) / 90
          const count = topImgList.length
          const radian = 2 * Math.sin(150 / radiusWidth) * 180 / Math.PI
          const radius = radian / (count - 1)
          if (count <= 1) return
          topImgList.forEach((item, index) => {
            // 根据角度， 半径计算位置
            const currentRadius = -(radian / 2) + (radius * index)
            const offsetY = radiusWidth * (1 - Math.cos(2 * Math.PI / 360 * currentRadius))
            item.style.transform = ` translateY(${offsetY}px) rotate(${currentRadius}deg)`
          })
        }
      })
    },
    // 字体选择
    fontChange(item) {
      // debugger
      console.log('fontChange')
      const { font_id: value, ttf, max_height, min_height } = item
      this.fontType = value
      if (this.fontHeight > max_height) {
        this.fontHeight = max_height
      } else if (this.fontHeight < min_height) {
        this.fontHeight = min_height
      }
      this.maxFontHeight = max_height
      this.minFontHeight = min_height
      this.form.bottomText.fontSize = this.fontHeight
      this.form.topText.fontSize = this.fontHeight
      console.log(max_height, min_height, value)
      // if (this.topInput === true) {
      if (this.topWrapperFocus === true) {
        this.form.topText.fontType = value
        this.getFontTop()
      }
      if (this.bottomWrapperFocus === true) {
        this.form.bottomText.fontType = value
        this.getFontBottom()
      }
      if (this.form.topText.inputMode === 'zh' || this.form.bottomText.inputMode === 'zh') {
        let font_id
        if (this.topWrapperFocus) {
          font_id = 'font'
        } else {
          font_id = 'font_b'
        }
        const oldStyle = document.querySelector('style[id=font_id]')
        oldStyle && document.body.removeChild(oldStyle)
        const style = document.createElement('style')
        const str = `
          @font-face {
            font-family: ${font_id};
            src: url("${ttf}");
          }
        `
        style.id = font_id
        style.type = 'text/css'
        if (style.styleSheet) { // ie下
          style.styleSheet.cssText = str
        } else {
          style.innerHTML = str // 或者写成 nod.appendChild(document.createTextNode(str))
        }
        document.body.appendChild(style)
      }
      this.$refs.fontType.toggle()
    },
    // 图片颜色选择
    imgColorChange(e) {
      if (this.topWrapperFocus === true) {
        this.form.topText.fontColor = e.hex
        designApi.reColor({
          color: e.hex,
          image: this.topImg
        }).then(res => {
          this.topImg = res.data
          if (this.openArc === true) {
            this.inputFocus(1).then(() => {
              this.inputBlur(1).then(() => {
                this.imgRotate()
              })
            })
          }
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
      if (name === 'showInputMode') {
        (this.topWrapperFocus || this.bottomWrapperFocus) && (this.inputModeModel = true)
      } // 显示输入模式选择弹框
      if (name === 'preview') this.preview()
      if (name === 'complete') this.complete()
      if (name === 'showGoods') this.showGoods()
    },
    // 隐藏遮罩
    hiddenVisible() {
      // this.visible = false
      // this.middleVisible = false
      // this.topFocus = false
      // this.bottomFocus = false
      // this.topInput = false
      // this.bottomInput = false
    },
    // 选中花样图片
    async checkFigureItem(item) {
      this.form.middleImg.design_id = item.design_id
      this.getGoodsList()
      this.patternPicture = [] // 上传的花样图片设为空
      const { data: design } = await designApi.getDesignById({ design_id: item.design_id });
      this.currentFigure = design
      this.setFigureItemSizeRange(item)
      // 解决花样图片跨域问题
      await commonApi.getImage({ url: item.prev_png_path }).then(res => {
        this.form.middleImg.prev_png_path = res.data
      })
      this.form.middleImg.width = this.middleImgWidth
      this.form.middleImg.height = this.middleImgMaxHeght
      this.patternModal = false
      this.middleVisible = true
    },
    // 重置花样最大最小高
    setFigureItemSizeRange(item) {
      this.currentBestHeight = item.best_height
      this.middleImgMaxHeght = Math.min(this.middleImgHeight, item.max_height || item.best_height || this.middleImgHeight)
      this.middleImgMinHeight = item.min_height
    },
    // checked定制模板
    checkTeplateItem(item) {
      this.currentTemplate = item
      this.templateModal = false
      if (item.emb_template_id !== 1) {
        // this.middleVisible = true
        this.visible = false
      } else {
        this.middleVisible = false
        this.visible = true
      }
      this.showBottomText = true
      this.showTopText = true
    },
    // 点击预览
    preview() {
      if (this.currentTemplate.emb_template_id === 1 && !this.form.topText.content) {
        Toast(`${this.$t('请输入文字内容')}`)
        return false
      }
      if (!this.topWrapperFocus && !this.bottomWrapperFocus) {
        this.getPreview()
        this.previewModal = true
      } else {
        const type = this.topWrapperFocus ? 1 : 2
        this.inputFocus(type).then(() => {
          this.inputBlur(type).then(() => {
            setTimeout(() => {
              this.getPreview()
              this.previewModal = true
            }, 0)
          })
        })
      }
    },
    // 将dom转成图片
    setImage() {
      return new Promise((resolve, reject) => {
        this.$refs.designBox.style.background = 'transparent'
        this.$refs.designBox.style.border = 'transparent'
        html2canvas(this.$refs.designBox, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          proxy: 'http://cxgh.tecqm.club'
        }).then(canvas => {
          const dataURL = canvas.toDataURL('image/png')
          this.design_image = dataURL
          this.$refs.designBox.style.background = 'rgba(0, 0, 0, 0.5)'
          this.$refs.designBox.style.border = '5px solid rgba(192, 192, 192, 0.5)'
          resolve(dataURL)
        })
      })
    },
    // 获取预览图
    async getPreview() {
      if (this.currentTemplate.emb_template_id === 1 && !this.form.topText.content) {
        Toast(`${this.$t('请输入文字内容')}`)
        return false
      }
      this.loading = true
      // 获取设计区图片
      this.setImage().then((design_image) => {
        this.setImage()
        // // 计算文字输入框和设计区的比例 当前输入框高度默认为45px
        // const top_scale = 45 / this.design_box.design_H
        // const bottom_scale = 45 / this.design_box.design_H
        // // 计算文字图片和文字输入框的比例
        // const top_font_scale = this.form.topText.fontSize / 45
        // const bottom_font_scale = this.form.bottomText.fontSize / 45
        // // 计算图片高度和设计区的比例
        // const middle_scale = (this.form.middleImg.height * this.design_box.design_scale) / this.design_box.design_H
        // 请求预览图接口
        designApi.getPreview({
          id: this.currentGoods.id || this.$route.query.goods_id,
          design_id: this.form.middleImg.design_id,
          design_image: design_image,
          // top_scale: top_scale,
          // top_font_scale: top_font_scale,
          top_font_content: this.topImg,
          top_font_color: this.form.topText.fontColor,
          font_id: this.fontType,
          // middle_scale: middle_scale,
          // bottom_scale: bottom_scale,
          // bottom_font_scale: bottom_font_scale,
          bottom_font_content: this.bottomImg,
          bottom_font_color: this.form.bottomText.fontColor,
          custom_template_id: this.currentTemplate.emb_template_id,
          custom_image: this.patternPicture[0] ? this.patternPicture[0].content : '',
          background: this.currentGoods.skuList ? this.currentGoods.skuList[0].images : this.customInfo.item?.background
        }).then(res => {
          this.loading = false
          this.previewImg = res.data.preview_image
          this.design_area_image = res.data.design_area_image
          this.is_wilcom = res.data.is_wilcom || 0
        }).catch(() => {
          Toast(`${this.$t('预览图生成失败')}!`)
          this.loading = false
        })
      }).catch((e) => {
        debugger
        this.loading = false
        Toast(`${this.$t('定制图案生成失败')}!`)
      })
    },
    // 完成定制
    complete() {
      if (this.currentTemplate.emb_template_id === 1 && !this.form.topText.content) {
        Toast(`${this.$t('请输入文字内容')}`)
        return false
      }
      if (!this.topWrapperFocus && !this.bottomWrapperFocus) {
        this.previewModal = false
        this.getPreview()
        this.confirmModal = true
      } else {
        const type = this.topWrapperFocus ? 1 : 2
        this.inputFocus(type).then(() => {
          this.inputBlur(type).then(() => {
            setTimeout(() => {
              this.previewModal = false
              this.getPreview()
              this.confirmModal = true
            }, 0)
          })
        })
      }
    },
    // 立即购买
    buyNow() {
      let [top_w, bottom_w] = [0, 0]
      if (this.currentTemplate.emb_template_id !== 2) {
        if (typeof this.$refs.topImgContent !== 'undefined') {
          top_w = this.$refs.topImgContent.offsetWidth
          if (this.currentTemplate.emb_template_id === 1 && this.openArc) {
            top_w = 2 * Math.PI * this.radiusWidth * (this.radian / 360)
          }
        }
      }
      if (this.currentTemplate.emb_template_id === 3) {
        if (typeof this.$refs.bottomImgContent !== 'undefined') {
          bottom_w = this.$refs.bottomImgContent.offsetWidth
        }
      }
      // 获取vuex->design->state->goodsInfo
      var goodsInfo = JSON.parse(this.design.goodsInfo)
      goodsInfo[0].is_beta = this.is_beta
      goodsInfo[0].design_info = {
        design_id: this.form.middleImg.design_id,
        top_font_width: top_w / parseInt(this.designBoxStyle.width) * (this.customInfo?.custom_info.design_width || 150),
        top_font_height: this.form.topText.fontSize,
        top_font_content: this.form.topText.content,
        top_font_color: this.form.topText.fontColor,
        bottom_font_width: bottom_w / parseInt(this.designBoxStyle.width) * (this.customInfo?.custom_info.design_width || 150),
        bottom_font_height: this.form.bottomText.fontSize,
        bottom_font_content: this.form.bottomText.content,
        bottom_font_color: this.form.bottomText.fontColor,
        font_id: this.fontType,
        font_family: this.fontType,
        design_width: this.form.middleImg.width,
        design_height: this.form.middleImg.height,
        is_choose_design: this.form.middleImg.design_id ? '1' : '0',
        custom_image: this.patternPicture[0] ? this.patternPicture[0].url : '',
        custom_template_id: this.currentTemplate.emb_template_id,
        preview_image: this.previewImg,
        design_area_image: this.design_area_image
      }
      console.log(goodsInfo)
      store.dispatch('order/setCartList', JSON.stringify(goodsInfo)).then(() => {
        this.$router.push({ path: '/orderConfirm', query: {
          is_wilcom: this.is_wilcom,
          is_beta: this.is_beta
        }})
      })
    },

    // 菜单打开
    onDropdownMenuOpen() {
      // this.inputBlur(1)
      // this.inputBlur(2)
      this.$nextTick(() => {
        this.showTextOperate = false
        this.middleVisible = false
      })
      this.subMenu = true
    },
    // 菜单关闭
    onDropdownMenuClose() {
      this.subMenu = false
      // this.$nextTick(() => {
      //   (this.topWrapperFocus || this.bottomWrapperFocus) ? this.showTextOperate = true : this.middleVisible = true
      // })
    },
    showGoods() {
      this.goodsModal = true
    },
    choose_goods($item) {
      const { sku_list } = $item
      try {
        $item.skuList = JSON.parse(sku_list)
        debugger
        this.currentGoods = $item
      } catch (e) {

      }
      debugger
      this.complete()
    }
  }
}
</script>
<style lang="scss" scoped>
.commonly{
  position: relative;
  height: 100%;
  .img-btn {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }
  .text-btns  .van-dropdown-menu__bar,
  .img-btns  .van-dropdown-menu__bar {
    height: 0;
    margin-bottom: 12px;
  }
  .text-btns,
  .img-btns {
    z-index: 99 !important;
  }
  .van-dropdown-item__content {
    padding: 10px;
  }
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
      z-index: 100;
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
  .icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    box-sizing: border-box;
    &:first-child{
      padding-top: 10px;
    }
    .mode-en, .mode-zh {
      width: 60px !important;
      height: 60px !important;
      color: #666666;
    }
    .mode-en {
      width: 30px !important;
      height: 30px !important;
    }
  }
  // 设计区域
  .designArea{
    // height:calc(100% - 260px);
    // min-height: 520px;
    // position: absolute;
    // top: 18vh;
    width: 100%;
    // left: 0;
    .commonly-bg-box{
      width: 100%;
      height: 375px;
      max-height: 375px;
      overflow: hidden;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(211, 211, 211, 0.8);
      .design_info {
        font-size: 20px;
        margin-left: 40px;
        height: 42px;
        line-height: 42px;
      }
    }
    .design-box{
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
      border: 5px solid rgba(192, 192, 192, 0.5);
      box-sizing: border-box;
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      // box-sizing: border-box;
      // padding: 4px;
      .top-input,.bottom-input{
        font-size: 12px;
        z-index: 1;
        height: unset !important;
        min-height: 1.2rem;
        .input-box{
          box-sizing: border-box;
          border: 1px solid #4bb1ff00;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.1);
          i {
            margin: 0 10px;
            color: #fff;
          }
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
          // display: inline;
          width: 100%;
        }
      }
      .top-img-list,.bottom-img-list{
        width: 100%;
        height: 1.6em !important;
      }
      .top-input{
        // position: absolute;
        // top: 0;
        // left: 0;
        width: 100%;
        &.focus {
          .input-box {
            width: 100%;
          }
        }
        &.topBottom {
          position: relative;
          #img.arc, #text.arc {
            height: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            img, span{
            }
          }
        }
        &.middle{
          // min-height: 45px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          // top: 50%;
          // transform: translateY(-50%);

          input{
            min-height: 45px;
          }
          .top-img-list {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .input-box {
              width: 100%;
            }
            .top-img-content {
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              #text {
                font-family: 'font';
              }
              #img.arc, #text.arc {
                img, span{
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }
              }
            }
          }
          .top-img-list,.bottom-img-list{
            min-height: 45px;
            line-height: 45px;
          }
        }

      }
      .bottom-input{
        // position: absolute;
        // bottom: 0;
        // left: 0;
        width: 100%;
      }
      .middle-img{
        // position: absolute;
        // top: 46px;
        // bottom: 46px;
        // left: 0;
        width: 99.2%;
        display: flex;
        align-items: center;
        // margin: 10px;
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
  .input-mode-btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    div {
      width: 60px;
      height: 60px;
      svg {
        width: 100%;
        height: 100%;
        &.mode-zh {
          box-sizing: border-box;
          padding: 6px;
        }
      }
    }
  }
}

// .fade-enter-active, .fade-leave-active {
//   transition: opacity .5s;
  
//   position: absolute;
//   top: 0;
//   left: 0;
// }
</style>
