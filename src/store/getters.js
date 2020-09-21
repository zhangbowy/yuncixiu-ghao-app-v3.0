const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  isLogin: state => state.user.isLogin,
  cartList: state => state.shopCart.cartList,
  lang: state => state.settings.lang,
  langsType: state => state.settings.langsType,
  hasLanguagePack: state => state.settings.hasLanguagePack
}
export default getters
