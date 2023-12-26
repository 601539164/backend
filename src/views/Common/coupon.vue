<template>
  <div class="couponList">
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
    <div class="total-info">共查询到 {{ total }} 项</div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="id" width="80">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="优惠券名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="优惠券码">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column label="生效时间">
          <template slot-scope="scope">
            {{ scope.row.beginTime }}<br />
            {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag
              v-for="tag in scope.row.statusShow"
              :key="tag.name"
              :type="tag.type"
            >
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="DetailsItem(scope.row)">
              详情
            </el-button>
            <el-button v-if="scope.row.status === 2" type="text" @click="changeStatusItem(scope.row.id,1)">
              启用
            </el-button>
            <el-button v-if="scope.row.status === 0 || scope.row.status === 1" type="text" @click="changeStatusItem(scope.row.id,2)">
              禁用
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
  </div>
</template>

<script>
import dayjs from 'dayjs'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import { getCouponPage, changeStatusCoupon } from '@/api/common'

export default {
  name: 'CouponList',
  components: {
    FilterTool,
    TabList
    //   Holiday
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentValue: -1,
      tabs: {
        title: '状态 :',
        radios: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '待生效',
            value: 0
          },
          {
            label: '生效中',
            value: 1
          },
          {
            label: '已禁用',
            value: 2
          },
          {
            label: '已过期',
            value: 3
          }
        ]
      },
      btn: [{
        label: '+ 新增优惠券',
        type: 'primary',
        click: this.addNewCoupon.bind(this)
      }],
      searchData: {},
      tableData: [],
      formData: {}
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '优惠券名字：',
          placeholder: '请输入优惠券名称',
          props: 'name'
        },
        {
          type: 'input',
          label: '优惠券码：',
          placeholder: '请输入优惠券码',
          props: 'code'
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
    getStatus(value) {
      const statusGroup = []
      const Status = []
      switch (value) {
        case 0:
          Status.name = '待生效'
          Status.type = 'warning'
          break
        case 1:
          Status.name = '生效中'
          Status.type = 'success'
          break
        case 2:
          Status.name = '已禁用'
          Status.type = 'danger'
          break
        case 3:
          Status.name = '已过期'
          Status.type = 'info'
          break
      }
      statusGroup.push(Status)
      return statusGroup
    },
    addNewCoupon({ '新建优惠券': name }) {
      this.$router.push({
        name: 'couponSetting/:id',
        params: { id: '00' },
        query: { name }
      })
    },
    shouldShowExpand(row) {
      return row.variants && row.variants.length > 0
    },
    getList() {
      this.loading = true
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        name: this.searchData.name || '',
        code: this.searchData.code || '',
        status: this.searchData.status < 0 ? '' : this.searchData.status
      }
      getCouponPage(params).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableData.forEach((item) => {
          item.beginTime = this.transferDate(item.beginTime, item.timeZone)
          item.endTime = this.transferDate(item.endTime, item.timeZone)
          item.statusShow = this.getStatus(item.status)
        })
      })
    },
    DetailsItem(row) {
      const { id, name } = row
      this.$router.push({
        name: 'couponSetting/:id',
        params: { id },
        query: { name, row }
      })
    },
    changeStatusItem(id, status) {
      this.$confirm(status === 2 ? `确认禁用？` : '确认启用？')
        .then((_) => {
          const data = {
            id,
            status
          }
          changeStatusCoupon(data).then(() => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.getList(this.currentPage)
          })
        })
        .catch((_) => {})
    },
    selectStatus(value) {
      this.currentValue = value
      this.searchData.status = value
      this.getList()
    },
    // 时间戳转换格式
    transferDate(itemTime, active_time_zone) {
      const currentTimeZone = dayjs().utcOffset() / 60
      const timezoneUnit = 3600000
      // 服务器保存的是先减去当前时区再加上时区的时间
      // 本地显示的是先减去选择的时间再加上当前时区
      const timeZoneNum = this.getNum(active_time_zone) * timezoneUnit
      const currentTimeZoneNum = currentTimeZone * timezoneUnit
      const transferTime = dayjs(
        itemTime * 1000 + timeZoneNum - currentTimeZoneNum
      ).format('YYYY-MM-DD')
      return transferTime
    },
    // 截取字符串中的数字包含正负号
    getNum(str) {
      const reg = /-?\d+/g
      const res = str.match(reg)
      return res[0]
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList(value)
    }
  }
}
</script>

  <style lang="scss">
  .couponList{
    .el-table-column--selection .cell {
        padding-left: 10px;
        padding-right: 10px;
    }
  }
  </style>
  <style lang="scss" scoped>
  .total-info {
    font-size: 12px;
    color: #adadad;
  }
  .couponList {
    padding: 20px;
  }
  </style>
