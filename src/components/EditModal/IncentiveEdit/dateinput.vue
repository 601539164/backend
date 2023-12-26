<template>
  <div class="active-statistical">
    <div
      v-for="(item, key) in statisticalList"
      :key="key"
      :span="item.span || 5"
      class="statistical-item"
    >
      <div class="statistical-date">
        {{ item.value }}
      </div>
      <div class="statistical-label">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    statisticalList: {
      type: Array,
      default: () => []
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
.statistical-item {
  border-radius: 4px;
  background: #FAFAFA;
  max-width: 200px;
  padding: 12px 40px;
  .statistical-date {
    color: #333;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
  }
  .statistical-label {
    color: #808080;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
