<template>
  <div class="goods-list">
    <div class="index-search">
      <van-search
        v-model="keyWords"
        shape="round"
        background="#fff"
        placeholder="搜索商品"
        @search="onSearch"
        @cancel="onCancel"
      />
    </div>
    <div class="content">
      <!-- 商品列表 -->
      <goods-list :data="goodsList" />
      <!-- 加载更多 -->
      <div v-if="goodsList.length>10" class="load-more">
        <infinite-loading @infinite="loadMore">
          <span slot="no-results" style="padding-bottom:50px;">没有更多了～</span>
          <span slot="no-more">没有更多了～</span>
        </infinite-loading>
      </div>
      <div v-if="goodsList.length==0">
        <no-data text="暂无商品" icon="no-data" :font-size="64" />
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading' // 上拉加载
import GoodsList from '@/components/Goods/GoodsList'
import { goodsApi } from '@/api/goods'
import NoData from '@/components/NoData'
export default {
  components: {
    GoodsList,
    InfiniteLoading,
    NoData
  },
  data() {
    return {
      goodsList: [],
      keyWords: '', // 搜索关键词
      category_id: '', // 分类id
      page: 1,
      pagesize: 10
    }
  },
  created() {
    this.category_id = this.$route.query.category_id
    this.fetchData(this.category_id)
  },
  methods: {
    fetchData(id) {
      goodsApi.getGoodsList({
        category_id: id || '',
        name: this.keyWords,
        page: 1,
        pagesize: this.pagesize
      }).then(res => {
        if (res.code === 0) {
          this.goodsList = res.data.data
        }
      })
    },
    loadMore($state) {
      goodsApi.getGoodsList({
        category_id: this.category_id || '',
        name: this.keyWords,
        page: this.page,
        pagesize: this.pagesize
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.goodsList = this.goodsList.concat(res.data.data)
            this.page++
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
    // 搜索事件
    onSearch(val) {
      this.keyWords = val
      this.fetchData(this.category_id)
    },
    onCancel() {}
  }
}
</script>

<style lang="scss">
.goods-list{
  padding-bottom: 60px;
  .index-search{
    position: sticky;
    top: 0;
    left: 0;
  }
}

</style>
