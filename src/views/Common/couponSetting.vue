<template>
  <div class="couponSetting-page">
    <el-form
      ref="formLabelAlign"
      v-loading="loading"
      label-position="left"
      label-width="150px"
      :model="formLabelAlign"
      :rules="formRules"
    >
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="formLabelAlign.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="优惠券码" prop="code">
        <el-input v-model="formLabelAlign.code" clearable></el-input>
      </el-form-item>
      <el-form-item label="游客优惠Code" prop="touristsCouponCode">
        <el-input v-model="formLabelAlign.touristsCouponCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="优惠券规则" prop="couponRuleExplain">
        <el-input v-model="formLabelAlign.couponRuleExplain" type="textarea" clearable></el-input>
        <br /><span style="font-size:12px;color:#aaa;">** 每条规则之间用英文分号(;)区分,不需要书写序号和换行</span>
      </el-form-item>
      <el-form-item label="折扣" prop="discountValue" class="rebates-switch">
        <el-input v-model.number="formLabelAlign.discountValue" clearable></el-input>
        <el-switch
          v-model="formLabelAlign.discountUnit"
          active-text="%"
          inactive-text="$"
          active-color="#2B7DE1"
          inactive-color="#2B7DE1"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="订单金额门槛" prop="orderAmountLimit" class="rebates-switch">
        <el-input v-model.number="formLabelAlign.orderAmountLimit" clearable></el-input>
        <span>$</span>
      </el-form-item>
      <el-form-item label="优惠券SKU限制" required class="frontLimit">
        <el-switch v-model="formLabelAlign.hasLimitSku" prop="hasLimitSku" style="margin-right: 5px;"></el-switch>
        <div :style=" { color: formLabelAlign.hasLimitSku ? '#2B7DE1' : '#DCDFE6' }">{{ formLabelAlign.hasLimitSku ? '是' : '否' }}</div>
      </el-form-item>
      <el-form-item v-if="formLabelAlign.hasLimitSku" prop="skus">
        <Tourproduct :tags="formLabelAlign.skus" @handle-Update="handleUpdate" />
      </el-form-item>
      <el-form-item label="奖励时区" prop="timeZone">
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
      <el-form-item label="奖励有效期" prop="award_time">
        <el-date-picker
          v-model="formLabelAlign.award_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <br /><span style="font-size:12px;color:#aaa;">** 有效期为起始日期的0时0分0秒开始，到结束日期的0时0分0秒结束（即不包含所选结束日期当天）</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="createCoupon()">{{ this.$route.params.id !== '00' ? '更新' : '创建' }}</el-button>
        <el-button type="info" @click="goToCoupon()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { saveCoupon, getCouponDetail } from '@/api/common'
import Tourproduct from '@/components/EditModal/IncentiveEdit/tourproduct.vue'

export default {
  components: {
    Tourproduct
  },
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
      formLabelAlign: {
        id: '',
        name: '',
        code: '',
        touristsCouponCode: '',
        couponRuleExplain: '',
        discountValue: '',
        discountUnit: true,
        orderAmountLimit: '',
        hasLimitSku: false,
        skus: [],
        timeZone: '',
        award_time: '',
        beginTime: '',
        endTime: ''
      },
      formRules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请填写优惠券码', trigger: 'blur' }
        ],
        touristsCouponCode: [
          { required: true, message: '请填写游客优惠券码', trigger: 'blur' }
        ],
        couponRuleExplain: [
          { required: true, message: '请填写优惠券规则', trigger: 'blur' }
        ],
        discountValue: [
          { required: true, message: '请填写折扣值', trigger: 'blur' },
          { type: 'number', min: 0, message: '请填写不能低于0的数字', trigger: 'blur' }
        ],
        orderAmountLimit: [
          { required: true, message: '请填写订单金额门槛', trigger: 'blur' },
          { type: 'number', min: 0, message: '请填写不能低于0的数字', trigger: 'blur' }
        ],
        skus: [
          { required: true, message: '请至少选择一个角色', trigger: 'blur' }
        ],
        timeZone: [
          { required: true, message: '请选择时区', trigger: 'blur' }
        ],
        award_time: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },
      tempRoute: {},
      rolesOption: [],
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
      ]
    }
  },
  watch: {
    'formLabelAlign.hasLimitSku': function(val) {
      if (!val) {
        this.formLabelAlign.skus = []
      }
    }
  },
  created() {
    const id = this.$route.params.id // 获取路由参数中的 ID
    const name = id !== '00' ? `details-${id}` : 'details' // 根据 ID 生成页面标题
    document.title = name // 设置页面标题
    const title = id !== '00' ? `优惠券详情-${id}` : '新增优惠券'

    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: title })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题
  },
  mounted() {
    if (this.$route.params.id) {
      this.getCouponDetails()
    }
  },
  methods: {
    getCouponDetails() {
      if (this.$route.params.id !== '00') {
        const params = {
          configId: this.$route.params.id
        }
        getCouponDetail(params).then((res) => {
          const row = res.data
          const beginTime = this.transferDate(row.beginTime, row.timeZone)
          const endTime = this.transferDate(row.endTime, row.timeZone)
          this.formLabelAlign = {
            ...row,
            discountUnit: row.discountUnit === 1,
            skus: row.skuLists,
            award_time: [beginTime, endTime]
          }
        })
      }
    },
    handleUpdate(tagsGroup) {
      this.formLabelAlign.skus = tagsGroup
    },
    // getRolesOption(val) {
    //     this.rolesOption = []
    //         const data = {
    //         site: val
    //     }
    //     getRoutesList(data).then((res) => {
    //         res.data.forEach((item) => {
    //             this.rolesOption.push({
    //             label: item.roleName,
    //             value: item.id
    //             })
    //         })
    //     })
    // },
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
    createCoupon() {
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          console.log('this.formLabelAlign', this.formLabelAlign)
          const data = {
            ...this.formLabelAlign,
            discountUnit: this.formLabelAlign.discountUnit ? 1 : 2,
            beginTime: this.computedDiffTimeZoneDate(this.formLabelAlign.award_time[0], this.formLabelAlign.timeZone) / 1000,
            endTime: this.computedDiffTimeZoneDate(this.formLabelAlign.award_time[1], this.formLabelAlign.timeZone) / 1000
          }
          saveCoupon(data).then(response => {
            this.$message({
              type: 'success',
              message: this.$route.params.id !== '00' ? '更新成功' : '创建成功'
            })
            this.formLabelAlign = {
              id: '',
              name: '',
              code: '',
              touristsCouponCode: '',
              couponRuleExplain: '',
              discountValue: '',
              discountUnit: true,
              orderAmountLimit: '',
              hasLimitSku: false,
              skus: [],
              timeZone: '',
              award_time: '',
              beginTime: '',
              endTime: ''
            }
            this.goToCoupon()
          })
        }
      })
    },
    goToCoupon() {
      this.$router.push('/universal/coupon')
    }
  }
}
</script>

<style lang="scss">
    .couponSetting-page{
        .frontLimit .el-form-item__content{
            display: flex;
            align-items: center;
        }
        .rebates-switch{
            .el-switch{
                border-radius: 5px;
                overflow: hidden;
                .el-switch__label{
                    margin: 0;
                    padding: 0 10px;
                    color: #ADADAD;
                    background-color: transparent;
                    &.is-active{
                        color: #FFF;
                        background-color: #2B7DE1;
                    }
                }
                .el-switch__core{
                    display: none;
                }
            }
        }
    }
</style>
<style lang="scss" scoped>
    .couponSetting-page{
        padding: 20px;
        padding-right: 40%;
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
        .rebates-switch{
            position: relative;
            .el-switch{
                position: absolute;
                right: 50px;
                top: 50%;
                transform: translateY(-50%) scale(1.3);
                .el-switch__core{
                    display: none;
                }
            }
            span{
                position: absolute;
                right: 50px;
                top: 50%;
                transform: translateY(-50%);
                color: #ADADAD;
            }
        }
    }
</style>
