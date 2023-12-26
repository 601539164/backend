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

    <el-form ref="additionNoticeForm" :model="additionNoticeForm" :rules="additionNoticeRules" label-position="left" label-width="130px" class="demo-Form demo-additionNoticeForm">
      <el-form-item label="模块类型" prop="type">
        <el-select v-model="additionNoticeForm.type" placeholder="请选择模块类型" clearable>
          <el-option label="纯文本" value="text"></el-option>
          <el-option label="标题+描述文本" value="titleAndText" disabled></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.type == 'titleAndText'" label="信息标题" prop="title">
        <el-input v-model="additionNoticeForm.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="信息内容" prop="content">
        <el-input v-model="additionNoticeForm.content" clearable></el-input>
        <br /><span style="font-size:12px;color:#aaa;">** 信息内容+链接文本（链接标题/图标）的长度需小于52个字符（含空格），配合页面效果调整文案长度</span>
      </el-form-item>
      <el-form-item label="颜色系" prop="color">
        <el-select v-model="additionNoticeForm.color" placeholder="请选择颜色系" clearable>
          <el-option label="蓝色" value="#F1F7FF"></el-option>
          <el-option label="灰色" value="#F5F5F7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联动作" prop="action">
        <el-select v-model="additionNoticeForm.action" placeholder="请选择关联动作" clearable>
          <el-option label="跳转链接" value="link"></el-option>
          <el-option label="弹窗消息" value="alert"></el-option>
          <el-option label="无" value="none"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.action == 'link'" label="链接文本" prop="linkText">
        <el-input v-model="additionNoticeForm.linkText" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.action == 'link'" label="链接Url" prop="linkUrl">
        <el-input v-model="additionNoticeForm.linkUrl" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.action == 'alert'" label="弹窗类型" prop="alertType">
        <el-select v-model="additionNoticeForm.alertType" placeholder="请选择弹窗类型" clearable>
          <el-option label="图文" value="imgAndText" disabled></el-option>
          <el-option label="标题+描述文本" value="titleAndText"></el-option>
          <el-option label="图标+描述文本" value="iconAndText"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.alertType == 'iconAndText'" label="图标" prop="icon">
        <el-select v-model="additionNoticeForm.icon" placeholder="请选择图标" clearable>
          <el-option label="无" value="1" disabled></el-option>
          <el-option label="提示!" value="2" disabled></el-option>
          <el-option label="问号？" value="3"></el-option>
          <el-option label="信息i" value="4" disabled></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.alertType == 'imgAndText'" label="图片链接" prop="linkUrl">
        <el-input v-model="additionNoticeForm.linkUrl" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.alertType == 'titleAndText'" label="链接标题" prop="urlTitle">
        <el-input v-model="additionNoticeForm.urlTitle" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.action == 'alert'" label="弹窗标题" prop="alertTitle">
        <el-input v-model="additionNoticeForm.alertTitle" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="additionNoticeForm.action == 'alert'" label="弹窗内容" prop="linkText">
        <el-input v-model="additionNoticeForm.linkText" type="textarea" clearable></el-input>
        <br /><span style="font-size:12px;color:#aaa;">** 每条规则之间用英文分号(;)区分,不需要书写序号和换行</span>
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
        {{ isEdit ? '更新' : '提交' }}
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
      isEdit: false,
      index: 0,
      additionNoticeForm: {
        type: '',
        title: '',
        content: '',
        color: '',
        action: '',
        icon: '',
        linkText: '',
        alertTitle: '',
        linkUrl: '',
        alertType: '',
        urlTitle: ''
      },
      additionNoticeRules: {
        type: [
          { required: true, message: '请选择模块类型', trigger: 'change' }
        ],
        color: [
          { required: true, message: '请选择颜色系', trigger: 'change' }
        ],
        action: [
          { required: true, message: '请选择关联动作', trigger: 'change' }
        ],
        alertType: [
          { required: true, message: '请选择关联动作', trigger: 'change' }
        ],
        icon: [
          { required: true, message: '请选择图标', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请填写信息标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写信息内容', trigger: 'blur' }
        ],
        linkText: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        linkUrl: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        alertTitle: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        urlTitle: [
          { required: true, message: '请填写链接标题', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'additionNoticeForm.action': function(val) {
      if (val === 'none' || !val) {
        this.additionNoticeForm.linkText = null
        this.additionNoticeForm.linkUrl = null
        this.additionNoticeForm.alertType = null
      }
      if (val === 'link') {
        this.additionNoticeForm.alertType = null
      }
      if (val === 'alert') {
        this.additionNoticeForm.linkUrl = null
      }
    },
    'additionNoticeForm.alertType': function(val) {
      if (!val) {
        this.additionNoticeForm.icon = null
        this.additionNoticeForm.linkUrl = null
        this.additionNoticeForm.urlTitle = null
        this.additionNoticeForm.alertTitle = null
        this.additionNoticeForm.linkText = null
      }
      if (val === 'titleAndText') {
        this.additionNoticeForm.icon = null
      }
      if (val === 'iconAndText') {
        this.additionNoticeForm.urlTitle = null
      }
    }
  },
  methods: {
    resetForm() {
      this.$confirm('将会丢失新增或修改的配置数据，确认取消?')
        .then((_) => {
          this.dialogVisible = false
          this.isEdit = false
          this.$refs.additionNoticeForm.resetFields()
        })
        .catch((_) => {})
    },
    submitForm() {
      this.$refs.additionNoticeForm.validate(valid => {
        if (!valid) return
        const val = this.additionNoticeForm
        const editVal = {
          index: this.index,
          data: this.additionNoticeForm
        }
        if (this.isEdit) {
          this.$emit('updateNotice-submit', editVal)
          this.isEdit = false
        } else {
          this.$emit('addNotice-submit', val)
        }
        this.isEdit = false
        this.dialogVisible = false
        this.$refs.additionNoticeForm.resetFields()
      })
    },
    conlog() {
      console.log('additionNoticeForm', this.additionNoticeForm)
    },
    show(item) {
      if (item) {
        if (item.isEdit) {
          this.isEdit = item.isEdit
          this.index = item.index
          this.modalTitle = '#' + (this.index + 1) + '-notice'
          this.additionNoticeForm = item.notices
        } else {
          this.isEdit = false
          this.modalTitle = '新增项-notice'
          this.additionNoticeForm = item.notices
        }
      } else {
        this.additionNoticeForm = {
          type: '',
          title: '',
          content: '',
          color: '',
          action: '',
          icon: '',
          linkText: '',
          alertTitle: '',
          linkUrl: '',
          alertType: '',
          urlTitle: ''
        }
      }
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('将会丢失新增或修改的配置数据，确认关闭？')
        .then((_) => {
          this.$refs.additionNoticeForm.resetFields()
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>
