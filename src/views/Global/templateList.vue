<template>
  <div class="EmailTemplateList-page">
    <filter-tool :filter-list="filterList" :form-data="formData" />
    <!-- <tab-list
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
    /> -->
    <div class="total-info">共查询到 {{ total }} 项</div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isActive" type="success">Active</el-tag>
            <el-tag v-else type="danger">Disabled</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <router-link :to="'/marketing/emailTemplateDetails/'+ scope.row.id" class="link-type">
              详情
            </router-link>
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
import FilterTool from '@/components/Common/FilterTool.vue'
// import TabList from '@/components/Common/TabList.vue'
import { getEmailTemplatelist } from '@/api/emailTemplate'

export default {
  name: 'EmailTemplateList',
  components: {
    FilterTool
    // TabList
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      // currentValue: 2,
      total: 0,
      columns: [
        {
          prop: 'id',
          label: '编号',
          width: '100'
        },
        {
          prop: 'tempName',
          label: '模板名字'
        },
        {
          prop: 'note',
          label: '模板说明'
        },
        {
          prop: 'title',
          label: '邮件标题'
        },
        {
          prop: 'updateTime',
          label: '更新时间'
        }
      ],
      tableData: [],
      formData: {}
      // btn: [{
      //   label: '新建邮件模板',
      //   type: 'primary',
      //   click: this.addNewEmail
      // }],
      // tabs: {
      //   title: '状态：',
      //   radios: [
      //     { label: '全部', value: 2 },
      //     { label: '已激活', value: 1 },
      //     { label: '未激活', value: 0 }
      //   ]
      // }
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '模板名字',
          placeholder: '按模板名字搜索',
          props: 'templateName'
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
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        size: this.pageSize,
        currentPage: this.currentPage,
        templateName: this.formData.templateName || ''
      }
      getEmailTemplatelist(params).then((res) => {
        this.loading = false
        this.tableData = res.data.temps
        this.total = res.data.totalCount
        this.tableData.forEach((item) => {
          const dateTime = new Date(item.updateTime)
          const formattedDateTime = `${dateTime.getFullYear()}-${this.padZero(dateTime.getMonth() + 1)}-${this.padZero(dateTime.getDate())} ${this.padZero(dateTime.getHours())}:${this.padZero(dateTime.getMinutes())}:${this.padZero(dateTime.getSeconds())}`
          item.updateTime = formattedDateTime
        })
      })
    },
    padZero(num) {
      return num.toString().padStart(2, '0')
    },
    // selectStatus(value) {
    //   this.currentValue = value
    //   this.formData.isActive = value
    //   this.getList()
    // },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList(value)
    }
  }
}
</script>

<style lang="scss" scoped>
    .EmailTemplateList-page{
        padding: 20px;
    }
</style>
