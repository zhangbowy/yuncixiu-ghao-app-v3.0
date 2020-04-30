<template>
  <div class="my-order">
    <top-bar class="top-bar" title="我的订单" />
    <van-tabs v-model="active" swipeable @change="tabCahnge">
      <van-tab v-for="item in tabs" :key="item.name" :title="item.name">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="tab-content">
            <order-list v-if="orderList.length>0" :data="orderList" @getList="fetchData()" />
            <div v-if="orderList.length>=10" class="load-more">
              <infinite-loading :identifier="infiniteId" @infinite="loadMore">
                <span slot="no-results" style="font-size: 12px">没有更多了～</span>
                <span slot="no-more" style="font-size: 12px">没有更多了～</span>
              </infinite-loading>
            </div>
            <div v-if="orderList.length===0" class="no-order">
              <no-data icon="no-order" text="暂无订单" :font-size="110" />
            </div>
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading' // 上拉加载
import TopBar from '@/components/TopBar'
import OrderList from './components/OrderList'
import NoData from '@/components/NoData'
import { Toast } from 'vant'
import { orderApi } from '@/api/order'
export default {
  components: {
    TopBar,
    OrderList,
    InfiniteLoading,
    NoData
  },
  data() {
    return {
      infiniteId: +new Date(), // 重置上拉加载组件
      active: 0,
      isLoading: false, // 下拉刷新
      tabs: [{
        name: '全部',
        type: 0
      }, {
        name: '待支付',
        type: 1
      }, {
        name: '待发货',
        type: 2
      }, {
        name: '待收货',
        type: 3
      }, {
        name: '已完成',
        type: 4
      }, {
        name: '待回复',
        type: 5
      }, {
        name: '已回复',
        type: 6
      }, {
        name: '已关闭',
        type: -2
      }],
      orderList: [],
      total: '',
      page: 1,
      pagesize: 10,
      order_no: '',
      order_type: 1
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
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      orderApi.getOrderList({
        currentPage: this.page,
        pageSize: this.pagesize,
        status: this.tabs[this.active].type
      }).then(res => {
        this.orderList = res.data.data
        this.total = res.data.count
        setTimeout(() => {
          this.isLoading = false
        }, 1000)
        Toast.clear()
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
