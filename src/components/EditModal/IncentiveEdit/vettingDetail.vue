<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="630"
    :show-close="false"
    top="60px"
    class="vetting-edit-modal"
    :before-close="handleClose"
  >
    <div
      slot="title"
      class="edit-title"
    >
      <div>{{ modalTitle }}</div>
      <div style="text-align: right;color: #D8D8D8;">
        <i class="el-icon-refresh"></i> <span>同步间隔：1 day 最新同步：{{ form.updatedTime || form.createdTime }}</span>
      </div>
    </div>
    <el-form ref="form" disabled :model="form" :label-position="labelPosition" label-width="110px">
      <div class="model-label">审批信息</div>
      <el-form-item label="用户身份" required>
        <el-input v-model="form.identityType"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" required>
        <el-input v-model="form.sharerEmail"></el-input>
      </el-form-item>
      <el-form-item label="激励动作" required>
        <el-input v-model="form.incentiveType"></el-input>
      </el-form-item>
      <el-form-item label="激励类型" required>
        <el-input v-model="form.rewardType"></el-input>
      </el-form-item>
      <el-form-item label="状态" required>
        <el-input v-model="form.rewardStatus"></el-input>
      </el-form-item>
      <el-form-item label="数量" required>
        <el-input v-model="form.rewardNum"></el-input>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="dark" :content="form.rewardDetail" placement="right">
          <el-button style="border: 0;"><i class="el-icon-question"></i> 奖励明细</el-button>
        </el-tooltip>
      </el-form-item>
      <div class="model-label">参与活动信息</div>
      <el-form-item label="时间" required>
        <el-input v-model="form.orderTime"></el-input>
      </el-form-item>
      <el-form-item label="有效订单金额" required>
        <el-input v-model="form.goodsAmount"></el-input>
      </el-form-item>
      <el-form-item label="订单金额" required>
        <el-input v-model="form.orderAmount"></el-input>
      </el-form-item>
      <el-form-item label="订单号" required>
        <el-input v-model="form.orderId"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" required>
        <el-input v-model="form.orderStatus"></el-input>
      </el-form-item>
    </el-form>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <div v-if="form.rewardStatus == '审批中'">
        <el-button
          type="info"
          @click="failpassItem(form, 4 )"
        >
          不通过
        </el-button>
        <el-button
          type="info"
          @click="passItem(form, 3 )"
        >
          通过
        </el-button>
      </div>
      <div>

        <el-button
          type="primary"
          @click="configureSubmit"
        >
          确认
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      recordsData: [],
      statisticalList: [{ label: 'limit3', value: '123' }], //
      modalTitle: '用户详情',
      labelPosition: 'left', // form位置
      dialogVisible: false,
      form: {
        // active: false
        id: '',
        identityType: '', // 用户角色，1推荐者2被推荐者3双反
        sharerEmail: '', // * 用户邮箱：
        incentiveType: '', // * 激励动作：
        rewardType: '', // * 激励类型：
        rewardNum: '', // * 激励的次数或金额或其他
        rewardStatus: '', // * 状态：
        orderTime: '', // * 订单内容时间
        orderAmount: '', // * 订单金额
        goodsAmount: '', // * 有效订单金额
        orderId: '', // * 订单号
        orderStatus: '', // * 订单状态
        rewardDetail: '', // * 奖励明细
        updatedTime: '',
        createdTime: ''
      }
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
    show(row) {
      this.dialogVisible = true
      if (row) {
        console.log(row)
        this.form = {
          ...this.form,
          id: row.id,
          identityType: row.identityType, // 用户角色，1推荐者2被推荐者3双反
          sharerEmail: row.sharerEmail, // * 用户邮箱：
          incentiveType: row.incentiveType, // * 激励动作：
          rewardType: row.rewardType, // * 激励类型：
          rewardStatus: row.rewardStatus, // * 状态：
          rewardNum: row.rewardNum, // * 激励的次数或金额或其他
          orderTime: row.orderTime, // * 订单内容时间
          orderAmount: row.orderAmount, // * 订单金额
          goodsAmount: row.goodsAmount, // * 有效订单金额
          orderId: row.orderId, // * 订单号
          orderStatus: row.orderStatus, // * 订单号
          rewardDetail: row.rewardDetail, // * 订单号
          updatedTime: row.updatedTime, // * 订单号
          createdTime: row.createdTime // * 订单号
        }
      }
    },

    failpassItem(row, status) {
      const par = {
        row: row,
        status: status
      }
      this.dialogVisible = false
      this.$emit('failpassItem', par)
    },
    passItem(row, status) {
      const par = {
        row: row,
        status: status
      }
      this.dialogVisible = false
      this.$emit('failpassItem', par)
    },
    configureSubmit() {
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => { })
    }

  }
}
</script>
<style lang="scss">

.vetting-edit-modal .el-dialog__body {
    padding: 12px 20px;
    height: 600px;
    overflow-x: hidden;
}
.vetting-edit-modal {
  .el-dialog__header{
    border-bottom: 1px solid #eee;
  }
  .el-dialog__footer{
    border-top: 1px solid #eee;
  }
}
</style>
<style lang="scss"  scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
.model-label {
      margin-bottom: 0;
      margin-left: 24px;
}
.el-input{
    width: 40%;
}
.model-label {
  color: #adadad;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 20px;
  margin-left: 0;
}
</style>
