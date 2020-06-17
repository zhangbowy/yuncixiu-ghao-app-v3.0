<template>
  <div class="address-edit">
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.name"
        name="name"
        label="姓名"
        clearable
        placeholder="姓名"
        :rules="[{ required: true, message: '请填写姓名' }]"
      />
      <van-field
        v-model="form.phone"
        type="tel"
        name="phone"
        clearable
        label="电话"
        placeholder="电话"
        :rules="[
          { required: true, message: '请填写您的手机号码！' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}
        ]"
      />
      <van-field
        readonly
        name="area"
        clickable
        label="城市"
        :value="area"
        right-icon="arrow"
        placeholder="选择省 / 市 / 区"
        :rules="[
          { required: true, message: '请选择省市区！' },
        ]"
        @click="showPicker = true"
      />
      <van-field
        v-model="form.address"
        name="address"
        clearable
        label="详细地址"
        placeholder="详细地址"
        :rules="[{ required: true, message: '请填写详细地址!' }]"
      />
      <van-field
        v-model="form.post_code"
        type="number"
        name="post_code"
        clearable
        label="邮编"
        placeholder="邮编"
        :rules="[
          { required: true, message: '请填写邮编！' }
        ]"
      />
      <!-- { pattern: /^[1-9]\d{5}$/g, message: '邮编格式错误！'} -->
      <van-field name="is_default" label="默认地址" input-align="right">
        <template #input>
          <van-switch v-model="form.is_default" size="20" :active-value="1" :inactive-value="0" />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          保存
        </van-button>

      </div>
    </van-form>
    <div v-if="addressInfo.address_id" class="form-action">
      <van-button round block type="danger" @click.stop="deleteAddress">
        删除
      </van-button>
    </div>
    <van-overlay :show="showPicker" @click="showPicker = false" />
    <van-popup v-model="showPicker" position="bottom" :overlay="false">

      <van-picker
        show-toolbar
        value-key="name"
        :columns="areaList"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        @change="onChange"
      />
    </van-popup>

  </div>
</template>

<script>
export default {
  props: {
    areaList: {
      type: Array,
      default: () => []
    },
    addressInfo: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        name: '',
        phone: '',
        province: '',
        province_code: '',
        city: '',
        city_code: '',
        area: '',
        area_code: '',
        address: '',
        is_default: 0,
        post_code: ''
      },
      province_code: '',
      city_code: '',
      area_code: '',
      area: '',
      areaIndex: [],
      showPicker: false
    }
  },
  watch: {
    addressInfo: {
      deep: true,
      immediate: true,
      handler(newValue) {
        this.form = newValue
        if (newValue.address_id) {
          this.area = `${newValue.province}/${newValue.city}/${newValue.area}`
        }
      }
    },
    type: {
      deep: true,
      immediate: true,
      handler(newValue) {
        if (newValue === '新增地址') {
          this.area = ''
        }
      }
    },
    // form(newValue) {
    //   this.$emit('change', newValue)
    // },
    areaIndex(newValue) {
      this.form.province_code = this.areaList[newValue[0]].id
      this.form.city_code = this.areaList[newValue[0]].children[newValue[1]].id
      this.form.area_code = this.areaList[newValue[0]].children[newValue[1]].children[newValue[2]].id
    }
  },
  methods: {
    // 删除地址
    deleteAddress() {
      this.$emit('delete', this.form.address_id)
    },
    // 保存地址
    onSubmit(values) {
      this.$emit('save', this.form)
    },
    // picker选中
    onConfirm(value, index) {
      const str = value.reduce((total, prev, index) =>
        `${total}${prev}${
          index === value.length - 1 ? '' : '/'
        }`
      , '')
      this.form.province = value[0]
      this.form.city = value[1]
      this.form.area = value[2]
      this.area = str
      this.areaIndex = index
      this.showPicker = false
    },
    onChange(e) {
    }
  }
}
</script>

<style lang="scss" socped>
.address-edit{
  font-size: 14px;
  padding: 12px;
  .form-action{
    padding: 0 16px;
  }
}
</style>
