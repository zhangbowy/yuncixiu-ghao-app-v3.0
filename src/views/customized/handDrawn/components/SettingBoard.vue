<template>
  <div ref="drawnConfig" :class="['drawn-config', isFullPage && 'drawn-config--full']">
    <div class="config-box" :class="[!showSettingBoard && 'config-box--disabled']">
      <van-button icon="setting" @click="onShowBtnClick" />
      <template v-if="showSettingBoard">
        <div class="config-item">
          <span>{{ `${$t('笔画粗细')}${$t('：')}` }}</span>
          <div class="slider">
            <van-stepper v-model="lineWidthComp" input-width="25px" button-size="22" min="1" max="50" @change="onChange('lineWidth')" />
          </div>
        </div>
        <div class="config-item">
          <span>{{ `${$t('笔锋粗细')}${$t('：')}` }}</span>
          <div class="slider">
            <van-stepper v-model="minWidthComp" input-width="25px" button-size="22" min="1" max="5" @change="onChange('minWidth')" />
          </div>
        </div>
        <div class="config-item" style="width: 25%">
          <span>{{ `${$t('颜色')}${$t('：')}` }}</span>
          <div class="color_con" :style="{background:lineColor}" @click="handleShowColor">
            <div v-show="colorShow" class="sketch">
              <sketch-picker v-model="lineColorComp" style="z-index: 10" @input="onChange('lineColor')" />
            </div>
            <van-overlay z-index="1" class-name="top-mask" :show="colorShow" @click.stop="hiddenVisible" />
          </div>
        </div>
        <div class="config-item" style="width: 32%">
          <span>{{ $t('宽') }}(mm)：</span>
          <div class="input">
            <input v-model.number="widthComp" type="number" step="1" max="150" :placeholder="`${$t('宽度')}`" @change="onChange('width')">
          </div>
        </div>
        <div class="config-item" style="width: 32%">
          <span>{{ $t('高') }}(mm)：</span>
          <div class="input">
            <input v-model.number="heightComp" type="number" step="1" max="150" :placeholder="`${$t('高度')}`" @change="onChange('height')">
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color' // 颜色选择器

export default {
  components: {
    'sketch-picker': Sketch
  },
  props: {
    lineWidth: {
      type: Number,
      default: 3
    },
    lineColor: {
      type: String,
      default: '#fff'
    },
    minWidth: {
      type: Number,
      default: 1
    },
    width: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 0
    },
    isFullPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      colorShow: false,
      lineColorComp: '',
      lineWidthComp: 3,
      minWidthComp: 1,
      widthComp: '',
      heightComp: '',
      showSettingBoard: true,
      showOverlay: false
    }
  },
  watch: {
    isFullPage: {
      handler(newValue, oldValue) {
        newValue && this.bindEvent()
      }
    },
    lineWidth: {
      handler(newValue, oldValue) {
        this.lineWidthComp = newValue
      }
    },
    lineColor: {
      handler(newValue, oldValue) {
        this.lineColorComp = newValue
      }
    },
    minWidth: {
      handler(newValue, oldValue) {
        this.minWidthComp = newValue
      }
    },
    width: {
      handler(newValue, oldValue) {
        this.widthComp = newValue
      }
    },
    height: {
      handler(newValue, oldValue) {
        this.heightComp = newValue
      }
    }
  },
  created() {
    // 监测横竖屏
    const onOrientationChange = () => {
      if (window.orientation === 180 || window.orientation === 0) {
        this.showSettingBoard = true
      }
    }
    window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', onOrientationChange, false)
  },
  methods: {
    onChange(type) {
      let value = this[type + 'Comp']
      if (type === 'lineColor') {
        value = value.hex
      }
      this.$emit('prop-change', { type, value })
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
    bindEvent() {
      // const drawnConfig = this.$refs['drawnConfig']
    },
    onShowBtnClick() {
      this.showSettingBoard = !this.showSettingBoard
    }
  }
}
</script>

<style lang='scss'>
.drawn-config {
  margin: 4px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
  .config-box {
    border-radius: 4px;
    .van-button {
      display: none !important;
    }
  }
  &--full {
    display: block !important;
    position: absolute;
    .config-box {
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s linear;
      &--disabled {
        // width: 0;
        height: 0;
        padding: 0 !important;
        background-color: rgba(0, 0, 0, 0);
        box-shadow: none;
        .van-button {
          margin: 9px !important;
        }
      }
      .sketch {
        position: fixed !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%);
      }
      .van-button {
        display: block !important;
        width: 100%;
        font-size: 16px;
        padding: 6px;
        height: 16px !important;
        overflow: hidden;
        white-space: nowrap;
        margin: 0 10px;
        color: #1989fa;
        background: rgba(0, 0, 0, 0);
        border: none;
        margin: 0;
        width: 20px !important;
        height: 20px !important;
        align-self: start;
      }
    }
  }
}
// 手机横屏css
@media all and (orientation : landscape) {
  .drawn-config {
    font-size: 10px;
    &--full {
      display: block !important;
      position: absolute;
      height: calc(100% - 8px);
      width: 80px;
      .config-box {
        font-size: 10px;
        height: 100%;
        width: 100%;
        font-size: 10px;
        box-sizing: border-box;
        flex-direction: column !important;
        flex-wrap: nowrap !important;
        padding: 4px !important;
        transform-origin: 10% 10%;
        &--disabled {
          // width: 0;
          height: 0;
          padding: 0 !important;
          background-color: rgba(0, 0, 0, 0);
          .van-button {
              margin: 4px !important;
          }
        }
        .config-item {
          width: 100% !important;
        }
        .color_con, .input > input {
          width: 20px !important;
          height: 10px !important;
      }
        .van-stepper {
          display: flex;
          flex-wrap: nowrap;
        }
        .van-stepper__input, .input > input {
          font-size: 6px !important;
          padding: 1px !important;
      }
        .van-stepper__input {
          // flex: 2 !important;
          width: 15px !important;
        }
        .van-button {
          display: block !important;
          width: 100%;
          font-size: 7px;
          padding: 6px;
          height: 16px !important;
          overflow: hidden;
          white-space: nowrap;
          margin: 0 10px;
          color: #1989fa;
          background: rgba(0, 0, 0, 0);
          border: none;
          margin: 0;
          width: 10px !important;
          height: 10px !important;
          align-self: start;
        }
      }
    }
  }
}
</style>
