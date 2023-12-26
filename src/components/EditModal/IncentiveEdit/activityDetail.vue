<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="630"
    :show-close="false"
    top="60px"
    class="incentive-edit-modal"
    :before-close="handleClose"
  >
    <div slot="title" class="edit-title">
      <div>
        <el-tag v-if="parent_id" effect="dark">{{ parent_id }}</el-tag>
        {{ modalTitle }}
      </div>
      <div class="switch-title">
        <el-switch
          v-model="formData.active_state"
          :disabled="disabled"
          active-color="#00BC4B"
          inactive-color="#EEEEEE"
          :width="48"
        />
        <div
          class="switch-label"
          :style="{ color: formData.active_state ? '#00BC4B' : '#ff4949' }"
        >{{ formData.active_state ? 'Active' : 'Inactive' }}</div>
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
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane
        label="数据统计"
        name="0"
      >
        <div class="flexcenter"><div class="model-label">数据统计</div><div class="model-label">数据更新时间：{{ Statistical_update_time }}</div> </div>
        此功能暂未开放
        <DateInput
          :statistical-list="statisticalList"
        >
        </DateInput>
      </el-tab-pane>-->
      <el-tab-pane label="活动配置" name="1">
        <div class="model-label">活动配置</div>
        <div class="configform">
          <BasicForm ref="BasicForm" :disabled="disabled" />
          <ParticipantForm ref="ParticipantForm" :disabled="disabled" />
          <RewardRulesForm ref="RewardRulesForm" :disabled="disabled" />
          <LimitNoticeForm ref="LimitNoticeForm" :disabled="disabled" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="2">
        <div class="flexcenter">
          <div class="model-header">
            操作记录
            <div class="model-label">系统</div>
          </div>
        </div>

        <el-table :data="recordsData" height="563" style="width: 100%">
          <el-table-column
            v-for="item in columns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          />
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="活动记录" name="3">
        <div class="flexcenter">
          <div class="model-header">
            活动记录
            <div class="model-label">用户</div>
          </div>
          <el-button
            :disabled="!recordsActiveData.length"
            type="text"
            class="export-records"
            @click="exportact(configform.id)"
          >导出记录</el-button>
        </div>
        <el-table :data="recordsActiveData" height="563" style="width: 100%" class="active-table">
          <el-table-column
            v-for="item in activeColumns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :style="{ color: item.textColor }"
          />
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="推荐用户：" class="customer">
                  <span>{{ props.row.referrer_email }}</span>
                </el-form-item>
                <el-form-item label="订单：">
                  <span>{{ props.row.order_no }}</span>
                </el-form-item>
                <el-form-item label="奖励类型：">
                  <span>{{ props.row.user_award_type }}</span>
                </el-form-item>
                <el-form-item label="奖励数量：">
                  <span>{{ props.row.order_award_amount }}</span>
                </el-form-item>
                <el-form-item label="订单金额：">
                  <span>{{ props.row.order_amount }}</span>
                </el-form-item>
                <el-form-item label="下单时间：">
                  <span>{{ props.row.order_time }}</span>
                </el-form-item>
                <el-form-item label="发放时间：">
                  <span>{{ props.row.order_award_send_time?props.row.order_award_send_time: '未发放' }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane> -->
    </el-tabs>
    <div
      style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
    />
    <span slot="footer" class="dialog-footer">
      <div>
        <el-button type="info" @click="delsubmit">取消</el-button>
        <el-button type="info" @click="editAct(configform.id)">编辑活动</el-button>
      </div>
      <div>
        <el-button type="primary" @click="configureSubmit">确认</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
// import DateInput from './dateinput.vue'
import BasicForm from '@/components/EditForm/IncentiveForm/basicForm.vue'
import ParticipantForm from '@/components/EditForm/IncentiveForm/participantForm.vue'
import RewardRulesForm from '@/components/EditForm/IncentiveForm/rewardRulesForm.vue'
import LimitNoticeForm from '@/components/EditForm/IncentiveForm/limitNoticeForm.vue'
import { exportActiveLogDetail } from '@/api/activities'

import { getActiveLink, getActiveLogDetail, getActive } from '@/api/activities'
export default {
  components: {
    // DateInput,
    BasicForm,
    ParticipantForm,
    RewardRulesForm,
    LimitNoticeForm
  },
  data() {
    return {
      disabled: true,
      parent_id: '',
      recordsData: [],
      recordsActiveData: [],
      statisticalList: [], //
      modalTitle: '',
      dialogVisible: false,
      Statistical_update_time: '2023/07/05 ',
      formData: {
        active_state: false
      },
      activeName: '1', // 激励活动弹窗默认
      labelPosition: 'left', // form位置
      configform: {
        id: '' // 活动编号
      },
      limitshow: true, // orderlimit 控制显隐 接口再写
      active_time_zone: '',
      columns: [
        {
          prop: 'type',
          label: '类型',
          width: 100
        },
        {
          prop: 'record',
          label: '记录'
        },
        // {
        //   prop: 'referrer_email',
        //   label: '用户邮箱'

        // },
        // {
        //   prop: 'order_award_amount',
        //   label: '奖励记录'
        // },
        // {
        //   prop: 'order_no',
        //   label: '订单'
        // },
        {
          prop: 'create_time',
          label: '更新时间'
        }
      ],
      activeColumns: [
        {
          prop: 'type',
          label: '类型',
          width: 100
        },
        {
          prop: 'record',
          label: '记录'
        },
        {
          prop: 'referrer_email',
          label: '用户邮箱'
        },
        {
          prop: 'order_record',
          label: '奖励记录',
          textColor: '#FF6B00'
        },
        {
          prop: 'create_time',
          label: '更新时间'
        }
      ]
    }
  },
  methods: {
    handleUpdate(tagsGroup) {
      this.configform.group_skus = tagsGroup
    },
    getDetail(id) {
      getActiveLink(id).then((res) => {
        this.loading = false
      })
    },
    getLoglist(params) {
      getActiveLogDetail(params).then((res) => {
        this.loading = false
        const { data } = res
        this.recordsData = data
      })
    },

    getActiveLoglist(params) {
      getActiveLogDetail(params).then((res) => {
        this.loading = false
        const { data } = res
        const rewardType = new Map([
          [1, 'Credit'],
          [2, 'Cash'],
          [3, 'coupon'],
          [4, 'discount']
        ])

        this.recordsActiveData = data.map(({ user_award_type, order_award_amount, ...rest }) => {
          return {
            user_award_type: rewardType.get(user_award_type),
            order_award_amount: `+${order_award_amount}`,
            ...rest
          }
        })
      })
    },
    async show(id, isEdit = true) {
      this.dialogVisible = true
      if (!isEdit) {
        return
      }
      const { data } = await getActive(id)

      this.active_time_zone = data.active_time_zone
      this.formData.active_state = data.active_state === 2
      this.loading = false
      const { ...rest } = data
      this.configform = Object.assign(this.configform, { ...rest })

      this.modalTitle = this.configform.active_name
      this.parent_id = this.configform.parent_id
      const params = {
        id: id,
        type: '系统'
      }
      this.getLoglist(params)
      const actparams = {
        id: id,
        type: '用户'
      }
      this.getActiveLoglist(actparams)
      this.$refs.BasicForm.getData(this.configform)
      this.$refs.ParticipantForm.getData(this.configform)
      this.$refs.RewardRulesForm.getData(this.configform)
      this.$refs.LimitNoticeForm.getData(this.configform)
    },
    configureSubmit() {
      this.dialogVisible = false
    },
    delsubmit() {
      this.dialogVisible = false
      this.activeName = '1'
    },
    editAct(id) {
      const params = {
        id,
        isEdit: true
      }
      this.$emit('addSuccess', params)
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
          this.activeName = '1'
        })
        .catch((_) => {})
    },
    exportact(id) {
      exportActiveLogDetail(id)
        .then(async(data) => {
          const { res } = data
          if (res.type === 'application/json') {
            const enc = new TextDecoder('utf-8')
            const buffer = await res.arrayBuffer()
            const jsonData =
              JSON.parse(enc.decode(new Uint8Array(buffer))) || {}
            this.$message.error(jsonData.msg)
            return
          }
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;chartset=utf-8'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'DTC操作记录.xlsx' // 指定下载文件名为.xlsx格式
          document.body.appendChild(link)
          link.click()
          URL.revokeObjectURL(url)
        })
        .catch((_) => {})
    }
  }
}
</script>
<style lang="scss">
.incentive-edit-modal {
  .el-dialog__body {
    padding-bottom: 0px;
  }
  > .el-input {
    width: 250px;
  }
  .el-select {
    width: 250px;
  }
}
.demo-rewardRulesForm{
  .el-form-item__content{
    >.el-input{
      width: 250px;
    }
  }
  >.el-select{
    width: 250px;
  }
}

  .active-table{
    .el-table__expanded-cell{
      padding: 16px;
    }
    .demo-table-expand{
      .el-form-item__content{
        line-height: 1.4;
        font-weight: 500;
        color: #333;
      }
      .el-form-item__label{
        line-height: 1.4;
        font-weight: 500;
        color: #333;
        padding-right: 0;
      }
    }
  }
</style>
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
.tableContainer {
  padding: 10px;
  margin-top: 20px;
}
.model-label {
  color: #adadad;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 20px;
}
.configform {
  margin-bottom: 0;
  height: calc(100vh - 363px);
  padding-bottom: 0;
  overflow-x: hidden;
  .el-input {
    width: 250px;
  }
}
.flexClass {
  display: flex;
  align-items: flex-start;
  .el-checkbox__inner {
    height: 20px !important;
    width: 20px !important;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-select {
    width: 250px !important;
  }
}
// .el-checkbox__inner {
//   height: 20px !important;
//   width: 20px !important;
// }
.el-form-item__label {
  color: #000;
  font-weight: 500;
}
.flexcenter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .model-header {
    display: flex;
    align-items: center;
    color: #000;
    font-size: 16px;
    font-weight: 500;
    .model-label {
      margin-bottom: 0;
      margin-left: 24px;
    }
  }
  .export-records {
    color: rgba(43, 125, 225, 1);
  }
}
.demo-table-expand{
  .el-form-item{
    width: calc((100% / 3) - 24px);
    margin-bottom: 12px;
    line-height: 1.2;
  }
  .customer{
    width: 100%;
  }

}
</style>
