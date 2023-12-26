<template>
  <el-form ref="basicForm" :model="basicForm" :rules="basicRules" label-position="left" label-width="130px" class="demo-Form demo-basicForm" :disabled="disabled">
    <el-form-item label="活动节点" prop="parent_id">
      <el-input v-model="basicForm.parent_id" clearable disabled></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="active_name">
      <el-input v-model="basicForm.active_name" clearable></el-input>
    </el-form-item>
    <el-form-item label="活动类型" prop="active_type">
      <el-select v-model="basicForm.active_type" placeholder="请选择活动类型">
        <el-option label="购后裂变" :value="1" :disabled="disabled_1"></el-option>
        <el-option label="开团" :value="2" :disabled="disabled_2"></el-option>
        <el-option label="购前裂变" :value="3" :disabled="disabled_3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="basicForm.active_type == '2'"
      label="开团商品"
      prop="group_skus"
      class="inputform"
    >
      <Tourproduct :tags="basicForm.group_skus" @handle-Update="handleUpdate" />
    </el-form-item>
    <el-form-item label="活动时区" prop="active_time_zone">
      <el-select
        v-model="basicForm.active_time_zone"
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
    <el-form-item label="活动生效时间" prop="activityTime">
      <el-date-picker
        v-model="basicForm.activityTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item v-if="basicForm.active_type == '1' || basicForm.active_type == '3'" label="活动图片链接（个人中心）" prop="active_image_url">
      <el-input v-model="basicForm.active_image_url" clearable></el-input>
      <br /><span style="font-size:12px;color:#aaa;">** 图片尺寸比例为1：1，重要文字信息居中显示（M端会进行裁切）</span>
    </el-form-item>
    <el-form-item label="活动规则" prop="active_rule_text">
      <el-input v-model="basicForm.active_rule_text" type="textarea" clearable></el-input>
      <br /><span style="font-size:12px;color:#aaa;">** 每条规则之间用英文分号(;)区分,不需要书写序号和换行</span>
    </el-form-item>
    <el-form-item v-if="basicForm.active_type !== 2" label="详情页是否展示" required class="frontLimit">
      <el-switch v-model="basicForm.is_active_display_product_page" prop="is_active_display_product_page" style="margin-right: 5px;"></el-switch>
      <div :style=" { color: basicForm.is_active_display_product_page ? '#2B7DE1' : '#DCDFE6' }">{{ basicForm.is_active_display_product_page ? '展示' : '不展示' }}</div>
    </el-form-item>
  </el-form>
</template>
<script>
import Tourproduct from '@/components/EditModal/IncentiveEdit/tourproduct.vue'
import dayjs from 'dayjs'

export default {
  components: {
    Tourproduct
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabled_1: false,
      disabled_2: false,
      disabled_3: false,
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
        parent_id: '根',
        active_name: '',
        active_image_url: '',
        activityTime: [],
        active_time_zone: '',
        active_rule_text: '',
        active_type: '',
        group_skus: [],
        is_active_display_product_page: true // 活动规则是否展示
      },
      basicRules: {
        parent_id: [
          { required: true, message: '请输入根节点活动', trigger: 'blur' }
        ],
        group_skus: [
          { required: true, message: '请输入产品sku', trigger: 'blur' }
        ],
        active_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        active_image_url: [
          { required: true, message: '请输入活动图片链接', trigger: 'blur' }
        ],
        activityTime: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'change' }
        ],
        active_type: [
          { required: true, message: '请选择活动类型', trigger: 'blur' }
        ],
        active_time_zone: [
          { required: true, message: '请选择时区', trigger: 'blur' }
        ],
        is_active_display_product_page: [
          { required: true, message: '请选择详情页是否展示', trigger: 'blur' }
        ],
        active_rule_text: [
          { required: true, message: '请输入活动规则', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'basicForm.active_type': function(val) {
      if (val === 1) {
        this.disabled_2 = true
        this.disabled_3 = true
      } else if (val === 2) {
        this.disabled_1 = true
        this.disabled_3 = true
      } else if (val === 3) {
        this.disabled_1 = true
        this.disabled_2 = true
      }
    }
  },
  methods: {
    handleUpdate(tagsGroup) {
      this.basicForm.group_skus = tagsGroup
    },
    conlog() {
      console.log('basicForm', this.basicForm)
    },
    pushData() {
      return this.basicForm
    },
    getData(data) {
      if (data) {
        this.basicForm = {
          parent_id: data.parent_id,
          active_name: data.active_name,
          //   activityTime: [dayjs(data.active_effect_time * 1000), dayjs(data.active_expired_time * 1000)],
          activityTime: [this.transferDate(data.active_effect_time, data.active_time_zone), this.transferDate(data.active_expired_time, data.active_time_zone)],
          active_type: data.active_type,
          group_skus: data.group_skus,
          active_time_zone: data.active_time_zone,
          active_image_url: data.active_image_url,
          active_rule_text: data.active_rule_text,
          is_active_display_product_page: data.is_active_display_product_page
        }
      }
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
