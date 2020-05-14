<template>
  <div class="number-input" :style="{width: width, margin: '0 auto'}">
    <van-field v-model="number" :placeholder="placeholder" type="number" :label="label">
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
      default: 0
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
        if (newValue > this.max) {
          Toast(`不得超过${this.max}mm`)
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
        if (newValue > this.max) {
          Toast(`不得超过${this.max}mm`)
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
  text-align: center;
  margin: 0 auto;
}
</style>
