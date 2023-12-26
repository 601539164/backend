<template>
  <div>
    <el-form v-if="active_type === 1 || active_type === 3" ref="limitNoticeForm" :model="limitNoticeForm" :rules="limitNoticeRules" label-position="left" label-width="130px" class="demo-Form demo-limitNoticeForm" :disabled="disabled">
      <span class="partition">限制</span>
      <el-form-item label="奖励审批" prop="is_award_audit">
        <el-select v-model="limitNoticeForm.is_award_audit" placeholder="请选择奖励审批" clearable disabled>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参与用户限制" prop="user_limit">
        <el-select v-model="limitNoticeForm.user_limit" placeholder="请选择参与用户限制" clearable disabled>
          <el-option label="注册用户" :value="1"></el-option>
          <el-option label="无" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <span class="partition">通知</span>
      <div class="EmailNotice">
        <el-form-item label="参与通知" prop="join_notify_object">
          <el-select v-model="limitNoticeForm.join_notify_object" placeholder="请选择参与通知" clearable disabled>
            <el-option label="是（双方）" :value="1"></el-option>
            <el-option label="是（仅分享者）" :value="2"></el-option>
            <el-option label="是（仅被分享者）" :value="3"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="limitNoticeForm.join_notify_object > 0" prop="join_notify_template_name" class="notify_template">
          <el-select v-model="limitNoticeForm.join_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;" disabled>
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
      </div>
      <div class="EmailNotice">
        <el-form-item label="进度通知" prop="progress_notify_object">
          <el-select v-model="limitNoticeForm.progress_notify_object" placeholder="请选择进度通知" clearable disabled>
            <el-option label="推荐方" :value="1"></el-option>
            <el-option label="被推荐方" :value="2"></el-option>
            <el-option label="双方" :value="3"></el-option>
            <el-option label="无" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="limitNoticeForm.progress_notify_object > 0" prop="progress_notify_template_name" class="notify_template">
          <el-select v-model="limitNoticeForm.progress_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;" disabled>
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
      </div>
      <div class="EmailNotice">
        <el-form-item label="完成通知" prop="finish_notify_object">
          <el-select v-model="limitNoticeForm.finish_notify_object" placeholder="请选择完成通知" clearable disabled>
            <el-option label="推荐方" :value="1"></el-option>
            <el-option label="被推荐方" :value="2"></el-option>
            <el-option label="双方" :value="3"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="limitNoticeForm.finish_notify_object > 0" prop="finish_notify_template_name" class="notify_template">
          <el-select v-model="limitNoticeForm.finish_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;" disabled>
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
      </div>
    <!-- <span class="partition">后置触发</span>
    <el-form-item label="完成后触发" prop="completion">
      <el-input v-model="limitNoticeForm.completion" disabled clearable></el-input>
    </el-form-item> -->
    </el-form>
    <el-form v-if="active_type == 2 " ref="limitNoticeForm" :model="grouplimitNoticeForm" :rules="grouplimitNoticeRules" label-position="left" label-width="130px" class="demo-Form demo-limitNoticeForm" :disabled="disabled">
      <span class="partition">成团限制</span>
      <el-form-item label="参与用户限制" prop="user_limit">
        <el-select v-model="grouplimitNoticeForm.user_limit" placeholder="请选择参与用户限制" clearable disabled>
          <el-option label="注册用户" :value="1"></el-option>
          <el-option label="无" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退换货限制" prop="return_limit">
        <el-select v-model="grouplimitNoticeForm.return_limit" placeholder="请选择参与退货限制" clearable>
          <el-option label="不可退换货" :value="0"></el-option>
          <el-option label="可以换货" :value="1"></el-option>
          <el-option label="可以退货" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <span class="partition">通知</span>
      <div class="EmailNotice">
        <el-form-item label="参与通知" prop="join_notify_object">
          <el-select v-model="grouplimitNoticeForm.join_notify_object" placeholder="请选择参与通知" clearable disabled>
            <el-option label="团长" :value="1"></el-option>
            <el-option label="团员" :value="2"></el-option>
            <el-option label="双方" :value="3"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="grouplimitNoticeForm.join_notify_object > 0" prop="join_notify_template_name" class="notify_template">
          <el-select v-model="grouplimitNoticeForm.join_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;" disabled>
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
      </div>
      <div class="EmailNotice">
        <el-form-item label="进度通知" prop="progress_notify_object">
          <el-select v-model="grouplimitNoticeForm.progress_notify_object" placeholder="请选择进度通知" clearable disabled>
            <el-option label="团长" :value="1"></el-option>
            <el-option label="团员" :value="2"></el-option>
            <el-option label="双方" :value="3"></el-option>
            <el-option label="无" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="grouplimitNoticeForm.progress_notify_object > 0" prop="progress_notify_template_name" class="notify_template">
          <el-select v-model="grouplimitNoticeForm.progress_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;" disabled>
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
      </div>
      <div class="EmailNotice">
        <el-form-item label="完成通知" prop="finish_notify_object">
          <el-select v-model="grouplimitNoticeForm.finish_notify_object" placeholder="请选择完成通知" clearable disabled>
            <el-option label="团长" :value="1"></el-option>
            <el-option label="团员" :value="2"></el-option>
            <el-option label="双方" :value="3"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="grouplimitNoticeForm.finish_notify_object > 0" prop="finish_notify_template_name" class="notify_template">
          <el-select v-model="grouplimitNoticeForm.finish_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;" disabled>
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
      </div>
    </el-form>
  </div>
</template>

<script>
import { getEmailTemplatelist } from '@/api/emailTemplate'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active_type: '',
      participationEmail: [],
      limitNoticeForm: {
        active_type: '',
        is_award_audit: true,
        user_limit: 1,
        join_notify_object: 0,
        join_notify_template_name: '',
        progress_notify_object: 3,
        progress_notify_template_name: 'EPB_PROCESS_MAIL',
        finish_notify_object: 1,
        finish_notify_template_name: 'EPB_COMPLETE_MAIL'
        // completion: '无'
      },
      limitNoticeRules: {
        is_award_audit: [
          { required: true, message: '请至少选择一个奖励审批', trigger: 'change' }
        ],
        user_limit: [
          { required: true, message: '请至少选择一种用户类型', trigger: 'change' }
        ],
        join_notify_object: [
          { required: true, message: '请至少选择一个参与通知', trigger: 'change' }
        ],
        join_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ],
        progress_notify_object: [
          { required: true, message: '请至少选择一个进度通知', trigger: 'change' }
        ],
        progress_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ],
        finish_notify_object: [
          { required: true, message: '请至少选择一个进度通知', trigger: 'change' }
        ],
        finish_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ]
        // completion: [
        //   { required: true, trigger: 'change' }
        // ]
      },
      grouplimitNoticeForm: {
        active_type: '',
        user_limit: 1,
        return_limit: '',
        join_notify_object: 3,
        join_notify_template_name: 'GROUP_BUY_JOIN_MAIL',
        progress_notify_object: 3,
        progress_notify_template_name: 'GROUP_BUY_DDL_NOTIFY_MAIL',
        finish_notify_object: 3,
        finish_notify_template_name: 'GROUP_BUY_COMPLETE_MAIL'
      },
      grouplimitNoticeRules: {
        user_limit: [
          { required: true, message: '请至少选择一种用户类型', trigger: 'change' }
        ],
        return_limit: [
          { required: true, message: '请至少选择一种退换货限制', trigger: 'change' }
        ],
        join_notify_object: [
          { required: true, message: '请至少选择一个参与通知', trigger: 'change' }
        ],
        join_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ],
        progress_notify_object: [
          { required: true, message: '请至少选择一个进度通知', trigger: 'change' }
        ],
        progress_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ],
        finish_notify_object: [
          { required: true, message: '请至少选择一个进度通知', trigger: 'change' }
        ],
        finish_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'limitNoticeForm.join_notify_object': function(val) {
      if (val === 0) {
        this.limitNoticeForm.join_notify_template_name = null
      }
    },
    'limitNoticeForm.progress_notify_object': function(val) {
      if (val === 0) {
        this.limitNoticeForm.progress_notify_template_name = null
      }
    },
    'limitNoticeForm.finish_notify_object': function(val) {
      if (val === 0) {
        this.limitNoticeForm.finish_notify_template_name = null
      }
    },
    'grouplimitNoticeForm.join_notify_object': function(val) {
      if (val === 0) {
        this.grouplimitNoticeForm.join_notify_template_name = null
      }
    },
    'grouplimitNoticeForm.progress_notify_object': function(val) {
      if (val === 0) {
        this.grouplimitNoticeForm.progress_notify_template_name = null
      }
    },
    'grouplimitNoticeForm.finish_notify_object': function(val) {
      if (val === 0) {
        this.grouplimitNoticeForm.finish_notify_template_name = null
      }
    }
  },
  mounted() {
    this.getEmail()
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
            value: item.tempName
          })
        })
        this.participationEmail = EmailData
      })
    },
    conlog() {
      console.log('limitNoticeForm', this.limitNoticeForm)
    },
    getActiveType(type) {
      this.active_type = type
      this.limitNoticeForm.active_type = type
      this.grouplimitNoticeForm.active_type = type
    },
    pushData() {
      if (this.active_type === 1 || this.active_type === 3) {
        this.limitNoticeForm = {
          ...this.limitNoticeForm
          // is_award_audit: Boolean(this.limitNoticeForm.is_award_audit)
          // active_type: this.limitNoticeForm.active_type * 1,
          // is_award_audit: this.limitNoticeForm.is_award_audit * 1,
          // user_limit: this.limitNoticeForm.user_limit * 1,
          // join_notify_object: this.limitNoticeForm.join_notify_object * 1,
          // progress_notify_object: this.limitNoticeForm.progress_notify_object * 1,
          // finish_notify_object: this.limitNoticeForm.finish_notify_object * 1
        }
        return this.limitNoticeForm
      } else {
        this.grouplimitNoticeForm = {
          ...this.grouplimitNoticeForm
          // active_type: this.grouplimitNoticeForm.active_type * 1,
          // return_limit: this.grouplimitNoticeForm.return_limit * 1,
          // user_limit: this.grouplimitNoticeForm.user_limit * 1,
          // join_notify_object: this.grouplimitNoticeForm.join_notify_object * 1,
          // progress_notify_object: this.grouplimitNoticeForm.progress_notify_object * 1,
          // finish_notify_object: this.grouplimitNoticeForm.finish_notify_object * 1
        }
        return this.grouplimitNoticeForm
      }
    },
    getData(data) {
      if (!data) return
      if (data.active_type === 1 || data.active_type === 3) {
        this.limitNoticeForm = {
        // ...data
          active_type: data.active_type,
          is_award_audit: data.is_award_audit,
          // is_award_audit: Number(data.is_award_audit),
          user_limit: data.user_limit,
          join_notify_object: data.join_notify_object,
          join_notify_template_name: data.join_notify_template_name,
          progress_notify_object: data.progress_notify_object,
          progress_notify_template_name: data.progress_notify_template_name,
          finish_notify_object: data.finish_notify_object,
          finish_notify_template_name: data.finish_notify_template_name
        }
      } else {
        this.grouplimitNoticeForm = {
          active_type: data.active_type,
          user_limit: data.user_limit,
          return_limit: data.return_limit,
          join_notify_object: data.join_notify_object,
          join_notify_template_name: data.join_notify_template_name,
          progress_notify_object: data.progress_notify_object,
          progress_notify_template_name: data.progress_notify_template_name,
          finish_notify_object: data.finish_notify_object,
          finish_notify_template_name: data.finish_notify_template_name
        }
      }
      this.active_type = data.active_type
    }
  }
}
</script>
<style lang="scss" scoped>
  .EmailNotice{
    display: flex;
    justify-content: flex-start;
  }
</style>
<style lang="scss">
  .EmailNotice{
    .notify_template{
      .el-form-item__content{
        margin-left: 15px !important;
      }
    }
  }
</style>
