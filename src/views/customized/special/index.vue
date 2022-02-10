<template>
  <div class="special">
    <div class="special-form">
      <div class="template">
        <van-checkbox-group v-model="result" direction="horizontal" @change="chooseTemp">
          <van-checkbox v-for="item in templateList" :key="item.emb_template_id" :name="item.emb_template_id">
            <div class="temp-item">
              <img :src="item.cover_image" alt="" width="60" height="60">
              <p>{{ item.template_name }}</p>
            </div>
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <van-form @submit="submit">
        <number-input
          v-model="form.width"
          width="100%"
          :max="600"
          :value="form.width"
          :label="`${$t('宽度')}`"
          :rules="[
            { required: true, message: `${$t('请输入宽度')}` },
          ]"
          :placeholder="`${$t('请输入宽度')}`"
          unit="mm"
        />
        <number-input
          v-model="form.height"
          width="100%"
          :max="400"
          :value="form.height"
          :label="`${$t('高度')}`"
          :rules="[
            { required: true, message: `${$t('请输入高度')}` },
          ]"
          :placeholder="`${$t('请输入高度')}`"
          unit="mm"
        />
        <van-field
          v-model="form.colorNum"
          :label="`${$t('颜色数')}`"
          name="colorValidator"
          :placeholder="`${$t('建议小于等于12色')}`"
          :rules="[
            { required: true, message: `${$t('请填写颜色数')}${$t('！')}` },
          ]"
        />
        <van-field
          v-model="form.time"
          :label="`${$t('时间')}`"
          name="timeValidator"
          :placeholder="`${$t('默认5个工作日')}`"
          :rules="[
            { required: true, message: `${$t('请填写时间')}${$t('！')}` },
          ]"
        />
        <van-field name="switch" :label="`${$t('包含商品')}`">
          <template #input>
            <van-switch
              v-model="form.is_only_design"
              size="20"
            />
          </template>
        </van-field>
        <van-field
          name="uploader"
          :label="`${$t('定制图案')}`"
          :rules="[
            { required: true, message: `${$t('请上传定制图案')}${$t('！')}` },
          ]"
        >
          <template #input>
            <van-uploader v-model="uploader" multiple :max-count="1" :after-read="onUploadImg" />
          </template>
        </van-field>
        <van-field
          v-model="form.desc"
          rows="2"
          autosize
          :label="`${$t('备注')}`"
          type="textarea"
          maxlength="50"
          :placeholder="`${$t('请输入')}`"
          show-word-limit
          :rules="[
            { required: true, message: `${$t('请输入备注')}${$t('！')}` },
          ]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">{{ $t(`提交`) }}</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import NumberInput from '@/components/Input/NumberInput'
import { designApi } from '@/api/design'
import { Toast } from 'vant'
import { mapState } from 'vuex'
import store from '../../../store'
export default {
  components: {
    NumberInput
  },
  data() {
    return {
      uploader: [],
      switchChecked: false,
      templateList: [],
      result: [], // 选中的模板id
      form: {
        width: '',
        height: '',
        time: '',
        is_only_design: true,
        colorNum: '',
        desc: ''
      }
    }
  },
  computed: {
    ...mapState([
      'design'
    ])
  },
  created() {
    this.getTemplate()
  },
  methods: {
    onUploadImg(file) {
      const fileData = new FormData()
      fileData.append('image', file.file)
      designApi.uploadImg(fileData).then(({ data, code, msg }) => {
        if (code === 0) {
          this.uploader[0].url = data
          this.$toast.success(`${this.$t(...msg)}`)
        }
      }).catch(err => {
        console.log(err)
        this.$toast.fail(`${this.$t('上传失败!')}`)
      })
    },
    chooseTemp() {
      const item = this.templateList[this.templateList.length - 1]
      if (this.result.length > 1 && this.result.indexOf(item.emb_template_id) > -1) {
        this.result = []
        this.result.push(item.emb_template_id)
      }
    },
    // 获取定制模板
    getTemplate() {
      designApi.getEmbTemplate({
        template_type: 2 // 1 一般定制 2 特殊定制
      }).then(res => {
        this.templateList = res.data
        // this.result = res.data[0].emb_template_id
      })
    },
    // 提交
    onFailed(errorInfo) {
      console.log('failed', errorInfo)
      Toast(`${this.$t('表单信息不完整')}`)
    },
    submit(values) {
      debugger
      console.log(values)
      if (this.result.length === 0) {
        Toast(`${this.$t('请勾选刺绣种类')}`)
        return false
      }
      var goodsInfo = JSON.parse(this.design.goodsInfo) || [{}]
      goodsInfo[0].shopping_type = 3
      goodsInfo[0].design_info = {
        custom_template_id: this.result,
        special_custom_width: this.form.width,
        special_custom_height: this.form.height,
        special_color_num: this.form.colorNum,
        special_custom_desc: this.form.desc,
        is_only_design: this.form.is_only_design === true ? 0 : 1,
        special_custom_image: this.uploader[0].url ? this.uploader[0].url : ''
      }
      store.dispatch('order/setCartList', JSON.stringify(goodsInfo)).then(() => {
        this.$router.push({ path: '/orderConfirm' })
      })
    }
  }
}
</script>

<style lang="scss">
.special{
  padding-top: 45px;
  .template{
    .van-checkbox-group--horizontal{
      justify-content: space-around;
      .van-checkbox--horizontal{
        width: 40%;
        justify-content: center;
      }
    }
    .temp-item{
      font-size: 12px;
      text-align: center;
      img{
        display: block;
        margin: 0 auto;
      }
      p{
        margin-top: 0;
      }
    }
  }
  .special-form{
    padding: 16px;
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 12px;
  }
}
</style>
