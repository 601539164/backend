<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="password">
      <el-input v-model="user.password" placeholder="请输入旧密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePassword } from '@/api/permission'

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      user: {
        password: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        password: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: 'requires a length of 7-18, including letters and numbers', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['email'])
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            email: this.email,
            password: this.user.password,
            confirmPassword: this.user.confirmPassword,
            newPassword: this.user.newPassword
          }
          changePassword(data).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.user = {
              password: undefined,
              newPassword: undefined,
              confirmPassword: undefined
            }
          })
        }
      })
    },
    close() {
      this.$router.push('/')
    }
  }
}
</script>
