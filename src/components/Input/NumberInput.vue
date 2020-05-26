<template>
  <div class="number-input" :style="{width: width, margin: '0 auto'}">
    <van-field v-model="number" :placeholder="placeholder" type="number" :label="label" :rules="rules">
      <template #button>
        <span>{{ unit }}</span>
      </template>
    </van-field>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: ''
    },
    placeholder: {
      type: [Number, String],
      default: ''
    },
    max: {
      type: [Number, String],
      default: ''
    },
    unit: {
      type: String,
      default: 'mm'
    }
  },
  data() {
    return {
      number: this.value
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (this.max && newValue > this.max) {
          Toast(`不得超过${this.max}${this.unit}`)
          this.number = this.max
        } else {
          this.number = newValue
        }
      }
    },
    number: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (this.max && newValue > this.max) {
          Toast(`不得超过${this.max}${this.unit}`)
          this.number = this.max
          this.$emit('input', this.max)
        } else {
          this.$emit('input', newValue)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.number-input{
  margin: 0 auto;
}
</style>
<style lang="scss">
.number-input{
  .van-cell::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 0.42667rem;
    border-bottom: 0.02667rem solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
}
</style>
