<template>
  <div class="special">
    <div class="special-form">
      <div class="template">
        <van-radio-group v-model="result" direction="horizontal">
          <van-radio v-for="(item,index) in templateList" :key="index" :name="item.emb_template_id">
            <div class="temp-item">
              <img :src="item.cover_image" alt="" width="60" height="60">
              <p>{{ item.template_name }}</p>
            </div>
          </van-radio>
        </van-radio-group>
      </div>
      <van-form @submit="submit">
        <number-input
          v-model="form.width"
          width="100%"
          max="600"
          :value="form.width"
          label="宽度"
          :rules="[
            { required: true, message: '请输入宽度' },
          ]"
          placeholder="请输入宽度"
          unit="mm"
        />
        <number-input
          v-model="form.height"
          width="100%"
          max="400"
          :value="form.height"
          label="高度"
          :rules="[
            { required: true, message: '请输入高度' },
          ]"
          placeholder="请输入高度"
          unit="mm"
        />
        <van-field
          v-model="form.colorNum"
          label="颜色数"
          name="colorValidator"
          placeholder="建议小于等于12色"
          :rules="[
            { required: true, message: '请填写颜色数！' },
          ]"
        />
        <van-field
          v-model="form.time"
          label="时间"
          name="timeValidator"
          placeholder="默认5个工作日"
          :rules="[
            { required: true, message: '请填写时间！' },
          ]"
        />
        <van-field name="switch" label="包含商品">
          <template #input>
            <van-switch
              v-model="switchChecked"
              size="20"
            />
          </template>
        </van-field>
        <van-field
          name="uploader"
          label="定制图案"
          :rules="[
            { required: true, message: '请上传定制图案！' },
          ]"
        >
          <template #input>
            <van-uploader v-model="uploader" multiple :max-count="1" />
          </template>
        </van-field>
        <van-field
          v-model="form.desc"
          rows="2"
          autosize
          label="备注"
          type="textarea"
          maxlength="50"
          placeholder="请输入"
          show-word-limit
          :rules="[
            { required: true, message: '请输入备注！' },
          ]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
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
      result: '', // 选中的模板id
      form: {
        width: '',
        height: '',
        time: '',
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
    uploadValidate(val) {
      console.val
    },
    // 获取定制模板
    getTemplate() {
      designApi.getEmbTemplate({
        template_type: 2 // 1 一般定制 2 特殊定制
      }).then(res => {
        this.templateList = res.data
        this.result = res.data[0].emb_template_id
      })
    },
    // 提交
    onFailed(errorInfo) {
      console.log('failed', errorInfo)
      Toast('表单信息不完整')
    },
    submit(values) {
      console.log(values)
      var goodsInfo = JSON.parse(this.design.goodsInfo)
      goodsInfo[0].shopping_type = 3
      goodsInfo[0].design_info = {
        custom_template_id: this.result,
        special_custom_width: this.form.width,
        special_custom_height: this.form.height,
        special_color_num: this.form.colorNum,
        special_custom_desc: this.form.desc,
        special_custom_image: this.uploader[0].content ? this.uploader[0].content : ''
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
    .van-radio-group--horizontal{
      justify-content: space-around;
      .van-radio--horizontal{
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
