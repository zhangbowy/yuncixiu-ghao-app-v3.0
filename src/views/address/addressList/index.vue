<template>
  <div class="address-manage">
    <div class="address-navbar">
      <top-bar title="地址列表" />
    </div>
    <div class="addrss-content">
      <address-list
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
    <div class="">
      <van-action-sheet v-model="show" :title="actionTitle">
        <div class="content">
          <address-edit
            :type="actionTitle"
            :area-list="cityList"
            :address-info="addressInfo"
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
import { Dialog, Toast } from 'vant'
import cityList from './city'
import { addressApi } from '@/api/user'
import AddressList from '@/components/Address/AddressList'
import AddressEdit from '@/components/Address/AddressEdit'
export default {
  components: {
    TopBar,
    AddressList,
    AddressEdit
  },
  data() {
    return {
      show: false,
      cityList: cityList,
      chosenAddressId: '1',
      actionTitle: '',
      addressInfo: {},
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      addressApi.getAddressList().then(res => {
        this.list = res.data
      })
    },
    onAdd() {
      this.actionTitle = '新增地址'
      this.addressInfo = {}
      this.show = true
    },

    onEdit(item, index) {
      this.actionTitle = '编辑地址'
      this.addressInfo = item
      this.show = true
    },
    onSave(form) {
      if (form.address_id && form.address_id !== '') {
        // 编辑
        addressApi.editAddress({
          address_id: form.address_id,
          name: form.name,
          phone: form.phone,
          province: form.province,
          province_code: form.province_code,
          city: form.city,
          city_code: form.city_code,
          area: form.area,
          area_code: form.area_code,
          address: form.address,
          is_default: form.is_default,
          post_code: form.post_code
        }).then(res => {
          Toast(res.msg)
          if (res.code === 0) {
            this.show = false
            this.fetchData()
          }
        })
      } else {
        // 新增
        addressApi.addAddress({
          name: form.name,
          phone: form.phone,
          province: form.province,
          province_code: form.province_code,
          city: form.city,
          city_code: form.city_code,
          area: form.area,
          area_code: form.area_code,
          address: form.address,
          is_default: form.is_default,
          post_code: form.post_code
        }).then(res => {
          Toast(res.msg)
          if (res.code === 0) {
            this.show = false
            this.fetchData()
          }
        })
      }
    },
    onDelete(id) {
      Dialog.confirm({
        title: '提示',
        message: '是否删除当前地址'
      })
        .then(() => {
          addressApi.deleteAddress({
            address_id: id
          }).then(res => {
            Toast(res.msg)
            if (res.code === 0) {
              this.show = false
              this.fetchData()
            }
          })
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-manage{
  background: #f5f5f5;
  min-height: 100vh;
  .address-navbar{
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 999;
  }
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
