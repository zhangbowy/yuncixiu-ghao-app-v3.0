<template>
  <div class="goods-list">
    <div class="index-search">
      <van-search
        v-model="keyWords"
        shape="round"
        background="#fff"
        placeholder="搜索花样"
        @search="onSearch"
        @cancel="onCancel"
      />
    </div>
    <div class="content">
      <!-- 花样列表 -->
      <div class="sample-box">
        <div v-for="(item,index) in figureList" :key="index+item.prev_png_path" class="sample-box-item">
          <img :src="item.prev_png_path" alt="" @click="patternDialog(item)">
        </div>
      </div>
      <!-- 加载更多 -->
      <div v-if="figureList.length>=12" class="load-more">
        <infinite-loading @infinite="loadMore">
          <span slot="no-results" style="padding-bottom:50px; font-size: 14px">没有更多了～</span>
          <span slot="no-more" style="padding-bottom:50px; font-size: 14px">没有更多了～</span>
        </infinite-loading>
      </div>
      <div v-if="figureList.length==0">
        <van-empty description="暂无花样" />
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading' // 上拉加载
import { designApi } from '@/api/design'
import { Dialog } from 'vant'
export default {
  components: {
    InfiniteLoading
  },
  data() {
    return {
      figureList: [],
      keyWords: '', // 搜索关键词
      page: 1,
      pagesize: 12,
      design_id: '', // 选中的花样,
      design_category_id: 0
    }
  },
  created() {
    this.design_category_id = this.$route.query.design_category_id
    const { design_id = null } = this.$route.query || {}
    this.design_id = design_id
    this.fetchData()
  },
  methods: {
    fetchData() {
      designApi.getFigure({
        name: this.keyWords,
        design_category_id: this.design_category_id,
        currentPage: 1,
        pageSize: this.pagesize
      }).then(res => {
        if (res.code === 0) {
          this.figureList = res.data.data
        }
      })
    },
    loadMore($state) {
      this.page++
      designApi.getFigure({
        currentPage: this.page,
        pagesize: this.pagesize
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.figureList = this.figureList.concat(res.data.data)
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
      this.fetchData()
    },
    onCancel() {},
    patternDialog(item) {
      Dialog.confirm({
        title: '提示',
        message: '请先选择定制商品，再选择定制花样。',
        confirmButtonText: '选择商品',
        confirmButtonColor: '#df2525'
      }).then(() => {
        this.$router.push({ path: '/goodsList', query: { design_id: item.design_id }})
      }).catch(() => {
      })
    }
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
.sample-box{
    display: flex;
    flex-flow: wrap;
    align-items: center;
    justify-content: space-around;
    background: #fff;
    padding-top: 10px;
    &-item{
      width: 28%;
      border: 1px solid #f5f5f5;
      box-shadow: 0px 10px 20px #f3f3f3;
      margin-bottom: 15px;
      border-radius: 6px;
      // width: 100px;
      // height: 100px;
      box-sizing: border-box;
      padding: 10px;
      img{
        width: 90%;
        // max-height: 100px;
        // min-height: 100px;
        border-radius: 6px;
        display: block;
      }
    }
  }
</style>
