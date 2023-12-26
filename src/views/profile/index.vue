<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card ref="userCard" :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>基础信息</span>
            </div>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="userinfo">
                <userInfo ref="userInfo" :user="user" @update-user="getUser" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="resetPwd">
                <resetPwd />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import resetPwd from './components/resetPwd'
import userInfo from './components/userInfo'

export default {
  name: 'Profile',
  components: { UserCard, resetPwd, userInfo },
  data() {
    return {
      user: {},
      activeTab: 'userinfo'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'email',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.role,
        email: this.email
      }
      this.$nextTick(() => {
        this.$refs.userCard.getUser()
        this.$refs.userInfo.getUser()
      })
    }
  }
}
</script>
