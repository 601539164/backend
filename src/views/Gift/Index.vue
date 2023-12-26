<template>
  <div class="gift-page">
    <div class="search-tool">
      <el-select v-model="searchType" class="select">
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="searchKey"
        class="input"
        clearable
        placeholder="按电子邮件或分享码搜索"
        @clear="getListBySearch()"
        @keyup.enter.native="getListBySearch()"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-button
        class="download-btn"
        type="primary"
        @click="getGiftUserList(true)"
      >
        下载表格
      </el-button>
    </div>
    <div class="table-content">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        />
        <el-table-column label="Credit总数" width="130">
          <template slot-scope="scope">
            <div class="credit-info">
              {{ scope.row.customerCredit }}
              <i class="el-icon-refresh" @click="refreshCredit(scope)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分享记录" width="160">
          <template slot-scope="scope">
            <el-popover placement="right" width="500" trigger="click">
              <el-table :data="scope.row.records">
                <el-table-column width="300" property="email" label="点击者" />
                <el-table-column
                  width="150"
                  property="createdTime"
                  label="点击时间"
                />
              </el-table>
              <el-button slot="reference" type="text"> 详情 </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="赠送Credit" width="160">
          <template slot-scope="scope">
            <el-button type="primary" @click="presentCredit(scope.row)">
              赠送
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="清除Credit" width="160">
          <template slot-scope="scope">
            <el-button type="warning" @click="clearCredit(scope.row)">
              清除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total > 10" style="margin-top: 20px; text-align: right">
        <el-pagination
          :current-page="pageNum"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="changePageNum"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  addCredit,
  reducedCredit,
  refreshCredit,
  downloadExcel
} from '@/api/gift'
import { downloadFormat } from '@/utils/downloadFormat'
import dayjs from 'dayjs'
export default {
  name: 'Gift',
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false,
      searchKey: '',
      searchType: 'email',
      searchOptions: [
        { label: '分享者邮箱', value: 'email' },
        { label: 'Referral ID', value: 'id' }
      ],
      tableData: [],
      columns: [
        { prop: 'date', label: '日期' },
        { prop: 'url', label: 'Referral ID' },
        { prop: 'customerEmail', label: '分享者邮箱' },
        { prop: 'referralCredit', label: 'Referral Credit' }
        // { prop: 'clicker', label: '点击者' },
        // { prop: 'count', label: '点击数' },
        // { prop: 'credit', label: 'Credit数 ' }
      ]
    }
  },
  mounted() {
    // console.log('??')
    this.getGiftUserList()
  },
  methods: {
    // 下载表格
    downloadTisTable(params) {
      params.page = 0
      params.size = 0
      console.log(downloadFormat)
      downloadExcel(params).then((res) => {
        downloadFormat(res)
      })
    },
    // 搜索
    getListBySearch() {
      this.pageNum = 1
      this.getGiftUserList()
      this.loading = true
    },
    // 刷新点数
    refreshCredit(scope) {
      // console.log(scope)
      this.loading = true
      const index = scope.$index
      const row = scope.row
      const params = {
        customerId: row.customerId,
        num: 0,
        site: row.station
      }
      refreshCredit(params).then((res) => {
        // console.log(res)
        this.tableData[index].credit = res.data
        this.loading = false
      })
    },
    // 赠送Credit
    presentCredit(row) {
      // console.log(row)
      this.$prompt('请输入赠送数量', '赠送Credit', {
        confirmButtonText: '赠送',
        cancelButtonText: '取消',
        inputPattern: /^\d*(\.\d{1,3})?$/,
        inputErrorMessage: '请输入数字'
      })
        .then(({ value }) => {
          // console.log(value)
          const params = {
            customerId: row.customerId,
            num: value,
            site: row.station
          }
          this.loading = true
          addCredit(params).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getGiftUserList()
          })
        })
        .catch(() => {})
    },
    // 清除Credit
    clearCredit(row) {
      this.$prompt('请输入清除数量', '清除Credit', {
        confirmButtonText: '清除',
        cancelButtonText: '取消',
        inputPattern: /^\d*(\.\d{1,3})?$/,
        inputErrorMessage: '请输入数字'
      })
        .then(({ value }) => {
          console.log(value)
          const params = {
            customerId: row.customerId,
            num: value,
            site: row.station
          }
          this.loading = true
          reducedCredit(params).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getGiftUserList()
          })
        })
        .catch(() => {})
    },
    // 翻页
    changePageNum(num) {
      // console.log(num)
      this.pageNum = num
      this.getGiftUserList()
    },
    // 获取列表
    getGiftUserList(isDownload) {
      let email = ''
      let referralId = ''
      switch (this.searchType) {
        case 'email':
          email = this.searchKey
          break
        case 'id':
          referralId = this.searchKey
          break
        default:
          break
      }
      const params = {
        page: this.pageNum,
        // size: 10,
        size: this.pageSize,
        referralId,
        email
      }
      if (isDownload) {
        this.downloadTisTable(params)
        return
      }
      this.tableData = []
      getList(params)
        .then((res) => {
          this.loading = false
          const data = res.data
          this.total = data.totalCount
          data.list.forEach((e) => {
            e.records = e.records.map((record) => {
              return {
                email: record.email,
                createdTime: dayjs(record.createdTime).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              }
            })
            const date = dayjs(e.createdTime).format('YYYY-MM-DD HH:mm:ss')
            this.tableData.push({
              date,
              url: e.referralId,
              // credit: e.credit,
              ...e
              // count: e.records.length
            })
          })
          // console.log(this.tableData)
        })
        .catch((err) => {
          console.log(err)
        })
      // console.log(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-page {
  margin: 10px 20px;
  .search-tool {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    .select {
      margin-right: 16px;
    }
    .input {
      width: 400px;
    }
    .download-btn {
      position: absolute;
      right: 0;
    }
  }
  .credit-info {
    i {
      cursor: pointer;
      color: #1890ff;
    }
  }
}
</style>
