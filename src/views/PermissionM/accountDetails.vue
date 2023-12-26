<template>
  <div class="accountDetails-page">
    <el-form
      ref="formLabelAlign"
      v-loading="loading"
      label-position="left"
      label-width="100px"
      :model="formLabelAlign"
      :rules="formRules"
    >
      <el-form-item label="所属站点" prop="site">
        <el-select
          v-model="formLabelAlign.site"
          placeholder="请选择所属站点"
          clearable
          :disabled="disabledSite"
        >
          <el-option
            v-for="(item, key) in siteOptions"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formLabelAlign.userName" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="E-Mail" prop="email">
        <el-input v-model="formLabelAlign.email" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item v-if="this.$route.params.id === '00'" label="密码" prop="password">
        <el-input v-model="formLabelAlign.password"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="isDisable">
        <template>
          <el-radio v-model="formLabelAlign.isDisable" :label="0">启用</el-radio>
          <el-radio v-model="formLabelAlign.isDisable" :label="1">禁用</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="账号有效期" prop="availableType">
        <template>
          <el-radio v-model="formLabelAlign.availableType" :label="1">永久有效</el-radio>
          <el-radio v-model="formLabelAlign.availableType" :label="2">指定时间后失效</el-radio>
          <el-date-picker
            v-if="formLabelAlign.availableType === 2"
            v-model="formLabelAlign.availableTs"
            type="date"
            placeholder="选择结束日期时间"
            value-format="timestamp"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </template>
      </el-form-item>
      <el-form-item v-if="rolesOption.length" label="角色选择" prop="roles">
        <template>
          <el-checkbox-group v-model="formLabelAlign.roles">
            <el-checkbox
              v-for="item in rolesOption"
              :key="item.value"
              :value="item.value"
              :label="item.value"
            >{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>
      <el-form-item label="渠道" prop="channel">
        <el-input v-model="formLabelAlign.channel" disabled></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="dept">
        <el-input v-model="formLabelAlign.dept"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formLabelAlign.remark" type="textarea"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button v-if="this.$route.params.id !== '00'" type="primary" @click="updateAccount()">更新</el-button>
        <el-button v-else type="primary" @click="createAccount()">创建</el-button>
        <el-button type="info" @click="goToAccount()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserPage, getRoutesList, createUser, updateUser } from '@/api/permission'

export default {
  data() {
    return {
      loading: false,
      formLabelAlign: {
        id: '',
        site: '',
        userName: '',
        email: '',
        password: '',
        isDisable: 1,
        availableType: '',
        availableTs: '',
        dept: '',
        remark: '',
        channel: 'BC',
        roles: []
      },
      formRules: {
        site: [
          { required: true, message: '请选择账号所属站点', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请填写用户名', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请填写E-Mail', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'change' }
        ],
        isDisable: [
          { required: true, message: '请至少选择一种状态', trigger: 'change' }
        ],
        availableType: [
          { required: true, message: '请至少选择一种有效形式', trigger: 'change' }
        ],
        availableTs: [
          { required: true, message: '请选择结束日期时间', trigger: 'change' }
        ],
        roles: [
          { required: true, message: '请至少选择一个角色', trigger: 'change' }
        ],
        channel: [
          { required: true, message: '请填写渠道', trigger: 'change' }
        ]
      },
      tempRoute: {},
      disabledSite: true,
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
  computed: {
    ...mapGetters([
      'level',
      'station'
    ]),
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
    'formLabelAlign.availableType': function(val) {
      if (val === 1) {
        this.formLabelAlign.availableTs = ''
      }
    },
    'formLabelAlign.site': function(val) {
      if (this.level !== 1) return
      if (val) {
        this.getRolesOption(this.formLabelAlign.site)
      } else {
        this.rolesOption = []
        this.formLabelAlign.roles = []
      }
    }
  },
  created() {
    const id = this.$route.params.id // 获取路由参数中的 ID
    const name = id !== '00' ? `details-${id}` : 'details' // 根据 ID 生成页面标题
    document.title = name // 设置页面标题
    const title = id !== '00' ? `账号详情-${id}` : '创建账号'

    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: title })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题
  },
  mounted() {
    this.initAccountDetails()
    // this.getRolesOption()
    if (this.$route.params.id) {
      this.getAccountDetails()
    }
  },
  methods: {
    getAccountDetails() {
      if (this.$route.params.id !== '00') {
        const params = {
          size: 10,
          currentPage: 1,
          id: this.$route.params.id,
          site: this.level === 1 ? this.$route.query.site : ''
        }
        getUserPage(params).then((res) => {
          const row = res.data.list[0]
          this.formLabelAlign = {
            ...row,
            roles: row.roles.map(ele => ele.id),
            availableTs: row.availableTs * 1000
          }
        })
      }
    },
    initAccountDetails() {
      if (this.level === 1) {
        this.disabledSite = false
        this.formLabelAlign.site = ''
      } else {
        this.disabledSite = true
        this.formLabelAlign.site = this.station
        this.getRolesOption(this.formLabelAlign.site)
      }
    },
    // getAccountDetails() {
    //   if (this.$route.params.id) {
    //     const row = this.$route.query.row
    //     this.formLabelAlign = {
    //       ...row,
    //       roles: row.roles.map(ele => ele.id),
    //       availableTs: row.availableTs * 1000
    //     }
    //   }
    // },
    getRolesOption(val) {
      this.rolesOption = []
      const data = {
        site: val
      }
      getRoutesList(data).then((res) => {
        res.data.forEach((item) => {
          this.rolesOption.push({
            label: item.roleName,
            value: item.id
          })
        })
      })
    },
    createAccount() {
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          const data = {
            ...this.formLabelAlign,
            availableTs: this.formLabelAlign.availableTs / 1000
          }
          createUser(data).then(response => {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.formLabelAlign = {
              id: '',
              userName: '',
              email: '',
              password: '',
              isDisable: 1,
              availableType: '',
              availableTs: '',
              dept: '',
              remark: '',
              channel: 'BC',
              roles: []
            }
            this.$router.push('/settings/account')
          })
        }
      })
    },
    updateAccount() {
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          const data = {
            ...this.formLabelAlign,
            availableTs: this.formLabelAlign.availableTs / 1000
          }
          updateUser(this.$route.params.id, data).then(response => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.formLabelAlign = {
              id: '',
              userName: '',
              email: '',
              password: '',
              isDisable: 1,
              availableType: '',
              availableTs: '',
              dept: '',
              remark: '',
              channel: 'BC',
              roles: []
            }
            this.$router.push('/settings/account')
          })
        }
      })
    },
    goToAccount() {
      this.$router.push('/settings/account')
    }
  }
}
</script>

<style lang="scss" scoped>
  .accountDetails-page{
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
