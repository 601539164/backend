<template>
  <div class="ProductManagementList">
    <filter-tool :filter-list="filterList" :form-data="formData" />
    <tab-list
      :current-value="currentValue"
      :tabs="tabs"
      :note="note"
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
        :row-class-name="rowClassName"
      >
        <el-table-column type="expand" :show-expand="shouldShowExpand">
          <template slot-scope="scope">
            <div class="subtable">
              <el-table
                :data="scope.row.variants"
                :show-header="false"
                style="width: 100%"
              >
                <el-table-column width="48">
                </el-table-column>
                <el-table-column label="" width="50">
                  <template slot-scope="props">
                    <el-image
                      style="width: 50px; height: 50px"
                      :src="props.row.imageUrl"
                      fit="fit"
                    >
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称">
                  <template slot-scope="props">
                    <!-- <a
                      :href="scope.row.dtcLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="color: #2B7DE1;"
                    > -->
                    {{ props.row.optionName[0] ? props.row.optionName[0].label : '-' }}
                    <!-- </a> -->
                  </template>
                </el-table-column>
                <el-table-column label="Product ID" width="150">
                  <template slot-scope="props">
                    {{ props.row.variantId }}
                  </template>
                </el-table-column>
                <el-table-column label="SKU" width="280">
                  <template slot-scope="props">
                    {{ props.row.sku }}
                  </template>
                </el-table-column>
                <el-table-column label="标记 #Tags" width="280">
                  <template slot-scope="props">
                    <div class="dataContainer">
                      <!-- <div class="dataLength" style="color: #FF7A00;">{{ props.row.tags.length }}</div> -->
                      <el-tag
                        v-for="item in props.row.tags.slice(0, 2)"
                        :key="item.label"
                        size="mini"
                        effect="plain"
                        style="margin-left: 12px;"
                      >
                        {{ item.flag }}
                      </el-tag>
                      <el-tag
                        v-for="item in props.row.tags.slice(2, 3)"
                        :key="item.label"
                        size="mini"
                        effect="plain"
                        class="tag-ellipsis"
                        style="margin-left: 12px;"
                      >
                        ...
                      </el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="36">
                </el-table-column>
                <el-table-column width="91">
                </el-table-column>
                <el-table-column width="48">
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" width="60">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.imageUrl"
              fit="fit"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <!-- <a
              :href="scope.row.dtcLink"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #2B7DE1;"
            > -->
            {{ scope.row.prodName }}
            <!-- </a> -->
          </template>
        </el-table-column>
        <el-table-column label="Product ID" width="150">
          <template slot-scope="scope">
            {{ scope.row.productId }}
          </template>
        </el-table-column>
        <el-table-column label="SKU" width="280">
          <template slot-scope="scope">
            {{ scope.row.sku }}
          </template>
        </el-table-column>
        <el-table-column label="标记 #Tags" width="280">
          <template slot-scope="scope">
            <div class="dataContainer">
              <div class="dataLength" style="color: #FF7A00;">{{ scope.row.tags.length }}</div>
              <el-tag
                v-for="item in scope.row.tags.slice(0, 2)"
                :key="item.label"
                size="mini"
                effect="plain"
                style="margin-left: 12px;"
              >
                {{ item.flag }}
              </el-tag>
              <el-tag
                v-for="item in scope.row.tags.slice(2, 3)"
                :key="item.label"
                size="mini"
                effect="plain"
                class="tag-ellipsis"
                style="margin-left: 12px;"
              >
                ...
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="60">
          <template slot-scope="scope">
            <div class="statusPoint" :style="{ background: scope.row.enabled ? '#00BC4B' : '#9b9191' }"></div>
            <!-- <el-tag v-if="scope.row.isActive" type="success">Active</el-tag>
            <el-tag v-else type="danger">Disabled</el-tag> -->
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
    <!-- <ProductEdit ref="editModal" @addSuccess="refreshList" /> -->
    <ProductEdit ref="ProductEditModal" />
  </div>
</template>

<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import ProductEdit from '@/components/EditModal/PMEditModal/ProductEdit.vue'
import { getPList, getPTagList } from '@/api/productManagement'
import dayjs from 'dayjs'

export default {
  name: 'ProductManagementList',
  components: {
    FilterTool,
    TabList,
    ProductEdit
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
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
      note: {
        icon: 'el-icon-refresh',
        syncInterval: '60',
        text: '同步间隔：60minutes 最新同步：',
        time: '2023年7月11日 22:00:00'
      },
      searchData: {},
      tableData: [],
      formData: {},
      TagsOptions: [],
      ActOptions: []
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '商品名称：',
          placeholder: '请输入商品名称',
          props: 'prodName'
        },
        {
          type: 'input',
          label: '商品SKU：',
          placeholder: '请输入商品SKU',
          props: 'sku'
        },
        {
          type: 'select',
          label: '标记#Tags：',
          placeholder: '请选择标记#Tags',
          props: 'tagFlag',
          options: this.TagsOptions
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
    this.OptionDataItit()
  },
  methods: {
    shouldShowExpand(row) {
      return row.variants && row.variants.length > 0
    },
    getList() {
      this.loading = true
      const params = {
        size: this.pageSize,
        currentPage: this.currentPage,
        prodName: this.searchData.prodName || '',
        sku: this.searchData.sku || '',
        tagFlag: this.searchData.tagFlag || '',
        enabled: this.currentValue < 0 ? '' : this.currentValue
      }
      getPList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.note.syncInterval = res.data.syncInterval
        this.note.text = '同步间隔：' + res.data.syncInterval + 'minutes 最新同步：'
        this.note.time = dayjs(res.data.syncTs * 1000).format('YYYY-MM-DD HH:mm:ss')
        this.tableData.forEach((item) => {
          item.enabled = item.enabled === 1
          item.isHover = false
        })
      })
    },
    OptionDataItit() {
      const params = {
        size: this.pageSize,
        currentPage: this.currentPage
      }
      getPTagList(params).then((res) => {
        const TagsData = res.data.list
        this.TagsOptions = this.OptionItit(TagsData)
      })
    },
    OptionItit(data) {
      const uniqueOption = data.reduce((result, item) => {
        const param = item.flag
        if (!result.some((entry) => entry.value === param)) {
          result.push({ label: param, value: param })
        }
        return result
      }, [])
      return uniqueOption
    },
    selectStatus(value) {
      this.currentValue = value
      this.getList()
    },
    DetailsItem(row) {
      const item = {
        ...row,
        syncTs: this.note.time,
        syncInterval: this.note.syncInterval
      }
      this.$refs.ProductEditModal.show(item)
    },
    refreshList() {
      this.getList()
    },
    rowClassName(scope) {
      if (scope.row.variants) {
        if (scope.row.variants.length > 0) {
          return
        } else {
          return 'hiddenExpand'
        }
      }
    },
    rowStyle(scope) {
      if (scope.row.enabled) {
        return
      } else {
        return { backgroundColor: '#ccc', opacity: '0.5' }
      }
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
  .ProductManagementList{
      padding: 20px;
    .dataContainer{
      background-color: #FAFAFA;
      display: flex;
      align-items: center;
      border-radius: 4px;
      overflow: hidden;
      .dataLength{
        padding: 10px 15px;
        background: #EEEEEE;
        font-size: 18px;
        font-weight: 500;
      }
      .el-tag{
        color: #808080;
        border:0;
        background-color: #EEEEEE;
      }
      .tag-ellipsis{
        background-color: transparent;
      }
    }
    .statusPoint{
      width: 8px;
      height: 8px;
      border-radius: 4px;
    }
    .subtable{
      .dataContainer{
        background-color: transparent;
      }
    }
  }
</style>
<style lang="scss">
.ProductManagementList{
  .hiddenExpand{
    .el-table__expand-column{
      .cell{
        display: none;
      }
    }
  }
  .el-table__expanded-cell{
    padding: 0px;
    .el-table {
      tr{
        background: #FAFAFA;
      }
      td{
        border-bottom: 0px solid #dfe6ec;
        padding: 8px 0;
      }
    }
  }
}
</style>
