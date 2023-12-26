<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="580"
    :show-close="false"
    top="60px"
    class="resources-setting-edit-modal"
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
      style="padding: 0 15px 150px 15px"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="站点" prop="sites">
        <el-select
          v-model="formData.sites"
          placeholder="选择站点"
          clearable
          multiple
          :style="{ width: '60%' }"
        >
          <el-option
            v-for="(item, key) in sitesOptions"
            :key="key"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="请选择资源类分类"
          clearable
          :style="{ width: '60%' }"
        >
          <el-option
            v-for="(item, key) in typeOptions"
            :key="key"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="请输入类型码"
          clearable
          :style="{ width: '60%' }"
        />
      </el-form-item>
      <el-form-item label="slot数量" prop="slot">
        <el-input
          v-model="formData.slot"
          placeholder="请输入slot数量"
          clearable
          :style="{ width: '60%' }"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="large" @click="resetForm">取 消</el-button>
      <el-button type="primary" size="large" @click="submitForm">
        创建
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getResourcesTypeList,
  getUserSiteList,
  addResourcesSetting,
  updateResourcesSetting
} from '@/api/resources'
export default {
  props: {
    modalTitle: {
      type: String,
      default: '创建类型规则'
    }
  },
  data() {
    return {
      id: undefined,
      slotNum: 4,
      formData: {
        sites: [],
        type: undefined,
        code: undefined,
        slot: 1
      },
      rules: {
        sites: [
          {
            required: true,
            type: 'array',
            message: '请选择站点',
            trigger: 'change'
          }
        ],
        slot: [
          {
            required: true,
            message: '请输入slot数量',
            trigger: 'change'
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '请输入大于0的数字',
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择资源类分类',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入类型码',
            trigger: 'blur'
          }
        ]
      },
      sitesOptions: [],
      typeOptions: [],
      dialogVisible: false
    }
  },
  mounted() {
    getUserSiteList().then((res) => {
      this.sitesOptions = res.data.map((item) => {
        return {
          label: item,
          value: item
        }
      })
    })
    getResourcesTypeList().then((res) => {
      this.typeOptions = res.data.map((item) => {
        return {
          label: item,
          value: item
        }
      })
    })
  },
  methods: {
    show(row) {
      // console.log(row)
      if (row) {
        this.formData = {
          sites: row.effectiveSite,
          type: row.resLocationType,
          code: row.typeCode,
          slot: row.slotNum
        }
        this.id = row.id
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
        // console.log(this.formData)
        // TODO 提交表单
        // this.$emit('submit', this.formData)
        const params = {
          effectiveSite: this.formData.sites,
          resLocationType: this.formData.type,
          slotNum: this.formData.slot,
          typeCode: this.formData.code
        }
        if (this.id) {
          params.id = this.id
          updateResourcesSetting(params).then((res) => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.resetForm()
            this.$emit('submitOver')
          })
        } else {
          addResourcesSetting(params).then((res) => {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.resetForm()
            this.$emit('submitOver')
          })
        }
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
      this.formData = {
        sites: [],
        type: undefined,
        code: undefined,
        slot: 1
      }
      this.id = undefined
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-title {
  padding: 20px 0;
  border-bottom: solid 1px #eee;
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
  .el-button {
    width: 148px;
  }
}
</style>
<style lang="scss">
.resources-setting-edit-modal {
  .el-dialog__header {
    padding: 10px 20px 0 20px;
  }
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
