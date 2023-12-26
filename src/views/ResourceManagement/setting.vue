<template>
  <div class="app-container">
    <tab-list
      :current-value="currentValue"
      :tabs="tabs"
      :btn="btn"
      @tabClick="selectStatus"
    />
    <div
      style="
        margin: 12px 0;
        height: 1px;
        background-color: #eeeeee;
        width: 100%;
      "
    />
    <div>
      <div class="table-header-tools">
        <div class="total-info">共查询到 {{ total }} 项</div>
        <div class="tool-info">
          类型码搜索：<el-input
            v-model="code"
            placeholder="请输入类型码"
            @change="searchByCode"
          />
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        />
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total > 10" style="margin-top: 16px; text-align: right">
        <el-pagination
          :current-page="currentPage"
          :total="total"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <ResourcesSettingEdit ref="editModal" @submitOver="refreshList" />
  </div>
</template>
<script>
import TabList from '@/components/Common/TabList.vue'
import ResourcesSettingEdit from '@/components/EditModal/RMEditModal/ResourcesSettingEdit.vue'
import { getResourcesSettingList, getResourcesTypeList } from '@/api/resources'

export default {
  name: 'ResourceManageSetting',
  components: {
    TabList,
    ResourcesSettingEdit
  },
  data() {
    return {
      loading: false,
      code: '',
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      columns: [
        {
          prop: 'index',
          label: '#'
        },
        {
          prop: 'resLocationType',
          label: '分类'
        },
        {
          prop: 'typeCode',
          label: '类型码'
        },
        {
          prop: 'slotNum',
          label: 'Slot数量'
        },
        {
          prop: 'effectiveSiteText',
          label: '站点'
        },
        {
          prop: 'status',
          label: '最近更新'
        }
      ],
      currentValue: '0',
      btn: [{
        label: '创建类型规则',
        type: 'primary',
        click: this.addNewResources.bind(this)
      }],
      tabs: {}
    }
  },
  mounted() {
    this.getList()
    this.getTypeList()
  },
  methods: {
    getTypeList() {
      getResourcesTypeList()
        .then((res) => {
          const radios = res.data.map((e) => {
            return {
              label: e,
              value: e
            }
          })
          radios.unshift({
            label: '全部',
            value: '0'
          })
          this.tabs = {
            radios,
            titles: '资源位分类:'
          }
        })
        .catch(() => {})
      // console.log(this.tabs)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    refreshList() {
      // this.currentPage = 1
      // this.code = ''
      // this.currentValue = '0'
      this.getList()
    },
    getList() {
      this.loading = true
      getResourcesSettingList({
        size: this.pageSize,
        currentPage: this.currentPage,
        typeCode: this.code,
        resLocationType: this.currentValue === '0' ? '' : this.currentValue
      })
        .then((res) => {
          this.loading = false
          this.tableData = res.data.list
          this.tableData.forEach((e, i) => {
            e.index = this.pageSize * (this.currentPage - 1) + i + 1
            e.effectiveSiteText = e.effectiveSite.join(' ')
          })
          this.total = res.data.totalCount
        })
        .catch(() => {
          this.loading = false
        })
    },
    selectStatus(value) {
      this.currentValue = value
      this.currentPage = 1
      this.getList()
    },
    addNewResources() {
      this.$refs.editModal.show()
    },
    searchByCode() {
      this.currentPage = 1
      this.getList()
    },
    showDetail(row) {
      this.$refs.editModal.show(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-header-tools {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 20px 0;
  align-items: center;
  .total-info {
    font-size: 12px;
    color: #adadad;
  }
  .tool-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: #000;
    .el-input {
      width: 200px;
    }
  }
}
</style>
