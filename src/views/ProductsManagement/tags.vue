<template>
  <div class="PMTagList">
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
        :row-style="rowStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        />
        <el-table-column width="40">
          <template slot-scope="scope">
            <div class="statusPoint" :style="{ background: scope.row.enabled ? '#00BC4B' : '#9b9191' }"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="editItem(scope.row)">
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
    <PMTags ref="editModal" @refresh="refreshList" />
  </div>
</template>

<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import PMTags from '@/components/EditModal/PMEditModal/PMTags.vue'
import { getPTagList } from '@/api/productManagement'

export default {
  name: 'PMTagList',
  components: {
    FilterTool,
    TabList,
    PMTags
  },
  data() {
    return {
      loading: false,
      pageSize: 20,
      currentPage: 1,
      total: 2,
      columns: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'flag',
          label: '标记参数'
        },
        {
          prop: 'skusLength',
          label: '关联商品'
        },
        {
          prop: 'updatedTime',
          label: '更新时间'
        }
      ],
      currentValue: -1,
      tabs: {
        title: '商品分类：',
        radios: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '生效中',
            value: 1
          },
          {
            label: '已失效',
            value: 0
          }
        ]
      },
      btn: [{
        label: '+ 创建标记#Tag',
        type: 'primary',
        click: this.addNewTag.bind(this)
      }],
      searchData: [],
      tableData: [],
      formData: {},
      TagsOptions: []
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '标记#Tags名称：',
          placeholder: '请输入标记#Tags名称',
          props: 'name'
        },
        {
          type: 'select',
          label: '标记参数：',
          placeholder: '请输入标记参数',
          props: 'flag',
          options: this.TagsOptions
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (searchData) => {
            this.searchData = searchData
            this.getList()
          }
        }
      ]
    }
  },
  mounted() {
    this.getList()
    this.OptionItit()
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        size: this.pageSize,
        currentPage: this.currentPage,
        name: this.searchData.name || '',
        flag: this.searchData.flag || '',
        enable: this.currentValue < 0 ? '' : this.currentValue
      }
      getPTagList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.tableData.forEach((item) => {
          item.skusLength = item.skus ? item.skus.length : 0
          item.updatedTime = item.updatedTime.replace('T', ' ')
        })
      })
    },
    OptionItit() {
      const params = {
        size: this.pageSize,
        currentPage: this.currentPage
      }
      getPTagList(params).then((res) => {
        const TagsData = res.data.list
        const uniqueOption = TagsData.reduce((result, item) => {
          const param = item.flag
          if (!result.some((entry) => entry.value === param)) {
            result.push({ label: param, value: param })
          }
          return result
        }, [])
        this.TagsOptions = uniqueOption
      })
    },
    addNewTag() {
      this.$refs.editModal.show()
    },
    selectStatus(value) {
      this.currentValue = value
      this.getList()
    },
    editItem(row) {
      const item = {
        ...row
      }
      this.$refs.editModal.show(item)
    },
    refreshList() {
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    rowStyle(scope) {
      if (scope.row.enabled) {
        return
      } else {
        return { backgroundColor: '#ccc', opacity: '0.5' }
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .total-info {
    font-size: 12px;
    color: #adadad;
  }
    .PMTagList{
        padding: 20px;
      .statusPoint{
        width: 8px;
        height: 8px;
        border-radius: 4px;
      }
    }
  </style>
