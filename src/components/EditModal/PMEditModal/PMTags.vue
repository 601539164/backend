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
      <div class="switch-title">
        <el-switch
          v-model="TagForm.enabled"
          active-color="#00BC4B"
          inactive-color="#EEEEEE"
          :width="48"
        />
        <div
          class="switch-label"
          :style="{ color: TagForm.enabled ? '#00BC4B' : '#ff4949' }"
        >
          {{ TagForm.enabled ? 'Active' : 'Inactive' }}
        </div>
      </div>
    </div>
    <div v-if="isEdit" style="text-align: right;color: #D8D8D8;">
      <i class="el-icon-refresh"></i> <span>更新时间：{{ syncTs }}</span>
    </div>
    <div
      style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
    />

    <el-form
      ref="TagForm"
      :model="TagForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="标记名称" prop="name">
        <el-input v-model="TagForm.name"></el-input>
      </el-form-item>
      <el-form-item label="标记参数" prop="flag">
        <el-input v-model="TagForm.flag" placeholder="要求首字符为 #，第二个字符为英文大写字母，例：#Tag"></el-input>
      </el-form-item>
      <div
        style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
      />
      <el-form-item
        label="关联商品"
        prop="skus"
        class="inputform"
      >
        <Tourproduct :tags="TagForm.skus" :is-type="isType" :isedit="!isdisabled" @handle-Update="handleUpdate" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="large" @click="cancel">
        取消
      </el-button>
      <el-button type="primary" size="large" @click="save">
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import Tourproduct from '@/components/EditForm/RMListing/tourproduct.vue'
import { refreshTag } from '@/api/productManagement'

export default {
  components: {
    Tourproduct
  },
  props: {
    isdisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalTitle: '创建标记Tag',
      site: '',
      isType: 'tag',
      formData: {},
      isEdit: false,
      syncTs: '',
      dialogVisible: false,
      TagForm: {
        enabled: '',
        name: '',
        flag: '',
        skus: []
      }
    }
  },
  computed: {
    rules() {
      return {
        flag: [
          {
            required: true,
            validator: this.flagValidate,
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入标记名称',
            trigger: 'blur'
          }
        ],
        skus: [
          {
            required: true,
            message: '请输入产品sku',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    flagValidate(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入标记参数'))
      } else {
        if (value.length < 3) {
          callback(new Error('至少填写3个字符'))
        }
        const firstChar = value.charAt(0)
        const secondChar = value.charAt(1)
        if (firstChar === '#' && /^[A-Z]$/.test(secondChar)) {
          callback()
        } else {
          callback(new Error('第一个字符必须为 #，第二个字符必须为英文大写字母'))
        }
      }
    },
    show(item) {
      if (item) {
        this.isEdit = true
        this.syncTs = item.updatedTime.replace('T', ' ')
        this.TagForm = {
          ...item,
          enabled: item.enabled === 1,
          skus: item.skus ? item.skus : []
        }
        this.modalTitle = item.name
      } else {
        this.isEdit = false
        this.TagForm = {
          enabled: false,
          name: undefined,
          flag: undefined,
          skus: []
        }
        this.modalTitle = '创建标记#Tag'
      }
      this.dialogVisible = true
    },
    handleUpdate(tagsGroup) {
      this.TagForm.skus = tagsGroup.map(s => s)
    },
    handleClose(done) {
      this.$confirm('确认关闭?')
        .then((_) => {
          done()
        })
        .catch((_) => { })
    },
    cancel() {
      this.$confirm('确认取消?')
        .then((_) => {
          this.dialogVisible = false
        })
        .catch((_) => { })
    },
    save() {
      this.$refs['TagForm'].validate((valid) => {
        if (valid) {
          const TagForm = {
            id: this.isEdit ? this.TagForm.id : '',
            name: this.TagForm.name,
            flag: this.TagForm.flag,
            skus: this.TagForm.skus,
            enabled: this.TagForm.enabled === true ? 1 : 0
          }
          refreshTag(TagForm).then(() => {
            this.$message({
              type: 'success',
              message: this.isEdit ? '修改成功' : '创建成功'
            })
            this.dialogVisible = false
            this.$emit('refresh')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
.dialog-footer {
    display: flex;
    justify-content: space-between;
}
</style>
