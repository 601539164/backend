<template>
  <div class="common-page">
    <div class="title">
      <el-tag>credit </el-tag>
      <span> {{ this.$route.query.name }}变动明细</span></div>
    <filter-tool
      :filter-list="filterList"
      :form-data="formData"
    />
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
    <div class="total-content">
      <div class="total-info">共查询到 {{ total }} 项</div>
      <div v-if="multipleSelection.length > 0" class="right-content">
        <div class="total-info">共选择  {{ multipleSelection.length }} 项</div>
        <div class="operator">
          <el-button type="text" class="pass-btn" @click="multipleUpadateItem(multipleSelection,3)">
            批量通过
          </el-button>
          <el-button type="text" class="fail-btn" @click="multipleUpadateItem(multipleSelection,4)">
            批量不通过
          </el-button>

        </div>
      </div>
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        height="calc(100vh - 307px)"
        class="vetlist"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35"
        >
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="获得credit">
          <template slot-scope="scope">
            {{ scope.row.awardAmount }}
            ( {{ scope.row.awardStatus }})
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="text" @click="detailItem(row)">
              详情
            </el-button>
            <el-button class="pass-btn" type="text" @click="(row, 3)">
              停止发放
            </el-button>
            <el-button class="fail-btn" type="text" @click="failItem(row, 4)">
              立即发放
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
    <orderDetail ref="editModal" @addSuccess="refreshList" @failpassItem="DetailpassItem" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import orderDetail from '@/components/EditModal/CreditModal/orderDetail.vue'
import { getRecordPage, exportRecord } from '@/api/credit'
export default {
  name: 'ActivitylinkList',
  components: {
    FilterTool,
    TabList,
    orderDetail
  },
  props: {
  },
  data() {
    return {
      loading: false,
      pageSize: 20,
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
          label: '+ 导出',
          type: 'primary',
          click: this.clickDownload
        }
      ],
      columns: [
        {
          prop: 'index',
          label: '#',
          width: 60
        },
        {
          prop: 'email',
          label: '用户邮箱'
        },
        {
          prop: 'incentiveType',
          label: '活动名称'
        },
        {
          prop: 'createdTime',
          label: '创建时间'
        },
        {
          prop: 'activityProductAmount',
          label: '参与活动商品金额'
        },
        {
          prop: 'awardAmount',
          label: '奖励金额'
        },
        {
          prop: 'rewardType',
          label: '奖励发放时间'
        }
      ],
      tableData: [

      ],
      formData: {},
      // ===========
      rolelist: [],
      activetype: [
        { label: 'Credit', value: 1 },
        { label: 'Cash', value: 2 },
        { label: 'coupon', value: 3 },
        { label: 'discount', value: 4 }
      ]
    }
  },
  computed: {
    filterList() {
      return [

      ]
    },
    ...mapGetters([
      'station'
    ])
  },
  created() {
    const query_name = this.$route.query.name// 获取路由参数中的 ID
    const name = `活动关联用户列表-${query_name}` // 根据 ID 生成页面标题
    document.title = name // 设置页面标题
    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: `${name}` })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题,
    // for (const [value, label] of Object.entries(awardObjectType)) {
    //   this.rolelist.push({
    //     label,
    //     value: parseInt(value)
    //   })
    // }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(page = 1) {
      this.loading = true
      const params = {
        activityId: this.$route.params.id,
        currentPage: page || this.currentPage,
        size: this.pageSize,
        email: this.formData.email || undefined // filter
      }
      getRecordPage(params)
        .then((res) => {
          const { data } = res
          const awardsStatusMap = new Map([
            [1, '无奖励'],
            [2, '待发放'],
            [3, '停止发放'],
            [4, '发放成功']
          ])
          const orderStatusMap = new Map([
            [0, 'Incomplete'],
            [1, 'Pending'],
            [2, 'Shipped'],
            [3, 'Partially Shipped'],
            [4, 'Refunded'],
            [5, 'Cancelled'],
            [6, 'Declined'],
            [7, 'Awaiting Payment'],
            [8, 'Awaiting Pickup'],
            [9, 'Awaiting Shipment'],
            [10, 'Completed'],
            [11, 'Awaiting Fulfillment'],
            [12, 'Manual Verification Required'],
            [13, 'Disputed'],
            [14, 'Partially Refunded']
          ])
          this.tableData = data.list.map(({ awardStatus, orderStatus, ...rest }) => {
            return {
              awardStatus: awardsStatusMap.get(awardStatus),
              orderStatus: orderStatusMap.get(orderStatus),
              ...rest
            }
          })
          this.total = data.totalCount
          this.tableData.forEach((e, i) => {
            e.index = this.pageSize * (this.currentPage - 1) + i + 1
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    clickDownload() {
      const clickdata = {
        id: this.$route.params.id
      }
      exportRecord(clickdata)
        .then((data) => {
          const fileName = 'credit变动明细.xls'
          const downloadUrl = URL.createObjectURL(data.res)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = fileName
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
        })
        .catch((_) => {})
    },
    refreshList(a) {
    },

    selectStatus(value) {
      this.currentValue = value
      this.getList()
    },
    detailItem(row) {
      this.$refs.editModal.show(row)
    },
    DetailpassItem(par) {
      const { row, status } = par
      console.log(row)
      this.$confirm(status === 3 ? `确认审批通过` : '确认审批不通过', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((_) => {
        this.loading = true
      })
        .catch((_) => {
          this.loading = false
        })
    },
    failItem(row, status) {
      console.log(row)
      this.$confirm(status === 3 ? `确认审批通过` : '确认审批不通过', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((_) => {
        this.loading = true
        this.loading = false
      })

        .catch((_) => {
          this.loading = false
        })
    },
    removeItem(row) {
      console.log('vetting', row)
    },
    // ======own
    handleSelectionChange(val) {
      console.log('val', val)
      this.multipleSelection = val
    },
    multipleUpadateItem(row, status) {
      this.$confirm(status === 3 ? '确认批量审批通过' : '确认批量审批不通过 ?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((_) => {
        this.loading = true
        const itemsid = []
        row.map((item) => {
          itemsid.push(item.id)
        })

        this.loading = false
      })
        .catch((_) => {
          this.loading = false
        })
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList(value)
    }
  }
}
</script>
<style lang="scss">
  .common-page{
    color: #000  !important;
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
