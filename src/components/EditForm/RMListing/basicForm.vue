<template>
  <el-form ref="basicForm" :model="basicForm" :rules="basicRules" :disabled="isdisabled" label-position="left" label-width="130px" class="demo-Form demo-basicForm">
    <el-form-item label="页面名称" prop="name">
      <el-input v-model="basicForm.name" clearable></el-input>
    </el-form-item>
    <el-form-item label="页面类型" prop="type">
      <el-input v-model="basicForm.type" clearable disabled>
      </el-input>
    </el-form-item>
    <el-form-item label="页面模板" prop="templateVersion">
      <el-input v-model="basicForm.templateVersion" clearable disabled>
      </el-input>
    </el-form-item>
    <el-form-item label="活动时区" prop="timeZone">
      <el-select
        v-model="basicForm.timeZone"
        placeholder="请选择时区"
        clearable
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
    <el-form-item label="生效时间" prop="activityTime">
      <el-date-picker
        v-model="basicForm.activityTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item
      label="关联产品"
      prop="skus"
      class="inputform"
    >
      <Tourproduct :tags="basicForm.skus" :is-type="isType" :isedit="!isdisabled" @handle-Update="handleUpdate" />

    </el-form-item>
  </el-form>
</template>
<script>
import Tourproduct from '@/components/EditForm/RMListing/tourproduct.vue'
import dayjs from 'dayjs'
import {
  listingSKUCheck
} from '@/api/resources'

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
      isType: 'listing',
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
      basicForm: {
        id: null,
        name: '',
        templateVersion: 'new-product-description',
        activityTime: [],
        timeZone: '',
        type: 'Listing',
        skus: []
      },
      basicRules: {
        skus: [
          { required: true, message: '请输入产品sku', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入页面名称', trigger: 'blur' }
        ],
        templateVersion: [
          { required: true, message: '请输入页面模板', trigger: 'blur' }
        ],
        activityTime: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择活动类型', trigger: 'blur' }
        ],
        timeZone: [
          { required: true, message: '请选择时区', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleUpdate(tagsGroup) {
      this.basicForm.skus = tagsGroup
    },
    conlog() {
      console.log('basicForm', this.basicForm)
    },
    checkSKU() {
      const skusInfo = {
        id: this.basicForm.id,
        beginTime: this.computedDiffTimeZoneDate(this.basicForm.activityTime[0], this.basicForm.timeZone),
        endTime: this.computedDiffTimeZoneDate(this.basicForm.activityTime[1], this.basicForm.timeZone),
        skus: this.basicForm.skus
      }
      listingSKUCheck(skusInfo).then((res) => {
        let isCheckSKU = false
        if (res.data.length > 0) {
          isCheckSKU = false
          let allSKU = ''
          for (let i = 0; i < res.data.length; i++) {
            const eleSKU = res.data[i].skuName
            allSKU += eleSKU
            const skuIndex = this.basicForm.skus.indexOf(eleSKU)
            if (skuIndex !== -1) {
              this.basicForm.skus.splice(skuIndex, 1)
            }
          }
          setTimeout(() => {
            this.$message({
              type: 'warning',
              message: `存在配置过模板的SKU：${allSKU}，已将其删除！`
            })
          }, 50)
          // console.log('isCheckSKU false', isCheckSKU)
          return isCheckSKU
        } else {
          isCheckSKU = true
          // console.log('isCheckSKU true', isCheckSKU)
          return isCheckSKU
        }
        // console.log('isCheckSKU all', isCheckSKU)
      })
    },
    pushData() {
      return this.basicForm
    },
    getData(data) {
      if (data) {
        this.basicForm = {
          id: data.id,
          name: data.name,
          templateVersion: data.templateVersion,
          activityTime: [this.transferDate(data.beginTime, data.timeZone), this.transferDate(data.endTime, data.timeZone)],
          timeZone: data.timeZone,
          type: data.type,
          skus: data.skus
        }
      }
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
    transferDate(itemTime, active_time_zone) {
      const currentTimeZone = dayjs().utcOffset() / 60
      const timezoneUnit = 3600000
      // 服务器保存的是先减去当前时区再加上时区的时间
      // 本地显示的是先减去选择的时间再加上当前时区
      const timeZoneNum = this.getNum(active_time_zone) * timezoneUnit
      const currentTimeZoneNum = currentTimeZone * timezoneUnit
      const transferTime = dayjs(
        itemTime * 1000 + timeZoneNum - currentTimeZoneNum
      ).format('YYYY-MM-DD HH:mm:ss')
      return transferTime
    },
    // 截取字符串中的数字包含正负号
    getNum(str) {
      const reg = /-?\d+/g
      const res = str.match(reg)
      return res[0]
    }
  }
}
</script>
