<template>
  <div class="holidayList">
    <filter-tool :filter-list="filterList" :form-data="formData" />
    <tab-list
      :tabs="tabs"
      :btn="btn"
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
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="日期数量">
          <template slot-scope="scope">
            {{ scope.row.totalTimes.length }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="DetailsItem(scope.row)">
              详情
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
    <Holiday ref="holidayEditModal" @addSuccess="refreshList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import Holiday from '@/components/EditModal/CommonEditModal/Holiday.vue'
import { getHolidatPage } from '@/api/common'

export default {
  name: 'HolidayList',
  components: {
    FilterTool,
    TabList,
    Holiday
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      columns: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'category',
          label: '使用范围'
        },
        {
          prop: 'site',
          label: '所属站点'
        }
      ],
      tabs: {
        title: ' ',
        radios: []
      },
      btn: [{
        label: '+ 创建节假日配置',
        type: 'primary',
        click: this.addNewHoliday.bind(this)
      }],
      searchData: {},
      tableData: [],
      formData: {},
      categoryOptions: [{ label: 'shipping', value: 'shipping' }],
      ActOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'station'
    ]),
    filterList() {
      return [
        {
          type: 'input',
          label: '名字：',
          placeholder: '请输入节假日',
          props: 'name'
        },
        {
          type: 'select',
          label: '使用范围',
          placeholder: '请输入使用范围',
          props: 'category',
          options: this.categoryOptions
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
    addNewHoliday() {
      this.$refs.holidayEditModal.getSite(this.station)
      this.$refs.holidayEditModal.show()
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
        category: this.searchData.category || ''
      }
      getHolidatPage(params).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    DetailsItem(row) {
      const item = {
        ...row,
        isEdit: true
      }
      this.$refs.holidayEditModal.show(item)
    },
    refreshList() {
      this.getList()
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
.holidayList {
  padding: 20px;
}
</style>
