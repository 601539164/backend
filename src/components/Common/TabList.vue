<template>
  <div class="tab-btns">
    <div v-if="tabs" class="tabs">
      <div class="tab-title">{{ tabs.title }}</div>

      <div
        v-for="(item, key) in tabs.radios"
        :key="key"
        class="tab-item"
        :class="{
          normal: item.value !== currentValue,
          isSelect: item.value === currentValue
        }"
        @click="handleTabClick(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <div>
      <el-button
        v-for="item in btn"
        :key="item.label"
        :type="item.type || 'primary'"
        @click="item.click"
      >
        <i v-if="item.icon" :class="item.icon"></i> {{ item.label }}
      </el-button>
    </div>
    <div v-if="note" style="color: #D8D8D8;">
      <i :class="note.icon"></i> <span>{{ note.text }} {{ note.time }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabList',
  props: {
    currentValue: {
      type: [Number, String],
      default: -1
    },
    tabs: {
      type: Object,
      default: () => {}
    },
    btn: {
      type: Array,
      default: () => {}
    },
    note: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  emits: ['tabClick'],
  methods: {
    handleTabClick(value) {
      this.$emit('tabClick', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tabs {
    display: flex;
    align-items: center;
    font-size: 14px;
    .tab-title {
      margin-right: 12px;
      font-weight: 500;
    }
    .tab-item {
      padding: 4px 8px;
      margin-right: 12px;
      color: #808080;
      cursor: pointer;
      &:hover {
        color: #2b7de1;
        background-color: rgba(43, 125, 225, 0.05);
      }
    }
  }
}

.isSelect {
  color: #2b7de1 !important;
  background-color: rgba(43, 125, 225, 0.05) !important;
}
</style>
