<template>
  <div class="countdown-page">

    <el-form
      ref="ruleForm"
      v-loading="loading"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="显示开关" required prop="status">
        <el-switch v-model="ruleForm.status" /><span class="demonstration">{{ ruleForm.status ? '开启中' : '关闭中' }}</span>
      </el-form-item>
      <el-form-item label="开始时间" required prop="startTime">
        <el-date-picker v-model="ruleForm.startTime" type="datetime" placeholder="选择日期时间" value-format="timestamp" /><span
          class="demonstration"
        >需要换算成中国时间后填入</span>
      </el-form-item>
      <el-form-item label="结束时间" required prop="endTime">
        <el-date-picker v-model="ruleForm.endTime" type="datetime" placeholder="选择日期时间" value-format="timestamp" /><span
          class="demonstration"
        >需要换算成中国时间后填入</span>
      </el-form-item>
      <el-form-item label="按钮链接" prop="url">
        <el-input v-model="ruleForm.url" type="textarea" />
      </el-form-item>
      <el-form-item label="按钮文案" prop="btnText">
        <el-input v-model="ruleForm.btnText" type="textarea" />
      </el-form-item>
      <el-form-item label="文案" prop="text">
        <el-input v-model="ruleForm.text" type="textarea" />
      </el-form-item>
      <el-form-item label="结构预览">
        <span class="structure">{{ ruleForm.text }}</span><el-button size="small" round>{{ ruleForm.btnText
        }}</el-button><span class="demonstration">仅供结构预览，操作无效，样式与产品经理沟通</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getCDInfo,
  refreshCDInfo
} from '@/api/countdown'

export default {
  name: 'Countdown',
  data() {
    return {
      loading: false,
      ruleForm: {
        status: false,
        startTime: '',
        endTime: '',
        url: '',
        btnText: '',
        text: ''
      },
      rules: {
        startTime: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        url: [
          { required: false, message: '请填写url', trigger: 'blur' }
        ],
        btnText: [
          { required: false, message: '请填写按钮文案', trigger: 'blur' }
        ],
        text: [
          { required: false, message: '请填写文案', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getCuntdownList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            status: this.ruleForm.status ? 1 : 0,
            startTime: this.ruleForm.startTime / 1000,
            endTime: this.ruleForm.endTime / 1000,
            url: this.ruleForm.url,
            btnText: this.ruleForm.btnText,
            text: this.ruleForm.text
          }

          refreshCDInfo(data).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getCuntdownList()
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getCuntdownList() {
      getCDInfo()
        .then((res) => {
          this.loading = true
          const data = res.data
          const status = data.status !== 0
          this.ruleForm.status = status
          this.ruleForm.startTime = data.startTime * 1000
          this.ruleForm.endTime = data.endTime * 1000
          this.ruleForm.url = data.url
          this.ruleForm.btnText = data.btnText
          this.ruleForm.text = data.text
          this.loading = false
        })
    }

  }

}
</script>

<style lang="scss" scoped>
.countdown-page {
  margin: 10px 20px;

  .demonstration {
    padding-left: 10px;
    color: #ccc;
  }

  .structure {
    margin-right: 10px;
  }
}
</style>
