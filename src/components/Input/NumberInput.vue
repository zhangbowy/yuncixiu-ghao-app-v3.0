<template>
  <div class="number-input" :style="{width: width, margin: '0 auto'}">
    <van-field v-model="number" :placeholder="placeholder" type="number" :label="label" :rules="rules" @blur="fieldBlur">
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
    min: {
      type: [Number, String],
      default: 0
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
          this.number = this.max
          this.$emit('input', this.max)
        } else {
          this.$emit('input', newValue)
        }
      }
    }
  },
  methods: {
    fieldBlur(e) {
      if (this.max && e.target.value > this.max) {
        Toast(`高度不能超过${this.max}mm`)
        this.number = this.max
        this.$emit('input', this.max)
      } else if (this.min && e.target.value < this.min) {
        Toast(`高度不能低于${this.min}mm`)
        this.number = this.min
        this.$emit('input', this.min)
      } else {
        this.$emit('input', e.target.value)
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
