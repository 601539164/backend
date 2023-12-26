<template>
  <div class="LocatorList">
    <div class="title">
      <span></span>
    </div>
    <filter-tool :filter-list="filterList" :form-data="formData" />
    <tab-list :current-value="currentValue" :tabs="tabs" :btn="btn" @tabClick="selectStatus" />
    <div
      style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
    />
    <div class="total-content">
      <div class="total-info">Totals for {{ total }} items</div>
      <div v-if="multipleSelection.length > 0" class="right-content">
        <div class="total-info"> Total {{ multipleSelection.length }} selections</div>
        <div class="operator">
          <el-button type="text" class="pass-btn" @click="multipleUpadateItem(multipleSelection,true)">
            Batch Enable
          </el-button>
          <el-button type="text" class="fail-btn" @click="multipleUpadateItem(multipleSelection,false)">
            Batch Disable
          </el-button>

        </div>
      </div>
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        height="calc(100vh - 307px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35"
        >
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="Status" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" type="success">Active</el-tag>
            <el-tag v-else type="danger">Disabled</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button type="text" @click="DetailsItem(scope.row)">Details</el-button>
            <el-button type="text" @click="updateStatus(scope.row)">
              <span v-if="!scope.row.status" style="color:#67c23a">Enabled</span>
              <span v-if="scope.row.status" style="color:#f56c6c">Paused</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :visible.sync="dialogVisible"
        width="630"
        top="60px"
        :before-close="handleClose"
        class="Email-dialog"
      >
        <div slot="title" class="edit-title">
          <div>
            {{ modalTitle }}
          </div>
        </div>
        <div>
          <upload-excel-component :on-success="handleSuccess" :on-return="handleReturn" :before-upload="beforeUpload" />
          <el-table :data="tableData_Ex" border highlight-current-row style="max-width: 100%;margin-top:20px;max-height: 50vh;overflow:auto;">
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
          </el-table>
        </div>

        <div
          style="
              margin: 12px 0;
              height: 1px;
              background-color: #eeeeee;
              width: 100%;
            "
        />
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="info"
            @click="cancel"
          >
            Cancel
          </el-button>
          <el-button
            @click="configurePre"
          >
            Confirm
          </el-button>
        </span>
      </el-dialog>
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
    <locationEdit ref="locationEditModal" @addSuccess="refreshList" />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import locationEdit from '@/components/EditModal/LocationEditModal/location.vue'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {
  getinstallerList,
  getTypeList,
  updateInstallerStatus,
  exportInstaller,
  importInstaller
} from '@/api/common'

export default {
  name: 'LocatorList',
  components: {
    FilterTool,
    TabList,
    locationEdit,
    UploadExcelComponent
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      currentValue: 'all',
      multipleSelection: [],
      columns: [
        {
          prop: 'name',
          label: 'Service Provider Name'
        },
        {
          prop: 'serverType',
          label: 'Service Type',
          width: 150
        },
        {
          prop: 'tag',
          label: 'Service Provider Type',
          width: 200
        },
        {
          prop: 'serviceCall',
          label: 'Service PN',
          width: 150
        },
        {
          prop: 'website',
          label: 'Url'
        },
        {
          prop: 'address',
          label: 'Address'
        },
        {
          prop: 'site',
          label: 'Site',
          width: 100
        }
        // {
        //   prop: 'introduction',
        //   label: '介绍'
        // }
      ],
      tabs: {
        title: 'Active Status：',
        radios: [
          {
            label: 'all',
            value: 'all'
          },
          {
            label: 'Enabled',
            value: 1
          },
          {
            label: 'Paused',
            value: 0
          }
        ]
      },
      btn: [
        {
          icon: 'el-icon-upload',
          label: 'Import',
          type: 'primary',
          click: this.clickImport
        },
        {
          icon: 'el-icon-download',
          label: 'Download',
          type: 'primary',
          click: this.clickDownload
        },
        {
          label: '+ Create',
          type: 'primary',
          click: this.showEdit.bind(this)
        }
      ],
      searchData: {},
      tableData: [],
      formData: {},
      serverOptions: [],
      ActOptions: [],
      tableData_Ex: [],
      tableHeader: [],
      modalTitle: 'Upload Excel file',
      dialogVisible: false,
      file: undefined,
      excelData: {
        header: null,
        results: null
      }
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
          label: 'name:',
          placeholder: 'service provider name',
          props: 'name'
        },

        {
          type: 'select',
          label: 'serverType:',
          placeholder: 'Choose service type',
          props: 'serverType',
          options: this.serverOptions
        },
        {
          type: 'input',
          label: 'address:',
          placeholder: 'address',
          props: 'address'
        },
        {
          type: 'button',
          label: 'Search',
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
    this.initserverType()
  },
  methods: {
    showEdit() {
      this.$refs.locationEditModal.getSite(this.station)
      this.$refs.locationEditModal.show()
    },
    updateStatus(row) {
      this.$confirm(row.status ? `Confirmation of disabled service providers` : 'Confirm activation of service providers')
        .then((_) => {
          const data = {
            ids: [row.id],
            status: !row.status
          }
          updateInstallerStatus(data).then(() => {
            this.$message({
              message: 'Update Success',
              type: 'success'
            })
            this.getList(this.currentPage)
          })
        })
        .catch((_) => {})
    },
    getList(page = 1) {
      this.loading = true
      const data = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        name: this.searchData.name || '',
        serverType: this.searchData.serverType || '',
        address: this.searchData.address || ''
      }
      if (typeof this.currentValue === 'number') {
        data.status = this.currentValue
      }
      getinstallerList(data).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    initserverType() {
      const params = {
        dictType: 'LOCATOR_SERVER_TYPE'
      }
      getTypeList(params).then((res) => {
        this.serverOptions = res.data.map((item) => ({
          value: item.dictItemValue,
          label: item.dictItemName
        }))
      })
    },
    selectStatus(value) {
      if (value === 2) {
        this.currentValue = null
      } else {
        this.currentValue = value
      }
      this.getList()
    },
    DetailsItem(row) {
      const item = {
        ...row,
        isEdit: true
      }
      this.$refs.locationEditModal.show(item)
    },
    refreshList() {
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    multipleUpadateItem(row, status) {
      this.$confirm(status ? 'Confirm batch enable' : 'Confirm batch disable ?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((_) => {
        this.loading = true
        const ids = []
        row.map((item) => {
          ids.push(item.id)
        })
        const params = {
          'ids': ids,
          'status': status
        }
        updateInstallerStatus(params)
          .then((data) => {
            if (data.data.length > 0) {
              const dataName = data.data.map(ele => ele).join('、')
              this.$message({
                showClose: true,
                message: `The following installer (${dataName}) could not be enabled, locate the error `,
                type: 'error',
                duration: 0
              })
            }
            this.$message({
              message: 'Update Success',
              type: 'success'
            })
            this.getList()
          })
        this.loading = false
      })
        .catch((_) => {
          this.loading = false
        })
    },
    clickImport() {
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData_Ex = results
      this.tableHeader = header
    },
    handleReturn(rawFile) {
      this.file = rawFile
    },
    clickDownload() {
      const clickdata = {
        pageNum: 1,
        pageSize: 10
      }
      exportInstaller(clickdata)
        .then(data => {
          const fileName = 'Installers.xls'
          const downloadUrl = URL.createObjectURL(data.res)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = fileName
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
        })
        .catch((_) => {})
    },
    configurePre() {
      const file = new FormData()
      file.append('file', this.file)
      importInstaller(file)
        .then(() => {
          this.$message({
            message: 'Update Success',
            type: 'success'
          })
          this.clearFile()
          this.getList()
        })
        .catch((error) => {
          // 处理请求失败的情况
          console.error('Error:', error)
        })
    },
    cancel() {
      this.clearFile()
      this.dialogVisible = false
    },
    clearFile() {
      this.file = undefined
      this.excelData = {
        header: null,
        results: null
      }
      this.tableData_Ex = []
      this.tableHeader = []
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.clearFile()
          done()
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
<style lang="scss">
.LocatorList{
  .el-table-column--selection .cell {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
<style lang="scss" scoped>
  .pass-btn{
    color: #00AA3A;;
  }
  .fail-btn{
    color: #FF3232;;
  }
  .excel-upload-input{
    display: none;
    z-index: -9999;
  }
  .drop{
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
  .edit-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .switch-title {
      display: flex;
      width: 100px;
      align-items: center;
      .switch-label {
        text-align: right;
        font-size: 14px;
        margin-left: 10px;
        font-weight: 500;
      }
    }
  }
  .dialog-footer{
    display: flex;
    justify-content: space-between;
  }
  .tableContainer{
    padding: 10px;
    margin-top: 20px;
    height: calc(100vh - 363px );
    min-height: 400px;
    overflow-x: hidden;
  }
  .el-step::v-deep{
    .el-step__title{
      font-size: 12px;
    }
  }
</style>
<style lang="scss" scoped>
.total-info {
  font-size: 12px;
  color: #adadad;
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
.LocatorList {
  padding: 20px;
}
</style>

