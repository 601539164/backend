<template>
  <div class="RightPermission-page">
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
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <div class="tree-header">
          <el-select
            v-model="site"
            placeholder="请选择所属站点"
            clearable
          >
            <el-option
              v-for="(item, key) in siteOptions"
              :key="key"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 10px" @click="switchSites">Switch Site</el-button>
        </div>
        <div class="tree-header">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
          >
          </el-input>
          <el-button type="primary" style="margin-left: 10px" @click="toggleTreeExpand">{{ expandText }}</el-button>
        </div>

        <el-tree
          v-if="refreshTable"
          ref="tree"
          v-loading="treeLoading"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          :default-expand-all="expandAll"
          :filter-node-method="filterNode"
        >
        </el-tree>
      </el-col>
      <el-col :span="18" :xs="24">
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
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="modifyItem(scope.row)">
                修改
              </el-button>
              <el-button type="text" @click="addItem(scope.row)">
                添加
              </el-button>
              <el-button type="text" @click="deleteItem(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total > 10" style="margin-top: 16px; text-align: right">
          <el-pagination
            :page-size="pageSize"
            :current-page="pageNum"
            :total="total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="630"
      top="60px"
      :before-close="handleClose"
      class="Email-dialog"
    >
      <el-form
        ref="formLabelAlign"
        v-loading="loading"
        label-position="left"
        label-width="100px"
        :model="formLabelAlign"
        :rules="formRules"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formLabelAlign.menuName"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <treeselect
            v-model="formLabelAlign.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="类型" prop="menuType">
          <el-select v-model="formLabelAlign.menuType" placeholder="请选择路由类型" clearable>
            <el-option label="一级菜单" :value="1"></el-option>
            <el-option label="二级菜单" :value="2"></el-option>
            <!-- <el-option label="按钮" :value="3"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="菜单级别" prop="menuLevel">
          <el-input v-model.number="formLabelAlign.menuLevel"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-radio v-model="formLabelAlign.status" :label="1">开启</el-radio>
            <el-radio v-model="formLabelAlign.status" :label="0">禁用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="formLabelAlign.icon"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="formLabelAlign.path"></el-input>
        </el-form-item>
        <el-form-item label="菜单编码" prop="perms">
          <el-input v-model="formLabelAlign.perms"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input v-model.number="formLabelAlign.sort"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="formLabelAlign.component"></el-input>
        </el-form-item>
        <el-form-item label="所属站点" prop="site">
          <template>
            <el-checkbox-group v-model="formLabelAlign.site">
              <el-checkbox
                v-for="(item, key) in siteOptions"
                :key="key"
                :label="item.label"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="渠道" prop="channel">
          <el-input v-model="formLabelAlign.channel" disabled></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isAdd" type="primary" @click="handleAddSubmit()">提 交</el-button>
        <el-button v-else type="primary" @click="handleUpdateSubmit()">更 新</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TabList from '@/components/Common/TabList.vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMenuPage, getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/permission'

export default {
  name: 'RightPermission',
  components: {
    TabList,
    Treeselect
  },
  data() {
    return {
      loading: false,
      treeLoading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      filterText: '',
      refreshTable: true,
      expandAll: true,
      expandText: '收起',
      columns: [
        {
          prop: 'id',
          label: '序号',
          width: 100
        },
        {
          prop: 'menuName',
          label: '菜单名'
        },
        {
          prop: 'menuType',
          label: '类别'
        },
        {
          prop: 'perms',
          label: '编码'
        },
        {
          prop: 'path',
          label: '菜单URL'
        },
        {
          prop: 'site',
          label: '生效站点'
        }
      ],
      btn: [
        {
          label: '+ 新建',
          type: 'primary',
          click: this.addNewActivity
        }
      ],
      tabs: {
        title: ' ',
        radios: []
      },
      site: 'US',
      // 枚举站点site
      siteOptions: [
        {
          label: 'AU',
          value: 'AU'
        },
        {
          label: 'CA',
          value: 'CA'
        },
        {
          label: 'DE',
          value: 'DE'
        },
        {
          label: 'JP',
          value: 'JP'
        },
        {
          label: 'UK',
          value: 'UK'
        },
        {
          label: 'US',
          value: 'US'
        },
        {
          label: 'EU',
          value: 'EU'
        }
      ],
      isAdd: true,
      dialogTitle: '添加菜单',
      rowId: -1,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogVisible: false,
      // 菜单树选项
      menuOptions: [],
      formLabelAlign: {
        menuName: '',
        path: '',
        icon: '',
        sort: '',
        menuLevel: '',
        menuType: '',
        status: 1,
        perms: '',
        component: '',
        channel: 'BC',
        site: [],
        parentId: 0
      },
      formRules: {
        menuName: [
          { required: true, message: '请填写菜单名称', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请填写路由地址', trigger: 'change' }
        ],
        icon: [
          { message: '请填写菜单图标', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请填写显示顺序', trigger: 'change' },
          { type: 'number', min: 0, message: '请输入正确且大于0的数字', trigger: 'blur' }
        ],
        menuLevel: [
          { required: true, message: '请填写菜单级别', trigger: 'change' },
          { type: 'number', min: 0, message: '请输入正确且大于0的数字', trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: '请至少选择一种菜单类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        site: [
          { required: true, message: '请至少选择一个站点', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'change' }
        ],
        component: [
          { message: '请填写组件路径', trigger: 'change' }
        ],
        perms: [
          { required: true, message: '请填写菜单编码', trigger: 'change' }
        ],
        channel: [
          { required: true, message: '请填写渠道', trigger: 'change' }
        ]
      },
      tableData: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getList()
    this.getMenuTree()
  },
  methods: {
    getList() {
      this.treeLoading = true
      const params = {
        size: this.pageSize,
        currentPage: this.pageNum
      }
      getMenuPage(params).then((res) => {
        this.treeLoading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.tableData.forEach((item) => {
          item.site = item.site.map(ele => ele).join('/')
          item.menuType = this.matchMenuTypeText(item.menuType)
        })
      })
    },
    matchMenuTypeText(value) {
      let menuTypeText = ''
      switch (value) {
        case 1:
          menuTypeText = '一级菜单'
          break
        case 2:
          menuTypeText = '二级菜单'
          break
        case 3:
          menuTypeText = '按钮'
          break
      }
      return menuTypeText
    },
    matchMenuTypeNum(value) {
      let menuType = -1
      switch (value) {
        case '一级菜单':
          menuType = 1
          break
        case '二级菜单':
          menuType = 2
          break
        case '按钮':
          menuType = 3
          break
      }
      return menuType
    },
    getMenuTree() {
      this.loading = true
      const params = {
        site: this.site
      }
      getMenuTree(params).then((res) => {
        this.loading = false
        this.data = this.generatetrees(res.data)
      })
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
          id: tree.id,
          label: tree.meta.title
        }
        // recursive child trees
        if (tree.children) {
          data.children = this.generatetrees(tree.children)
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
    handleTree(data, id, parentId, children) {
      const config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
      }

      var childrenListMap = {}
      var nodeIds = {}
      var tree = []

      for (const d of data) {
        const parentId = d[config.parentId]
        if (childrenListMap[parentId] == null) {
          childrenListMap[parentId] = []
        }
        nodeIds[d[config.id]] = d
        childrenListMap[parentId].push(d)
      }

      for (const d of data) {
        const parentId = d[config.parentId]
        if (nodeIds[parentId] == null) {
          tree.push(d)
        }
      }

      for (const t of tree) {
        adaptToChildrenList(t)
      }

      function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
          o[config.childrenList] = childrenListMap[o[config.id]]
        }
        if (o[config.childrenList]) {
          for (const c of o[config.childrenList]) {
            adaptToChildrenList(c)
          }
        }
      }
      return tree
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    switchSites() {
      console.log('switchSites', this.site)
      this.getMenuTree()
    },
    toggleTreeExpand() {
      this.refreshTable = false
      this.expandAll = !this.expandAll
      this.expandText = this.expandAll ? '收起' : '展开'
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    getMenuTreeSelect() {
      getMenuTree().then((res) => {
        this.menuOptions = []
        const menu = { id: 0, menuName: '主类目', children: [] }
        menu.children = this.handleTree(res.data, 'id')
        this.menuOptions.push(menu)
      })
    },
    addNewActivity() {
      this.getMenuTreeSelect()
      this.dialogTitle = '添加菜单'
      this.dialogVisible = true
      this.isAdd = true
    },
    modifyItem(row) {
      this.dialogVisible = true
      this.isAdd = false
      this.getMenuTreeSelect()
      this.dialogTitle = '修改菜单'
      this.formLabelAlign = {
        ...row,
        site: row.site.split('/')
      }
      this.rowId = row.id
    },
    addItem(row) {
      this.addNewActivity()
      this.formLabelAlign.parentId = row.parentId
    },
    deleteItem(row) {
      this.$confirm(`确认要"删除"该菜单吗？`, `删除"${row.menuName}"菜单`, {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteMenu(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
            this.getMenuTree()
          })
        })
        .catch((_) => {})
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
        delete node.children
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      }
    },
    handleAddSubmit() {
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          createMenu(this.formLabelAlign).then(() => {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.dialogVisible = false
            this.reset()
            this.getList()
            this.getMenuTree()
          })
        }
      })
    },
    handleUpdateSubmit() {
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          const data = {
            ...this.formLabelAlign,
            menuType: this.matchMenuTypeNum(this.formLabelAlign.menuType)
          }
          updateMenu(this.rowId, data).then(() => {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.dialogVisible = false
            this.reset()
            this.getList()
            this.getMenuTree()
            this.rowId = -1
          })
        }
      })
    },
    reset() {
      this.formLabelAlign = {
        menuName: '',
        path: '',
        icon: '',
        sort: '',
        menuType: '',
        status: 1,
        perms: '',
        component: '',
        channel: 'BC',
        site: [],
        parentId: 0
      }
      this.$refs['formLabelAlign'].resetFields()
    },
    cancel() {
      this.reset()
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('继续修改？')
        .then(_ => {
        })
        .catch(_ => {
          done()
        })
    },
    handleCurrentChange(value) {
      this.pageNum = value
      this.getList(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.RightPermission-page {
  padding: 20px;
  .tree-header{
    display: flex;
    margin-bottom: 10px;
  }
}
.total-info {
  font-size: 12px;
  color: #adadad;
}
</style>
