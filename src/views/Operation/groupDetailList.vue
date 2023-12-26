<template>
  <div class="groupbuylist-page">
    <filter-tool
      :filter-list="filterList"
      :form-data="formData"
    />
    <div class="title"><el-tag>拼团</el-tag><span>活动名称：{{ this.$route.query.name }}</span></div>
    <div
      style="
              margin: 12px 0;
              height: 1px;
              background-color: #eeeeee;
              width: 100%;
          "
    />
    <div class="total-content" style="width:60%">
      <div class="total-info">共查询到 {{ total }} 个团</div>
      <div class="total-info">拼团成功人数 {{ successfulNum }} </div>
      <div class="total-info">订单数量：{{ successfulOrderNum }}</div>
      <div class="total-info">合计金额：{{ totalOrderAmount }}</div>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              class="memberlist"
              :data="props.row.members"
              style="width: 100%"
              row-key="id"
              border
            >
              <el-table-column
                prop="email"
                label="用户邮箱"
              >
              </el-table-column>
              <el-table-column
                prop="identityType"
                label="身份类型"
              >
                <template slot-scope="scope">
                  {{ getIdentity(scope.row.identityType) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="orderId"
                label="订单ID"
              >
              </el-table-column>
              <el-table-column
                prop="orderAmount"
                label="订单金额"
              >
              </el-table-column>
              <el-table-column
                prop="orderStatus"
                label="订单状态"
              >
                <template slot-scope="scope">
                  {{ getorderStatus(scope.row.orderStatus) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="orderTime"
                label="下单时间"
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
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
import { mapGetters } from 'vuex'
import FilterTool from '@/components/Common/FilterTool.vue'
import { getgroupBuylist } from '@/api/activities'
import dayjs from 'dayjs'
export default {
  name: 'ActivitylinkList',
  components: {
    FilterTool
  },
  props: {
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      totalOrderAmount: 0,
      successfulOrderNum: 0,
      successfulNum: 0,
      columns: [
        {
          prop: 'id',
          label: '团ID'
        },
        {
          prop: 'groupSize',
          label: '团员数量'
        },
        {
          prop: 'sku',
          label: '购买产品SKU'
        },
        {
          prop: 'status',
          label: '团状态'
        },
        {
          prop: 'expireTs',
          label: '成团过期时间'
        }

      ],
      tableData: [

      ],
      formData: {},
      // ===========
      rolelist: []

    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '用户邮箱：',
          placeholder: '请输入',
          props: 'email'
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (formData) => {
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
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(page = 1) {
      this.loading = true
      const params = {
        activityId: this.$route.params.id,
        pageNum: page || this.currentPage,
        pageSize: this.pageSize,
        email: this.formData.email || '',
        groupStatus: 3
      }
      getgroupBuylist(params)
        .then((res) => {
          const Groupstatus = new Map([
            [1, '未成团'],
            [2, '待成团'],
            [3, '已成团'],
            [4, '超时未成团']
          ])
          const identity = new Map([
            [1, '团长'],
            [2, '团员']

          ])
          const { data } = res

          this.tableData = data.list.map(({ status, identityType, members, expireTs, ...rest }) => {
            return {
              status: Groupstatus.get(status),
              identityType: identity.get(identityType),
              members: members.filter(item => item.isAnalog === false),
              expireTs: dayjs(expireTs * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              ...rest
            }
          })
          this.totalOrderAmount = data.totalOrderAmount
          this.successfulOrderNum = data.successfulOrderNum
          this.successfulNum = data.successfulNum
          this.total = data.totalCount
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
    getIdentity(value) {
      let identity = ''

      switch (value) {
        case 1:
          identity = '团长'
          break
        case 2:
          identity = '团员'
          break
        default:
          identity = '未知'
          break
      }

      return identity
    },
    getorderStatus(value) {
      let orderStatus = ''
      switch (value) {
        case 1:
          orderStatus = 'Incomplete'
          break
        case 2:
          orderStatus = 'Pending'
          break
        case 3:
          orderStatus = 'Partially Shipped'
          break
        case 4:
          orderStatus = 'Refunded'
          break
        case 5:
          orderStatus = 'Cancelled'
          break
        case 6:
          orderStatus = 'Declined'
          break
        case 7:
          orderStatus = 'Awaiting Payment'
          break
        case 8:
          orderStatus = 'Awaiting Pickup'
          break
        case 9:
          orderStatus = 'Awaiting Shipment'
          break
        case 10:
          orderStatus = 'Completed'
          break
        case 11:
          orderStatus = 'Awaiting Fulfillment'
          break
        case 12:
          orderStatus = 'Manual Verification Required'
          break
        case 13:
          orderStatus = 'Disputed'
          break
        case 14:
          orderStatus = 'Partially Refunded'
          break
        default:
          orderStatus = '未知'
          break
      }

      return orderStatus
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList(value)
    }
  }
}
</script>
<style lang="scss">
  .groupbuylist-page{
    .el-table__expanded-cell{
      // padding: 20px;
    }
    .el-table__row{
      background: #FAFAFA;
      td{
        padding-top: 11px;
        padding-bottom: 19px;
      }
    }
  }
  .memberlist{
  .el-table__row{
    background: #FFFFFF;
    td{
        padding-top: 13px;
        padding-bottom: 17px;
    }
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
.groupbuylist-page {
    padding: 20px;
}
.total-info{
  color: #ADADAD;
  font-size: 12px;
}

.remove-btn{
  color: #ADADAD;
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
