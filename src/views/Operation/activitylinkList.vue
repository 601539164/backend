<template>
  <div class="activitylinkList-page">
    <div class="title"><el-tag>根</el-tag><span>{{ this.$route.query.name }}/ 活动关联用户列表</span></div>
    <filter-tool
      :filter-list="filterList"
      :form-data="formData"
    />
    <tab-list
      :current-value="currentValue"
      :tabs="tabs"
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

        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="text" @click="detailItem(row)">
              详情
            </el-button>
            <el-button v-if="row.rewardStatus === '审批中' " class="pass-btn" type="text" @click="failItem(row, 3)">
              通过
            </el-button>
            <el-button v-if="row.rewardStatus === '审批中' " class="fail-btn" type="text" @click="failItem(row, 4)">
              不通过
            </el-button>
            <el-button v-if="row.rewardStatus === '审核通过' || row.rewardStatus === '审核不通过' || row.rewardStatus === '活动奖励已发放'" disabled type="text">
              {{ row.rewardStatus }}
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
    <vettingDetail ref="editModal" @addSuccess="refreshList" @failpassItem="DetailpassItem" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import vettingDetail from '@/components/EditModal/IncentiveEdit/vettingDetail.vue'
import { getApprovalRewards, approvalRewards } from '@/api/activities'
import { awardObjectType } from '@/utils/parameters'
export default {
  name: 'ActivitylinkList',
  components: {
    FilterTool,
    TabList,
    vettingDetail
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
        title: '状态：',
        radios: [
          {
            label: '全部',
            value: -1
          },

          {
            label: '进行中',
            value: 2
          },
          {
            label: '审核通过',
            value: 5
          },
          {
            label: '审核不通过',
            value: 4
          }

        ]
      },
      columns: [
        {
          prop: 'index',
          label: '#',
          width: 60
        },
        {
          prop: 'identityType',
          label: '用户身份',
          width: 100
        },
        {
          prop: 'sharerEmail',
          label: '用户邮箱'
        },
        {
          prop: 'incentiveType',
          label: '激励动作'
        },
        {
          prop: 'rewardType',
          label: '激励类型'
        },
        {
          prop: 'orderStatus',
          label: '订单状态'
        },
        {
          prop: 'rewardStatus',
          label: '状态'
        },
        {
          prop: 'rewardNum',
          label: '数量',
          width: 80
        },
        {
          prop: 'updatedTime',
          label: '最后更新'
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
        // {
        //   type: 'select',
        //   label: '用户身份：',
        //   placeholder: '全部',
        //   props: 'identityType',
        //   options: this.rolelist
        // }, 后续做
        {
          type: 'input',
          label: '用户邮箱：',
          placeholder: '请输入',
          props: 'sharerEmail'
        },
        {
          type: 'select',
          label: '激励类型：',
          placeholder: '全部',
          props: 'rewardType',
          options: this.activetype
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (formData) => {
            console.log(formData, 'formData')
            this.formData = formData
            this.currentPage = 1
            this.getList()
          }
        }
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
    for (const [value, label] of Object.entries(awardObjectType)) {
      this.rolelist.push({
        label,
        value: parseInt(value)
      })
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(page = 1) {
      this.loading = true
      const params = {
        activeId: this.$route.params.id,
        page: page || this.currentPage,
        size: this.pageSize,
        sharerEmail: this.formData.sharerEmail || undefined, // filter
        identityType: this.formData.identityType || undefined,
        rewardType: this.formData.rewardType || undefined,
        rewardStatus: this.currentValue < 0 ? undefined : this.currentValue
      }
      getApprovalRewards(params)
        .then((data) => {
          const roleMap = new Map([
            [1, '推荐者'],
            [2, '被推荐者'],
            [3, '双反']
          ])
          const statusMap = new Map([
            [2, '审批中'],
            [3, '审核通过'],
            [4, '审核不通过'],
            [5, '活动奖励已发放']
          ])
          const rewardTypeMap = new Map([
            [1, 'credit'],
            [2, 'cash'],
            [3, 'coupon'],
            [4, 'discount']
          ])
          const incentiveTypeMap = new Map([
            [1, '下单'],
            [2, '订阅'],
            [3, '注册'],
            [4, '加购'],
            [5, '新用户首单下单']
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
          const { res } = data
          this.tableData = res.list.map(({ incentiveType, identityType, orderStatus, rewardType, rewardStatus, ...rest }) => {
            return {
              identityType: roleMap.get(identityType),
              rewardStatus: statusMap.get(rewardStatus),
              rewardType: rewardTypeMap.get(rewardType),
              incentiveType: incentiveTypeMap.get(incentiveType),
              orderStatus: orderStatusMap.get(orderStatus),
              ...rest
            }
          })
          this.total = res.totalCount
          this.tableData.forEach((e, i) => {
            e.index = this.pageSize * (this.currentPage - 1) + i + 1
          })
        })
        .finally(() => {
          this.loading = false
        })
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
      this.$confirm(status === 3 ? `确认审批通过` : '确认审批不通过', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((_) => {
        this.loading = true
        const params = {
          'id': [row.id],
          'site': this.station,
          'status': status,
          'activeId': this.$route.params.id,
          'activeName': this.$route.query.name
        }

        approvalRewards(params)
          .then((data) => {
            if (data.success) {
              this.$message({
                showClose: true,
                message: status === 3 ? '审批已通过' : '审批未通过',
                type: 'success'
              })

              this.getList(this.currentPage)
              this.loading = false
            }
          })
          .catch((_) => {
            this.loading = false
          })
      })
        .catch((_) => {
          this.loading = false
        })
    },
    failItem(row, status) {
      this.$confirm(status === 3 ? `确认审批通过` : '确认审批不通过', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((_) => {
        this.loading = true
        const params = {
          'id': [row.id],
          'site': this.station,
          'status': status,
          'activeId': this.$route.params.id,
          'activeName': this.$route.query.name
        }
        approvalRewards(params)
          .then((data) => {
            if (data.success) {
              this.getList(this.currentPage)
              this.loading = false
            }
          })
          .catch(err => {
            console.log(err)
          })

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
      console.log(row, status)
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
        const params = {
          'id': itemsid,
          'site': this.station,
          'status': status,
          'activeId': this.$route.params.id,
          'activeName': this.$route.query.name
        }
        approvalRewards(params)
          .then((data) => {
            this.getList()
          })
        console.log(params, ';...params')

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
  .vetlist{
    .el-table-column--selection .cell {
     padding-left: 10px;
     padding-right: 10px;
    }
  }
</style>
<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  text-align: left;
  margin-top: 20px ;
  margin-bottom: 32px ;
  .el-tag--medium {
    background: #2B7DE1;
    color: #FFF;
    font-size: 12px;
    font-weight: 500;
    margin-right: 12px;
    height: auto;
  }
}
.activitylinkList-page {
    padding: 20px;
}
.total-info{
  color: #ADADAD;;
  font-size: 12px;
}
.pass-btn{
  color: #00AA3A;;
}
.fail-btn{
  color: #FF3232;;
}
.remove-btn{
  color: #ADADAD;;
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
.operator{
  button{
    font-size: 12px;
    padding: 0;
  }
}
</style>
