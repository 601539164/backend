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
      :rules="formRules"
      size="medium"
      class="edit-form"
      label-position="left"
      label-width="140px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入资源位名称"
          clearable
          :style="{ width: '50%' }"
        />
      </el-form-item>
      <el-form-item label="年度" prop="annual">
        <el-date-picker
          v-model="formData.annual"
          type="year"
          value-format="yyyy"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属站点" prop="site">
        <el-select
          v-model="formData.site"
          placeholder="请选择所属站点"
          clearable
          :style="{ width: '50%' }"
          disabled
        >
          <el-option
            v-for="(item, key) in siteOptions"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用范围" prop="category">
        <el-select
          v-model="formData.category"
          placeholder="请选择使用范围"
          clearable
          :style="{ width: '50%' }"
        >
          <el-option label="shipping" value="shipping"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置类型" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="请选择配置类型"
          clearable
          :style="{ width: '50%' }"
        >
          <el-option label="holiday" value="holiday"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.annual" label="节假日" prop="holidayTimes">
        <el-date-picker
          v-model="formData.holidayTimes"
          type="dates"
          value-format="yyyy-MM-dd"
          placeholder="选择一个或多个日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <br /><span style="font-size:12px;color:#aaa;">** 时间可选范围与上面所配置的年度相关</span>
      </el-form-item>
      <el-form-item v-if="formData.annual" label="特定日" prop="specificTimes">
        <el-date-picker
          v-model="formData.specificTimes"
          type="dates"
          value-format="yyyy-MM-dd"
          placeholder="选择一个或多个日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <br /><span style="font-size:12px;color:#aaa;">** 时间可选范围与上面所配置的年度相关</span>
      </el-form-item>
      <el-form-item v-if="formData.annual" label="公休日" prop="publicTimes">
        <el-date-picker
          v-model="formData.publicTimes"
          type="dates"
          value-format="yyyy-MM-dd"
          placeholder="选择一个或多个日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <br /><span style="font-size:12px;color:#aaa;">** 时间可选范围与上面所配置的年度相关</span>
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
        {{ isEdit ? '编辑' : '创建' }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addHoliday } from '@/api/common'

export default {
  data() {
    return {
      modalTitle: '创建节假日配置',
      isEdit: false,
      editId: '',
      site: '',
      ruleId: '',
      formData: {
        name: undefined,
        annual: undefined,
        site: undefined,
        category: undefined,
        type: undefined,
        holidayTimes: [],
        specificTimes: [],
        publicTimes: [],
        totalTimes: []
      },
      formRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        annual: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        site: [
          { required: true, message: '请选择站点', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择适用范围', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择配置类型', trigger: 'blur' }
        ],
        holidayTimes: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      // 枚举站点site
      siteOptions: [
        {
          label: 'AU',
          value: 'AU'
        },
        {
          label: 'CA',
          value: 'CA'
        },
        {
          label: 'DE',
          value: 'DE'
        },
        {
          label: 'JP',
          value: 'JP'
        },
        {
          label: 'UK',
          value: 'UK'
        },
        {
          label: 'US',
          value: 'US'
        },
        {
          label: 'EU',
          value: 'EU'
        }
      ],
      dialogVisible: false
    }
  },
  computed: {
    pickerOptions() {
      const yearRestriction = this.formData.annual * 1
      return {
        disabledDate(time) {
          return time.getFullYear() < yearRestriction || time.getFullYear() > yearRestriction
        }
      }
    }
  },
  watch: {
    'formData.annual': function(val) {
      if (!val) {
        this.formData.holidayTimes = []
        this.formData.specificTimes = []
        this.formData.publicTimes = []
        this.formData.totalTimes = []
      } else {
        const oldAnnual = this.oldValue || ''
        if (oldAnnual === '') {
          this.formData.totalTimes = []
        } else if (val !== oldAnnual) {
          this.formData.holidayTimes = []
          this.formData.specificTimes = []
          this.formData.publicTimes = []
          this.formData.totalTimes = []
        }
        this.oldValue = val
      }
    }
  },
  methods: {
    getSite(site) {
      this.site = site
    },
    show(item) {
      if (item) {
        this.editId = item.id
        this.isEdit = item.isEdit
        this.modalTitle = '编辑' + item.name
        this.formData = {
          ...item
        }
      } else {
        this.formData = {
          name: undefined,
          annual: undefined,
          site: undefined,
          category: undefined,
          type: undefined,
          holidayTimes: [],
          specificTimes: [],
          publicTimes: [],
          totalTimes: []
        }
        this.formData.site = this.site
        this.modalTitle = '创建节假日配置'
        this.isEdit = false
      }
      this.dialogVisible = true
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
        this.formData.totalTimes = [...new Set([...this.formData.holidayTimes, ...this.formData.specificTimes, ...this.formData.publicTimes])]
        // TODO 提交表单
        const params = {
          ...this.formData,
          totalTimes: this.formData.totalTimes
        }
        addHoliday(params).then(() => {
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
      this.modalTitle = '创建节假日配置'
      this.isEdit = false
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
