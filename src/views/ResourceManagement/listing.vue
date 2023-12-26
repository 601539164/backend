<template>
  <div class="app-container">
    <filter-tool :filter-list="filterList" :form-data="formData" />
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
      <div class="total-info">共查询到 {{ total }} 项</div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; margin-top: 20px"
        :row-style="rowStyle"
      >
        <el-table-column label="页面名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="页面模板">
          <template slot-scope="scope">
            {{ scope.row.templateVersion }}
          </template>
        </el-table-column>
        <el-table-column label="有效时间">
          <template slot-scope="scope">
            <span>
              {{ scope.row.beginTime }}
            </span><br>
            <span>
              {{ scope.row.endTime }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updatedTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">Active</el-tag>
            <el-tag v-else-if="scope.row.status === 0" type="warning">Pending</el-tag>
            <el-tag v-else type="info">Inactive</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="editItem(scope.row)">
              详情
            </el-button>
            <el-button type="text" @click="previewItem(scope.row)">
              快览
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total > 10" style="margin-top: 16px; text-align: right">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
    <ResourcesListingEdit ref="editModal" @addSuccess="refreshList" />
  </div>
</template>
<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import ResourcesListingEdit from '@/components/EditModal/RMEditModal/ResourcesListingEdit.vue'
import { getListingResources } from '@/api/resources'
import dayjs from 'dayjs'
export default {
  name: 'ResourceManageListing',
  components: {
    FilterTool,
    TabList,
    ResourcesListingEdit
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentValue: -1,
      btn: [{
        label: '+ 创建页面',
        type: 'primary',
        click: this.addNewPage.bind(this)
      }],
      tabs: {
        title: '状态：',
        radios: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '生效中',
            value: 1
          },
          {
            label: '待生效',
            value: 0
          },
          {
            label: '已失效',
            value: 2
          }
        ]
      },
      formData: {},
      searchData: {},
      typeOptions: []
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '页面名称：',
          placeholder: '请输入页面名称',
          props: 'name'
        },
        {
          type: 'input',
          label: '页面模板：',
          placeholder: '请输入页面模板',
          props: 'templateVersion'
        },
        {
          type: 'input',
          label: '产品sku：',
          placeholder: '请输入sku',
          props: 'sku'
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (searchData) => {
            this.currentPage = 1
            this.searchData = searchData
            this.getList()
          }
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    refreshList() {
      // this.pageSize = 10
      // this.pageUrl = ''
      // this.formData.pageUrl = ''
      // this.formData.resName = ''
      // this.currentValue = -1
      // this.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        name: this.searchData.name || '',
        templateVersion: this.searchData.templateVersion || '',
        sku: this.searchData.sku || '',
        status: this.currentValue < 0 ? '' : this.currentValue
      }
      getListingResources(params).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableData.forEach((item) => {
          item.beginTime = this.transferDate(item.beginTime, item.timeZone)
          item.endTime = this.transferDate(item.endTime, item.timeZone)
        })
      })
    },
    transferDate(itemTime, active_time_zone) {
      const currentTimeZone = dayjs().utcOffset() / 60
      const timezoneUnit = 3600000
      // 服务器保存的是先减去当前时区再加上时区的时间
      // 本地显示的是先减去选择的时间再加上当前时区
      const timeZoneNum = this.getNum(active_time_zone) * timezoneUnit
      const currentTimeZoneNum = currentTimeZone * timezoneUnit
      const transferTime = dayjs(
        itemTime * 1000 + timeZoneNum - currentTimeZoneNum
      ).format('YYYY-MM-DD HH:mm:ss')
      return transferTime
    },
    // 截取字符串中的数字包含正负号
    getNum(str) {
      const reg = /-?\d+/g
      const res = str.match(reg)
      return res[0]
    },
    selectStatus(value) {
      this.currentValue = value
      this.getList()
    },
    addNewPage() {
      this.$refs.editModal.show()
    },
    editItem(row) {
      const item = {
        id: row.id,
        name: row.name,
        isEdit: true
      }
      this.$refs.editModal.show(item)
    },
    previewItem(row) {
      const item = {
        id: row.id,
        name: row.name,
        isPreview: true
      }
      this.$refs.editModal.show(item)
    },
    rowStyle(scope) {
      if (scope.row.status === 0) {
        return { color: ' #999999' }
      } else if (scope.row.status === 2) {
        return { color: ' #CDCDCD' }
      } else {
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.total-info {
  font-size: 12px;
  color: #adadad;
}
</style>
