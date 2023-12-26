<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="580"
    :show-close="false"
    top="60px"
    class="resources-edit-modal"
    :before-close="handleClose"
    append-to-body
  >
    <div slot="title" class="edit-title">
      <div>{{ modalTitle }}</div>
    </div>

    <el-form ref="additionTagsForm" :model="additionTagsForm" :rules="additionTagsRules" label-position="left" label-width="130px" class="demo-Form demo-additionTagsForm">
      <el-form-item label="状态标记" prop="flag">
        <el-select v-model="additionTagsForm.flag" placeholder="请选择状态标记" clearable>
          <el-option v-if="isOption" label="HOT热销" value="#HOT">
            <span>
              <svg ref="svgElement" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;vertical-align: text-bottom;">
                <g id="Frame 3">
                  <path id="Vector" d="M12.6227 7.56441C12.3432 6.94579 11.9369 6.39057 11.4292 5.93347L11.0104 5.55573C10.9962 5.54331 10.979 5.5345 10.9605 5.53008C10.942 5.52566 10.9227 5.52575 10.9043 5.53036C10.8858 5.53497 10.8688 5.54394 10.8547 5.55651C10.8406 5.56907 10.8298 5.58485 10.8233 5.60245L10.6362 6.12999C10.5195 6.46181 10.3054 6.80008 10.0016 7.13272C9.98625 7.14906 9.9652 7.15913 9.94265 7.16091C9.93139 7.16188 9.92006 7.16048 9.9094 7.1568C9.89873 7.15312 9.88899 7.14724 9.88083 7.13956C9.87112 7.13118 9.8635 7.12072 9.85853 7.109C9.85357 7.09727 9.85139 7.08459 9.85217 7.07191C9.90539 6.21939 9.64623 5.25814 9.07878 4.21192C8.60959 3.34288 7.9578 2.66473 7.14306 2.19156L6.54858 1.84805C6.53065 1.83794 6.5103 1.83275 6.48963 1.83302C6.46897 1.83329 6.44875 1.83901 6.4311 1.84958C6.41345 1.86015 6.39901 1.87519 6.38928 1.89313C6.37956 1.91106 6.3749 1.93124 6.37581 1.95155L6.40733 2.63091C6.42903 3.09522 6.37458 3.50598 6.2448 3.84707C6.08635 4.26467 5.85913 4.65247 5.56844 5.00081C5.3661 5.2429 5.13675 5.46186 4.88471 5.65359C4.27775 6.1126 3.78424 6.70073 3.44111 7.37393C3.09879 8.05286 2.92043 8.80036 2.91992 9.55819C2.91992 10.2267 3.0538 10.8734 3.31869 11.4839C3.83682 12.671 4.8041 13.6134 6.01593 14.1115C6.6407 14.3693 7.30273 14.4993 7.98645 14.4993C8.67018 14.4993 9.33221 14.3689 9.95698 14.1128C10.5586 13.8665 11.1057 13.5073 11.5676 13.0553C12.0386 12.5987 12.4125 12.0545 12.6675 11.4544C12.9226 10.8543 13.0536 10.2102 13.053 9.5598C13.0542 8.8724 12.9076 8.19251 12.6227 7.56482V7.56441Z" fill="#F27500" />
                </g>
              </svg>
            </span>
            <span style="margin-left: 8px;">HOT热销</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="#TAG标记" required>
        <el-input v-model="additionTagsForm.flag" disabled></el-input>
      </el-form-item>
    </el-form>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button size="large" @click="resetForm">
        取消
      </el-button>
      <el-button
        type="primary"
        size="large"
        @click="submitForm"
      >
        提交
      </el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      modalTitle: '新增项',
      dialogVisible: false,
      AddTarget: '',
      isStatus: false,
      isOption: false,
      additionTagsForm: {
        flag: '',
        base64: '',
        content: ''
      },
      additionTagsRules: {
        flag: [
          { required: true, message: '请选择状态标记', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'additionTagsForm.flag': function(val) {
      if (!val) {
        this.additionTagsForm.base64 = null
        this.additionTagsForm.content = null
      }
      if (val === '#HOT') {
        this.additionTagsForm.content = 'HOT热销'
        this.convertSvgToBase64(this.$refs.svgElement)
          .then(base64String => {
            this.additionTagsForm.base64 = base64String
          })
          .catch(error => {
            console.error(error)
          })
      }
    }
  },
  methods: {
    getSVGcontent(refEle) {
      this.convertSvgToBase64(refEle)
        .then(base64String => {
          this.additionTagsForm.content = base64String
        })
        .catch(error => {
          console.error(error)
        })
    },
    convertSvgToBase64(SVG) {
      // 获取 SVG 元素
      const svgElement = SVG
      // 将 SVG 元素转换为 Blob 对象
      const svgBlob = new Blob([svgElement.outerHTML], { type: 'image/svg+xml' })
      // 通过 Blob 对象创建 URL
      const svgUrl = URL.createObjectURL(svgBlob)
      // 使用 fetch() 获取 SVG 文件的内容
      return fetch(svgUrl)
        .then(response => response.blob())
        .then(blob => {
          // 将 Blob 对象转换为 Base64 字符串
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64String = reader.result
              resolve(base64String)
            }
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
        })
    },
    resetForm() {
      this.dialogVisible = false
      this.additionTagsForm.flag = undefined
    },
    submitForm() {
      this.$refs.additionTagsForm.validate(valid => {
        if (!valid) return
        const val = {
          Target: this.AddTarget,
          tag: this.additionTagsForm
        }
        this.$emit('addTag-submit', val)
        this.dialogVisible = false
        this.additionTagsForm.flag = undefined
      })
    },
    conlog() {
      console.log('additionTagsForm', this.additionTagsForm)
    },
    show(val) {
      if (val) {
        if (val.isStatus) {
          this.isOption = false
          this.isStatus = val.isStatus
          this.AddTarget = val.AddTarget
        } else if (val.isOption) {
          this.isStatus = false
          this.isOption = val.isOption
          this.AddTarget = val.AddTarget
        }
      } else {
        this.isStatus = false
        this.isOption = false
        this.modalTitle = '新增项'
      }
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>
