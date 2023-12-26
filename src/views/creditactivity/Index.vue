<template>
  <div class="creditpage">
    <filter-tool :filter-list="filterList" :form-data="formData" />
    <tab-list :current-value="currentValue" :tabs="tabs" :btn="btn" @tabClick="selectStatus" />
    <div
      style="
            margin: 12px 0;
            height: 1px;
            background-color: #eeeeee;
            width: 100%;
          "
    />
    <div class="total-content">
      <div class="total-info">共查询到 {{ total }} 项</div>
      <div v-if="multipleSelection.length > 0" class="right-content">
        <div class="total-info">共选择  {{ multipleSelection.length }} 项</div>
        <div class="operator">
          <el-button type="text" class="pass-btn" @click="multipleUpadateItem(multipleSelection,1)">
            批量生效
          </el-button>
          <el-button type="text" class="fail-btn" @click="multipleUpadateItem(multipleSelection,3)">
            批量作废
          </el-button>

        </div>
      </div>
    </div>
    <div>
      <el-table v-loading="loading" border :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column label="活动ID">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">{{ scope.row.campaignName }}</template>
        </el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="scope">
            {{ scope.row.startTs }}
            <br />
            <div style="text-">-</div>
            {{ scope.row.endTs }}
          </template>
        </el-table-column>
        <el-table-column label="活动状态">
          <template slot-scope="scope">{{ getStatusText(scope.row.status) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetails(scope.row)">查看明细</el-button>
            <el-button type="text" @click="changeStatusItem(scope.row.id,scope.row.status)">
              <div v-if="scope.row.status !== 2">
                上线
              </div>
              <div v-else>
                下线
              </div>
            </el-button>

            <el-button type="text" @click="updateDtails(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import dayjs from 'dayjs'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import { getActivityPage, changeStatus, deleteActivity } from '@/api/credit'

export default {
  name: 'Creditpage',
  components: {
    FilterTool,
    TabList
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentValue: -1,
      multipleSelection: [],
      tabs: {
        title: ' ',
        radios: []
      },
      btn: [
        {
          label: '+ 新增活动',
          type: 'primary',
          click: this.addNewActivity.bind(this)
        }
      ],
      searchData: [],
      tableData: [],
      formData: {}
    }
  },
  computed: {
    getStatusText() {
      return function(status) {
        switch (status) {
          case 1:
            return '未生效'
          case 2:
            return '生效中'
          case 3:
            return '已过期'
          case 4:
            return '下线'
          default:
            return ''
        }
      }
    },
    filterList() {
      return [
        {
          type: 'input',
          label: '名字：',
          placeholder: '请输入活动名称',
          props: 'campaignName'
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addNewActivity({ 新增活动: name }) {
      this.$router.push({
        name: 'creditActivityDetail/:id',
        params: { id: '00' },
        query: { name }
      })
    },
    getList(page = 1) {
      this.loading = true
      const params = {
        size: this.pageSize,
        currentPage: page || this.currentPage,
        campaignName: this.searchData.campaignName || ''
      }
      getActivityPage(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.tableData.forEach((item) => {
          item.startTs = this.transferDate(item.startTs, item.timeOffset)
          item.endTs = this.transferDate(item.endTs, item.timeOffset)
        })
      })
    },
    viewDetails(row) {
      const { id, campaignName } = row
      this.$router.push({
        name: 'creditOfChanges/:id',
        params: { id },
        query: { name: campaignName, row }
      })
    },
    updateDtails(row) {
      const { id, campaignName } = row
      this.$router.push({
        name: 'creditActivityDetail/:id',
        params: { id },
        query: { campaignName, row }
      })
    },
    deleteItem(row) {
      const { id, campaignName } = row
      this.$confirm(`确认要删除"${campaignName}"该活动吗？`, `删除"${campaignName}"活动`, 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteActivity(id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList(this.currentPage)
          })
        })
        .catch((_) => {})
    },
    selectStatus(value) {
      this.currentValue = value
      this.searchData.status = value !== -1 ? value === 1 : ''
      this.getList()
    },
    // 时间戳转换格式
    transferDate(itemTime, active_time_zone) {
      const currentTimeZone = dayjs().utcOffset() / 60
      const timezoneUnit = 3600000
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
      const res = String(str).match(reg)
      return res[0]
    },
    changeStatusItem(id, status) {
      this.$confirm(status === 2 ? `确认禁用？` : '确认启用？')
        .then((_) => {
          status = status === 2 ? 3 : status === 1 ? 2 : status === 3 ? 2 : 1
          const data = {
            id,
            status
          }
          changeStatus(data).then(() => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.getList(this.currentPage)
          })
        })
        .catch((_) => {})
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList(value)
    }
  }
}
</script>

  <style lang="scss" scoped>
.total-info {
  font-size: 12px;
  color: #adadad;
}
.creditpage {
  padding: 20px;
}
.total-content{
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 17px;
  .right-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    .total-info{
      margin-right: 40px;
    }
  }
}
</style>
