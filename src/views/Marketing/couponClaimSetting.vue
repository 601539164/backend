<template>
  <div class="couponClaimSetting-page">
    <el-form
      ref="formLabelAlign"
      v-loading="loading"
      label-position="left"
      label-width="150px"
      :model="formLabelAlign"
      :rules="formRules"
    >
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="formLabelAlign.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="生效优惠券码" prop="couponCode">
        <el-input v-model="formLabelAlign.couponCode"></el-input>
      </el-form-item>
      <el-form-item label="邮件调用模板" prop="emailTemplateId">
        <el-select v-model="formLabelAlign.emailTemplateId" placeholder="请选择邮件模板" clearable>
          <el-option
            v-for="(item, key) in participationEmail"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券使用限制" required>
        <el-checkbox v-model="formLabelAlign.hasLimitCouponNumbers">限制优惠券使用总数</el-checkbox>
      </el-form-item>
      <el-form-item v-if="formLabelAlign.hasLimitCouponNumbers" prop="couponNumbers">
        <el-input v-model.number="formLabelAlign.couponNumbers" placeholder="填写最大优惠券使用数量"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="formLabelAlign.hasLimitPerPerson">每位用户使用优惠券有数量限制</el-checkbox>
      </el-form-item>
      <el-form-item v-if="formLabelAlign.hasLimitPerPerson" prop="perPersonNumbers">
        <el-input v-model.number="formLabelAlign.perPersonNumbers" placeholder="填写每为用户最大领取次数"></el-input>
      </el-form-item>
      <el-form-item label="活动时区" prop="timeZone">
        <el-select
          v-model="formLabelAlign.timeZone"
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
          v-model="formLabelAlign.activityTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <template>
          <el-radio v-model="formLabelAlign.status" :label="true">启用</el-radio>
          <el-radio v-model="formLabelAlign.status" :label="false">禁用</el-radio>
        </template>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="createCouponClaim()">{{ this.$route.params.id !== '00' ? '更新' : '创建' }}</el-button>
        <el-button type="info" @click="goToCouponClaim()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { saveCouponClaim, getCouponClaimDetail } from '@/api/marketing'
import { getEmailTemplatelist } from '@/api/emailTemplate'

export default {
  data() {
    return {
      loading: false,
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
      participationEmail: [],
      formLabelAlign: {
        id: '',
        name: '',
        couponCode: '',
        emailTemplateId: '',
        hasLimitCouponNumbers: false,
        couponNumbers: '',
        hasLimitPerPerson: false,
        perPersonNumbers: '',
        timeZone: '',
        activityTime: [],
        status: true
      },
      formRules: {
        name: [
          { required: true, message: '请填写活动名称', trigger: 'blur' }
        ],
        couponCode: [
          { required: true, message: '请填写优惠券码', trigger: 'blur' }
        ],
        emailTemplateId: [
          { required: true, message: '请选择邮件模板', trigger: 'change' }
        ],
        couponNumbers: [
          { required: true, message: '请填写最大优惠券使用数量', trigger: 'blur' },
          { type: 'number', min: 1, message: '请填写不能低于1的数字', trigger: 'blur' }
        ],
        perPersonNumbers: [
          { required: true, message: '请填写每为用户最大领取次数', trigger: 'blur' },
          { type: 'number', min: 1, message: '请填写不能低于1的数字', trigger: 'blur' }
        ],
        timeZone: [
          { required: true, message: '请选择时区', trigger: 'change' }
        ],
        activityTime: [
          { type: 'array', required: true, message: '请选择活动有效时间', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择活动活动状态', trigger: 'blur' }
        ]
      },
      tempRoute: {}
    }
  },
  watch: {
    'formLabelAlign.hasLimitCouponNumbers': function(val) {
      if (!val) {
        this.formLabelAlign.couponNumbers = ''
      }
    },
    'formLabelAlign.hasLimitPerPerson': function(val) {
      if (!val) {
        this.formLabelAlign.perPersonNumbers = ''
      }
    }
  },
  created() {
    const id = this.$route.params.id // 获取路由参数中的 ID
    const name = id !== '00' ? `details-${id}` : 'details' // 根据 ID 生成页面标题
    document.title = name // 设置页面标题
    const title = id !== '00' ? `活动详情-${id}` : '创建活动'

    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: title })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题
  },
  mounted() {
    this.getEmail()
    if (this.$route.params.id) {
      this.getCouponClaimDetails()
    }
  },
  methods: {
    getEmail() {
      const params = {
        size: 30,
        currentPage: 1
      }
      getEmailTemplatelist(params).then((res) => {
        const EmailData = []
        res.data.temps.forEach((item) => {
          EmailData.push({
            label: item.tempName,
            value: item.id
          })
        })
        this.participationEmail = EmailData
      })
    },
    getCouponClaimDetails() {
      if (this.$route.params.id !== '00') {
        const params = {
          activityId: this.$route.params.id
        }
        getCouponClaimDetail(params).then((res) => {
          const row = res.data
          const beginTime = this.transferDate(row.beginTime, row.timeZone)
          const endTime = this.transferDate(row.endTime, row.timeZone)
          this.formLabelAlign = {
            ...row,
            activityTime: [beginTime, endTime]
          }
        })
      }
    },
    // 时间结合时区，转成时间戳
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
    // 时间戳转换格式
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
    },
    createCouponClaim() {
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          const data = {
            ...this.formLabelAlign,
            beginTime: this.computedDiffTimeZoneDate(this.formLabelAlign.activityTime[0], this.formLabelAlign.timeZone) / 1000,
            endTime: this.computedDiffTimeZoneDate(this.formLabelAlign.activityTime[1], this.formLabelAlign.timeZone) / 1000
          }
          saveCouponClaim(data).then(response => {
            this.$message({
              type: 'success',
              message: this.$route.params.id !== '00' ? '更新成功' : '创建成功'
            })
            this.formLabelAlign = {
              id: '',
              name: '',
              couponCode: '',
              emailTemplateId: '',
              hasLimitCouponNumbers: false,
              couponNumbers: '',
              hasLimitPerPerson: false,
              perPersonNumbers: '',
              timeZone: '',
              activityTime: [],
              status: true
            }
            this.goToCouponClaim()
          })
        }
      })
    },
    goToCouponClaim() {
      this.$router.push('/marketing/couponClaim')
    }
  }
}
</script>

<style lang="scss" scoped>
    .couponClaimSetting-page{
      padding: 20px;
      .flextype{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .EmailPreviewContent{
        color: #000 !important;
      }
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
</style>
