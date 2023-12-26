<template>
  <div class="AccountPermission-page">
    <filter-tool
      :filter-list="filterList"
      :form-data="searchData"
    />
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
    <div style="display:flex;align-items:center;">
      <el-select
        v-if="level===1"
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
      <el-button v-if="level===1" type="primary" style="margin-left: 10px" @click="switchSites">Switch Site</el-button>
      <div v-if="level===1" style="padding:0px 5px;"></div>
      <div class="total-info">共查询到 {{ total }} 项</div>
    </div>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.roleLevel >= level" type="text" @click="modifyItem(scope.row,true)">
            查看
          </el-button>
          <el-button v-if="scope.row.roleLevel > level" type="text" @click="modifyItem(scope.row,false)">
            修改
          </el-button>
          <el-button v-if="scope.row.roleLevel > level" type="text" @click="copyItem(scope.row)">
            复制
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
        :disabled="disabledForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formLabelAlign.roleName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-radio v-model="formLabelAlign.status" :label="1">开启</el-radio>
            <el-radio v-model="formLabelAlign.status" :label="0">禁用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="所属站点" prop="site">
          <el-select
            v-model="formLabelAlign.site"
            placeholder="请选择所属站点"
            clearable
            :disabled="disabledSite"
            @change="handleChange"
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
        </el-form-item>
        <el-form-item label="备注" prop="remake">
          <el-input v-model="formLabelAlign.remake"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="menuIds">
          <el-tree
            ref="tree"
            v-model="formLabelAlign.menuIds"
            class="filter-tree"
            :data="menuTree"
            :node-key="nodeKey"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            :disabled="disabledForm"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isAdd & !isPeview" type="primary" @click="handleAddSubmit()">提 交</el-button>
        <el-button v-else-if="!isAdd & isPeview" type="primary" @click="handleUpdateSubmit()">更 新</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import { getRoutesPage, getMenuTreeForRoleCreate, createRole, updateRole } from '@/api/permission'

export default {
  name: 'AccountPermission',
  components: {
    FilterTool,
    TabList
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
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
      columns: [
        {
          prop: 'id',
          label: 'id'
        },
        {
          prop: 'roleName',
          label: '角色名称'
        },
        {
          prop: 'remake',
          label: '备注'
        }
      ],
      isAdd: true,
      isPeview: false,
      dialogTitle: '添加角色',
      rowId: -1,
      nodeKey: 'id',
      menuTree: [],
      tableData: [],
      searchData: {},
      dialogVisible: false,
      disabledSite: true,
      formLabelAlign: {
        roleName: '',
        status: 1,
        remake: '',
        site: '',
        menuIds: []
      },
      formRules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        remake: [
          { required: true, message: '请填写备注', trigger: 'change' }
        ],
        site: [
          { required: true, message: '请选择所属站点', trigger: 'change' }
        ]
        // menuIds: [
        //   { required: true, message: '请至少选择一种用户类型', trigger: 'change' }
        // ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      disabledForm: false,
      isabledSite: true,
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
      ]
    }
  },
  computed: {
    ...mapGetters([
      'level',
      'station'
    ]),
    filterList() {
      return [
        {
          type: 'input',
          label: '角色名称',
          placeholder: '按角色名搜索',
          props: 'roleName'
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (searchData) => {
            this.pageNum = 1
            this.searchData = searchData
            this.getList()
          }
        }
      ]
    }
  },
  // watch: {
  //   'formLabelAlign.site': function(val) {
  //     if (this.level !== 1) return
  //     if (val) {
  //       this.initMenuTree(this.formLabelAlign.site)
  //     } else {
  //       this.menuTree = []
  //       this.formLabelAlign.roles = []
  //     }
  //   }
  // },
  mounted() {
    this.getList()
    this.initRoleDialog(this.site)
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        size: this.pageSize,
        currentPage: this.pageNum,
        site: this.site,
        roleName: this.searchData.roleName || ''
      }
      getRoutesPage(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
      })
    },
    initRoleDialog(station = this.station) {
      if (this.level === 1) {
        this.disabledSite = false
        this.formLabelAlign.site = ''
        this.initMenuTree(this.site)
      } else {
        this.disabledSite = true
        this.formLabelAlign.site = this.station
        this.initMenuTree(station)
      }
    },
    initMenuTree(siteData) {
      this.loading = true
      const params = {
        site: siteData
      }
      getMenuTreeForRoleCreate(params).then((res) => {
        this.loading = false
        this.menuTree = this.generatetrees(res.data)
      })
    },
    switchSites() {
      this.getList()
      this.initRoleDialog(this.site)
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
          parentId: tree.parentId,
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
    handleChange(value) {
      this.menuTree = []
      this.initMenuTree(this.formLabelAlign.site)
    },
    addNewActivity() {
      if (this.level === 1) {
        this.menuTree = []
      }
      this.dialogVisible = true
      const defaultSite = this.level === 1 ? '' : this.station
      this.formLabelAlign = {
        roleName: '',
        status: true,
        note: '',
        site: defaultSite,
        menuIds: []
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.formLabelAlign.menuIds)
      })
      this.isAdd = true
      this.isPeview = false
      this.disabledForm = false
      this.dialogTitle = '添加角色'
    },
    modifyItem(row, bloo) {
      this.dialogVisible = true
      this.isAdd = false
      this.isPeview = !bloo
      this.disabledForm = bloo
      this.dialogTitle = bloo ? '查看角色权限' : '修改角色权限'
      this.formLabelAlign = {
        ...row,
        menuIds: this.removeParentNode(row.menus).map((item) => { return { id: item } })
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.formLabelAlign.menuIds)
      })
      this.rowId = row.id
    },
    copyItem(row) {
      this.dialogVisible = true
      this.disabledForm = false
      this.isAdd = true
      this.isPeview = false
      this.dialogTitle = '添加角色'
      this.formLabelAlign = {
        ...row,
        menuIds: this.removeParentNode(row.menus).map((item) => { return { id: item } }),
        site: row.site,
        roleName: '',
        remake: ''
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.formLabelAlign.menuIds)
      })
    },
    removeParentNode(menus) {
      let menuIds = []
      const menuWithId = []
      const menuWithoutId = []
      let totalId = []
      const menuParentId = []
      menus.filter(menu => {
        if (menu.children) {
          menu.children.map((item) => { menuWithId.push(item.id) })
          menu.children.map((item) => { menuParentId.push(item.parentId) })
        } else {
          menuWithoutId.push(menu.id)
        }
      })
      totalId = menuWithoutId.concat(menuWithId)
      menuIds = totalId.filter(item => !menuParentId.includes(item))
      return menuIds
    },
    cancel() {
      this.dialogVisible = false
    },
    handleAddSubmit() {
      const selectedNodeIds = this.$refs.tree.getCheckedNodes().map(ele => ele.id)
      const parentIds = this.$refs.tree.getCheckedNodes().map(ele => ele.parentId)
      const menuIds = selectedNodeIds.concat(parentIds).filter(item => item !== 0)
      this.formLabelAlign = {
        ...this.formLabelAlign,
        menuIds: Array.from(new Set(menuIds))
      }
      // if (this.formLabelAlign.menuIds.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '角色权限还未设置'
      //   })
      //   return
      // }
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          createRole(this.formLabelAlign).then(() => {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.formLabelAlign = {
              roleName: '',
              status: true,
              note: '',
              menuIds: []
            }
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    handleUpdateSubmit() {
      const selectedNodeIds = this.$refs.tree.getCheckedNodes().map(ele => ele.id)
      const parentIds = this.$refs.tree.getCheckedNodes().map(ele => ele.parentId)
      const menuIds = selectedNodeIds.concat(parentIds).filter(item => item !== 0)
      this.formLabelAlign = {
        ...this.formLabelAlign,
        menuIds: Array.from(new Set(menuIds))
      }
      // if (this.formLabelAlign.menuIds.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '角色权限还未设置'
      //   })
      //   return
      // }
      this.$refs['formLabelAlign'].validate(valid => {
        if (valid) {
          updateRole(this.rowId, this.formLabelAlign).then(() => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.formLabelAlign = {
              roleName: '',
              status: true,
              note: '',
              menuIds: []
            }
            this.dialogVisible = false
            this.getList()
            this.rowId = -1
          })
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    handleCurrentChange(value) {
      this.pageNum = value
      this.getList(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.AccountPermission-page {
  padding: 20px;
}
.total-info {
  font-size: 12px;
  color: #adadad;
}
</style>
