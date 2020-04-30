<template>
  <div class="order-trace">
    <top-bar class="top-bar" title="物流详情" />
    <div class="trace-info-top">
      <div class="order-no">{{ traceInfo.express_name }} {{ traceInfo.express_number }}</div>
      <div class="order-status">{{ traceInfo._state }}</div>
    </div>
    <div class="trace-info-content">
      <van-steps direction="vertical" :active="0" active-color="#1296db">
        <van-step v-for="(item,index) in traceInfo.traces" :key="index">
          <p>{{ item.content }}</p>
          <span>{{ item.datetime }}</span>
        </van-step>
      </van-steps>
      <div v-if="traceInfo.traces.length==0">
        <van-empty
          class="custom-image"
          image="https://img.yzcdn.cn/vant/custom-empty-image.png"
          description="暂无轨迹信息"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { orderApi } from '@/api/order'
import TopBar from '@/components/TopBar'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      id: this.$route.query.id,
      traceInfo: {
        traces: []
      }
    }
  },
  created() {
    this.getTraceInfo()
  },
  methods: {
    getTraceInfo() {
      orderApi.orderTrace({
        order_item_id: this.id
      }).then(res => {
        this.traceInfo = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.trace-info-top{
  font-size: 12px;
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
  .order-no{
    width: 60%;
    color: #000;
  }
  .order-status{
    width: 40%;
    text-align: right;
    font-size: 14px;
    color: #1296db;
  }
}
.trace-info-content{
  padding: 10px;
  font-size: 12px;
  p{
    margin: 0;
    margin-bottom: 10px;
  }
  span{
    font-size: 10px;
  }
}

</style>
