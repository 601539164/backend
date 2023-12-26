<template>
  <div class="couponClaimDetails-page">
    <filter-tool
      :filter-list="filterList"
      :form-data="formData"
    />
    <div class="title">
      <span>活动名称：{{ this.$route.query.name }}</span>
    </div>
    <div
      style="
                margin: 12px 0;
                height: 1px;
                background-color: #eeeeee;
                width: 100%;
            "
    />
    <div class="total-content" style="width:40%">
      <div class="total-info">优惠券已领取： {{ claimCount }} 张</div>
      <div class="total-info">优惠券已使用： {{ useCount }} 张</div>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="email"
          label="领取者邮箱"
        >
          <template slot-scope="scope">
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column
          prop="couponCode"
          label="优惠券码"
        >
          <template slot-scope="scope">
            {{ scope.row.couponCode }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="领取时间"
        >
          <template slot-scope="scope">
            {{ scope.row.createdTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="isUsed"
          label="使用状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isUsed" type="success">已使用</el-tag>
            <el-tag v-else type="info">未使用</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
                prop="goodsAmount"
                label="备注"
            >
            </el-table-column> -->
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
import { getClaimRecords } from '@/api/marketing'

export default {
  name: 'CouponClaimDetails',
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
      claimCount: 0,
      useCount: 0,
      tableData: [],
      formData: {},
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
    const name = `优惠券活动用户领取情况列表-${query_name}` // 根据 ID 生成页面标题
    document.title = name // 设置页面标题
    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: `${name}` })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题,
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(pageNum = 1) {
      this.loading = true
      const params = {
        activityId: this.$route.params.id,
        pageNum: this.currentPage,
        email: this.formData.sharerEmail || '',
        pageSize: this.pageSize
      }
      getClaimRecords(params)
        .then((res) => {
          const { data } = res

          this.total = data.total
          this.claimCount = data.claimCount
          this.useCount = data.useCount
          this.tableData = data.records
        })
        .finally(() => {
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
    .couponClaimDetails-page{
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
  .couponClaimDetails-page {
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
