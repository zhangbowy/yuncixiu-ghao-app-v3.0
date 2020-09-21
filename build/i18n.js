
/* eslint-disable */
const fs = require("fs")
const path = require("path")


const {langsType}  = require('../src/settings')

const dirList = foreachDir([
  path.resolve(__dirname, '../src/views'),
  path.resolve(__dirname, '../src/components'),
  // path.resolve(__dirname, '../src/components/UploadFigure')
])

// createLang(dirList, langsType)

function foreachDir (filePathList) {
  const DirList = []
  filePathList.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let fileNameList = []
      const fileList = fs.readdirSync(filePath)
      fileList.forEach(name => {
        const fileName = path.resolve(filePath, `./${name}`)
        const stat = fs.statSync(fileName)
        if (stat.isDirectory()) {
          // let templatePath = fileName.replace(/views/, 'views1')
          // templatePath = templatePath.replace(/components/, 'components1')
          // if(!fs.existsSync(templatePath) ) {
          //   fs.mkdirSync(templatePath)
          // }
          fileNameList = [...fileNameList, ...(foreachDir([fileName])).flat()]
        } else {
          fileNameList.push(fileName)
        }
      })
      DirList.push(fileNameList)
    }
  })
  return DirList
}

function createLang(dirList, langs) {
  let langObj = {}
  for(let key in langs) {
    const lang = langs[key]
    langObj[lang.name] = {}
  }
  // matchRouter(langObj)
  dirList.forEach(fileNameList => {
    langObj = match(fileNameList, langObj)
  })
  // for(let key in langs) {
  //   const lang = langs[key]
  //   // fs.writeFileSync(lang.path, JSON.stringify(langObj[lang.name]))
  //   if(key !== 'zh') {
  //     translate(langObj[lang.name], lang)
  //   }
  // }
}




function matchRouter (langObj) {
  const router = fs.readFileSync(path.resolve(__dirname, '../src/router/index.js')).toString()
  router.replace(/[\u4e00-\u9fa5]+/g, value => {
    insetWord(langObj, value)
  })
}

function match(fileNameList, langObj) {
  
  fileNameList.forEach(file => {
    // console.log(file)
    // 中文标点符号
    const punctuationReg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g
    // 中文
    const cnReg = /[\u4e00-\u9fa5]+/g
    // 标签中的中文及标点符号
    const tagCnAndPunReg = />[\s]*[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+[\s]*</g
    // 中文带标点符号
    const cnAndPunReg = /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|()/（）!]+/g
    // 标签中的中文
    const tagCnReg = />[\s]*([\u4e00-\u9fa5A-z0-9]\s*)+[\s]*</g
    // 带字母数字的中文
    const numberCnReg = /[\u4e00-\u9fa5A-z0-9\s]+/g
    // 属性中的中文
    const propCnReg = /\S+="([\u4e00-\u9fa5]+[\u4e00-\u9fa5A-z0-9/\s()（）]*)+"/g
    // 属性中的中文及标点符号
    const propCnAndPunReg = /\S+="[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+"/g
    // js 中的中文
    const jsCnReg = /<script[\d\D]*<\/script>/g
    // template 
    const templateReg = /<template>[\d\D]*<\/template>/

    // 三目运算符 中的中文
    // :tag-name="id!=''? '编辑商品': '新增商品'"
    const ternaryReg = /\?\s{0,1}['"][\u4e00-\u9fa5]+['"]\s{0,1}:\s{0,1}['"][\u4e00-\u9fa5]+'"/g

    // 接口提示信息
    // res.msg | data.msg | res.data.msg
    const apiHintReg = /res.msg|res.data.msg|data.msg/g

    // 胡子三目 {{ scope.row.is_active==0?'未激活':'已激活' }}
    const beardTernaryReg = /\?\s{0,1}['"][\u4e00-\u9fa5]+['"]\s{0,1}:\s{0,1}['"][\u4e00-\u9fa5]+['"]\s{0,1}}}<\//g

    // eg: message: '请填写姓名！'
    const messageReg = /message: '[\u4e00-\u9fa5A-z0-9\s!]+！{0,1}'/g
    //eg: 登录账号：{{ 
    // const 

    // 带引号的中文
    const qmCnReg = /['"][\u4e00-\u9fa5]+[\u4e00-\u9fa5|A-z0-9\/\s\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]*[!|?]{0,1}['"]/g
    const content = fs.readFileSync(file)
    let template = content.toString().replace(tagCnReg, (value) => {
      // console.log(value)
      value = value.replace(numberCnReg, val => { 
        insetWord(langObj, val.trim())
        return `{{ $t(` + "`" + val.trim() + "`" + `) }}`
      })
      return value
    })
    template = template.replace(propCnReg, (value) => {
      // console.log(value)
      value = value.replace(cnAndPunReg, val => { 
        return "`" + val + "`"
      })
      value = value.replace(punctuationReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      value = value.replace(cnReg, val => {
        // console.log(val, 'dd')
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      return `:${value}`
    })
    template = template.replace(tagCnAndPunReg, (value) => {
      value = value.replace(cnAndPunReg, val => { 
        return "`" + val + "`"
      })
      value = value.replace(punctuationReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      value = value.replace(cnReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      
      return value
    }) 
    template = template.replace(propCnAndPunReg, (value) => {
      // console.log(value, 'old')
      value = value.replace(cnAndPunReg, val => { 
        return "`" + val + "`"
      })
      value = value.replace(punctuationReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      value = value.replace(cnReg, val => {
        insetWord(langObj, val)
        return "${" + `$t('${val}')` + "}"
      })
      // console.log(value, 'new')
      return `:${value}`
    })
    template = template.replace(jsCnReg, (value) => {
      value = value.replace(qmCnReg, val => {
        // console.log(val, 'dd')
        val = val.replace(/['"]/g, '')
        val = val.replace(numberCnReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `this.$t('${v}')` + "}"
        })
        val = val.replace(punctuationReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `this.$t('${v}')` + "}" 
        })
        return '`' + val + '`'
      })
      
      return value
    })

    template = template.replace(ternaryReg, (value) => {
      // console.log(value)
      value = value.replace(qmCnReg, val => {
        // console.log(val, 'dd')
        val = val.replace(/['"]/g, '')
        val = val.replace(cnReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `$t('${v}')` + "}"
        })
        val = val.replace(punctuationReg, v => {
          // console.log(v)
          insetWord(langObj, v)
          return "${" + `$t('${v}')` + "}" 
        })
        return '`' + val + '`'
      })
      
      return value
    })
    template = template.replace(apiHintReg, (value) => {
      // console.log(value)
      return `this.$t(${value})`
    })

    template = template.replace(beardTernaryReg, (value) => {
      value = value.replace(/['"]/g, '')
      value = value.replace(cnReg, val => {
        insetWord(langObj, val)
        return `$t('${val}')`
      })
      return value
    })

    template = template.replace(messageReg, (value) => {
      value = value.replace(qmCnReg, val => {
        val = val.replace(/['"]/g, '')
        val = val.replace(cnAndPunReg, v => { 
          return "`" + v + "`"
        })
        val = val.replace(punctuationReg, v => {
          insetWord(langObj, v)
          return "${" + `$t('${v}')` + "}"
        })
        val = val.replace(cnReg, v => {
          insetWord(langObj, v)
          return "${" + `$t('${v}')` + "}"
        })
        return `${val}`
      })
      return value
    })

    // let templatePath = file.replace(/views/, 'views1')
    // templatePath = templatePath.replace(/components/, 'components1')
    fs.writeFileSync(file, template)
  })
  return langObj
}
function insetWord (langObj, val) {
  for (let lan in langObj) {
    const message = langObj[lan]
    if(!message[val]) {
      message[val] = lan === 'zh' ? val : ''
    }
  }
}
// console.log(translateVal)

function translate(langObj, langSetting)  {
  const en = [
    "Home page",

    "Personal center",

    "Classification",

    "Shopping cart",

    "User login",

    "User registration",

    "Share page Jump preview page",

    "Design preview",

    "Product list",

    "Commodity details",

    "Confirm order",

    "Order list",

    "Order details",

    "Logistics details",

    "Address list",

    "About us",

    "User authorization",

    "Start designing",

    "General customization",

    "Special customization",

    "Hand painted",

    "Page",

    "Back to home page",

    "Default",

    "New address",

    "Edit address",

    "Tips",

    "Delete current address",

    "Success",

    "I have read and accepted it",

    "Rules for using websites",

    "Privacy policy",

    "Submit",

    "Wechat login",

    "Password login",

    "Account number",

    "Please enter account number",

    "Password",

    "Please enter the password",

    "Quick login",

    "Mobile phone number",

    "Please input the mobile number",

    "Captcha",

    "Please input SMS verification code",

    "、",

    ". ",

    "Send verification code",

    "Search products",

    "Commodities",

    "Pattern",

    "All",

    "The pattern is in pre-sale",

    "Please select customized products first",

    "Then select custom pattern",

    ",",

    "OK",

    "Select products",

    "Select template",

    "Upload pictures",

    "Pattern library",

    "Preview",

    "Finish the design",

    "Chinese fonts",

    "Embroidery font",

    "Return to modify",

    "Add to cart",

    "Buy now",

    "Custom sharing",

    "Please click on the upper right corner to share customization",

    "Size",

    "Delete",

    "Re input",

    "Remove background",

    "White background only",

    "Change image size",

    "Font",

    "Color",

    "Standard colors",

    "Custom",

    "Arc",

    "Open or not",

    "Radian",

    "Radius",

    "Click to enter text",

    "Image height",

    "Please enter height",

    "Select input mode",

    "Align left",

    "In the middle",

    "Align right",

    "Chinese cannot be input in this mode",

    "Background removal failed",

    "Please enter the text content",

    "Preview image generation failed",

    "Custom pattern generation failed",

    "Please enter the text",

    "Font height",

    "Please input font height",

    "Done",

    "Width",

    "Height",

    ":",

    "Stroke thickness",

    "The style is thick and thin",

    "Zoom in",

    "Start painting by hand",

    "Empty",

    "Revocation",

    "Finish drawing",

    "Please draw the content",

    "Full screen",

    "Restore",

    "Empty the drawing board",

    "Width cannot exceed 150 mm",

    "Height shall not exceed 150 mm",

    "Please enter the width",

    "Number of colors",

    "Suggest less than or equal to",

    "Color",

    "Time",

    "Working days",

    "Including goods",

    "Custom pattern",

    "Remarks",

    "Please enter",

    "Incomplete form information",

    "Please check the embroidery type",

    "!",

    "Please fill in the number of colors",

    "Please fill in the time",

    "Please upload custom pattern",

    "Please enter the comment",

    "Entering the mall",

    "Image loading error",

    "Search patterns",

    "No pattern for the moment",

    "~",

    "There's no more",

    "Selected",

    "Select specifications",

    "Select quantity",

    "Customize now",

    "Pre sale of goods",

    "$",

    "Please select the specification",

    "Network error",

    "Added successfully",

    "No commodities for the time being",

    "Custom recommendation",

    "Pattern type recommendation",

    "Hot selling goods",

    "Pre sale goods",

    "No pre-sale products for the time being",

    "Add shipping address",

    "Including customization fee",

    "Delivery mode",

    "Subtotal",

    "Freight",

    "Message",

    "Please enter a message",

    "Submit order",

    "Express delivery",

    "Store pick up",

    "Request exception",

    "Payment failed",

    "Cancel order",

    "Pay now",

    "Scanning machines",

    "Confirm receipt",

    "Delete order",

    "Total price of goods",

    "Order total price",

    "Order No.",

    "Order time",

    "Order type",

    "Payment time",

    "Buyer message",

    "Payment required",

    "Cancel this order",

    "?",

    "Confirm receipt",

    "Are you sure you want to delete",

    "Inquiry",

    "Reply to quotation",

    "Order No.",

    "You click Cancel",

    "My order",

    "No order yet",

    "Price",

    "Reply price",

    "To be paid",

    "To be shipped",

    "Goods to be received",

    "Completed",

    "To be answered",

    "Replied",

    "Closed",

    "Reply succeeded.",

    "Please enter the reply price",

    "Please fill in the remarks",

    "No track information for the time being",

    "Select all",

    "No goods in shopping cart",

    "Specifications",

    "Please select product",

    "You have not selected a product yet",

    "Are you sure to delete the selected items",

    "You click Cancel",

    "Management",

    "About page",

    "View all orders",

    "Address management",

    "Language",

    "Switching languages",

    "Save",

    "Name",

    "Telephone",

    "City",

    "Select province",

    "City",

    "District",

    "Detailed address",

    "Postcode",

    "Default address",

    "Please fill in your name",

    "Please fill in your mobile phone number",

    "Mobile phone number format error",

    "Please select the province, city and city",

    "Please fill in the detailed address",

    "Please fill in the postcode",

    "Postcode format error",

    "You have not created a shipping address yet",

    "Customization",

    "No recommended products for the time being",

    "Pre sale",

    "No data at present",

    "Cancel",

    "Share with friends now",

    "Wechat",

    "Microblog",

    "Copy link",

    "Sharing posters",

    "QR code",

    "Circle of friends",

    "My",
  ]
  const valueList = Object.keys(langObj)
  valueList.forEach((item, index) => {
    console.log(`"${item}",`)
    langObj[item] = en[index]
  })
  fs.writeFileSync(langSetting.path, JSON.stringify(langObj))
  console.log(langObj)
}
