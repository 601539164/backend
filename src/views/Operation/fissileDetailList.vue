<template>
  <div class="fissilelist-page">
    <filter-tool
      :filter-list="filterList"
      :form-data="formData"
    />
    <div class="title"><el-tag>裂变</el-tag><span>活动名称：{{ this.$route.query.name }}</span>
      <el-button v-if="this.$route.query.type === '购前返现'" size="mini" round type="primary" icon="el-icon-document" style="margin-left: 30px;" @click="handleCopy(activityUrl,$event)">
        复制活动链接
      </el-button>
    </div>
    <div
      style="
              margin: 12px 0;
              height: 1px;
              background-color: #eeeeee;
              width: 100%;
          "
    />
    <div class="total-content" style="width:60%">
      <div class="total-info">裂变成功人数： {{ successfulNum }}</div>
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
              :data="props.row.records"
              style="width: 100%"
              row-key="id"
              border
            >
              <el-table-column
                prop="email"
                label="被分享者邮箱"
              >
              </el-table-column>
              <el-table-column
                prop="couponCode"
                label="优惠券码"
              >
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
                prop="goodsAmount"
                label="订单有效金额"
              >
              </el-table-column>
              <el-table-column
                prop="rewardType"
                label="奖励类型"
              >
                <template slot-scope="scope">
                  {{ getrewardType(scope.row.rewardType) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="rewardNum"
                label="奖励数量"
              >
              </el-table-column>
              <el-table-column
                prop="orderTime"
                label="下单时间"
              >
              </el-table-column>
              <el-table-column
                prop="rewardStatus"
                label="奖励状态"
              >
                <template slot-scope="scope">
                  {{ getrewardStatus(scope.row.rewardStatus) }}
                </template>
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
import { fissionDetailList } from '@/api/activities'
import clip from '@/utils/clipboard'

// import dayjs from 'dayjs'
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
          prop: 'dignity',
          label: '身份'
        },
        {
          prop: 'id',
          label: '编号'
        },
        {
          prop: 'customerEmail',
          label: '邮箱'
        },
        {
          prop: 'rewards',
          label: '奖励汇总'
        },
        {
          prop: 'referralUrl',
          label: '分享链接'
        }
      ],
      tableData: [

      ],
      activityUrl: '',
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
          props: 'sharerEmail'
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
    const name = `裂变活动关联用户列表-${query_name}` // 根据 ID 生成页面标题
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
        currentPage: page || this.currentPage,
        sharerEmail: this.formData.sharerEmail || '',
        size: this.pageSize
      }
      fissionDetailList(params)
        .then((res) => {
          // const Groupstatus = new Map([
          //   [1, '未成团'],
          //   [2, '待成团'],
          //   [3, '已成团'],
          //   [4, '超时未成团']
          // ])
          // const identity = new Map([
          //   [1, '团长'],
          //   [2, '团员']

          // ])
          const { data } = res

          this.tableData = data.list
          this.tableData = data.list.map(({ rewards, ...rest }) => {
            return {
              // status: Groupstatus.get(status),
              // identityType: identity.get(identityType),
              // members: members.filter(item => item.isAnalog === false),
              // expireTs: dayjs(expireTs * 1000).format(
              //   'YYYY-MM-DD HH:mm:ss'
              // ),
              dignity: '分享者',
              rewards: this.rewardsAssemble(rewards),
              ...rest
            }
          })
          this.activityUrl = data.activityUrl
          this.total = data.totalCount
          this.totalOrderAmount = data.totalOrderAmount
          this.successfulOrderNum = data.successfulOrderNum
          this.successfulNum = data.successfulNum
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
    getrewardType(value) {
      let orderStatus = ''
      switch (value) {
        case 1:
          orderStatus = 'credit'
          break
        case 2:
          orderStatus = 'cash'
          break
        case 3:
          orderStatus = 'coupon'
          break
        case 4:
          orderStatus = 'discount'
          break
      }
      return orderStatus
    },
    getrewardStatus(value) {
      let orderStatus = ''
      switch (value) {
        case 1:
          orderStatus = '无奖励'
          break
        case 2:
          orderStatus = '待审核'
          break
        case 3:
          orderStatus = '已审核待发放'
          break
        case 4:
          orderStatus = '审核失败'
          break
        case 5:
          orderStatus = '发放成功'
          break
        case 6:
          orderStatus = '领取成功'
          break
      }
      return orderStatus
    },
    rewardsAssemble(rewards) {
      let Assemble = ''
      for (let i = 0; i < rewards.length; i++) {
        const ele = rewards[i]
        const interval = i > 1 ? ',' : ' '
        Assemble += this.getrewardType(ele.rewardType) + ':' + ele.rewardNum + interval
      }
      return Assemble
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList(value)
    },
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>
<style lang="scss">
  .fissilelist-page{
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
.fissilelist-page {
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
