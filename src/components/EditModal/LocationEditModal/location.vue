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
          v-model="formData.status"
          :disabled="disabled"
          active-color="#00BC4B"
          inactive-color="#EEEEEE"
          :width="48"
        />
        <div
          class="switch-label"
          :style="{ color: formData.status ? '#00BC4B' : '#ff4949' }"
        >{{ formData.status ? 'Active' : 'Inactive' }}</div>
      </div>
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
      ref="elForm"
      :model="formData"
      :rules="formRules"
      size="medium"
      class="edit-form"
      label-position="left"
      label-width="165px"
    >
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="Sample Service Provider Name"
          clearable
          :style="{ width: '50%' }"
        />
      </el-form-item>
      <el-form-item label="Site" prop="site">
        <el-select
          v-model="formData.site"
          placeholder="Select a site"
          clearable
          :style="{ width: '50%' }"
          disabled
        >
          <el-option
            v-for="(item, key) in siteOptions"
            :key="key"
            :label="item.label"
            :value="item.value"
          >{{ item.label }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Service Type" prop="serverType">
        <el-select
          v-model="formData.serverType"
          placeholder="Choose service type"
          clearable
          :style="{ width: '60%' }"
        >
          <el-option
            v-for="(item, key) in typeOptions"
            :key="key"
            :value="item.value"
          >{{ item.label }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Provider type" prop="tag">
        <el-select
          v-model="formData.tag"
          placeholder="Choose Service provider type"
          clearable
          :style="{ width: '60%' }"
        >
          <el-option
            v-for="(item, key) in tagOptions"
            :key="key"
            :value="item.value"
          >{{ item.label }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="PN" prop="serviceCall">
        <el-input
          v-model="formData.serviceCall"
          placeholder="1 (909) 2877111"
          clearable
          :style="{ width: '50%' }"
        />
      </el-form-item>
      <el-form-item label="Url" prop="website">
        <el-input
          v-model="formData.website"
          type="textarea"
          placeholder="Url"
          clearable
          :style="{ width: '50%' }"
        />
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="formData.address" type="textarea" placeholder="Address" clearable></el-input>
      </el-form-item>
      <el-form-item label="Positioning" prop="isLocated">
        <el-select
          v-model="formData.isLocated"
          placeholder="Choose open positioning or not"
          clearable
        >
          <el-option label="yes" :value="true"></el-option>
          <el-option label="no" :value="false"></el-option>
        </el-select>
        <br />
        <span
          style="font-size:12px;color:#aaa;"
        >** The positioning will be inactive if you choose No</span>
      </el-form-item>
      <el-form-item v-if="formData.isLocated" label="longitude" prop="longitude">
        <el-input-number
          v-model="formData.longitude"
          :min="-180"
          :max="180"
          placeholder="longitude"
          :controls="false"
          clearable
        ></el-input-number>
        <br />
        <span style="font-size:12px;color:#aaa;">** Longitude range -180 degrees to +180 degrees</span>
      </el-form-item>
      <el-form-item v-if="formData.isLocated" label="latitude" prop="latitude">
        <el-input-number
          v-model="formData.latitude"
          :min="-90"
          :max="90"
          placeholder="latitude"
          :controls="false"
          clearable
        ></el-input-number>
        <br />
        <span style="font-size:12px;color:#aaa;">** Range of latitude -90 degrees to +90 degrees</span>
      </el-form-item>
      <el-form-item label="Description" prop="introduction">
        <el-input
          v-model="formData.introduction"
          type="textarea"
          placeholder="Provider description"
          clearable
          :style="{ width: '50%' }"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="large" @click="resetForm">Cancel</el-button>
      <el-button type="primary" size="large" @click="submitForm">{{ isEdit ? 'Edit' : 'Add' }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateInstallerInfo, getTypeList } from '@/api/common'

export default {
  data() {
    return {
      modalTitle: 'Add Service Provider Information',
      disabled: true,
      isEdit: false,
      editId: '',
      site: '',
      ruleId: '',
      formData: {
        status: true,
        name: undefined,
        site: undefined,
        serviceCall: undefined,
        website: undefined,
        address: undefined,
        isLocated: undefined,
        latitude: undefined,
        longitude: undefined,
        introduction: undefined,
        serverType: undefined,
        tag: undefined
      },
      typeOptions: [],
      tagOptions: [],
      formRules: {
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        site: [
          {
            required: true,
            message: 'site is required',
            trigger: 'blur'
          }
        ],
        serverType: [
          {
            required: true,
            message: 'service type is required',
            trigger: 'blur'
          }
        ],
        tag: [
          {
            required: true,
            message: 'provider type is required',
            trigger: 'blur'
          }
        ],
        serviceCall: [
          { required: true, message: 'PN is required', trigger: 'blur' }
        ],
        isLocated: [
          {
            required: true,
            message: 'Choose open or close positioning',
            trigger: 'blur'
          }
        ],
        website: [
          { required: true, message: 'Select a site', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'address is required', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: 'latitude is required', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: 'longitude is required', trigger: 'blur' }
        ],
        introduction: [
          {
            required: true,
            message: 'Provider description is required',
            trigger: 'blur'
          }
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
          return (
            time.getFullYear() < yearRestriction ||
            time.getFullYear() > yearRestriction
          )
        }
      }
    }
  },
  watch: {
    'formData.isLocated': function(val) {
      if (!val) {
        this.formData.latitude = null
        this.formData.longitude = null
        this.formData.status = false
      } else {
        this.formData.status = true
      }
    }
  },
  methods: {
    getSite(site) {
      this.site = site
    },
    show(item) {
      this.initserverType()
      this.initserverTag()
      if (item) {
        this.editId = item.id
        this.isEdit = item.isEdit
        this.modalTitle = 'Edit' + item.name
        this.formData = {
          ...item
        }
      } else {
        this.formData = {
          status: true,
          name: undefined,
          site: undefined,
          serviceCall: undefined,
          website: undefined,
          address: undefined,
          latitude: undefined,
          longitude: undefined,
          introduction: undefined,
          serverType: undefined,
          tag: undefined
        }
        this.formData.site = this.site
        this.modalTitle = 'Add Service Provider Information'
        this.isEdit = false
      }
      this.dialogVisible = true
    },
    initserverType() {
      const params = {
        dictType: 'LOCATOR_SERVER_TYPE'
      }
      getTypeList(params).then((res) => {
        this.typeOptions = res.data.map((item) => ({
          value: item.dictItemValue,
          label: item.dictItemName
        }))
      })
    },
    initserverTag() {
      const params = {
        dictType: 'LOCATOR_TAG'
      }
      getTypeList(params).then((res) => {
        this.tagOptions = res.data.map((item) => ({
          value: item.dictItemValue,
          label: item.dictItemName
        }))
      })
    },
    handleClose(done) {
      this.$confirm('Confirm shutdown?')
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
          ...this.formData
        }
        updateInstallerInfo(params).then(() => {
          this.$message({
            message: 'Add Success',
            type: 'success'
          })
          this.$emit('addSuccess')

          this.resetForm()
        })
      })
    },
    resetForm() {
      this.id = undefined
      this.modalTitle = 'Add Service Provider Information'
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
