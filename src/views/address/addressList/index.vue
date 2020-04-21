<template>
  <div class="address-list">
    <top-bar :title="'地址列表'" />
    <div class="addrss-content">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      >
        <!-- <div slot="item-bottom">
          <div class="delete-item" @click.stop="deleteAddress()">
            <svg-icon icon-class="delete" /><span>删除</span>
          </div>
        </div> -->
      </van-address-list>
    </div>
    <div class="">
      <van-action-sheet v-model="show" :title="actionTitle">
        <div class="content">
          <van-address-edit
            :area-list="areaList"
            :show-postal="false"
            show-delete
            show-set-default
            show-search-result
            :address-info="addressInfo"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
          />
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import areaList from './area'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      show: false,
      areaList: areaList,
      chosenAddressId: '1',
      actionTitle: '',
      addressInfo: {},
      list: [
        {
          id: '1',
          name: '张三',
          tel: '13000000000',
          province: '',
          city: '',
          county: '',
          areaCode: '',
          addressDetail: '文三路 138 号东方通信大厦 7 楼 501 室',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
          isDefault: true
        },
        {
          id: '2',
          name: '李四',
          tel: '1310000000',
          addressDetail: '莫干山路 50 号',
          province: '',
          city: '',
          county: '',
          areaCode: '',
          address: '浙江省杭州市拱墅区莫干山路 50 号',
          isDefault: false
        }
      ]
    }
  },
  methods: {
    onAdd() {
      console.log('新增地址')
      this.actionTitle = '新增地址'
      this.show = true
    },
    onEdit(item, index) {
      this.actionTitle = '编辑地址'
      console.log('编辑地址:' + index)
      this.addressInfo = item
      this.show = true
    },
    onSave(e) {
      console.log(e)
      console.log('save')
    },
    onDelete(e) {
      console.log(e)
      console.log('delete')
    }
  }
}
</script>

<style lang="scss" scoped>
.address-list{
  background: #f5f5f5;
  min-height: 100vh;
  .delete-item{
    font-size: 14px;
    color: #8a8a8a;
    text-align: right;
    margin-top: 20px;
    span{
      padding-left: 10px;
    }
  }
}
</style>
