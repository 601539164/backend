<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="580"
    :show-close="false"
    top="60px"
    class="resources-edit-modal"
    :before-close="handleClose"
  >
    <div slot="title" class="edit-title">
      <div>{{ modalTitle }}</div>
    </div>

    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      class="edit-form"
      label-position="left"
      label-width="140px"
    >
      <div v-if="isPreview" class="preview-mask"></div>
      <el-form-item label="所属页面" prop="page">
        <el-select
          v-model="formData.page"
          placeholder="所属页面"
          clearable
        >
          <el-option
            v-for="(item, key) in AdvPageOptions"
            :key="key"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
        <br v-if="pageShow" /><span v-if="pageShow" style="font-size:12px;color:#aaa;">** 当前选中显示为参数，请以下拉选项名称为准</span>
      </el-form-item>
      <el-form-item label="所属分类" prop="advType">
        <el-select
          v-model="formData.advType"
          placeholder="所属分类"
          clearable
        >
          <el-option
            v-for="(item, key) in AdvTypeOptions"
            :key="key"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
        <br v-if="advTypeShow" /><span v-if="advTypeShow" style="font-size:12px;color:#aaa;">** 当前选中显示为参数，请以下拉选项名称为准</span>
      </el-form-item>
      <el-form-item label="广告位名称" prop="advName">
        <el-input
          v-model="formData.advName"
          placeholder="请输入广告位名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="显示状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题" prop="pcTitle">
        <el-input
          v-model="formData.pcTitle"
          placeholder="请输入PC端标题"
          clearable
        />
        <br /><span style="font-size:12px;color:#aaa;">** 移动端标题请做到图片上</span>
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input
          v-model="formData.link"
          placeholder="请输入跳转链接"
          clearable
        />
      </el-form-item>
      <el-form-item label="链接文案" prop="linkText">
        <el-input
          v-model="formData.linkText"
          placeholder="请输入链接文案"
          clearable
        />
      </el-form-item>
      <el-form-item label="PC图片" prop="pcImage">
        <el-input
          v-model="formData.pcImage"
          placeholder="请输入图片链接"
          clearable
        />
      </el-form-item>
      <el-form-item label="M端图片" prop="mImage">
        <el-input
          v-model="formData.mImage"
          placeholder="请输入图片链接"
          clearable
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
      :class="{ previewFoot: isPreview }"
    >
      <el-button size="large" @click="resetForm">
        取消
      </el-button>
      <el-button
        v-if="!isPreview"
        type="primary"
        size="large"
        @click="submitForm"
      >
        {{ isEdit ? '编辑' : '创建' }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addAdv,
  updateAdv,
  getAdvType
} from '@/api/resources'
export default {
  data() {
    return {
      modalTitle: '添加广告位',
      isPreview: false,
      isEdit: false,
      editId: '',
      formData: {
        page: undefined,
        advType: undefined,
        advName: undefined,
        status: 0,
        pcTitle: undefined,
        link: undefined,
        linkText: undefined,
        pcImage: undefined,
        mImage: undefined
      },
      AdvPageOptions: [],
      AdvTypeOptions: [],
      dialogVisible: false,
      pageShow: false,
      advTypeShow: false
    }
  },
  computed: {
    rules() {
      return {
        page: [
          {
            required: true,
            message: '请选择所属页面',
            trigger: 'change'
          }
        ],
        advType: [
          {
            required: true,
            message: '请选择所属分类',
            trigger: 'change'
          }
        ],
        advName: [
          {
            required: true,
            message: '请输入广告位名称',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择显示状态',
            trigger: 'blur'
          }
        ],
        pcTitle: [
          {
            required: true,
            message: '请填写标题',
            trigger: 'blur'
          }
        ],
        link: [
          {
            required: true,
            message: '请填写跳转链接',
            trigger: 'blur'
          }
        ],
        linkText: [
          {
            required: true,
            message: '请填写链接文案',
            trigger: 'blur'
          }
        ],
        pcImage: [
          {
            required: true,
            message: '请填写PC端图片链接',
            trigger: 'blur'
          }
        ],
        mImage: [
          {
            required: true,
            message: '请填写M端图片链接',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    'formData.page': function(val) {
      if (!val) {
        this.pageShow = false
        this.formData.advType = undefined
        this.AdvTypeOptions = []
      } else {
        this.pageShow = true
        getAdvType().then((res) => {
          res.data.map((item) => {
            if (item.page === val) {
              const data = item.type
              this.AdvTypeOptions = Object.keys(data).map(function(key) {
                return {
                  label: key,
                  value: data[key]
                }
              })
            }
          })
        })
      }
    },
    'formData.advType': function(val) {
      if (val) {
        this.advTypeShow = true
      } else {
        this.advTypeShow = false
      }
    }
  },
  mounted() {
    getAdvType().then((res) => {
      this.AdvPageOptions = res.data.map((item) => ({
        value: item.page,
        label: item.pageName
      }))
    })
  },
  methods: {
    show(item) {
      if (item) {
        this.editId = item.id
        this.formData = {
          page: item.page,
          advType: item.advType,
          advName: item.advName,
          status: item.status,
          pcTitle: item.pcTitle,
          link: item.link,
          linkText: item.linkText,
          pcImage: item.pcImage,
          mImage: item.mImage
        }
        if (item.isEdit) {
          this.modalTitle = '编辑广告位'
          this.isEdit = item.isEdit
        }
      } else {
        this.formData = {
          page: undefined,
          advType: undefined,
          advName: undefined,
          status: 0,
          pcTitle: undefined,
          link: undefined,
          linkText: undefined,
          pcImage: undefined,
          mImage: undefined
        }
        this.isEdit = false
        this.isPreview = false
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['elForm'].clearValidate()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    submitForm() {
      this.$refs['elForm'].validate((valid) => {
        if (!valid) return
        // TODO 提交表单
        const params = {
          page: this.formData.page,
          advType: this.formData.advType,
          advName: this.formData.advName,
          status: this.formData.status,
          pcTitle: this.formData.pcTitle,
          link: this.formData.link,
          linkText: this.formData.linkText,
          pcImage: this.formData.pcImage,
          mImage: this.formData.mImage
        }
        if (this.isEdit) {
          params.id = this.editId
          params.site = this.site
          updateAdv(params).then(() => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$emit('addSuccess')
            this.resetForm()
          })
          return
        }
        addAdv(params).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('addSuccess')
          this.resetForm()
        })
      })
    },
    resetForm() {
      this.id = undefined
      this.isPreview = false
      this.modalTitle = '添加广告位'
      this.$refs['elForm'].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  background-color: transparent;
  cursor: not-allowed;
}
.edit-form {
  position: relative;
}
.edit-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .switch-title {
    display: flex;
    width: 100px;
    align-items: center;
    .switch-label {
      text-align: right;
      font-size: 14px;
      margin-left: 10px;
      font-weight: 500;
    }
  }
}
.slot-subtitle {
  position: absolute;
  top: -40px;
  right: 20px;
  color: #adadad;
  font-size: 12px;
  // margin-left: -100%;
  // width: 100px;
}
.slot-list {
  position: relative;
  margin-top: 45px;
  border-bottom: solid 1px #eee;
  .slot-item {
    border-top: solid 1px #eee;
  }
  .havebg {
    background-color: #fafafa;
  }
}
.have-save-slot {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  position: relative;
  .no {
    color: #adadad;
    font-size: 12px;
    flex-shrink: 0;
  }
  .image {
    width: 64px;
    height: auto;
    margin-left: 20px;
  }
  .slot-text {
    color: #adadad;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 60%;
    margin-left: 20px;
  }
  .edit-slot {
    margin-left: 20px;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.no-save-slot {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  position: relative;
  .slot-upload {
    position: absolute;
    z-index: 9;
    opacity: 0;
    width: 0;
    height: 0;
  }
  // justify-content: space-between;
  .no {
    color: #adadad;
    font-size: 12px;
    flex-shrink: 0;
  }
  .el-button {
    position: relative;
    z-index: 10;
    margin-left: 20px;
  }
  .el-input {
    position: relative;
    z-index: 10;
    flex-grow: 1;
    margin-left: 25px;
    font-size: 12px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
  .el-button {
    width: 148px;
  }
}

.previewFoot {
  justify-content: center;
}
</style>
<style lang="scss">
.resources-edit-modal {
  .el-form {
    border-bottom: 1px solid #eee;
  }
  .el-switch {
    .el-switch__core {
      border-radius: 4px;
      height: 24px;
      line-height: 24px;
      &:after {
        top: 3px;
        left: 3px;
        // right: 2px;
        // margin-left: -19px;
        border-radius: 2px;
      }
    }
  }
  .is-checked {
    .el-switch__core {
      &:after {
        left: 100%;
        margin-left: -19px !important;
      }
    }
  }
}
.slot-form-item {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
