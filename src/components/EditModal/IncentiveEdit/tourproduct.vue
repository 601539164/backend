<template>
  <div class="tourproduct">
    <div class="tourcontent">
      <div class="tourproductlist">
        <el-tag
          v-for="tag in tags"
          :key="tag"
          :closable="isedit"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          <span>{{ tag }}</span>
        </el-tag>
      </div>
      <div class="totalcontent">
        <div class="total">
          {{ '共计' + tags.length + '件商品' }}
        </div>
        <el-button type="primary" icon="el-icon-close" @click="handleDeleteAllTags">清空</el-button>
      </div>
    </div>
    <el-input
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      placeholder="请输入内容"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
      <template #append>
        <el-button icon="el-icon-circle-plus-outline" @click="inputVisible = true" />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'Tourproduct',
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    isedit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputValue: '',
      inputVisible: false
    }
  },
  methods: {
    handleClose(tag) {
      const index = this.tags.indexOf(tag)
      if (index !== -1) {
        this.tags.splice(index, 1)
      }
      this.$emit('handle-Update', this.tags)
    },
    handleInputConfirm() {
      const inputValue = this.inputValue.trim()
      if (inputValue) {
        this.addTag(inputValue)
        this.inputValue = ''
      }
      this.inputVisible = false
    },
    addTag(tag) {
      const exists = this.tags.includes(tag)
      if (exists) {
        this.$message({
          type: 'warning',
          message: `SKU：${tag}，不可重复添加`
        })
      } else {
        this.tags.unshift(tag)
        this.$emit('handle-Update', this.tags)
      }
    },
    handleDeleteAllTags() {
      this.tags.splice(0)
      this.$emit('handle-Update', this.tags)
    }
  }
}
</script>
<style lang="scss">
    .tourproduct{
        width: 80%;
        display: flex;
        flex-direction: column-reverse;
        .el-form-item__content{

        }
        .el-icon-close{
            top: 0;
            right: 0;
            color: #000;
            &:hover{
                background: #808080;
            }
        }
    }

</style>
  <style lang="scss" scoped>
    .input-new-tag{
        width: 85%;
    }
    .tourcontent{
        display: flex;
        width: 100%;
        .tourproductlist{
            width: 75%;
        }
        .totalcontent{
            width: 25%;
            padding: 12px;
            .total{
                margin-bottom: 20px;
            }
            .el-button{
                background: transparent;
                color: #808080;
                border: none;
            }
        }
    }
    .tourproductlist{
        margin-top: 12px;
        height: 120px;
        overflow-x:hidden ;
        display: flex;
        align-items: center;
        flex-direction: column;
        border: 1px solid #DCDFE6;
        padding: 12px;
        border-radius: 4px;
        .el-tag{
            margin-bottom: 8px;
            width: 100%;
            display: flex;
            align-items: center;
            background:#F3F3F3;
            border-radius: 2px;
            border-color:#F3F3F3;
            padding:8px 12px ;
            span{
                flex: 1;
                color: #000;
            }

        }
    }
</style>
