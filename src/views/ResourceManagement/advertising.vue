<template>
  <div class="advertisingList">
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
    <div class="total-content">
      <div class="total-info">共查询到 {{ total }} 项</div>
      <div v-if="multipleSelection.length > 0" class="right-content">
        <div class="total-info">共选择  {{ multipleSelection.length }} 项</div>
        <div class="operator">
          <el-button type="text" class="pass-btn" @click="multipleUpadateItem(multipleSelection)">
            批量删除
          </el-button>
        </div>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="advTree"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </el-col>
      <el-col :span="20" :xs="24">
        <div>
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            class="advlist"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="35">
            </el-table-column>
            <el-table-column label="ID" width="60">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="分类">
              <template slot-scope="scope">
                {{ showAdvType(scope.row.advType) }}
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <el-image style="width: 60px; height: auto" :src="scope.row.pcImage" fit="fit" lazy></el-image>
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                {{ scope.row.advName }}
              </template>
            </el-table-column>
            <el-table-column label="链接地址">
              <template slot-scope="scope">
                <a :href="scope.row.link" target="_blank">{{ scope.row.link }}</a>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createdTime }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" type="success">已启用</el-tag>
                <el-tag v-else type="danger">已禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status === 1" type="text" @click="changeStatusItem(scope.row,0)">
                  禁用
                </el-button>
                <el-button v-else type="text" @click="changeStatusItem(scope.row,1)">
                  启用
                </el-button>
                <el-button type="text" @click="DetailsItem(scope.row)">
                  编辑
                </el-button>
                <el-button type="text" @click="DeleteItem(scope.row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <div v-if="total > 10" style="margin-top: 16px; text-align: right">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
    <Advertising ref="advertisingEditModal" @addSuccess="refreshList" />
  </div>
</template>

<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import Advertising from '@/components/EditModal/RMEditModal/Advertising.vue'
import {
  getAdvListing,
  deleteAdv,
  getAdvType,
  updateAdv
} from '@/api/resources'

export default {
  name: 'AdvertisingList',
  components: {
    FilterTool,
    TabList,
    Advertising
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      tabs: {
        title: ' ',
        radios: []
      },
      btn: [{
        label: '+ 添加广告位',
        type: 'primary',
        click: this.addNewHoliday.bind(this)
      }],
      multipleSelection: [],
      searchData: {},
      tableData: [],
      formData: {},
      advTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      advTypeOptions: []
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '名称：',
          placeholder: '请输入广告位名称',
          props: 'advName'
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
    this.getAdvTree()
  },
  methods: {
    addNewHoliday() {
      this.$refs.advertisingEditModal.show()
    },
    getList() {
      this.loading = true
      const params = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        page: this.page || '',
        advName: this.searchData.advName || ''
      }
      getAdvListing(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
      })
    },
    DetailsItem(row) {
      const item = {
        ...row,
        isEdit: true
      }
      this.$refs.advertisingEditModal.show(item)
    },
    DeleteItem(id) {
      this.$confirm(`确认删除？`)
        .then((_) => {
          const itemsid = []
          itemsid.push(id)
          const params = itemsid
          deleteAdv(params).then((data) => {
            this.$message({
              type: 'success',
              message: `已删除`
            })
            this.getList()
          })
        })
        .catch((_) => {})
    },
    changeStatusItem(itemDate, status) {
      this.$confirm(status === 0 ? `确认禁用？` : '确认启用？')
        .then((_) => {
          const data = {
            ...itemDate,
            status: status
          }
          updateAdv(data).then(() => {
            this.$message({
              type: 'success',
              message: status === 0 ? `已禁用` : '已启用'
            })
            this.getList(this.currentPage)
          })
        })
        .catch((_) => {})
    },
    refreshList() {
      this.getList()
    },
    getAdvTree() {
      this.loading = true
      getAdvType().then((res) => {
        this.loading = false
        this.advTree = this.generatetrees(res.data)
        this.advTypeOptions = this.getAdvTypeOptions(res.data)
      })
    },
    handleNodeClick(data) {
      // 获取父级节点的数据
      const parentData = this.getParentNodeData(this.advTree, data)
      if (parentData) {
        this.page = parentData.value
        this.getList()
      } else {
        this.page = data.value
        this.getList()
      }
    },
    showAdvType(index) {
      return this.advTypeOptions[index]
    },
    getAdvTypeOptions(option) {
      const AdvTypeOptions = {}
      option.forEach(item => {
        const types = item.type
        Object.keys(types).forEach(key => {
          AdvTypeOptions[types[key]] = key
        })
      })
      return AdvTypeOptions
    },
    getParentNodeData(nodes, targetNode) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        if (node.children) {
          if (node.children.includes(targetNode)) {
            // 当前节点是目标节点的父级节点
            return node
          } else {
            const parentNode = this.getParentNodeData(node.children, targetNode)
            if (parentNode) {
              // 在当前节点的子节点中找到了目标节点的父级节点
              return parentNode
            }
          }
        }
      }
      return null // 未找到父级节点
    },
    generatetrees(trees) {
      const resTree = []
      for (let tree of trees) {
        // skip some tree
        const onlyOneShowingChild = this.onlyOneShowingChild(tree.children, tree)
        if (tree.children && onlyOneShowingChild && !tree.alwaysShow) {
          tree = onlyOneShowingChild
        }
        const data = {
          label: tree.pageName,
          value: tree.page
        }
        // recursive child trees
        if (tree.type) {
          const dataC_T = tree.type
          const childrenType = Object.keys(dataC_T).map(function(key) {
            return {
              pageName: key,
              page: dataC_T[key]
            }
          })
          data.children = this.generatetrees(childrenType)
        }
        resTree.push(data)
      }
      return resTree
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children ? children.filter(item => !item.hidden) : []
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        return onlyOneChild
      }
      return false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    multipleUpadateItem(row) {
      this.$confirm('确认批量删除选中的广告位？', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then((_) => {
        this.loading = true
        const itemsid = []
        row.map((item) => {
          itemsid.push(item.id)
        })
        const params = itemsid
        deleteAdv(params).then((data) => {
          this.getList()
        })
        this.loading = false
      })
        .catch((_) => {
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
  .advlist{
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
  .advertisingList {
    padding: 20px;
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
