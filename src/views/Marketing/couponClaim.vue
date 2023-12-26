<template>
  <div class="couponClaimPage">
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
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="使用优惠码">
          <template slot-scope="scope">
            {{ scope.row.couponCode }}
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
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" type="success">Active</el-tag>
            <el-tag v-else type="danger">Disabled</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="SettingItem(scope.row)">
              详情
            </el-button>
            <el-button v-if="scope.row.status" type="text" @click="changeStatusItem(scope.row.id,false)">
              禁用
            </el-button>
            <el-button v-else type="text" @click="changeStatusItem(scope.row.id,true)">
              启用
            </el-button>
            <el-button type="text" @click="DetailsItem(scope.row)">
              领取详情
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
import { getCouponClaimPage, changeStatusCouponClaim } from '@/api/marketing'

export default {
  name: 'CouponClaim',
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
      tabs: {
        title: '状态 :',
        radios: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '生效',
            value: 1
          },
          {
            label: '失效',
            value: 0
          }
        ]
      },
      btn: [{
        label: '+ 新增活动',
        type: 'primary',
        click: this.addNewClaim.bind(this)
      }],
      searchData: [],
      tableData: [],
      formData: {}
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '名字：',
          placeholder: '请输入活动名称',
          props: 'name'
        },
        {
          type: 'input',
          label: '优惠券码：',
          placeholder: '请输入优惠券码',
          props: 'couponCode'
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
    addNewClaim({ '创建优惠券领取活动': name }) {
      this.$router.push({
        name: 'couponClaimSetting/:id',
        params: { id: '00' },
        query: { name }
      })
    },
    getList() {
      this.loading = true
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        name: this.searchData.name || '',
        couponCode: this.searchData.couponCode || '',
        status: this.searchData.status
      }
      getCouponClaimPage(params).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableData.forEach((item) => {
          item.beginTime = this.transferDate(item.beginTime, item.timeZone)
          item.endTime = this.transferDate(item.endTime, item.timeZone)
        })
      })
    },
    SettingItem(row) {
      const { id, name } = row
      this.$router.push({
        name: 'couponClaimSetting/:id',
        params: { id },
        query: { name, row }
      })
    },
    DetailsItem(row) {
      const { id, name } = row
      this.$router.push({
        name: 'couponClaimDetails/:id',
        params: { id },
        query: { name, row }
      })
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
    changeStatusItem(id, status) {
      this.$confirm(status === 2 ? `确认禁用？` : '确认启用？')
        .then((_) => {
          const data = {
            id,
            status
          }
          changeStatusCouponClaim(data).then(() => {
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
  .couponClaimPage {
    padding: 20px;
  }
  </style>
