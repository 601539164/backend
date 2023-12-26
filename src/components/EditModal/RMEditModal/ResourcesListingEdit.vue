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
      <!-- <div class="switch-title">
        <el-switch
          v-model="formData.active"
          active-color="#00BC4B"
          :disabled="isPreview"
          inactive-color="#EEEEEE"
          :width="48"
        />
        <div
          class="switch-label"
          :style="{ color: formData.active ? '#00BC4B' : '#ff4949' }"
        >
          {{ formData.active ? 'Active' : 'Disabled' }}
        </div>
      </div> -->
    </div>

    <div style="background-color: #F5F7FA;border-radius: 4px;">
      <el-steps :active="active" finish-status="success" simple class="custom-steps">
        <el-step title="基础信息" description="配置 1"></el-step>
        <el-step title="模块配置" description="配置 2"></el-step>
      </el-steps>
    </div>
    <div v-show="active === id_basic" class="tableContainer">
      <BasicForm ref="BasicForm" :isdisabled="isPreview" />
    </div>
    <div v-show="active === id_participant" class="tableContainer">
      <ModuleForm ref="ModuleForm" :isdisabled="isPreview" />
    </div>

    <span
      slot="footer"
      class="dialog-footer"
      :class="{ previewFoot: isPreview }"
    >
      <div>
        <el-button size="large" @click="cancel">
          {{ isPreview ? '关闭' : '取消' }}
        </el-button>
        <el-button
          v-if="active > 0"
          @click="configurePre"
        >
          上一步
        </el-button>
      </div>
      <div style="margin-left: 10px;">
        <el-button
          v-if="active < 1"
          type="primary"
          @click="next"
        >
          下一步
        </el-button>
        <el-button
          v-if="!isPreview && active === 1"
          type="primary"
          size="large"
          @click="submitForm"
        >
          {{ isEdit ? '编辑' : '创建' }}
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import {
  addListingPage,
  getListingDetail
} from '@/api/resources'
import BasicForm from '@/components/EditForm/RMListing/basicForm.vue'
import ModuleForm from '@/components/EditForm/RMListing/moduleForm.vue'

export default {
  components: {
    BasicForm,
    ModuleForm
  },
  data() {
    return {
      modalTitle: '创建页面详情',
      active: 0,
      id_basic: 0,
      id_participant: 1,
      isPreview: false,
      isEdit: false,
      editId: '',
      // 枚举所有GMT时区，GMT+H 或GMT-H的格式
      timeZoneOptions: [
        {
          label: 'GMT-12',
          value: 'GMT-12',
          offset: -12
        },
        {
          label: 'GMT-11',
          value: 'GMT-11',
          offset: -11
        },
        {
          label: 'GMT-10',
          value: 'GMT-10',
          offset: -10
        },
        {
          label: 'GMT-9',
          value: 'GMT-9',
          offset: -9
        },
        {
          label: 'GMT-8',
          value: 'GMT-8',
          offset: -8
        },
        {
          label: 'GMT-7',
          value: 'GMT-7',
          offset: -7
        },
        {
          label: 'GMT-6',
          value: 'GMT-6',
          offset: -6
        },
        {
          label: 'GMT-5',
          value: 'GMT-5',
          offset: -5
        },
        {
          label: 'GMT-4',
          value: 'GMT-4',
          offset: -4
        },
        {
          label: 'GMT-3',
          value: 'GMT-3',
          offset: -3
        },
        {
          label: 'GMT-2',
          value: 'GMT-2',
          offset: -2
        },
        {
          label: 'GMT-1',
          value: 'GMT-1',
          offset: -1
        },
        {
          label: 'GMT+0',
          value: 'GMT+0',
          offset: 0
        },
        {
          label: 'GMT+1',
          value: 'GMT+1',
          offset: 1
        },
        {
          label: 'GMT+2',
          value: 'GMT+2',
          offset: 2
        },
        {
          label: 'GMT+3',
          value: 'GMT+3',
          offset: 3
        },
        {
          label: 'GMT+4',
          value: 'GMT+4',
          offset: 4
        },
        {
          label: 'GMT+5',
          value: 'GMT+5',
          offset: 5
        },
        {
          label: 'GMT+6',
          value: 'GMT+6',
          offset: 6
        },
        {
          label: 'GMT+7',
          value: 'GMT+7',
          offset: 7
        },
        {
          label: 'GMT+8',
          value: 'GMT+8',
          offset: 8
        },
        {
          label: 'GMT+9',
          value: 'GMT+9',
          offset: 9
        },
        {
          label: 'GMT+10',
          value: 'GMT+10',
          offset: 10
        },
        {
          label: 'GMT+11',
          value: 'GMT+11',
          offset: 11
        },
        {
          label: 'GMT+12',
          value: 'GMT+12',
          offset: 12
        }
      ],
      data_basicForm: {},
      data_moduleForm: {},
      DataForm: {},
      dialogVisible: false
    }
  },
  methods: {
    show(item) {
      if (item) {
        const data = {
          configId: item.id
        }
        getListingDetail(data).then((res) => {
          this.$refs.BasicForm.getData(res.data)
          this.$refs.ModuleForm.getData(res.data)
        })
        if (item.isPreview) {
          this.modalTitle = '预览' + item.name + '页面详情'
          this.isPreview = item.isPreview
          this.isEdit = false
        }
        if (item.isEdit) {
          this.modalTitle = '编辑' + item.name + '页面详情'
          this.isEdit = item.isEdit
          this.editId = item.id
          this.isPreview = false
        }
      } else {
        this.editId = null
        this.modalTitle = '创建页面详情'
        this.isEdit = false
        this.isPreview = false
      }
      this.dialogVisible = true
    },
    configurePre() {
      this.active--
    },
    next() {
      this.$refs.BasicForm.checkSKU()
      // 这有个BUG：checkSKU时如果所有的sku都被清空，会没办法检测到，需要用ischeckSKU返回的布尔值来判断，
      // 但是返回的值是没有经过处理的，不知道是不是for循环占据过多资源得原因，目前还没找到解决方案，先跳过
      // const isCheckSKU = this.$refs.BasicForm.checkSKU()
      // console.log("isCheckSKU wai ",isCheckSKU)
      // if (!isCheckSKU) return
      this.$refs.BasicForm.$refs['basicForm'].validate(valid => {
        if (!valid) return
        // if (isCheckSKU) {
        this.data_basicForm = this.$refs.BasicForm.pushData()
        // console.log('this.data_basicForm ', this.data_basicForm)
        this.active++
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: '请删除'
        //   })
        // }
      })
    },
    handleClose(done) {
      this.$confirm('将会丢失新增或修改的配置数据，确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    computedDiffTimeZoneDate(dateTime, timeZone) {
      const date = new Date(dateTime)
      const localTime = date.getTime()
      const localOffset = date.getTimezoneOffset() * 60000
      const utc = localTime - localOffset
      const offset = this.timeZoneOptions.find((e) => {
        return e.value === timeZone
      }).offset
      const gmtTime = utc - 3600000 * offset
      return gmtTime
    },
    submitForm() {
      const isEmpty = this.$refs.ModuleForm.isEmpty()
      if (isEmpty) {
        this.$message({
          type: 'error',
          message: '至少进行一个模块的配置'
        })
        return
      } else {
        this.$refs.ModuleForm.$refs['moduleForm'].validate((valid) => {
          if (!valid) return
          this.data_moduleForm = this.$refs.ModuleForm.pushData()
          this.DataForm = {
            id: this.editId,
            ...this.data_basicForm,
            beginTime: this.computedDiffTimeZoneDate(this.data_basicForm.activityTime[0], this.data_basicForm.timeZone) / 1000,
            endTime: this.computedDiffTimeZoneDate(this.data_basicForm.activityTime[1], this.data_basicForm.timeZone) / 1000,
            ...this.data_moduleForm,
            infoBar: {
              ...this.data_moduleForm.infoBar,
              targetTime: this.computedDiffTimeZoneDate(this.data_moduleForm.infoBar.targetTime, this.data_basicForm.timeZone) / 1000
            }
          }
          addListingPage(this.DataForm).then(() => {
            this.$message({
              message: this.isEdit ? '编辑成功' : '添加成功',
              type: 'success'
            })
            this.$emit('addSuccess')
            this.resetForm()
          })
        })
      }
    },
    cancel() {
      this.$confirm('将会丢失新增或修改的配置数据，确认关闭？')
        .then((_) => {
          this.dialogVisible = false
          this.active = 0
        })
        .catch((_) => {})
    },
    resetForm() {
      this.dialogVisible = false
      this.editId = null
      this.active = 0
      this.modalTitle = '创建页面详情'
    }
  }
}
</script>
  <style lang="scss" scoped>
  .tableContainer{
    padding: 10px;
    margin-top: 20px;
    max-height: calc(100vh - 363px );
    overflow-x: hidden;
  }
  .custom-steps {
    width: 400px; /* 设置定宽为 400px */
  }
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
