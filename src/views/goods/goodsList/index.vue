<template>
  <div class="goods-list">
    <div class="index-search">
      <van-search
        v-model="keyWords"
        shape="round"
        background="#fff"
        :placeholder="`${$t('搜索商品')}`"
        @search="onSearch"
        @cancel="onCancel"
      />
    </div>
    <div class="content">
      <template v-if="has_figure">
        <van-tabs v-model="tabsActive" sticky swipeable @click="onTabsClick">
          <van-tab :title="`${$t('商品')}`">
            <!-- 商品列表 -->
            <goods-list v-if="goodsList.length>0" :data="goodsList" :design-id="design_id" />
            <!-- 加载更多 -->
            <div v-if="goodsList.length>=12" class="load-more">
              <infinite-loading @infinite="loadMore">
                <span slot="no-results" style="padding-bottom:50px; font-size: 14px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
                <span slot="no-more" style="padding-bottom:50px; font-size: 14px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
              </infinite-loading>
            </div>
            <div v-if="goodsList.length==0">
              <no-data :text="`${$t('暂无商品')}`" icon="no-data" :font-size="64" />
            </div>
          </van-tab>
          <van-tab :title="`${$t('花样')}`">
            <div class="sample-box">
              <template v-for="(item,index) in figureList">
                <div :key="index+item.prev_png_path" class="sample-box-item">
                  <img :src="item.prev_png_path" alt="" lazy-load @click="patternDialog(item)">
                  <span v-if="item.is_presell==1" class="corner-mark">{{ '预售' }}</span>
                </div>
              </template>
            </div>
            <!-- 加载更多 -->
            <div v-if="goodsList.length>=12" class="load-more">
              <infinite-loading @infinite="loadMore">
                <span slot="no-results" style="padding-bottom:50px; font-size: 14px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
                <span slot="no-more" style="padding-bottom:50px; font-size: 14px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
              </infinite-loading>
            </div>
            <div v-if="goodsList.length==0">
              <no-data :text="`${$t('暂无商品')}`" icon="no-data" :font-size="64" />
            </div>
          </van-tab>
        </van-tabs>
      </template>
      <template v-else>
        <!-- 商品列表 -->
        <goods-list v-if="goodsList.length>0" :data="goodsList" :design-id="design_id" />
        <!-- 加载更多 -->
        <div v-if="goodsList.length>=12" class="load-more">
          <infinite-loading @infinite="loadMore">
            <span slot="no-results" style="padding-bottom:50px; font-size: 14px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
            <span slot="no-more" style="padding-bottom:50px; font-size: 14px">{{ `${$t('没有更多了')}${$t('～')}` }}</span>
          </infinite-loading>
        </div>
        <div v-if="goodsList.length==0">
          <no-data :text="`${$t('暂无商品')}`" icon="no-data" :font-size="64" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading' // 上拉加载
import GoodsList from '@/components/Goods/GoodsList'
import { goodsApi } from '@/api/goods'
import { designApi } from '@/api/design'
import { Dialog } from 'vant'
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
      figureList: [],
      keyWords: '', // 搜索关键词
      category_id: '', // 分类id
      page: 1,
      pagesize: 12,
      design_id: '', // 选中的花样
      tabsActive: 0,
      has_figure: false
    }
  },
  watch: {
    '$route': {
      handler(newValue) {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.category_id = this.$route.query.category_id
      const { design_id = null, has_figure = false, tabsActive = 0 } = this.$route.query || {}
      this.design_id = design_id
      this.has_figure = has_figure === 'true'
      this.tabsActive = Number(tabsActive)
      this.fetchData(this.category_id)
    },
    fetchData(id) {
      goodsApi.getGoodsList({
        design_id: this.design_id || 0,
        category_id: id || '',
        name: this.keyWords,
        currentPage: 1,
        pageSize: this.pagesize
      }).then(res => {
        if (res.code === 0) {
          this.goodsList = res.data.data
        }
      })
      this.has_figure && this.getFigure()
    },
    getFigure() {
      designApi.getFigure({
        currentPage: 1,
        pageSize: 1000,
        design_category_id: this.category_id
      }).then(res => {
        this.figureList = res.data.data
      })
    },
    // 点击花样
    patternDialog(item) {
      Dialog.confirm({
        title: `${this.$t('提示')}`,
        message: item.is_presell ? `${this.$t('该花样正在预售中')}` : `${this.$t('请先选择定制商品')}${this.$t('，')}${this.$t('再选择定制花样')}${this.$t('。')}`,
        confirmButtonText: item.is_presell ? `${this.$t('确定')}` : `${this.$t('选择商品')}`,
        confirmButtonColor: '#df2525'
      }).then(() => {
        !item.is_presell && this.$router.push({ path: '/goodsList', query: { design_id: item.design_id, has_figure: false }})
      }).catch(() => {
      })
    },
    onTabsClick(value) {
      // console.log(value)
    },
    loadMore($state) {
      this.page++
      goodsApi.getGoodsList({
        category_id: this.category_id || '',
        design_id: this.design_id || 0,
        name: this.keyWords,
        currentPage: this.page,
        pagesize: this.pagesize
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.goodsList = this.goodsList.concat(res.data.data)
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

<style lang="scss" scoped>
.goods-list{
  padding-bottom: 60px;
  .index-search{
    position: sticky;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 100;
  }
}
.sample-box{
  display: flex;
  flex-flow: wrap;
  align-items: center;
  background: #fff;
  padding-top: 10px;
  &-item{
    width:40%;
    border: 1px solid #f5f5f5;
    box-shadow: 0px 10px 20px #f3f3f3;
    margin: 0 5% 15px;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    img{
      width: 90%;
      border-radius: 6px;
      display: block;
    }
    .corner-mark{
      position: absolute;
      left: -3px;
      top: -1px;
      background: #ff2828;
      padding: 3px;
      border-radius: 6px 0 6px 0 ;
      font-size: 10px;
      color: #fff;
      transform: scale(0.8);
      display: inline-block;
    }
  }
}
</style>
