<template>
  <div class="filter-tool">
    <div
      v-for="(item, key) in filterList"
      :key="key"
      :span="item.span || 5"
      class="filter-item"
    >
      <div v-if="item.type !== 'button'" class="filter-label">
        {{ item.label }}
      </div>

      <el-select
        v-if="item.type === 'select'"
        v-model="formData[item.props]"
        :placeholder="item.placeholder || '请选择下拉选择'"
        clearable
        :style="{ width: item.width || '100%' }"
      >
        <el-option
          v-for="(op, index) in item.options"
          :key="index"
          :label="op.label"
          :value="op.value"
          :disabled="op.disabled"
        />
      </el-select>

      <el-date-picker
        v-if="item.type === 'date'"
        v-model="formData[item.props]"
        format="YYYY-MM-DD"
        :style="{ width: item.width || '100%' }"
        :placeholder="item.placeholder || '请选择日期'"
        clearable
      />
      <el-date-picker
        v-if="item.type === 'datetime'"
        v-model="formData[item.props]"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        :style="{ width: item.width || '100%' }"
        :placeholder="item.placeholder || '请选择日期'"
        clearable
      />
      <el-date-picker
        v-if="item.type === 'daterange'"
        v-model="formData[item.props]"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :style="{ width: item.width || '100%' }"
        :placeholder="item.placeholder || '请选择日期'"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        clearable
      />
      <el-input
        v-if="item.type === 'input'"
        v-model="formData[item.props]"
        :placeholder="item.placeholder || '请输入内容'"
        clearable
        :style="{ width: item.width || '100%' }"
      />
      <el-button
        v-if="item.type === 'button'"
        :type="item.btnType"
        :size="item.size || 'default'"
        @click="item.click && item.click(formData)"
      >
        {{ item.label }}
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    filterList: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },

  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.filter-tool {
  display: flex;
  align-items: center;
  /* flex-wrap: wrap; */
  margin-bottom: 20px;

  .filter-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    flex-grow: 01;
    font-weight: 500;
    margin-right: 40px;
    &:last-child {
      text-align: right;
      justify-content: flex-end;
      margin-right: 0;
    }
    .filter-label {
      flex-shrink: 0;
      flex-grow: 1;
      margin-right: 12px;
    }
  }
}
</style>
