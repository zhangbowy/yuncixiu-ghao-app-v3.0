<template>
  <div class="special">
    <div class="special-form">
      <div class="template">
        <van-checkbox-group v-model="result" direction="horizontal">
          <van-checkbox v-for="(item,index) in templateList" :key="index" :name="item.emb_template_id">
            <div class="temp-item">
              <img :src="item.cover_image" alt="" width="80" height="80">
              <p>{{ item.template_name }}</p>
            </div>
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <van-form @failed="onFailed" @submit="submit">
        <!-- 通过 pattern 进行正则校验 -->
        <van-field
          v-model="size"
          label="尺寸"
          name="pattern"
          placeholder="建议面积不超过300*200mm"
          :rules="[{ pattern, message: '请输入正确尺寸' }]"
        />
        <van-field name="uploader" label="刺绣图片">
          <template #input>
            <van-uploader v-model="uploader" multiple :max-count="1" />
          </template>
        </van-field>
        <!-- 通过 validator 进行函数校验 -->
        <van-field
          v-model="colorNum"
          label="颜色数"
          name="colorValidator"
          placeholder="建议小于等于12色"
          :rules="[{ colorValidator, message: '建议小于等于12色' }]"
        />
        <van-field
          v-model="time"
          label="时间"
          name="timeValidator"
          placeholder="默认5个工作日"
          :rules="[{ timeValidator, message: '默认5个工作日' }]"
        />
        <van-field name="switch" label="包含商品">
          <template #input>
            <van-switch v-model="switchChecked" size="20" />
          </template>
        </van-field>

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
import { designApi } from '@/api/design'
import { Toast } from 'vant'
export default {
  data() {
    return {
      size: '',
      colorNum: '',
      time: '',
      pattern: /\d{6}/,
      colorValidator: /\d{6}/,
      timeValidator: /\d{6}/,
      uploader: [],
      switchChecked: false,
      checkboxGroup: [],
      templateList: [],
      currentTemplate: {},
      result: []
    }
  },
  created() {
    this.getTemplate()
  },
  methods: {
    // 校验函数返回 true 表示校验通过，false 表示不通过
    validator(val) {
      return /1\d{10}/.test(val)
    },
    // 获取定制模板
    getTemplate() {
      designApi.getEmbTemplate({
        template_type: 2 // 1 一般定制 2 特殊定制
      }).then(res => {
        this.templateList = res.data
        this.currentTemplate = this.templateList[0]
      })
    },
    // 提交
    onFailed(errorInfo) {
      console.log('failed', errorInfo)
      Toast('表单信息不完整')
    },
    submit(values) {
      console.log(values)
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
      }
    }
    .temp-item{
      font-size: 12px;
      text-align: center;
      img{
        display: block;
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
