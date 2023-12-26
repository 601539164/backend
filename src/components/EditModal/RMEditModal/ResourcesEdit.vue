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
      </div>
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
      <el-form-item label="资源类分类" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="请选择资源类分类"
          clearable
          :style="{ width: '50%' }"
          @change="changeType"
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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入资源位名称"
          clearable
          :style="{ width: '50%' }"
        />
      </el-form-item>
      <el-form-item label="所属页面" prop="page">
        <el-input
          v-model="formData.page"
          placeholder="请输入所属页面"
          clearable
          :style="{ width: '50%' }"
        />
      </el-form-item>
      <el-form-item label="类型码" prop="code">
        <el-select
          v-model="formData.code"
          placeholder="请选择类型码"
          clearable
          :style="{ width: '50%' }"
          @change="changeCode"
        >
          <el-option
            v-for="(item, key) in codeOptions"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线端口" prop="resEndPoint">
        <el-checkbox-group v-model="formData.resEndPoint">
          <el-checkbox label="PC">PC端</el-checkbox>
          <el-checkbox label="M">M端</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="slot-form-item" label-width="100%" prop="slot">
        <template slot="label">
          <span>
            {{ 'Slot配置(共' + slotList.length + '个)' }}
            <!-- > -->
          </span>
        </template>
        <div class="slot-list">
          <div class="slot-subtitle">
            完成 {{ formData.slot.length }}/{{ slotList.length }}
          </div>
          <div
            v-for="(slot, key) in slotList"
            :key="key"
            :class="{ havebg: key % 2 === 1 }"
            class="slot-item"
          >
            <div v-if="slot.isEdit" class="no-save-slot">
              <div class="no">#{{ key + 1 }}</div>
              <el-button
                v-if="!slot.clickInput"
                size="mini"
                @click="changeToInputUrl(key)"
              >
                引用资源Url
              </el-button>
              <el-input
                v-else
                v-model="slot.url"
                size="mini"
                placeholder="请输入url"
              />
              <input
                :id="'upload' + key"
                type="file"
                accept="image/*"
                class="slot-upload"
                @input="uploadImage(key)"
              />
              <el-button v-if="formData.type !== 'NewRelease' && formData.type !== 'FeaturedProducts'" size="mini" @click="clickToUploadImage(key)">
                上传资源
              </el-button>
              <el-input v-model="slot.name" size="mini" placeholder="名称" />
              <el-input v-if="formData.type === 'NewRelease' || formData.type === 'FeaturedProducts'" v-model="slot.subName" size="mini" placeholder="描述" />
              <el-input
                v-model="slot.jumpUrl"
                size="mini"
                placeholder="跳转Url"
              />
              <el-button size="mini" type="text" @click="saveCurrentSlot(key)">
                保存
              </el-button>
            </div>
            <div v-else class="have-save-slot">
              <div class="no">#{{ key + 1 }}</div>
              <img :src="slot.url" class="image" />
              <div class="slot-text">{{ slot.name }}</div>
              <div class="slot-text">{{ slot.subName }}</div>
              <div class="slot-text">{{ slot.jumpUrl }}</div>
              <el-button
                size="mini"
                class="edit-slot"
                type="text"
                @click="editThisSlots(key)"
              >
                编辑
              </el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="时区" prop="timeZone">
        <el-select
          v-model="formData.timeZone"
          placeholder="请选择时区"
          clearable
          :style="{ width: '50%' }"
        >
          <el-option
            v-for="(item, key) in timeZoneOptions"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生效时间" prop="range">
        <el-date-picker
          v-model="formData.range"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :style="{ width: '100%' }"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          range-separator="至"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item> -->
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
      :class="{ previewFoot: isPreview }"
    >
      <el-button size="large" @click="resetForm">
        {{ isPreview ? '关闭' : '取消' }}
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
  getAvailableResourcesRule,
  uploadResourcesImg,
  addResources,
  updateResources
} from '@/api/resources'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      modalTitle: '创建资源位',
      isPreview: false,
      isEdit: false,
      editId: '',
      site: '',
      ruleId: '',
      formData: {
        type: undefined,
        name: undefined,
        page: undefined,
        code: undefined,
        range: null,
        active: true,
        slot: [],
        resEndPoint: [],
        timeZone: undefined
      },
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

      typeOptions: [],
      codeOptions: [],
      rulesInfo: {},
      slotList: [],
      dialogVisible: false
    }
  },
  computed: {
    rules() {
      return {
        slot: [
          {
            required: true,
            validator: this.slotValidate,
            trigger: 'change'
          }
        ],
        timeZone: [
          {
            required: true,
            message: '请选择所在时区',
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择资源类分类',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入资源位名称',
            trigger: 'blur'
          }
        ],
        page: [
          {
            required: true,
            message: '请输入所属页面',
            trigger: 'blur'
          }
        ],
        resEndPoint: [
          {
            required: true,
            message: '请选择类型码',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '请选择类型码',
            trigger: 'change'
          }
        ],
        range: [
          {
            required: true,
            message: '生效时间不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    getAvailableResourcesRule().then((res) => {
      // console.log(res)
      this.rulesInfo = res.data
      this.typeOptions = res.data.map((e) => {
        return {
          label: e.resLocationType,
          value: e.resLocationType
        }
      })
    })
  },

  methods: {
    // slot的验证
    slotValidate(rule, value, callback) {
      if (value.length !== this.slotList.length) {
        callback(new Error('请填写完slot信息并保存'))
      } else if (!value.length) {
        callback(new Error('请填写slot信息'))
      } else {
        callback()
      }
    },
    show(item) {
      if (item) {
        this.editId = item.id
        this.ruleId = item.ruleId
        if (item.isPreview) {
          this.isPreview = item.isPreview
          this.modalTitle = '预览资源位'
        }

        this.slotList = item.slots.map((e, i) => {
          return {
            id: i,
            isEdit: false,
            name: e.name,
            subName: e.subName,
            url: e.resourceUrl,
            jumpUrl: e.jumpUrl,
            clickInput: false
          }
        })
        this.formData.timeZone = item.timeZone
        this.formData = {
          type: item.resLocationType,
          name: item.resName,
          page: item.pageUrl,
          resEndPoint: item.resEndPoint || [],
          code: item.typeCode,
          range: [
            dayjs(this.computedDiffTimeZoneDate(item.startTime, item.timeZone)).format(
              'YYYY-MM-DD'
            ),
            dayjs(this.computedDiffTimeZoneDate(item.endTime, item.timeZone)).format(
              'YYYY-MM-DD'
            )
          ],
          active: item.effective === 1,
          slot: this.slotList.map((e) => {
            return { ...e }
          }),
          timeZone: item.timeZone
        }
        if (item.isEdit) {
          this.modalTitle = '编辑资源位'
          this.isEdit = item.isEdit
          this.site = item.site
          this.changeType()
        }
      } else {
        this.formData = {
          type: undefined,
          name: undefined,
          page: undefined,
          code: undefined,
          range: undefined,
          active: true,
          slot: [],
          resEndPoint: [],
          timeZone: undefined
        }
        this.slotList = []
        this.isEdit = false
        this.isPreview = false
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['elForm'].clearValidate()
      })
    },
    changeToInputUrl(index) {
      // console.log(index)
      this.slotList[index].clickInput = true
    },
    changeType(e) {
      const findData = this.rulesInfo.find(
        (e) => e.resLocationType === this.formData.type
      )
      this.codeOptions = findData.rules.map((e) => {
        return {
          label: e.typeCode,
          value: e.typeCode,
          ...e
        }
      })
      if (!e) return
      this.formData.code = undefined
      this.formData.slot = []
      this.slotList = []
    },
    changeCode() {
      const findData = this.codeOptions.find(
        (e) => e.typeCode === this.formData.code
      )
      this.slotList = []
      this.formData.slot = []
      if (!findData) return
      this.ruleId = findData.id
      for (let i = 0; i < findData.slotNum; i++) {
        // this.formData.slot.push('')
        this.slotList.push({
          id: i,
          isEdit: true,
          name: '',
          subName: '',
          url: '',
          jumpUrl: '',
          clickInput: false
        })
      }
    },
    saveCurrentSlot(index) {
      this.slotList[index].isEdit = false
      this.formData.slot[index] = {
        name: this.slotList[index].name,
        subName: this.slotList[index].subName,
        url: this.slotList[index].url,
        jumpUrl: this.slotList[index].jumpUrl
      }
    },
    editThisSlots(index) {
      this.slotList[index].isEdit = true
      if (this.isEdit) {
        this.slotList[index].clickInput = true
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
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
      // 用dayjs计算GMT-4时区的当前时间
      this.$refs['elForm'].validate((valid) => {
        if (!valid) return
        // TODO 提交表单
        const params = {
          effective: this.formData.active ? 1 : 0,
          endTs: this.computedDiffTimeZoneDate(this.formData.range[1], this.formData.timeZone) / 1000,
          pageUrl: this.formData.page,
          resEndPoint: this.formData.resEndPoint,
          resLocationType: this.formData.type,
          resName: this.formData.name,
          ruleId: this.ruleId,
          slots: this.formData.slot.map((e) => {
            return {
              name: e.name,
              subName: e.subName,
              resourceUrl: e.url,
              jumpUrl: e.jumpUrl
            }
          }),
          startTs: this.computedDiffTimeZoneDate(this.formData.range[0], this.formData.timeZone) / 1000,
          timeZone: this.formData.timeZone,
          typeCode: this.formData.code
        }
        if (this.isEdit) {
          params.id = this.editId
          params.site = this.site
          updateResources(params).then(() => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$emit('addSuccess')
            this.resetForm()
          })
          return
        }
        addResources(params).then(() => {
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
      this.modalTitle = '创建资源位'
      this.$refs['elForm'].resetFields()
      this.dialogVisible = false
    },
    uploadImage(index) {
      const uploadDom = document.getElementById('upload' + index)
      const file = uploadDom.files[0]
      const formData = new FormData()
      formData.append('file', file)
      uploadResourcesImg(formData).then((res) => {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.slotList[index].clickInput = true
        this.slotList[index].url = res.data
      })
    },
    clickToUploadImage(index) {
      const uploadDom = document.getElementById('upload' + index)
      uploadDom.click()
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
