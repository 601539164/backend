<template>
  <div class="incentiveList-page">
    <filter-tool
      :filter-list="filterList"
      :form-data="searchData"
    />
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
      <el-table v-loading="loading" height="calc(100vh - 307px)" :data="tableData" style="width: 100%">
        <el-table-column v-for="item in columns" :key="item.prop" :label="item.label" :width="item.width">
          <template #default="{row}">
            <span v-if="item.prop ==='active_state'">
              <span v-if="row.active_state === 2" style="color:#13ce66">Active</span>
              <span v-else-if="row.active_state === 1" style="color:#ff4949">Inactive</span>
              <span v-else style="color:#EEEEEE">Expired</span>
            </span>
            <span v-else-if="item.prop ==='active_name'">
              <el-tag effect="dark">
                {{ row.parent_id }}
              </el-tag>
              {{ row.active_name }}
            </span>
            <span v-else-if="item.prop ==='active_state'">
              {{ row[item.prop] }}
            </span>
            <span v-else-if="item.prop ==='effect_date'">
              <span>
                {{ row.active_effect_time }}
              </span><br>
              <span>
                {{ row.active_expired_time }}
              </span>
            </span>
            <span v-else>
              {{ row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="text" @click="detailItem(row)">
              详情
            </el-button>
            <el-button type="text" :disabled="!row.is_award_audit" @click="vettingItem(row)">
              {{ row.is_award_audit? "处理审批": "无需审批" }}
            </el-button>
            <el-button v-if="row.act_type === 2" type="text" @click="groupItem(row)">
              查看明细
            </el-button>
            <el-button v-else-if="row.act_type === 1 || row.act_type === 3" type="text" @click="fissileItem(row)">
              查看明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total > 10" style="margin-top: 16px; text-align: right">
      <el-pagination
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
    <incentiveCreate ref="editModal" @addSuccess="getList" @child-event="getList" />
    <activityDetail ref="preveModal" @addSuccess="prevRefreshList" />
  </div>
</template>

<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import incentiveCreate from '@/components/EditModal/IncentiveEdit/incentiveCreate.vue'
import activityDetail from '@/components/EditModal/IncentiveEdit/activityDetail.vue'
import { getActivePages } from '@/api/activities'
import { changeActiveType, awardObjectType, awardObjectType2, awardType } from '@/utils/parameters'
import dayjs from 'dayjs'

export default {
  name: 'IncentiveList',
  components: {
    FilterTool,
    TabList,
    incentiveCreate,
    activityDetail
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      currentValue: 0,
      active_type: '',
      btn: [{
        label: '创建活动',
        type: 'primary',
        click: this.addNewActivity
      }],
      tabs: {
        title: '状态：',
        radios: [
          { label: '全部', value: 0 },
          { label: '已激活', value: 2 },
          { label: '未激活', value: 1 }
        ]
      },
      columns: [
        { prop: 'active_state', label: '状态', width: '100' },
        { prop: 'id', label: '编号' },
        { prop: 'active_name', label: '活动名称' },
        { prop: 'active_type', label: '活动类型', width: '130' },
        // { prop: 'act_type', label: '', width: '100' },
        { prop: 'award_object_type', label: '激励方', width: '130' },
        { prop: 'award_type', label: '激励类型', width: '130' },
        { prop: 'effect_date', label: '生效时间' }
      ],
      tableData: [],
      searchData: {},
      activeTypeOptions: [
        {
          label: '购后返现',
          value: 1
        },
        {
          label: '拼团',
          value: 2
        },
        {
          label: '购前返现',
          value: 3
        }
      ],
      activeAwardType: [
        {
          label: 'Discount',
          value: 1
        }
      ],
      // 枚举所有GMT时区，GMT+H 或GMT-H的格式
      timeZoneOptions: [
        {
          label: 'GMT-12',
          value: 'GMT-12',
          offset: -12
        },
        {
          label: 'GMT-11',
          value: 'GMT-11',
          offset: -11
        },
        {
          label: 'GMT-10',
          value: 'GMT-10',
          offset: -10
        },
        {
          label: 'GMT-9',
          value: 'GMT-9',
          offset: -9
        },
        {
          label: 'GMT-8',
          value: 'GMT-8',
          offset: -8
        },
        {
          label: 'GMT-7',
          value: 'GMT-7',
          offset: -7
        },
        {
          label: 'GMT-6',
          value: 'GMT-6',
          offset: -6
        },
        {
          label: 'GMT-5',
          value: 'GMT-5',
          offset: -5
        },
        {
          label: 'GMT-4',
          value: 'GMT-4',
          offset: -4
        },
        {
          label: 'GMT-3',
          value: 'GMT-3',
          offset: -3
        },
        {
          label: 'GMT-2',
          value: 'GMT-2',
          offset: -2
        },
        {
          label: 'GMT-1',
          value: 'GMT-1',
          offset: -1
        },
        {
          label: 'GMT+0',
          value: 'GMT+0',
          offset: 0
        },
        {
          label: 'GMT+1',
          value: 'GMT+1',
          offset: 1
        },
        {
          label: 'GMT+2',
          value: 'GMT+2',
          offset: 2
        },
        {
          label: 'GMT+3',
          value: 'GMT+3',
          offset: 3
        },
        {
          label: 'GMT+4',
          value: 'GMT+4',
          offset: 4
        },
        {
          label: 'GMT+5',
          value: 'GMT+5',
          offset: 5
        },
        {
          label: 'GMT+6',
          value: 'GMT+6',
          offset: 6
        },
        {
          label: 'GMT+7',
          value: 'GMT+7',
          offset: 7
        },
        {
          label: 'GMT+8',
          value: 'GMT+8',
          offset: 8
        },
        {
          label: 'GMT+9',
          value: 'GMT+9',
          offset: 9
        },
        {
          label: 'GMT+10',
          value: 'GMT+10',
          offset: 10
        },
        {
          label: 'GMT+11',
          value: 'GMT+11',
          offset: 11
        },
        {
          label: 'GMT+12',
          value: 'GMT+12',
          offset: 12
        }
      ]

    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'select',
          label: '活动类型：',
          placeholder: '请选择活动类型',
          props: 'active_type',
          options: this.activeTypeOptions
        },
        {
          type: 'input',
          label: '活动名称：',
          placeholder: '按活动名称搜索',
          props: 'active_name'
        },
        // {
        //   type: 'select',
        //   label: '时区',
        //   placeholder: '选择时区',
        //   props: 'active_time_zone',
        //   options: this.timeZoneOptions
        // },
        // {
        //   type: 'datetime',
        //   label: '生效时间：',
        //   placeholder: '选择生效时间',
        //   props: 'active_effect_time'
        // },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (searchData) => {
            this.pageNum = 1
            this.searchData = searchData
            this.getList()
            // if (this.validateSearchData(searchData)) {
            //   this.searchData = {
            //     ...searchData,
            //     active_effect_time: searchData.active_effect_time ? this.computedDiffTimeZoneDate(searchData.active_effect_time, searchData.active_time_zone) : ''
            //   }
            //   console.log('this.searchData', this.searchData)
            //   this.getList()
            // }
          }
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(page = 1) {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum || page,
        active_type: this.searchData.active_type || '',
        active_name: this.searchData.active_name || '',
        // active_time_zone: this.searchData.active_time_zone || '',
        active_effect_time: this.searchData.active_effect_time || '',
        active_state: this.searchData.active_state || ''
      }
      this.loading = true
      try {
        const { res } = await getActivePages(params)
        this.loading = false
        this.tableData = res.list
        this.total = res.totalCount
        this.tableData.forEach((item) => {
          this.active_type = item.active_type
          item.act_type = item.active_type
          item.active_type = changeActiveType[(item.active_type)]
          item.award_object_type = this.active_type === 2 ? awardObjectType2[(item.group_award_object_type)] : awardObjectType[(item.fission_award_object_type)]
          item.award_type = this.active_type === 2 ? awardType[(item.captain_award_type)] : awardType[(item.recommender_award_type)]
          // item.active_effect_time = dayjs(item.active_effect_time * 1000).format('YYYY-MM-DD HH:mm:ss')
          // item.active_expired_time = dayjs(item.active_expired_time * 1000).format('YYYY-MM-DD HH:mm:ss')
          item.active_effect_time = this.transferDate(item.active_effect_time, item.active_time_zone)
          item.active_expired_time = this.transferDate(item.active_expired_time, item.active_time_zone)
        })
      } catch {
        this.loading = false
      }
    },
    // computedDiffTimeZoneDate(dateTime, timeZone) {
    //   // console.log({dateTime})
    //   const date = new Date(dateTime)
    //   // console.log({date})
    //   const localTime = date.getTime()
    //   // console.log({localTime})
    //   const localOffset = date.getTimezoneOffset() * 60000
    //   const utc = localTime + localOffset
    //   // console.log({timeZone})
    //   const offset = -this.timeZoneOptions.find((e) => {
    //     return e.value === timeZone
    //   }).offset
    //   const gmtTime = utc + 3600000 * offset
    //   // console.log({gmtTime})
    //   // console.log(dayjs(gmtTime).format('YYYY-MM-DD HH:mm:ss'))
    //   return gmtTime
    // },
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
    prevRefreshList(id) {
      this.$refs.editModal.edit(id)
    },
    selectStatus(value) {
      this.currentValue = value
      this.searchData.active_state = value
      this.getList()
    },
    addNewActivity() {
      this.$refs.editModal.show()
    },
    detailItem({ id }) {
      this.$refs.preveModal.show(id)
    },
    vettingItem({ id, active_name: name }) {
      this.$router.push({
        name: 'activitylinkList/:id',
        params: { id },
        query: { name }
      })
    },
    groupItem({ id, active_name: name }) {
      this.$router.push({
        name: 'groupDetailList/:id',
        params: { id },
        query: { name }
      })
    },
    fissileItem({ id, active_type: type, active_name: name }) {
      this.$router.push({
        name: 'fissileDetailList/:id',
        params: { id },
        query: { name, type }
      })
    },
    // validateSearchData(searchData) {
    //   const { active_effect_time, active_time_zone } = searchData;
    //   if ((active_effect_time && !active_time_zone) || (!active_effect_time && active_time_zone)) {
    //     this.$message({
    //       type: 'error',
    //       message: '时区和生效时间需要同时填写'
    //     })
    //     return false;
    //   }
    //   return true;
    // },
    handleCurrentChange(value) {
      this.pageNum = value
      this.getList(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.incentiveList-page {
  padding: 20px;
}
.total-info {
  font-size: 12px;
  color: #adadad;
}
</style>
