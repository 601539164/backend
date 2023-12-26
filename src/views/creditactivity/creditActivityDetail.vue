<template>
  <div class="common-page">
    <el-form
      ref="creditActivityForm"
      v-loading="loading"
      label-position="left"
      label-width="100px"
      :model="creditActivityForm"
      :rules="formRules"
    >
      <el-row type="flex" justify="end">
        <el-col :span="2">
          <el-button type="info" @click="goBack()">返回</el-button>
        </el-col>
      </el-row>
      <el-form-item label="活动名称 " prop="campaignName">
        <el-input v-model="creditActivityForm.campaignName" type="textarea" style="60%"></el-input>
      </el-form-item>
      <el-form-item label="活动时区" prop="timeOffset">
        <el-select
          v-model="creditActivityForm.timeOffset"
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
      <el-form-item label="活动有效期" prop="availableTs">
        <el-date-picker
          v-model="creditActivityForm.availableTs"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>

      </el-form-item>
      <el-form-item label="credit规则" prop="rewardPercentage">
        <span>返产品金额 </span>
        <el-input-number v-model="creditActivityForm.rewardPercentage" size="medium" :min="0" :max="100" :controls="false"></el-input-number>
        <span> %</span>
      </el-form-item>
      <el-form-item label="发放时间" prop="rewardDelayDay">
        <span>shipped </span>
        <el-input-number v-model="creditActivityForm.rewardDelayDay" size="medium" :min="0" :max="365" :precision="0" :controls="false"></el-input-number>
        <span> 天 后生效</span>
      </el-form-item>
      <el-form-item label="商品限制" prop="limitSkus">
        <template>
          <el-radio v-model="creditActivityForm.productLimitType" :label="1">所有</el-radio>
          <el-radio v-model="creditActivityForm.productLimitType" :label="2">部分</el-radio>
          <span style="display: inline-block;width: 60%;">   <Tourproduct
            v-if="creditActivityForm.productLimitType === 2"
            :tags="creditActivityForm.limitSkus"
            @handle-Update="handleUpdate"
          /></span>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button v-if="this.$route.params.id !== '00'" type="primary" @click="update()">更新</el-button>
        <el-button v-else type="primary" @click="create()">创建</el-button>
        <el-button type="info" @click="goBack()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  // getActivity,
  createActivity,
  updateActivity
} from '@/api/credit'
import Tourproduct from '@/components/EditModal/IncentiveEdit/tourproduct.vue'

export default {
  components: {
    Tourproduct
  },
  data() {
    return {
      loading: false,

      creditActivityForm: {
        id: '',
        campaignName: '',
        startTs: '',
        endTs: '',
        productLimitType: '',
        rewardPercentage: '',
        rewardDelayDay: '',
        timeOffset: '',
        channel: 'BC',
        availableTs: [],
        limitSkus: []
      },
      formRules: {
        timeOffset: [
          { required: true, message: '请选择时区', trigger: 'blur' }
        ],
        site: [
          { required: true, message: '请选择账号所属站点', trigger: 'change' }
        ],
        campaignName: [
          { required: true, message: '请填写用户名', trigger: 'change' }
        ],
        rewardPercentage: [
          {
            required: true,
            message: '请至少选择一种有效形式',
            trigger: 'change'
          }
        ],
        rewardDelayDay: [
          { required: true, message: '请填写发放时间', trigger: 'change' }
        ],
        limitSkus: [
          { required: false, message: '请输入产品sku', trigger: 'blur' }
        ]
      },
      tempRoute: {},
      disabledSite: true,
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
      ]
    }
  },

  computed: {
    ...mapGetters(['station']),
    pickerOptions() {
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0) // 设置时间为当天的 0 点
      currentDate.setDate(currentDate.getDate() + 1) // 将日期设置为明天
      return {
        disabledDate(time) {
          return time.getTime() < currentDate.getTime()
        }
      }
    }
  },
  watch: {
  },
  created() {
    const id = this.$route.params.id // 获取路由参数中的 ID
    const name = id !== '00' ? `details-${id}` : 'details' // 根据 ID 生成页面标题
    document.title = name // 设置页面标题
    const title = id !== '00' ? `活动-${id}` : '新增活动'
    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: title })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题
  },
  mounted() {
    this.initDetails()
    if (this.$route.params.id) {
      this.getDetails()
    }
  },
  methods: {
    handleUpdate(tagsGroup) {
      this.creditActivityForm.limitSkus = tagsGroup
    },
    getDetails() {
      if (this.$route.params.id !== '00') {
        // const params = {
        //   size: 10,
        //   currentPage: 1,
        //   id: this.$route.params.id
        // }
        // getActivityPage(params).then((res) => {
        //   const row = res.data.list[0]
        //   this.creditActivityForm = {
        //     ...row,
        //     roles: row.roles.map((ele) => ele.id),
        //     availableTs: row.availableTs * 1000
        //   }
        // })
      }
    },
    initDetails() {
    },
    create() {
      this.$refs['creditActivityForm'].validate((valid) => {
        if (valid) {
          const data = {
            ...this.creditActivityForm,
            timeOffset: this.timeZoneOptions.find((e) => {
              return e.value === this.creditActivityForm.timeOffset
            }).offset,
            startTs: this.computedDiffTimeZoneDate(this.creditActivityForm.availableTs[0], this.creditActivityForm.timeOffset) / 1000,
            endTs: this.computedDiffTimeZoneDate(this.creditActivityForm.availableTs[1], this.creditActivityForm.timeOffset) / 1000
          }
          console.log(data)
          createActivity(data).then((response) => {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.creditActivityForm = {
              id: '',
              campaignName: '',
              dept: '',
              remark: '',
              channel: 'BC',
              startTs: '',
              endTs: ''
            }
            this.$router.push('/marketing/creditactivity')
          })
        }
      })
    },
    update() {
      this.$refs['creditActivityForm'].validate((valid) => {
        if (valid) {
          const data = {
            ...this.creditActivityForm,
            timeOffset: this.timeZoneOptions.find((e) => {
              return e.value === this.creditActivityForm.timeOffset
            }).offset,
            startTs: this.computedDiffTimeZoneDate(this.creditActivityForm.availableTs[0], this.creditActivityForm.timeOffset) / 1000,
            endTs: this.computedDiffTimeZoneDate(this.creditActivityForm.availableTs[1], this.creditActivityForm.timeOffset) / 1000
          }
          updateActivity(data).then((response) => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.creditActivityForm = {
              id: '',
              campaignName: '',
              availableTs: [],
              timeOffset: '',
              startTs: '',
              endTs: '',
              channel: 'BC'
            }
            this.$router.push('/marketing/creditactivity')
          })
        }
      })
    },
    goBack() {
      this.$router.push('/marketing/creditactivity')
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
    multipleUpadateItem(row, status) {
      console.log(row, status)
    }
  }
}
</script>
<style lang="scss">
  .common-page{
    color: #000  !important;
    padding: 20px;
    .el-textarea__inner{
      width: 60%;
    }
  }
</style>
