const path = require('path')
module.exports = {
  title: '云易绣商城',
  lang: 'zh',
  langsType: {
    'zh': {
      name: 'zh',
      title: '中文',
      path: path.resolve(__dirname, '../src/lang/zh.json')
    },
    'en': {
      name: 'en',
      title: 'Englist',
      path: path.resolve(__dirname, '../src/lang/en.json'),
      type: 'ZH_CN2EN'
    }
  }
}
