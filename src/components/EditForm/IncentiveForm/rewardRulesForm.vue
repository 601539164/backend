<template>
  <div>
    <el-form v-if="active_type === 1 || active_type === 3" ref="rewardRulesForm" :model="rewardRulesForm" :rules="rewardRulesRules" label-position="left" label-width="150px" class="demo-Form demo-rewardRulesForm" :disabled="disabled">
      <span class="partition">奖励对象Target</span>
      <el-form-item label="奖励对象" prop="fission_award_object_type">
        <el-select v-model="rewardRulesForm.fission_award_object_type" placeholder="请选择奖励对象" disabled>
          <el-option
            v-for="(op, index) in awardObjectTypeOption"
            :key="index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </el-form-item>
      <div v-if="rewardRulesForm.fission_award_object_type == '1' || rewardRulesForm.fission_award_object_type == '3'">
        <span class="partition">分享者奖励 Referrer Reward</span>
        <el-table
          ref="awardCountTable"
          :data="awardCountData"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            property="segment_number"
            label="分段"
            width="50"
          >
            <template slot-scope="scope">
              #{{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="次数规则（后含）">
            <template #header>
              <span>次数规则（后含）</span>
              <br>
              <span>（示例：1-3（含））</span>
            </template>
            <el-table-column
              property="award_times_start"
              width="80"
            >
            </el-table-column>
            <el-table-column
              property="award_times_end"
              width="80"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            property="award_type"
            label="奖励类型"
          >
            <template slot-scope="scope">
              {{ showAwardTypeOption(scope.row.award_type) }}
            </template>
          </el-table-column>
          <el-table-column
            property="award_matching"
            label="奖励匹配"
          >
            <template slot-scope="scope">
              {{ showAwardMatchingOption(scope.row.award_matching) }}
            </template>
          </el-table-column>
          <el-table-column
            property="single_award_value"
            label="单次奖励(Num)"
          >
          </el-table-column>
          <el-table-column
            width="50"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color: #ADADAD;"
                @click.native.prevent="deleteRow(scope.$index, awardCountData)"
              >
                <i class="el-icon-close"></i>
              </el-button>
            </template>
          </el-table-column>
          <template slot="append" class="referrerRewardAdd">
            <tr v-show="addNewStatus" class="custom-row">
              <td width="50"><div class="cell"> {{ addNew.segment_number }}</div></td>
              <td width="80">
                <el-input v-model.number="addNew.award_times_start" placeholder=""></el-input>
              </td>
              <td width="80">
                <el-input v-model.number="addNew.award_times_end" placeholder=""></el-input>
              </td>
              <td>
                <el-select v-model="addNew.award_type" placeholder="请选择奖励类型">
                  <el-option
                    v-for="item in rewardTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-select v-model="addNew.award_matching" placeholder="请选择奖励匹配">
                  <el-option
                    v-for="item in rewardMatchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model.number="addNew.single_award_value" placeholder=""></el-input>
              </td>
              <td width="50" style="text-align: center;">
                <el-button type="text" @click="saveAdd">保存</el-button>
              </td>
            </tr>
          </template>
        </el-table>
        <div class="awardCountFooter">
          <div>
            <el-button type="text" @click="addAwardCount">
              <i class="el-icon-plus"></i>新增奖励
            </el-button>
          </div>
        </div>
        <el-form-item label="发放方式" prop="sharer_award_distribute_type">
          <el-select v-model="rewardRulesForm.sharer_award_distribute_type" placeholder="请选择发放方式" clearable>
            <el-option
              v-for="(op, index) in awardDistributeTypeOption"
              :key="index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="rewardRulesForm.fission_award_object_type == '2' || rewardRulesForm.fission_award_object_type == '3'">
        <span class="partition">被分享者奖励 Referral Reward</span>
        <el-form-item label="奖励类型" prop="recommender_award_type" class="frontLimit">
          <el-select v-model="rewardRulesForm.recommender_award_type" placeholder="请选择奖励类型" clearable>
            <el-option label="coupon" :value="3"></el-option>
          </el-select>
          <div v-if="rewardRulesForm.recommender_award_type == 3" style="margin-left: 20px;">
            <el-checkbox v-model="rewardRulesForm.recommender_single_coupon_code" label="每人独立Coupon Code" :disabled="single_coupon_disabled"></el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="recommender_coupon_name">
          <el-input v-model="rewardRulesForm.recommender_coupon_name" clearable></el-input>
        </el-form-item>
        <div v-if="active_type === 3">
          <el-form-item label="游客优惠Code">
            <el-input v-model="rewardRulesForm.recommender_tourists_coupon_code" clearable></el-input>
            <br /><span style="font-size:12px;color:#aaa;">** 游客优惠Code选填，如果没填游客码，游客领取时提示登录领取</span>
          </el-form-item>
        </div>
        <div v-if="active_type === 1">
          <el-form-item label="游客优惠Code" prop="recommender_tourists_coupon_code">
            <el-input v-model="rewardRulesForm.recommender_tourists_coupon_code" clearable></el-input>
          </el-form-item>
        </div>
        <el-form-item label="优惠券规则" prop="recommender_coupon_rule_explain">
          <el-input v-model="rewardRulesForm.recommender_coupon_rule_explain" type="textarea" clearable></el-input>
          <br /><span style="font-size:12px;color:#aaa;">** 每条规则之间用英文分号(;)区分,不需要书写序号和换行</span>
        </el-form-item>
        <el-form-item label="折扣" prop="recommender_discount_value" class="rebates-switch">
          <el-input v-model.number="rewardRulesForm.recommender_discount_value" clearable></el-input>
          <el-switch
            v-model="rewardRulesForm.recommender_discount_unit"
            active-text="%"
            inactive-text="$"
            active-color="#2B7DE1"
            inactive-color="#2B7DE1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="订单金额门槛" prop="recommender_order_threshold_amount" class="rebates-switch">
          <el-input v-model.number="rewardRulesForm.recommender_order_threshold_amount" clearable></el-input>
          <span>$</span>
        </el-form-item>
        <el-form-item label="优惠券SKU限制" required class="frontLimit">
          <el-switch v-model="rewardRulesForm.recommender_reward_sku_limit" prop="recommender_reward_sku_limit" style="margin-right: 5px;"></el-switch>
          <div :style=" { color: rewardRulesForm.recommender_reward_sku_limit ? '#2B7DE1' : '#DCDFE6' }">{{ rewardRulesForm.recommender_reward_sku_limit ? '是' : '否' }}</div>
        </el-form-item>
        <el-form-item v-if="rewardRulesForm.recommender_reward_sku_limit" prop="recommender_award_sku">
          <Tourproduct :tags="rewardRulesForm.recommender_award_sku" @handle-Update="handleUpdate" />
        </el-form-item>

        <div v-if="active_type === 3">
          <el-form-item label="奖励有效期类别" required>
            <el-switch
              v-model="rewardRulesForm.recommender_award_cutoff_type"
              active-color="#409eff"
              inactive-color="#13ce66"
              active-text="固定天数"
              inactive-text="固定日期"
            ></el-switch>
          </el-form-item>
          <el-form-item v-if="rewardRulesForm.recommender_award_cutoff_type" prop="recommender_award_effective_day" label="奖励天数限制">
            <el-input-number v-model="rewardRulesForm.recommender_award_effective_day" :min="1" label="奖励天数限制"></el-input-number>
            <br /><span style="font-size:12px;color:#aaa;">** 领取优惠券可配置x天内失效（整数天数）</span>
          </el-form-item>
          <el-form-item v-else label="奖励有效期" prop="recommender_award_time">
            <el-date-picker
              v-model="rewardRulesForm.recommender_award_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <br /><span style="font-size:12px;color:#aaa;">** 有效期为起始日期的0时0分0秒开始，到结束日期的0时0分0秒结束（即不包含所选结束日期当天）</span>
          </el-form-item>
        </div>
        <div v-if="active_type === 1">
          <el-form-item label="奖励有效期" prop="recommender_award_time">
            <el-date-picker
              v-model="rewardRulesForm.recommender_award_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <br /><span style="font-size:12px;color:#aaa;">** 有效期为起始日期的0时0分0秒开始，到结束日期的0时0分0秒结束（即不包含所选结束日期当天）</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-form v-if="active_type === 2" ref="rewardRulesForm" :model="groupRulesForm" :rules="groupRulesRules" label-position="left" label-width="130px" class="demo-Form demo-rewardRulesForm" :disabled="disabled">
      <span class="partition">奖励对象Target成团</span>
      <el-form-item label="奖励对象" prop="group_award_object_type">
        <el-select v-model="groupRulesForm.group_award_object_type" placeholder="请选择奖励对象" disabled>
          <el-option label="团长" :value="1"></el-option>
          <el-option label="团员" :value="2"></el-option>
          <el-option label="双方" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="参团人数"
        prop="group_people_number"
        class="inputform"
      >
        <el-input v-model.number="groupRulesForm.group_people_number" width="250"></el-input>
      </el-form-item>

      <el-form-item label="团长奖励发放" prop="captain_award_distribute_type">
        <el-select v-model="groupRulesForm.captain_award_distribute_type" placeholder="请选择团长奖励发放">
          <el-option label="拼团成功前发放" :value="1"></el-option>
          <!-- <el-option label="xxx" :value="2"></el-option> -->
        </el-select>
      </el-form-item>
      <div v-if="groupRulesForm.group_award_object_type == '1' || groupRulesForm.group_award_object_type == '3'">
        <span class="partition">团长奖励 Captain Reward</span>
        <el-form-item label="奖励类型" prop="captain_award_type">
          <el-select v-model="groupRulesForm.captain_award_type" placeholder="请选择奖励类型">
            <!-- <el-option label="credit" :value="1"></el-option>
            <el-option label="cash" :value="2"></el-option>
            <el-option label="coupon" :value="3"></el-option> -->
            <el-option label="discount" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券叠加" prop="captain_coupon_is_overlay">
          <el-select v-model="groupRulesForm.captain_coupon_is_overlay" placeholder="优惠券是否叠加" disabled>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣" prop="captain_discount_value" class="rebates-switch">
          <el-input v-model.number="groupRulesForm.captain_discount_value" clearable></el-input>
          <el-switch
            v-model="groupRulesForm.captain_discount_unit"
            active-text="%"
            inactive-text="$"
            active-color="#2B7DE1"
            inactive-color="#2B7DE1"
          >
          </el-switch>
        </el-form-item>
      </div>

      <div v-if="groupRulesForm.group_award_object_type == '2' || groupRulesForm.group_award_object_type == '3' ">
        <span class="partition"> 团员奖励 Member Reward</span>
        <el-form-item label="奖励类型" prop="member_award_type">
          <el-select v-model="groupRulesForm.member_award_type" placeholder="请选择团员奖励类型">
            <!-- <el-option label="credit" :value="1"></el-option>
            <el-option label="cash" :value="2"></el-option>
            <el-option label="coupon" :value="3"></el-option> -->
            <el-option label="discount" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣" prop="member_discount_value" class="rebates-switch">
          <el-input v-model.number="groupRulesForm.member_discount_value" clearable></el-input>
          <el-switch
            v-model="groupRulesForm.member_discount_unit"
            active-text="%"
            inactive-text="$"
            active-color="#2B7DE1"
            inactive-color="#2B7DE1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="优惠券叠加" prop="member_coupon_is_overlay">
          <el-select v-model="groupRulesForm.member_coupon_is_overlay" placeholder="优惠券是否叠加" disabled>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>

</template>

<script>
import { sharerAwardDistributeType, awardObjectType, awardType, awardMatching, awardTypeRule, awardCountDataMap } from '@/utils/parameters'
import Tourproduct from '@/components/EditModal/IncentiveEdit/tourproduct.vue'
import dayjs from 'dayjs'

export default {
  components: {
    Tourproduct
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAdd: false,
      value1: true,
      active_type: '',
      hasValue: false,
      awardObjectTypeOption: [],
      awardDistributeTypeOption: [],
      awardTypeOption: [],
      addNewStatus: false,
      addNew: {
        segment_number: '',
        award_times_start: '',
        award_times_end: '',
        award_type: '',
        award_matching: '',
        single_award_value: ''
      },
      rewardTypeOptions: [
        {
          label: 'credit',
          value: 1
        },
        {
          label: 'cash',
          value: 2
        }
        // {
        //   label: 'coupon',
        //   value: 3
        // },
        // {
        //   label: 'discount',
        //   value: 4
        // }
      ],
      rewardMatchOptions: [
        {
          label: '固定金额',
          value: 1
        },
        {
          label: '订单金额比例',
          value: 2
        }
      ],
      awardCountData: [],
      single_coupon_disabled: false,
      recommenderDiscountValue: Infinity,
      rewardRulesForm: {
        fission_award_object_type: 3,
        sharer_award_distribute_type: '',
        recommender_award_type: '',
        recommender_single_coupon_code: false,
        recommender_reward_sku_limit: true,
        recommender_coupon_name: '',
        recommender_tourists_coupon_code: '',
        recommender_coupon_rule_explain: '',
        recommender_order_threshold_amount: '',
        recommender_discount_unit: false,
        recommender_discount_value: '',
        recommender_award_sku: [],
        recommender_award_time: '',
        recommender_award_effective_day: '',
        active_type: '',
        sharer_award_rules: [],
        recommender_award_cutoff_type: false
      },
      captainDiscountValue: Infinity,
      memberDiscountValue: Infinity,
      groupRulesForm: {
        active_type: '',
        group_award_object_type: 3, // 成团奖励对象类型：1推荐人，2被推荐人，3双方
        group_people_number: '', // 参团人数
        captain_award_distribute_type: '', // 团长奖励发放：1拼团成功后发放 2xxx
        captain_award_type: '', // 团长奖励类型1-credit,2-cash,3-coupon,4-discount
        captain_coupon_is_overlay: false, // 团长优惠券是否叠加 0:否|1:是
        captain_discount_unit: false, // 团长折扣单位
        captain_discount_value: '', // number团长折扣值
        member_award_type: '', // 团员奖励类型1Discount,2xxx
        member_discount_unit: false, // 团员折扣单位
        member_discount_value: '', // number团员折扣值
        member_coupon_is_overlay: false // 团员优惠券叠加
      }
    }
  },
  computed: {
    rewardRulesRules() {
      const maxRecommenderDiscountValue = this.recommenderDiscountValue === 100 ? 100 : Infinity
      return {
        fission_award_object_type: [
          { required: true, trigger: 'blur' }
        ],
        sharer_award_distribute_type: [
          { required: true, message: '请选择发放方式', trigger: 'change' }
        ],
        recommender_award_type: [
          { required: true, message: '请选择奖励类型', trigger: 'change' }
        ],
        recommender_single_coupon_code: [
          { required: true, trigger: 'blur' }
        ],
        recommender_reward_sku_limit: [
          { required: true, trigger: 'blur' }
        ],
        recommender_coupon_name: [
          { required: true, message: '请输入优惠券名字', trigger: 'blur' }
        ],
        recommender_tourists_coupon_code: [
          { required: true, message: '请输入游客优惠Code', trigger: 'blur' }
        ],
        recommender_coupon_rule_explain: [
          { required: true, message: '请输入优惠券使用规则', trigger: 'blur' }
        ],
        recommender_discount_value: [
          { required: true, message: '请输入折扣', trigger: 'blur' },
          { type: 'number', min: 0, max: maxRecommenderDiscountValue, message: '折扣必须介于0到' + maxRecommenderDiscountValue + '之间', trigger: 'blur' }
        ],
        recommender_order_threshold_amount: [
          { required: true, message: '请输入订单金额门槛', trigger: 'blur' },
          { type: 'number', min: 0, message: '金额不能低于0', trigger: 'blur' }
        ],
        recommender_award_sku: [
          { required: true, message: '请输入商品SKU', trigger: 'change' }
        ],
        recommender_award_time: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ],
        recommender_award_effective_day: [
          { type: 'number', required: true, message: '请输入天数限制', trigger: 'blur' }
        ]
      }
    },
    groupRulesRules() {
      const maxCaptainDiscountValue = this.captainDiscountValue === 100 ? 100 : Infinity
      const maxMemberDiscountValue = this.memberDiscountValue === 100 ? 100 : Infinity
      return {
        group_award_object_type: [
          { required: true, message: '请选择奖励对象', trigger: 'change' }
        ],
        group_people_number: [
          { required: true, message: '请输入参团人数', trigger: 'blur' },
          { type: 'number', min: 2, message: '参团人数需大于1', trigger: 'blur' }
        ],
        captain_award_distribute_type: [
          { required: true, trigger: 'blur' }
        ],
        captain_award_type: [
          { required: true, trigger: 'blur' }
        ],
        captain_coupon_is_overlay: [
          { required: true, trigger: 'blur' }
        ],
        captain_discount_unit: [
          { required: true, trigger: 'blur' }
        ],
        captain_discount_value: [
          { required: true, message: '请输入折扣', trigger: 'blur' },
          { type: 'number', min: 0, max: maxCaptainDiscountValue, message: '折扣必须介于0到' + maxCaptainDiscountValue + '之间', trigger: 'blur' }
        ],
        member_award_type: [
          { required: true, trigger: 'blur' }
        ],
        member_discount_unit: [
          { required: true, trigger: 'blur' }
        ],
        member_coupon_is_overlay: [
          { required: true, trigger: 'blur' }
        ],
        member_discount_value: [
          { required: true, message: '请输入折扣', trigger: 'blur' },
          { type: 'number', min: 0, max: maxMemberDiscountValue, message: '折扣必须介于0到' + maxMemberDiscountValue + '之间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'rewardRulesForm.recommender_award_type': function(val) {
      if (val !== 3 && !this.single_coupon_disabled) {
        this.rewardRulesForm.recommender_single_coupon_code = false
      }
    },
    'rewardRulesForm.recommender_discount_unit': function(val) {
      if (val) {
        this.recommenderDiscountValue = 100
      } else {
        this.recommenderDiscountValue = Infinity
      }
    },
    'rewardRulesForm.recommender_reward_sku_limit': function(val) {
      if (!val) {
        this.rewardRulesForm.recommender_award_sku = []
      }
    },
    'rewardRulesForm.recommender_award_cutoff_type': function(val) {
      if (val) {
        this.rewardRulesForm.recommender_award_time = ''
        this.rewardRulesForm.recommender_award_effective_time = ''
        this.rewardRulesForm.recommender_award_expired_time = ''
      } else {
        this.rewardRulesForm.recommender_award_effective_day = ''
      }
    },

    'groupRulesForm.captain_discount_unit': function(val) {
      if (val) {
        this.captainDiscountValue = 100
      } else {
        this.captainDiscountValue = Infinity
      }
    },
    'groupRulesForm.member_discount_unit': function(val) {
      if (val) {
        this.memberDiscountValue = 100
      } else {
        this.memberDiscountValue = Infinity
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.awardObjectTypeOption = this.initOptions(awardObjectType)
      this.awardDistributeTypeOption = this.initOptions(sharerAwardDistributeType)
      this.awardTypeOption = this.initOptions(awardType)
    },
    initOptions(El) {
      const outputEL = Object.keys(El).map((key) => {
        const value = El[key]
        return {
          label: value,
          value: key * 1
        }
      })
      return outputEL
    },
    showAwardTypeOption(index) {
      return awardTypeRule[index]
    },
    showAwardMatchingOption(index) {
      return awardMatching[index]
    },
    handleUpdate(tagsGroup) {
      this.rewardRulesForm.recommender_award_sku = tagsGroup
    },
    log() {
      console.log('...groupRulesFormtype', this.groupRulesForm.active_type)
      console.log('...rewardRulesFormtype', this.rewardRulesForm.active_type)
    },
    conlog() {
      console.log('rewardRulesForm', this.rewardRulesForm)
      console.log('groupRulesForm', this.groupRulesForm)
    },
    getActiveType(type, skuLimiteData) {
      this.active_type = type
      this.groupRulesForm.active_type = type
      this.rewardRulesForm.active_type = type
      if (skuLimiteData.recommender_sku_flag) {
        this.rewardRulesForm.recommender_reward_sku_limit = skuLimiteData.recommender_sku_flag
        this.rewardRulesForm.recommender_award_sku = this.rewardRulesForm.recommender_award_sku.length > 0 ? this.rewardRulesForm.recommender_award_sku : [...skuLimiteData.recommender_sku]
      } else {
        this.rewardRulesForm.recommender_reward_sku_limit = this.rewardRulesForm.recommender_award_sku.length > 0 ? this.rewardRulesForm.recommender_reward_sku_limit : false
        this.rewardRulesForm.recommender_award_sku = this.rewardRulesForm.recommender_award_sku.length > 0 ? this.rewardRulesForm.recommender_award_sku : []
      }
      if (skuLimiteData.recommender_join_times > 1) {
        this.rewardRulesForm.recommender_single_coupon_code = true
        this.single_coupon_disabled = true
      } else {
        this.single_coupon_disabled = false
      }
    },
    pushData() {
      if (this.active_type === 1 || this.active_type === 3) {
        this.rewardRulesForm = {
          ...this.rewardRulesForm,
          // fission_award_object_type: this.rewardRulesForm.fission_award_object_type * 1,
          // sharer_award_distribute_type: this.rewardRulesForm.sharer_award_distribute_type * 1,
          recommender_award_type: this.rewardRulesForm.recommender_award_type * 1,
          sharer_award_rules: this.awardCountData
        }
        return this.rewardRulesForm
      } else {
        this.groupRulesForm = {
          ...this.groupRulesForm,
          group_award_object_type: this.groupRulesForm.group_award_object_type * 1
        }
        return this.groupRulesForm
      }
    },
    getData(data) {
      if (data.active_type === 1 || data.active_type === 3) {
        this.rewardRulesForm = {
          active_type: data.active_type,
          fission_award_object_type: data.fission_award_object_type,
          sharer_award_distribute_type: data.sharer_award_distribute_type,
          recommender_award_type: data.recommender_award_type * 1,
          recommender_single_coupon_code: data.recommender_single_coupon_code,
          recommender_reward_sku_limit: data.recommender_reward_sku_limit,
          recommender_award_cutoff_type: data.recommender_award_cutoff_type === 1, // 奖励有效期类别
          recommender_award_effective_day: data.recommender_award_effective_day, // 奖励有效期类别
          recommender_coupon_name: data.recommender_coupon_name,
          recommender_tourists_coupon_code: data.recommender_tourists_coupon_code,
          recommender_coupon_rule_explain: data.recommender_coupon_rule_explain,
          recommender_order_threshold_amount: data.recommender_order_threshold_amount,
          recommender_award_sku: data.recommender_award_sku,
          recommender_discount_unit: data.recommender_discount_unit === 1,
          recommender_discount_value: data.recommender_discount_value,
          // recommender_award_time: [dayjs(data.recommender_award_effective_time * 1000), dayjs(data.recommender_award_expired_time * 1000)]
          recommender_award_time: [this.transferDate(data.recommender_award_effective_time, data.active_time_zone), this.transferDate(data.recommender_award_expired_time, data.active_time_zone)]
        }
        this.active_type = this.rewardRulesForm.active_type
        this.awardCountData = data.sharer_award_rules
      } else if (data.active_type === 2) {
        this.groupRulesForm = {
          active_type: data.active_type * 1,
          group_award_object_type: data.group_award_object_type,
          group_people_number: data.group_people_number, // 参团人数
          captain_award_distribute_type: data.captain_award_distribute_type, // 团长奖励发放：1拼团成功后发放 2xxx
          captain_award_type: data.captain_award_type, // 团长奖励类型1Discount,2xxx
          captain_coupon_is_overlay: data.captain_coupon_is_overlay, // 团长优惠券是否叠加 0:否|1:是
          captain_discount_unit: data.captain_discount_unit === 1, // number团长折扣单位
          captain_discount_value: data.captain_discount_value, // number团长折扣值
          member_award_type: data.member_award_type, // 团员奖励
          member_discount_value: data.member_discount_value, // 团员折扣
          member_discount_unit: data.member_discount_unit === 1, // 团员折扣
          member_coupon_is_overlay: data.member_coupon_is_overlay // 团员优惠券叠加
        }
        this.active_type = this.groupRulesForm.active_type
      }
    },
    deleteRow(index, rows) {
      this.$confirm('确认删除？')
        .then((_) => {
          rows.splice(index, 1)
        })
        .catch((_) => { })
    },
    addAwardCount() {
      // this.isAdd = true
      if (this.addNewStatus) return
      this.addNew.segment_number = `#${this.awardCountData.length + 1}`
      this.addNewStatus = true
      // this.addAwardCountData.index = `#${this.awardCountData.length + 1}`
    },
    saveAdd() {
      const obj = JSON.parse(JSON.stringify(this.addNew))
      this.awardCountData.push(obj)
      this.addNewStatus = false
      Object.keys(this.addNew).forEach((key) => {
        this.addNew[key] = ''
      })
    },
    checkTransmission() {
      if (this.active_type === 2) return true
      if (this.awardCountData.length === 0) {
        this.$message({
          type: 'error',
          message: '分享者奖励还没填写'
        })
        return false
      } else {
        const [hasValue, emptyKey] = this.isCheckAwardCountDataEmpty(this.awardCountData)
        if (!hasValue) {
          this.$message({
            type: 'error',
            message: `分享者奖励列表中${emptyKey}字段还未填写,请重新填写完整！`
          })
        } else {
          const [isNumber, NumKey] = this.checkAwardCountDataType(this.awardCountData)
          if (!isNumber) {
            this.$message({
              type: 'error',
              message: `分享者奖励列表中${NumKey}字段必须填写大于0的数字,请检查！`
            })
          } else {
            return true
          }
        }
      }
    },
    isCheckAwardCountDataEmpty(awardCountData) {
      for (let i = 0; i < awardCountData.length; i++) {
        const data = awardCountData[i]
        for (const key in data) {
          if (data[key] === '') {
            console.log('key', key)
            return [false, awardCountDataMap[key]]
          }
        }
      }
      return [true, undefined]
    },
    checkAwardCountDataType(awardCountData) {
      for (let i = 0; i < awardCountData.length; i++) {
        const data = awardCountData[i]
        if (typeof data.award_times_start !== 'number') {
          return [false, awardCountDataMap[`award_times_start`]]
        }
        if (typeof data.award_times_end !== 'number') {
          return [false, awardCountDataMap[`award_times_end`]]
        }
        if (typeof data.single_award_value !== 'number') {
          return [false, awardCountDataMap[`single_award_value`]]
        }
      }
      return [true, undefined]
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-row::v-deep{
    input {
      // border: none;
    }
  }
  .awardCountFooter{
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .rebates-switch{
    position: relative;
    .el-switch{
      position: absolute;
      left: 155px;
      top: 50%;
      transform: translateY(-50%) scale(1.3);
      .el-switch__core{
        display: none;
      }
    }
    span{
      position: absolute;
      left: 220px;
      top: 50%;
      transform: translateY(-50%);
      color: #ADADAD;
    }
  }
</style>
<style lang="scss">
.rebates-switch{
  .el-switch{
    border-radius: 5px;
    overflow: hidden;
    .el-switch__label{
      margin: 0;
      padding: 0 10px;
      color: #ADADAD;
      background-color: transparent;
      &.is-active{
        color: #FFF;
        background-color: #2B7DE1;
      }
    }
    .el-switch__core{
      display: none;
    }
  }
}
</style>
