<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="630"
    :show-close="false"
    :close-on-click-modal="false"
    top="60px"
    class="incentive-model"
  >
    <div slot="title" class="edit-title">
      <div>
        <span v-if="isEdit">
          修改活动详情：
        </span>
        <el-tag v-if="parent_id" effect="dark">
          {{ parent_id }}
        </el-tag>
        {{ modalTitle }}
      </div>
      <div class="switch-title">
        <el-switch
          v-model="DataForm.active_state"
          active-color="#00BC4B"
          inactive-color="#EEEEEE"
          :width="48"
        />
        <div
          class="switch-label"
          :style="{ color: DataForm.active_state ? '#00BC4B' : '#ff4949' }"
        >
          {{ DataForm.active_state ? 'Active' : 'Inactive' }}
        </div>
      </div>
    </div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="基础信息" description="配置 1"></el-step>
      <el-step title="参与者配置" description="配置 2"></el-step>
      <el-step title="奖励规则配置" description="配置 3"></el-step>
      <el-step title="限制与通知" description="配置 4"></el-step>
    </el-steps>

    <div v-show="active === id_basic" class="tableContainer">
      <BasicForm ref="BasicForm" />
    </div>
    <div v-show="active === id_participant" class="tableContainer">
      <ParticipantForm ref="ParticipantForm" />
    </div>
    <div v-show="active === id_rewardRules" class="tableContainer">
      <RewardRulesForm ref="RewardRulesForm" />
    </div>
    <div v-show="active === id_limitNotice" class="tableContainer">
      <LimitNoticeForm ref="LimitNoticeForm" />
    </div>

    <div
      style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <div>
        <el-button
          type="info"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          v-if="active > 0"
          @click="configurePre"
        >
          上一步
        </el-button>
      </div>
      <div>
        <el-button
          v-if="active < 3"
          type="primary"
          @click="next"
        >
          下一步
        </el-button>
        <el-button
          v-if="active === 3 && !isEdit"
          type="primary"
          @click="configureSubmit"
        >
          创建
        </el-button>
        <el-button
          v-if="active === 3 && isEdit"
          type="primary"
          @click="updateSubmit"
        >
          更新
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import BasicForm from '@/components/EditForm/IncentiveForm/basicForm.vue'
import ParticipantForm from '@/components/EditForm/IncentiveForm/participantForm.vue'
import RewardRulesForm from '@/components/EditForm/IncentiveForm/rewardRulesForm.vue'
import LimitNoticeForm from '@/components/EditForm/IncentiveForm/limitNoticeForm.vue'
import { getActive, addActive, updateActive } from '@/api/activities'

export default {
  components: {
    BasicForm,
    ParticipantForm,
    RewardRulesForm,
    LimitNoticeForm
  },
  data() {
    return {
      modalTitle: '创建激励活动',
      dialogVisible: false,
      isEdit: false,
      active: 0,
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
      id_basic: 0,
      id_participant: 1,
      id_rewardRules: 2,
      id_limitNotice: 3,
      parent_id: '',
      formData: {
        active: true
      },
      comparativeData: '',
      diff: '',
      record: '',
      DataForm: {
        active_state: false
      },
      data_basicForm: '',
      data_participantForm: '',
      data_rewardRulesForm: '',
      data_limitNoticeForm: ''
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    show(item) {
      if (item) {
        if (item.isEdit) {
          this.isPreview = item.isPreview
          this.modalTitle = item.active_name
          this.parent_id = item.parent_id
        }
      } else {
        this.isEdit = false
        this.modalTitle = '创建激励活动'
        this.parent_id = ''
      }
      this.dialogVisible = true
    },
    edit(para) {
      const id = para.id
      this.isEdit = para.isEdit

      if (id) {
        getActive(id).then((res) => {
          this.DataForm.active_state = res.data.active_state === 2
          if (this.isEdit) {
            this.modalTitle = res.data.active_name
            this.parent_id = res.data.parent_id
          }
          this.$refs.BasicForm.getData(res.data)
          this.$refs.ParticipantForm.getData(res.data)
          this.$refs.RewardRulesForm.getData(res.data)
          this.$refs.LimitNoticeForm.getData(res.data)
          this.DataForm = {
            ...res.data,
            active_state: res.data.active_state === 2,
            id: res.data.id
          }
          this.comparativeData = {
            ...res.data,
            active_state: res.data.active_state === 2,
            id: res.data.id
          }
        })
      } else {
        return
      }
      this.dialogVisible = true
    },
    configurePre() {
      this.active--
    },
    next() {
      if (this.active === 0) {
        this.$refs.BasicForm.$refs['basicForm'].validate(valid => {
          if (!valid) return
          this.data_basicForm = this.$refs.BasicForm.pushData()
          this.active++
          this.$refs.ParticipantForm.getActiveType(this.data_basicForm.active_type)
        })
      } else if (this.active === 1) {
        this.$refs.ParticipantForm.$refs['participantForm'].validate(valid => {
          if (!valid) return
          this.data_participantForm = this.$refs.ParticipantForm.pushData()
          this.active++
          const skuLimiteData = {
            recommender_sku_flag: this.data_participantForm.recommender_sku_flag,
            recommender_sku: this.data_participantForm.recommender_sku,
            recommender_join_times: this.data_participantForm.recommender_join_times
          }
          this.$refs.RewardRulesForm.getActiveType(this.data_basicForm.active_type, skuLimiteData)
        })
      } else if (this.active === 2) {
        if (this.$refs.RewardRulesForm.checkTransmission()) {
          this.$refs.RewardRulesForm.$refs['rewardRulesForm'].validate(valid => {
            if (!valid) return
            this.data_rewardRulesForm = this.$refs.RewardRulesForm.pushData()
            this.active++
            this.$refs.LimitNoticeForm.getActiveType(this.data_basicForm.active_type)
          })
        } else {
          console.log('下一步')
        }
      }
    },
    configureSubmit() {
      this.$refs.LimitNoticeForm.$refs['limitNoticeForm'].validate(valid => {
        if (valid) {
          this.data_limitNoticeForm = this.$refs.LimitNoticeForm.pushData()
          this.DataForm = {
            active_state: this.DataForm.active_state ? 2 : 1,
            ...this.data_basicForm,
            active_effect_time: this.computedDiffTimeZoneDate(this.data_basicForm.activityTime[0], this.data_basicForm.active_time_zone) / 1000,
            active_expired_time: this.computedDiffTimeZoneDate(this.data_basicForm.activityTime[1], this.data_basicForm.active_time_zone) / 1000,
            ...this.data_participantForm,
            sharer_order_start_date: this.data_participantForm.sharer_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.sharer_order_date[0], this.data_basicForm.active_time_zone) / 1000 : '',
            sharer_order_end_date: this.data_participantForm.sharer_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.sharer_order_date[1], this.data_basicForm.active_time_zone) / 1000 : '',
            recommender_order_start_date: this.data_participantForm.recommender_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.recommender_order_date[0], this.data_basicForm.active_time_zone) / 1000 : '',
            recommender_order_end_date: this.data_participantForm.recommender_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.recommender_order_date[1], this.data_basicForm.active_time_zone) / 1000 : '',
            ...this.data_rewardRulesForm,
            recommender_award_effective_time: this.data_rewardRulesForm.recommender_award_time ? this.computedDiffTimeZoneDate(this.data_rewardRulesForm.recommender_award_time[0], this.data_basicForm.active_time_zone) / 1000 : '',
            recommender_award_expired_time: this.data_rewardRulesForm.recommender_award_time ? this.computedDiffTimeZoneDate(this.data_rewardRulesForm.recommender_award_time[1], this.data_basicForm.active_time_zone) / 1000 : '',
            recommender_discount_unit: this.data_rewardRulesForm.recommender_discount_unit ? this.data_rewardRulesForm.recommender_discount_unit ? 1 : 2 : 2,
            captain_discount_unit: this.data_rewardRulesForm.captain_discount_unit ? this.data_rewardRulesForm.captain_discount_unit ? 1 : 2 : 2,
            member_discount_unit: this.data_rewardRulesForm.member_discount_unit ? this.data_rewardRulesForm.member_discount_unit ? 1 : 2 : 2,
            recommender_award_cutoff_type: this.data_rewardRulesForm.recommender_award_cutoff_type ? this.data_rewardRulesForm.recommender_award_cutoff_type ? 1 : 0 : 0,
            ...this.data_limitNoticeForm
          }
          addActive(this.DataForm).then(() => {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.dialogVisible = false
            this.active = 0
            this.$emit('child-event')
          })
        } else {
          console.log('表单LimitNoticeForm验证失败')
        }
      })
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
    updateSubmit() {
      this.data_limitNoticeForm = this.$refs.LimitNoticeForm.pushData()
      this.DataForm = {
        ...this.DataForm,
        active_id: this.DataForm.id,
        active_state: this.DataForm.active_state ? 2 : 1,
        ...this.data_basicForm,
        active_effect_time: this.computedDiffTimeZoneDate(this.data_basicForm.activityTime[0], this.data_basicForm.active_time_zone) / 1000,
        active_expired_time: this.computedDiffTimeZoneDate(this.data_basicForm.activityTime[1], this.data_basicForm.active_time_zone) / 1000,
        ...this.data_participantForm,
        sharer_order_start_date: this.data_participantForm.sharer_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.sharer_order_date[0], this.data_basicForm.active_time_zone) / 1000 : '',
        sharer_order_end_date: this.data_participantForm.sharer_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.sharer_order_date[1], this.data_basicForm.active_time_zone) / 1000 : '',
        recommender_order_start_date: this.data_participantForm.recommender_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.recommender_order_date[0], this.data_basicForm.active_time_zone) / 1000 : '',
        recommender_order_end_date: this.data_participantForm.recommender_order_date ? this.computedDiffTimeZoneDate(this.data_participantForm.recommender_order_date[1], this.data_basicForm.active_time_zone) / 1000 : '',
        ...this.data_rewardRulesForm,
        recommender_award_effective_time: this.data_rewardRulesForm.recommender_award_time ? this.computedDiffTimeZoneDate(this.data_rewardRulesForm.recommender_award_time[0], this.data_basicForm.active_time_zone) / 1000 : '',
        recommender_award_expired_time: this.data_rewardRulesForm.recommender_award_time ? this.computedDiffTimeZoneDate(this.data_rewardRulesForm.recommender_award_time[1], this.data_basicForm.active_time_zone) / 1000 : '',
        recommender_discount_unit: this.data_rewardRulesForm.recommender_discount_unit ? this.data_rewardRulesForm.recommender_discount_unit ? 1 : 2 : 2,
        captain_discount_unit: this.data_rewardRulesForm.captain_discount_unit ? this.data_rewardRulesForm.captain_discount_unit ? 1 : 2 : 2,
        member_discount_unit: this.data_rewardRulesForm.member_discount_unit ? this.data_rewardRulesForm.member_discount_unit ? 1 : 2 : 2,
        recommender_award_cutoff_type: this.data_rewardRulesForm.recommender_award_cutoff_type ? this.data_rewardRulesForm.recommender_award_cutoff_type ? 1 : 0 : 0,
        ...this.data_limitNoticeForm
      }
      this.comparativeData = {
        ...this.comparativeData,
        active_state: this.comparativeData.active_state ? 2 : 1
      }
      updateActive(this.DataForm).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogVisible = false
        this.active = 0
        this.$emit('child-event')
      })
    },
    cancel() {
      this.$confirm('将会丢失新增或修改的配置数据，确认取消?')
        .then((_) => {
          this.dialogVisible = false
          this.active = 0
        })
        .catch((_) => { })
    },
    handleClose(done) {
      this.$confirm('将会丢失新增或修改的配置数据，确认取消?？')
        .then((_) => {
          this.active = 0
          done()
        })
        .catch((_) => { })
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
  .dialog-footer{
    display: flex;
    justify-content: space-between;
  }
  .tableContainer{
    padding: 10px;
    margin-top: 20px;
    height: calc(100vh - 363px );
    min-height: 400px;
    overflow-x: hidden;
  }
  .el-step::v-deep{
    .el-step__title{
      font-size: 12px;
    }
  }
</style>
<style lang="scss">
  .incentive-model{
    .el-dialog{
      width: 800px;
    }
    .tableContainer{
      .demo-Form{
        .el-form-item__content{
          >.el-input{
            width: 250px;
          }
        }
        >.el-select{
          width: 250px;
        }
      }
    }
  }
  .frontLimit .el-form-item__content{
    display: flex;
    align-items: center;
  }
  .partition{
    display: block;
    color: #ADADAD;
    font-size: 12px;
    margin-bottom: 12px;
  }
</style>
