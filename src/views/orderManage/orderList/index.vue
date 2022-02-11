<template>
  <div class="my-order">
    <top-bar class="top-bar" :title="`${$t('我的订单')}`" />
    <van-tabs v-model="active" swipeable animated @change="tabCahnge">
      <van-tab v-for="item in tabs" :key="item.name" :title="item.name">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="tab-content">
            <order-list v-if="orderList.length>0" :data="orderList" @getList="fetchData()" @change="orderChange" @showPrevPop="showPrev" />
            <div v-if="orderList.length>=10" class="load-more">
              <infinite-loading :identifier="infiniteId" @infinite="loadMore">
                <span slot="no-results" style="font-size: 12px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
                <span slot="no-more" style="font-size: 12px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
              </infinite-loading>
            </div>
            <div v-if="orderList.length===0" class="no-order">
              <no-data icon="no-order" :text="`${$t('暂无订单')}`" :font-size="110" />
            </div>
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>

    <!-- 回复报价 -->
    <form-popup v-model="showReplay" :title="`${$t('回复报价')}`" @confirm="confirmRelay" @cancel="showReplay = false">
      <div slot="modalcontent">
        <van-form>
          <van-field
            v-model="replayForm.price"
            :name="`${$t('价格')}`"
            :label="`${$t('回复价格')}`"
            :border="false"
            :placeholder="`${$t('回复价格')}`"
            :rules="[{ validatorPrice, message: `${$t('请输入回复价格')}` }]"
          />
          <van-field
            v-model="replayForm.buyer_message"
            type="textarea"
            :name="`${$t('备注')}`"
            :label="`${$t('备注')}`"
            :border="false"
            maxlength="50"
            :placeholder="`${$t('备注')}`"
            :rules="[{ validatorMessage, message: `${$t('请填写备注信息')}` }]"
          />
        </van-form>
      </div>
    </form-popup>

    <preview-modal
      v-model="isShowPrevPop"
      :operate="false"
      :img="previewImg"
      @change="value => isShowPrevPop = value"
    />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading' // 上拉加载
import TopBar from '@/components/TopBar'
import OrderList from './components/OrderList'
import NoData from '@/components/NoData'
import { orderApi } from '@/api/order'
import FormPopup from '@/components/PopModal/FormPopup'
import { Toast } from 'vant'
import PreviewModal from '@/views/customized/commonly/components/PreviewModal'
export default {
  components: {
    TopBar,
    OrderList,
    InfiniteLoading,
    NoData,
    'form-popup': FormPopup,
    'preview-modal': PreviewModal
  },

  data() {
    return {
      infiniteId: +new Date(), // 重置上拉加载组件
      active: 0,
      isLoading: false, // 下拉刷新
      showReplay: false,
      replayForm: {
        order_no: '',
        price: '',
        buyer_message: ''
      },
      tabs: [{
        name: `${this.$t('全部')}`,
        type: 0
      }, {
        name: `${this.$t('待支付')}`,
        type: 1
      }, {
        name: `${this.$t('待刺绣')}`,
        type: '2,7,8,9,10,3'
      },
      //  {
      //   name: `${this.$t('待收货')}`,
      //   type: '3'
      // },
       {
        name: `${this.$t('已完成')}`,
        type: 4
      }, {
        name: `${this.$t('待回复')}`,
        type: 5
      }, {
        name: `${this.$t('已回复')}`,
        type: 6
      }, {
        name: `${this.$t('已关闭')}`,
        type: -2
      }],
      orderList: [],
      page: 1,
      pagesize: 10,
      order_no: '',
      order_type: 1,
      isShowPrevPop: false,
      previewImg: ''
    }
  },
  created() {

  },
  mounted() {
    if (this.$route.query.current_type) {
      this.active = parseInt(this.$route.query.current_type)
    }
    this.fetchData()
  },
  methods: {
    fetchData() {
      orderApi.getOrderList({
        currentPage: this.page,
        pageSize: this.pagesize,
        status: this.tabs[this.active].type
      }).then(res => {
        this.orderList = res.data.data
        setTimeout(() => {
          this.isLoading = false
        }, 1000)
      })
    },
    tabCahnge(e) {
      this.page = 1
      this.fetchData()
    },
    onRefresh() {
      this.page = 1
      this.infiniteId += 1 // 重置上拉加载状态
      this.fetchData()
    },
    loadMore($state) {
      this.page++
      orderApi.getOrderList({
        currentPage: this.page,
        pageSize: this.pagesize,
        status: this.tabs[this.active].type
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.orderList = this.orderList.concat(res.data.data)
            if (res.data.data.length === 10) {
              $state.loaded() // 加载完成
            } else {
              $state.complete()
            }
          } else {
            $state.complete()
          }
        } else {
          $state.complete()
        }
      })
    },
    validatorPrice(val) {
      return val !== ''
    },
    validatorMessage(val) {
      return val !== ''
    },
    confirmRelay(value) {
      if (this.validatorPrice && this.validatorMessage) {
        orderApi.askOrder(this.replayForm).then(res => {
          Toast.success(`${this.$t('回复成功')}${this.$t('！')}`)
          this.showReplay = false
          this.fetchData()
        })
      }
    },
    orderChange(data) {
      if (data.name === 'replay') {
        this.showReplay = true
        this.replayForm.order_no = data.order_no
      }
    },
    showPrev($row) {
      this.previewImg = $row.order_item[0].image
      this.isShowPrevPop = true
    }
  }
}
</script>

<style lang="scss" scoped>
.my-order{
  .top-bar{
    position: sticky;
    top: 0;
    z-index: 999;
  }
  .tab-content{
    min-height: 70vh;
    .no-order{
      padding-top: 50px;
    }
    .load-more{
      padding-bottom: 20px;
    }
  }
}

</style>

<style lang="scss">
.my-order {
  .van-tabs__wrap{
    position: sticky;
    top: 45px;
    z-index: 999;
  }
}

</style>
