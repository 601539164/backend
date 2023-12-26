<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="name">
      <el-input v-model="user.name" maxlength="30" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" disabled />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserName } from '@/api/permission'
import { getInfo } from '@/api/user'
import store from '@/store'

export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        name: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
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
          name: response.data.userName
        }
      })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            name: this.user.name
          }
          updateUserName(data).then(async(response) => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            await store.dispatch('user/getInfo')
            this.$emit('update-user')
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
