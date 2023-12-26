<template>
  <div class="AccountPermission-page">
    <filter-tool
      :filter-list="filterList"
      :form-data="searchData"
    />
    <tab-list
      :current-value="currentValue"
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
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDisable === 0" type="success">已启用</el-tag>
          <el-tag v-else type="info">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.level > level" type="text" @click="modifyItem(scope.row)">
            修改
          </el-button>
          <el-button v-if="scope.row.level > level" type="text" @click="resetPasswordItem(scope.row.id)">
            重置密码
          </el-button>
          <el-button v-if="scope.row.level > level && scope.row.isDisable === 0" type="text" @click="disableItem(scope.row)">
            禁用
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import { getUserPage, getRoutesList, resetPassword, updateUser } from '@/api/permission'

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
      currentValue: 0,
      btn: [
        {
          label: '+ 新建',
          type: 'primary',
          click: this.addNewActivity
        }
        // {
        //   label: '导出',
        //   type: 'info',
        //   click: this.addNewActivity1
        // }
      ],
      tabs: {
        title: ' ',
        radios: []
      },
      columns: [
        {
          prop: 'id',
          label: 'id',
          width: '100'
        },
        {
          prop: 'userName',
          label: '用户名'
        },
        {
          prop: 'email',
          label: '电子邮件'
        },
        {
          prop: 'role',
          label: '角色'
        },
        {
          prop: 'createdTime',
          label: '创建时间'
        }
      ],
      tableData: [],
      searchData: {},
      rolesOption: [],
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
      'level'
    ]),
    filterList() {
      return [
        {
          type: 'input',
          label: '用户名：',
          placeholder: '按用户名搜索',
          props: 'userName'
        },
        {
          type: 'input',
          label: 'E-mail：',
          placeholder: '按E-mail搜索',
          props: 'email'
        },
        {
          type: 'select',
          label: '角色：',
          placeholder: '请选择角色',
          props: 'roleId',
          options: this.rolesOption
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
  mounted() {
    this.getList()
    this.getRolesOption()
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        size: this.pageSize,
        currentPage: this.pageNum,
        site: this.site,
        roleId: this.searchData.roleId || '',
        userName: this.searchData.userName || '',
        email: this.searchData.email || ''
      }
      getUserPage(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.tableData.forEach((item) => {
          item.role = item.roles.map(ele => ele.roleName).join('/')
        })
      })
    },
    switchSites() {
      this.getList()
    },
    getRolesOption() {
      getRoutesList().then((res) => {
        res.data.forEach((item) => {
          this.rolesOption.push({
            label: item.roleName,
            value: item.id
          })
        })
      })
    },
    addNewActivity({ '创建账号': name }) {
      this.$router.push({
        name: 'accountDetails/:id',
        params: { id: '00' },
        query: { name }
      })
    },
    addNewActivity1({ id, active_name: name }) {
      this.$router.push({
        name: 'accountDetails',
        params: { id },
        query: { name }
      })
    },
    modifyItem(row) {
      const { id, userName: name } = row
      const site = this.site
      this.$router.push({
        name: 'accountDetails/:id',
        params: { id },
        query: { name, row, site }
      })
    },
    resetPasswordItem(id) {
      this.$confirm(`密码将重置成renogy1314，确认重置id为${id}的密码？`, '重置密码', {
        distinguishCancelAndClose: true,
        confirmButtonText: '重置',
        cancelButtonText: '取消'
      })
        .then(() => {
          resetPassword(id).then(() => {
            this.$message({
              type: 'success',
              message: '重置成功'
            })
          })
        })
        .catch((_) => {})
    },
    disableItem(row) {
      this.$confirm(`确认要"禁用"该用户吗？`, `禁用"${row.userName}"用户`, {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          const data = {
            ...row,
            roles: row.roles.map(ele => ele.id),
            isDisable: 1
          }
          updateUser(row.id, data).then(() => {
            this.$message({
              type: 'success',
              message: '禁用成功'
            })
            this.getList()
          })
        })
        .catch((_) => {})
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
