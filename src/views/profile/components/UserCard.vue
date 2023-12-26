<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>
    <div>
      <div class="text-center">
        <el-avatar> {{ userAvatar }} </el-avatar>
      </div>
      <ul class="list-group list-group-striped">
        <li class="list-group-item">
          <svg-icon icon-class="user" />用户名称
          <div class="pull-right">{{ user.userName }}</div>
        </li>
        <li class="list-group-item">
          <svg-icon icon-class="email" />用户邮箱
          <div class="pull-right">{{ user.email }}</div>
        </li>
        <li class="list-group-item">
          <svg-icon icon-class="tree" />所属部门
          <div v-if="user.dept" class="pull-right">{{ user.dept }}</div>
        </li>
        <li class="list-group-item">
          <svg-icon icon-class="peoples" />所属角色
          <div class="pull-right">{{ user.role }}</div>
        </li>
        <li class="list-group-item">
          <svg-icon icon-class="date" />创建日期
          <div class="pull-right">{{ user.createdTime }}</div>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
import { getInfo } from '@/api/user'

export default {
  data() {
    return {
      user: {},
      userAvatar: '',
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getInfo().then(response => {
        this.user = {
          ...response.data,
          role: response.data.roles.map(ele => ele.roleName).join('/')
        }
        this.userAvatar = this.user.userName.substring(0, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-group-striped > .list-group-item {
	border-left: 0;
	border-right: 0;
	border-radius: 0;
	padding-left: 0;
	padding-right: 0;
}
.list-group {
	padding-left: 0px;
	list-style: none;
}
.list-group-item {
	border-bottom: 1px solid #e7eaec;
	border-top: 1px solid #e7eaec;
	margin-bottom: -1px;
	padding: 11px 0px;
	font-size: 13px;
}
.pull-right {
	float: right !important;
}
</style>
