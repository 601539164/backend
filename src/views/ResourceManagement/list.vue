<template>
  <div class="app-container">
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
    <div>
      <div class="total-info">共查询到 {{ total }} 项</div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="上线端口" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resEndPoint?scope.row.resEndPoint.join(", "):scope.row.resEndPoint }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.effective" type="success">Active</el-tag>
            <el-tag v-else type="danger">Disabled</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="editItem(scope.row)">
              详情
            </el-button>
            <el-button type="text" @click="previewItem(scope.row)">
              快览
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
    <ResourcesEdit ref="editModal" @addSuccess="refreshList" />
  </div>
</template>
<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import ResourcesEdit from '@/components/EditModal/RMEditModal/ResourcesEdit.vue'
import { getResourcesList, getResourcesTypeList } from '@/api/resources'
import dayjs from 'dayjs'
export default {
  name: 'ResourceManageList',
  components: {
    FilterTool,
    TabList,
    ResourcesEdit
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      columns: [
        {
          prop: 'id',
          label: '编号',
          width: '80'
        },
        {
          prop: 'resLocationType',
          label: '分类'
        },
        {
          prop: 'typeCode',
          label: '类型码'
        },
        {
          prop: 'resName',
          label: '名称'
        },
        {
          prop: 'pageUrl',
          label: '所属页面'
        },
        {
          prop: 'slotNum',
          label: 'Slot数量'
        },
        {
          prop: 'startTime',
          label: '生效时间'
        },
        {
          prop: 'endTime',
          label: '结束时间'
        },
        {
          prop: 'timeZone',
          label: '时区'
        },
        {
          prop: 'site',
          label: '生效站点'
        }
      ],
      currentValue: -1,
      btn: [{
        label: '创建资源位',
        type: 'primary',
        click: this.addNewResources.bind(this)
      }],
      tabs: {
        title: '状态：',
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
      formData: {},
      typeOptions: []
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'select',
          label: '资源位分类：',
          placeholder: '请选择资源位分类',
          props: 'type',
          options: this.typeOptions
        },
        {
          type: 'input',
          label: '所属页面：',
          placeholder: '请输入页面url',
          props: 'pageUrl'
          // width: '200px'
        },
        {
          type: 'input',
          label: '名称：',
          placeholder: '请输入名称',
          props: 'resName'
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
    this.getTypeList()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    refreshList() {
      // this.pageSize = 10
      this.pageUrl = ''
      this.formData.pageUrl = ''
      this.formData.resName = ''
      this.currentValue = -1
      this.currentPage = 1
      this.getList()
    },
    getTypeList() {
      getResourcesTypeList().then((res) => {
        this.typeOptions = res.data.map((item) => {
          return {
            label: item,
            value: item
          }
        })
      })
    },
    getList() {
      this.loading = true
      const params = {
        size: this.pageSize,
        currentPage: this.currentPage,
        pageUrl: this.formData.pageUrl || '',
        resName: this.formData.resName || '',
        resLocationType: this.formData.type || '',
        effective: this.currentValue < 0 ? '' : this.currentValue
      }
      getResourcesList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.tableData.forEach((item) => {
          item.startTime = this.transferDate(item.startTs, item.timeZone)
          item.endTime = this.transferDate(item.endTs, item.timeZone)
          item.slotNum = item.slots.length
        })
      })
    },
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
    selectStatus(value) {
      this.currentValue = value
      this.getList()
    },
    addNewResources() {
      this.$refs.editModal.show()
    },
    editItem(row) {
      const item = {
        ...row,
        isEdit: true
      }
      this.$refs.editModal.show(item)
    },
    previewItem(row) {
      const item = {
        ...row,
        isPreview: true
      }
      this.$refs.editModal.show(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.total-info {
  font-size: 12px;
  color: #adadad;
}
</style>
