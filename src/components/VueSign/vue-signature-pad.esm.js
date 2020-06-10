import SignaturePad from 'signature_pad'
import mergeImages from 'merge-images'

var IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml']

var checkSaveType = function(type) { return IMAGE_TYPES.includes(type) }

var DEFAULT_OPTIONS = {
  dotSize: (0.5 + 2.5) / 2,
  minWidth: 0.5,
  maxWidth: 2.5,
  throttle: 16,
  minDistance: 5,
  backgroundColor: 'rgba(0,0,0,0)',
  penColor: 'black',
  velocityFilterWeight: 0.7,
  onBegin: function() {},
  onEnd: function() {}
}

var convert2NonReactive = function(observerValue) { return JSON.parse(JSON.stringify(observerValue)) }

var TRANSPARENT_PNG = {
  src:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  x: 0,
  y: 0
}

var script = {
  name: 'VueSignaturePad',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    customStyle: {
      type: Object,
      default: function() { return ({}) }
    },
    options: {
      type: Object,
      default: function() { return ({}) }
    },
    images: {
      type: Array,
      default: function() { return [] }
    }
  },
  data: function() {
    return ({
      signaturePad: {},
      cacheImages: [],
      signatureData: TRANSPARENT_PNG,
      onResizeHandler: null,
      canvasTxt: null
    })
  },
  computed: {
    propsImagesAndCustomImages: function propsImagesAndCustomImages() {
      var nonReactiveProrpImages = convert2NonReactive(this.images)
      var nonReactiveCachImages = convert2NonReactive(this.cacheImages)

      return nonReactiveProrpImages.concat(nonReactiveCachImages)
    }
  },
  watch: {
    options: function(nextOptions) {
      var this$1 = this

      Object.keys(nextOptions).forEach(function(option) {
        if (this$1.signaturePad[option]) {
          this$1.signaturePad[option] = nextOptions[option]
        }
      })
    }
  },
  mounted: function mounted() {
    var ref = this
    var options = ref.options
    var canvas = this.$refs.signaturePadCanvas
    var signaturePad = new SignaturePad(canvas, Object.assign({}, DEFAULT_OPTIONS,
      options))
    this.signaturePad = signaturePad

    this.onResizeHandler = this.resizeCanvas.bind(this)

    window.addEventListener('resize', this.onResizeHandler, false)

    this.resizeCanvas()
  },
  beforeDestroy: function beforeDestroy() {
    if (this.onResizeHandler) {
      window.removeEventListener('resize', this.onResizeHandler, false)
    }
  },
  methods: {
    getBase64PNG() {
      var canvas = this.$refs.signaturePadCanvas
      return canvas.toDataURL('image/png')
    },
    saveCanvas: function saveCanvas() {
      var canvas = this.$refs.signaturePadCanvas
      var data = this.signaturePad.toData()
      const item = {}
      item.data = data
      item.canvas = canvas
      return item
    },
    redrawCanvas: function redrawCanvas(item, xratio, yratio) {
      var canvas = this.$refs.signaturePadCanvas
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      canvas.getContext('2d').scale(xratio, yratio)
      this.signaturePad.clear()
      this.signaturePad.fromData(item.data)
    },
    resizeCanvas: function resizeCanvas() {
      var canvas = this.$refs.signaturePadCanvas
      var data = this.signaturePad.toData()
      var ratio = 1
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d').scale(ratio, ratio)
      this.canvasTxt = canvas.getContext('2d')
      this.signaturePad.clear()
      this.signatureData = TRANSPARENT_PNG
      this.signaturePad.fromData(data)
    },
    saveSignature: function saveSignature(type, encoderOptions) {
      if (type === void 0) type = IMAGE_TYPES[0]

      var ref = this
      var signaturePad = ref.signaturePad
      var status = { isEmpty: false, data: undefined }

      if (!checkSaveType(type)) {
        var imageTypesString = IMAGE_TYPES.join(', ')
        throw new Error(
          ('The Image type is incorrect! We are support ' + imageTypesString + ' types.')
        )
      }

      if (signaturePad.isEmpty()) {
        return Object.assign({}, status,
          { isEmpty: true })
      } else {
        this.signatureData = signaturePad.toDataURL(type, encoderOptions)
        var resImgData = this.canvasTxt.getImageData(0, 0, this.$refs.signaturePadCanvas.width, this.$refs.signaturePadCanvas.height)
        var cropInfo = {}
        const crop_area = this.getCropArea(resImgData.data)
        var crop_canvas = document.createElement('canvas')
        const crop_ctx = crop_canvas.getContext('2d')
        crop_canvas.width = crop_area[2] - crop_area[0]
        crop_canvas.height = crop_area[3] - crop_area[1]
        const crop_imgData = this.canvasTxt.getImageData(...crop_area)
        crop_ctx.globalCompositeOperation = 'destination-over'
        crop_ctx.putImageData(crop_imgData, 0, 0)
        this.signatureData = crop_canvas.toDataURL()
        crop_canvas = null
        cropInfo.width = crop_area[2] - crop_area[0]
        cropInfo.height = crop_area[3] - crop_area[1]
        cropInfo.site = crop_area
        return Object.assign({}, status,
          { data: this.signatureData, cropInfo: cropInfo })
      }
    },
    getCropArea(imgData) {
      var topX = this.$refs.signaturePadCanvas.width; var btmX = 0; var topY = this.$refs.signaturePadCanvas.height; var btnY = 0
      for (var i = 0; i < this.$refs.signaturePadCanvas.width; i++) {
        for (var j = 0; j < this.$refs.signaturePadCanvas.height; j++) {
          var pos = (i + this.$refs.signaturePadCanvas.width * j) * 4
          if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
            btnY = Math.max(j, btnY)
            btmX = Math.max(i, btmX)
            topY = Math.min(j, topY)
            topX = Math.min(i, topX)
          }
        }
      }
      topX++
      btmX++
      topY++
      btnY++
      const data = [topX, topY, btmX, btnY]
      return data
    },
    undoSignature: function undoSignature() {
      var ref = this
      var signaturePad = ref.signaturePad
      var record = signaturePad.toData()

      if (record) {
        return signaturePad.fromData(record.slice(0, -1))
      }
    },
    mergeImageAndSignature: function mergeImageAndSignature(customSignature) {
      this.signatureData = customSignature

      return mergeImages((this.images).concat(this.cacheImages,
        [this.signatureData]
      ))
    },
    addImages: function addImages(images) {
      if (images === void 0) images = []

      this.cacheImages = (this.cacheImages).concat(images)

      return mergeImages((this.images).concat(this.cacheImages,
        [this.signatureData]
      ))
    },
    fromDataURL: function fromDataURL(data, options, callback) {
      if (options === void 0) options = {}

      return this.signaturePad.fromDataURL(data, options, callback)
    },
    fromData: function fromData(data) {
      return this.signaturePad.fromData(data)
    },
    toData: function toData() {
      return this.signaturePad.toData()
    },
    lockSignaturePad: function lockSignaturePad() {
      return this.signaturePad.off()
    },
    openSignaturePad: function openSignaturePad() {
      return this.signaturePad.on()
    },
    isEmpty: function isEmpty() {
      return this.signaturePad.isEmpty()
    },
    getPropImagesAndCacheImages: function getPropImagesAndCacheImages() {
      return this.propsImagesAndCustomImages
    },
    clearCacheImages: function clearCacheImages() {
      this.cacheImages = []

      return this.cacheImages
    },
    clearSignature: function clearSignature() {
      return this.signaturePad.clear()
    }
  },
  render: function render(createElement) {
    var ref = this
    var width = ref.width
    var height = ref.height
    var customStyle = ref.customStyle

    return createElement(
      'div',
      {
        style: Object.assign({}, { width: width,
          height: height },
        customStyle)
      },
      [
        createElement('canvas', {
          style: {
            width: '100%',
            height: '100%'
          },
          ref: 'signaturePadCanvas'
        })
      ]
    )
  }
}

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector
    createInjector = shadowMode
    shadowMode = false
  }
  // Vue.extend constructor export interop.
  const options = typeof script === 'function' ? script.options : script
  // render functions
  if (template && template.render) {
    options.render = template.render
    options.staticRenderFns = template.staticRenderFns
    options._compiled = true
    // functional template
    if (isFunctionalTemplate) {
      options.functional = true
    }
  }
  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }
  let hook
  if (moduleIdentifier) {
    // server build
    hook = function(context) {
      // 2.3 injection
      context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        // eslint-disable-next-line no-undef
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (style) {
        style.call(this, createInjectorSSR(context))
      }
      // register component module identifier for async chunk inference
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (style) {
    hook = shadowMode
      ? function(context) {
        style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot))
      }
      : function(context) {
        style.call(this, createInjector(context))
      }
  }
  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      const originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      const existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }
  return script
}

/* script */
var __vue_script__ = script

/* template */

/* style */
// eslint-disable-next-line no-undef-init
var __vue_inject_styles__ = undefined
/* scoped */
// eslint-disable-next-line no-undef-init
var __vue_scope_id__ = undefined
/* module identifier */
// eslint-disable-next-line no-undef-init
var __vue_module_identifier__ = undefined
/* functional template */
// eslint-disable-next-line no-undef-init
var __vue_is_functional_template__ = undefined
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /* #__PURE__*/normalizeComponent(
  {},
  __vue_inject_styles__,
  __vue_script__,
  __vue_scope_id__,
  __vue_is_functional_template__,
  __vue_module_identifier__,
  false,
  undefined,
  undefined,
  undefined
)

function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true
  Vue.component(__vue_component__.name, __vue_component__)
}

var plugin = {
  install: install
}

var GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
}

if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}

if (GlobalVue) {
  GlobalVue.use(plugin)
}

export default plugin
