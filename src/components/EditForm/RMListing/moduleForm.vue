<template>
  <div>
    <el-form ref="moduleForm" :model="moduleForm" :rules="moduleRules" :disabled="isdisabled" label-position="left" label-width="150px" class="demo-Form demo-moduleForm">
      <el-collapse v-model="collapseActive">
        <el-collapse-item title="页面顶部模块" name="top">
          <template slot="title">
            <span class="arrow"><i class="el-icon-arrow-right"></i></span>
            页面顶部模块
          </template>
          <template>
            <div class="collapseActive">
              <el-collapse v-model="collapseActiveTop">
                <el-collapse-item title="InfoBar" name="InfoBar">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      通知栏InfoBar
                    </div>
                    <div class="switch-title">
                      <el-switch
                        v-model="moduleForm.infoBar.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.infoBar.status">
                    <el-form-item label="上线端口" prop="infoBar.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.infoBar.resEndPoint">
                        <el-checkbox label="PC">PC端</el-checkbox>
                        <el-checkbox label="M">M端</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="通知栏类型" prop="infoBar.type">
                      <el-select v-model="moduleForm.infoBar.type" placeholder="请选择通知栏类型">
                        <el-option label="文字+链接" value="textAndLink"></el-option>
                        <el-option label="文字+倒计时" value="flashSaleAndDDl"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="信息内容" prop="infoBar.content">
                      <el-input v-model="moduleForm.infoBar.content" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.infoBar.type == 'flashSaleAndDDl'" label="数量关联" prop="infoBar.quantityCorrelation">
                      <el-select v-model="moduleForm.infoBar.quantityCorrelation" placeholder="请选择通知栏类型">
                        <el-option label="库存量" value="库存量"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.infoBar.type == 'textAndLink' || moduleForm.infoBar.type == 'flashSaleAndDDl'" label="背景颜色" prop="infoBar.backgroundColor">
                      <el-select v-model="moduleForm.infoBar.backgroundColor" placeholder="请选择背景颜色">
                        <el-option label="蓝色" value="#357FFF"></el-option>
                        <el-option label="紫色" value="#8840FF"></el-option>
                        <el-option label="橙色" value="#F28118"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.infoBar.type == 'textAndLink'" label="链接文本" prop="infoBar.linkText">
                      <el-input v-model="moduleForm.infoBar.linkText" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.infoBar.type == 'textAndLink'" label="链接Url" prop="infoBar.linkUrl">
                      <el-input v-model="moduleForm.infoBar.linkUrl" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.infoBar.type == 'flashSaleAndDDl'" label="目标时间" prop="infoBar.targetTime">
                      <el-date-picker
                        v-model="moduleForm.infoBar.targetTime"
                        type="datetime"
                        placeholder="选择日期时间"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用通知栏InfoBar</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
        </el-collapse-item>
        <el-collapse-item title="页面右侧模块" name="right">
          <template slot="title">
            <span class="arrow"><i class="el-icon-arrow-right"></i></span>
            页面右侧模块
          </template>
          <template>
            <div class="collapseActive">
              <el-collapse v-model="collapseActiveRight">
                <el-collapse-item title="Status" name="Status">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      产品状态标记Status
                    </div>
                    <div class="switch-title">
                      <el-switch
                        v-model="moduleForm.productStatusFlag.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.productStatusFlag.status">
                    <el-form-item label="上线端口" prop="productStatusFlag.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.productStatusFlag.resEndPoint">
                        <el-checkbox label="PC">PC端</el-checkbox>
                        <el-checkbox label="M">M端</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-table
                      :data="moduleForm.productStatusFlag.tags"
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="#" width="40">
                      </el-table-column>
                      <el-table-column label="状态标记">
                        <template slot-scope="scope">
                          <el-image :src="scope.row.base64" class="optionInfoImg" />
                        </template>
                      </el-table-column>
                      <el-table-column
                        v-for="item in columns"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                      />
                      <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                          <el-button type="text" @click="delate(scope.$index,moduleForm.productStatusFlag.tags)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div v-if="moduleForm.productStatusFlag.tags.length === 0" class="addendum">
                      <el-button type="text" @click="productStatusFlagAdd">
                        + 新增项
                      </el-button>
                    </div>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用产品状态标记Status</div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="PriceInfo" name="PriceInfo">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      价格补充PriceInfo
                    </div>
                    <div class="switch-title">
                      <el-switch
                        v-model="moduleForm.priceInfo.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.priceInfo.status">
                    <el-form-item label="上线端口" prop="priceInfo.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.priceInfo.resEndPoint">
                        <el-checkbox label="PC">PC端</el-checkbox>
                        <el-checkbox label="M">M端</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="显示类型" prop="priceInfo.type">
                      <el-select v-model="moduleForm.priceInfo.type" placeholder="请选择显示类型">
                        <el-option label="折扣金额" value="price"></el-option>
                        <el-option label="百分比" value="percent"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用价格补充PriceInfo</div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Notice" name="Notice">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      提示信息Notice
                    </div>
                    <div class="switch-title">
                      <el-switch
                        v-model="moduleForm.noticeInfo.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.noticeInfo.status">
                    <el-form-item label="上线端口" prop="noticeInfo.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.noticeInfo.resEndPoint">
                        <el-checkbox label="PC">PC端</el-checkbox>
                        <el-checkbox label="M">M端</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-table
                      :data="moduleForm.noticeInfo.notices"
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="#" width="40">
                      </el-table-column>
                      <el-table-column
                        v-for="item in noticesColumns"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                      />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button type="text" @click="editRow(scope.$index,scope.row)">
                            编辑
                          </el-button>
                          <!-- <el-button type="text" @click="copyRow(scope.row)">
                            复制
                          </el-button> -->
                          <el-button type="text" @click="delate(scope.$index,moduleForm.noticeInfo.notices)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div v-if="moduleForm.noticeInfo.notices.length === 0" class="addendum">
                      <el-button type="text" @click="noticeInfoAdd">
                        + 新增项
                      </el-button>
                    </div>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用提示信息Notice</div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Coupon" name="Coupon">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      优惠券Coupon
                    </div>
                    <div class="switch-title">
                      <el-switch
                        v-model="moduleForm.couponInfo.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.couponInfo.status">
                    <el-form-item label="上线端口" prop="couponInfo.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.couponInfo.resEndPoint">
                        <el-checkbox label="PC">PC端</el-checkbox>
                        <el-checkbox label="M">M端</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="券码类型" prop="couponInfo.type">
                      <el-select v-model="moduleForm.couponInfo.type" placeholder="请选择券码类型">
                        <el-option label="通用券（无需注册）" value="price"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="优惠折扣" prop="couponInfo.title">
                      <el-input v-model="moduleForm.couponInfo.title" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="券码名称" prop="couponInfo.subTitle">
                      <el-input v-model="moduleForm.couponInfo.subTitle" clearable maxlength="43" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="券码描述" prop="couponInfo.desc">
                      <el-input v-model="moduleForm.couponInfo.desc" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="券码CODE" prop="couponInfo.code">
                      <el-input v-model="moduleForm.couponInfo.code" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="背景颜色" prop="couponInfo.color">
                      <el-select v-model="moduleForm.couponInfo.color" placeholder="请选择背景颜色" clearable>
                        <el-option label="橙色" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="按钮标题" prop="couponInfo.buttonTitle">
                      <el-input v-model="moduleForm.couponInfo.buttonTitle" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="解释弹窗标题" prop="couponInfo.alertTitle">
                      <el-input v-model="moduleForm.couponInfo.alertTitle" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="解释弹窗内容" prop="couponInfo.alertContent">
                      <el-input v-model="moduleForm.couponInfo.alertContent" type="textarea" clearable></el-input>
                      <br /><span style="font-size:12px;color:#aaa;">** 每条规则之间用英文分号(;)区分,不需要书写序号和换行</span>
                    </el-form-item>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用优惠券Coupon</div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Option" name="Option">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      选项配置Option
                    </div>
                    <div class="switch -title">
                      <el-switch
                        v-model="moduleForm.optionInfo.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.optionInfo.status">
                    <el-form-item label="上线端口" prop="optionInfo.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.optionInfo.resEndPoint">
                        <el-checkbox label="PC">PC端</el-checkbox>
                        <el-checkbox label="M">M端</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-table
                      :data="moduleForm.optionInfo.tags"
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="#" width="40">
                      </el-table-column>
                      <el-table-column label="状态标记">
                        <template slot-scope="scope">
                          <el-image :src="scope.row.base64" class="optionInfoImg" />
                          <span style="margin-left: 8px;">{{ scope.row.content }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        v-for="item in OptionColumns"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                      />
                      <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                          <el-button type="text" @click="delate(scope.$index,moduleForm.optionInfo.tags)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div v-if="moduleForm.optionInfo.tags.length === 0" class="addendum">
                      <el-button type="text" @click="optionInfoAdd">
                        + 新增项
                      </el-button>
                    </div>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用选项配置Option</div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Shipping" name="Shipping">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      发货Shipping
                    </div>
                    <div class="switch -title">
                      <el-switch
                        v-model="moduleForm.shippingInfo.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.shippingInfo.status">
                    <el-form-item label="Device" prop="shippingInfo.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.shippingInfo.resEndPoint">
                        <el-checkbox label="PC">PC</el-checkbox>
                        <el-checkbox label="M">Mobile</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="Shipping method" prop="shippingInfo.method">
                      <el-select v-model="moduleForm.shippingInfo.method" placeholder="Select Shipping method" clearable>
                        <el-option label="Free shipping" :value="1"></el-option>
                        <el-option label="Standard shipping" :value="2"></el-option>
                        <el-option label="LTL shipping" :value="3"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.shippingInfo.method === 1 || moduleForm.shippingInfo.method === 2" label="Holiday" prop="shippingInfo.holidayConfigId">
                      <el-select v-model="moduleForm.shippingInfo.holidayConfigId" placeholder="Select Holiday" clearable>
                        <el-option
                          v-for="(item, key) in holidayOptions"
                          :key="key"
                          :label="item.label"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.shippingInfo.method === 1 || moduleForm.shippingInfo.method === 2" label="Ship within" required class="frontLimit">
                      <el-input v-model="moduleForm.shippingInfo.time" required clearable style="width: 67px;"></el-input>
                      <div style="margin-left: 12px;">
                        <el-select v-model="moduleForm.shippingInfo.unit" required placeholder="Select Ship within" clearable>
                          <el-option label="day" value="day"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                    <el-form-item label="Pop up description" required class="frontLimit">
                      <div class="switch-title">
                        <el-switch
                          v-model="moduleForm.shippingInfo.descStatus"
                          active-color="#00BC4B"
                          inactive-color="#EEEEEE"
                          :width="48"
                          @change="handleSwitchChange"
                        />
                      </div>
                      <div style="margin-left: 12px;">
                        <span>Customize pop up description</span>
                        <span style="margin-left: 5px;">
                          <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">If you choose to customize the pop up<br /> description, your customized description <br /> will replace default description and the <br /> displayed in the pop up. </div>
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </span>
                      </div>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.shippingInfo.descStatus" prop="shippingInfo.desc" required>
                      <el-input v-model="moduleForm.shippingInfo.desc" type="textarea" placeholder="Enter your description" clearable></el-input>
                      <br /><span style="font-size:12px;color:#aaa;">** 每条规则之间用英文分号(;)区分,不需要书写序号和换行</span>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.shippingInfo.descStatus" label="Link inside pop up" required prop="shippingInfo.linkStatus" class="frontLimit">
                      <div class="switch -title">
                        <el-switch
                          v-model="moduleForm.shippingInfo.linkStatus"
                          active-color="#00BC4B"
                          inactive-color="#EEEEEE"
                          :width="48"
                          @change="handleSwitchChange"
                        />
                      </div>
                      <div style="margin-left: 12px;">
                        <span>Add customized link </span>
                        <span style="margin-left: 5px;">
                          <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">Your customized link will be added to the end of<br /> the description.</div>
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </span>
                      </div>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.shippingInfo.linkStatus" label="Link copy" prop="shippingInfo.linkCopy">
                      <el-input v-model="moduleForm.shippingInfo.linkCopy" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.shippingInfo.linkStatus" label="Link URL" prop="shippingInfo.linkUrl">
                      <el-input v-model="moduleForm.shippingInfo.linkUrl" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用发货Shipping</div>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Refund" name="Refund">
                  <template slot="title">
                    <div>
                      <span class="arrow"><i class="el-icon-arrow-right"></i></span>
                      退货Refund
                    </div>
                    <div class="switch -title">
                      <el-switch
                        v-model="moduleForm.refundInfo.status"
                        active-color="#00BC4B"
                        inactive-color="#EEEEEE"
                        :width="48"
                        @change="handleSwitchChange"
                      />
                    </div>
                  </template>
                  <div v-if="moduleForm.refundInfo.status">
                    <el-form-item label="Device" prop="refundInfo.resEndPoint">
                      <el-checkbox-group v-model="moduleForm.refundInfo.resEndPoint">
                        <el-checkbox label="PC">PC</el-checkbox>
                        <el-checkbox label="M">Mobile</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="Return policy" prop="refundInfo.policy">
                      <el-input v-model="moduleForm.refundInfo.policy" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Pop up description" required class="frontLimit">
                      <div class="switch-title">
                        <el-switch
                          v-model="moduleForm.refundInfo.descStatus"
                          active-color="#00BC4B"
                          inactive-color="#EEEEEE"
                          :width="48"
                          @change="handleSwitchChange"
                        />
                      </div>
                      <div style="margin-left: 12px;">
                        <span>Customize pop up description</span>
                        <span style="margin-left: 5px;">
                          <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">If you choose to customize the pop up<br /> description, your customized description <br /> will replace default description and the <br /> displayed in the pop up. </div>
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </span>
                      </div>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.refundInfo.descStatus" prop="refundInfo.desc" required>
                      <el-input v-model="moduleForm.refundInfo.desc" type="textarea" placeholder="Enter your description" clearable></el-input>
                      <br /><span style="font-size:12px;color:#aaa;">** 每条规则之间用英文分号(;)区分,不需要书写序号和换行</span>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.refundInfo.descStatus" label="Link inside pop up" required prop="refundInfo.linkStatus" class="frontLimit">
                      <div class="switch -title">
                        <el-switch
                          v-model="moduleForm.refundInfo.linkStatus"
                          active-color="#00BC4B"
                          inactive-color="#EEEEEE"
                          :width="48"
                          @change="handleSwitchChange"
                        />
                      </div>
                      <div style="margin-left: 12px;">
                        <span>Add customized link </span>
                        <span style="margin-left: 5px;">
                          <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">Your customized link will be added to the end of<br /> the description.</div>
                            <i class="el-icon-question"></i>
                          </el-tooltip>
                        </span>
                      </div>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.refundInfo.linkStatus" label="Link copy" prop="refundInfo.linkCopy">
                      <el-input v-model="moduleForm.refundInfo.linkCopy" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="moduleForm.refundInfo.linkStatus" label="Link URL" prop="refundInfo.linkUrl">
                      <el-input v-model="moduleForm.refundInfo.linkUrl" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div v-else>
                    <div class="collapseitemNote">请先启用退货Refund</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <AdditionOptionTags ref="additionOptionTags" @addTag-submit="AddOptionTagSubmit" />
    <AdditionTags ref="additionTags" @addTag-submit="AddTagSubmit" />
    <AdditionNotice ref="additionNotice" @addNotice-submit="addNoticeSubmit" @updateNotice-submit="updateNoticeSubmit" />

  </div>
</template>

<script>
import { getHolidayList } from '@/api/common'
import AdditionOptionTags from '@/components/EditForm/RMListing/additionOptionTags.vue'
import AdditionTags from '@/components/EditForm/RMListing/additionTags.vue'
import AdditionNotice from '@/components/EditForm/RMListing/additionNotice.vue'
import dayjs from 'dayjs'

export default {
  components: {
    AdditionOptionTags,
    AdditionTags,
    AdditionNotice
  },
  props: {
    isdisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'flag',
          label: '#TAG标记'
        }
      ],
      OptionColumns: [
        {
          prop: 'flag',
          label: '#TAG标记'
        }
      ],
      noticesColumns: [
        {
          prop: 'type',
          label: '组件类型',
          width: 90
        },
        {
          prop: 'content',
          label: '信息内容'
        },
        {
          prop: 'action',
          label: '关联动作',
          width: 90
        }
      ],
      holidayOptions: [],
      moduleForm: {
        infoBar: {
          backgroundColor: '',
          content: '',
          linkText: '',
          linkUrl: '',
          quantityCorrelation: '',
          resEndPoint: [],
          status: false,
          targetTime: '',
          type: ''
        },
        productStatusFlag: {
          resEndPoint: [],
          status: false,
          tags: [
            // {
            //   backgroundColor: 'adgadf',
            //   content: 'gad',
            //   flag: 'gadfgad'
            // }
          ]
        },
        priceInfo: {
          resEndPoint: [],
          status: false,
          type: ''
        },
        noticeInfo: {
          notices: [
            // {
            //   action: 'action',
            //   alertTitle: 'alertTitle',
            //   alertType: 'alertType',
            //   color: 'color',
            //   content: 'content',
            //   icon: 'icon',
            //   linkText: 'linkText',
            //   linkUrl: 'linkUrl',
            //   title: 'title',
            //   type: 'type'
            // }
          ],
          resEndPoint: [],
          status: false
        },
        couponInfo: {
          alertContent: '',
          alertTitle: '',
          buttonTitle: 'Get coupon',
          code: '',
          color: '',
          desc: '',
          resEndPoint: [],
          status: false,
          title: '',
          subTitle: '',
          type: ''
        },
        optionInfo: {
          resEndPoint: [],
          status: false,
          tags: [
            // {
            //   backgroundColor: '',
            //   content: '',
            //   flag: ''
            // }
          ]
        },
        shippingInfo: {
          desc: '',
          descStatus: false,
          linkCopy: '',
          linkStatus: false,
          linkUrl: '',
          method: '',
          methodText: '',
          resEndPoint: [],
          holidayConfigId: '',
          status: false,
          time: '',
          unit: ''
        },
        refundInfo: {
          desc: '',
          descStatus: false,
          linkCopy: '',
          linkStatus: false,
          linkUrl: '',
          policy: '',
          resEndPoint: [],
          status: false
        }
      },
      moduleRules: {
        infoBar: {
          backgroundColor: [
            { required: true, message: '请选择背景颜色', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请填写信息内容', trigger: 'blur' }
          ],
          linkText: [
            { required: true, message: '请填写链接文本', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '请填写链接Url', trigger: 'blur' }
          ],
          quantityCorrelation: [
            { required: true, message: '请选择数量关联', trigger: 'change' }
          ],
          resEndPoint: [
            { type: 'array', required: true, message: '请选择上线端口', trigger: 'change' }
          ],
          targetTime: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择通知栏类型', trigger: 'change' }
          ]
        },
        productStatusFlag: {
          resEndPoint: [
            { type: 'array', required: true, message: '请选择上线端口', trigger: 'change' }
          ]
          // tags: [
          //   {
          //     backgroundColor: 'adgadf',
          //     content: 'gad',
          //     flag: 'gadfgad'
          //   }
          // ]
        },
        priceInfo: {
          resEndPoint: [
            { type: 'array', required: true, message: '请选择上线端口', trigger: 'change' }
          ],
          status: false,
          type: [
            { required: true, message: '请选择显示类型', trigger: 'change' }
          ]
        },
        noticeInfo: {
          // notices: [
          //   {
          //     action: 'action',
          //     alertTitle: 'alertTitle',
          //     alertType: 'alertType',
          //     color: 'color',
          //     content: 'content',
          //     icon: 'icon',
          //     linkText: 'linkText',
          //     linkUrl: 'linkUrl',
          //     title: 'title',
          //     type: 'type'
          //   }
          // ],
          resEndPoint: [
            { type: 'array', required: true, message: '请选择上线端口', trigger: 'change' }
          ]
        },
        couponInfo: {
          alertContent: [
            { required: true, message: '请填写弹窗内容', trigger: 'blur' }
          ],
          alertTitle: [
            { required: true, message: '请填写弹窗标题', trigger: 'blur' }
          ],
          buttonTitle: [
            { required: true, message: '请填写按钮标题', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请填写券码CODE', trigger: 'blur' }
          ],
          color: [
            { required: true, message: '请选择背景颜色', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写券码描述', trigger: 'blur' }
          ],
          resEndPoint: [
            { type: 'array', required: true, message: '请选择上线端口', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请填写优惠折扣', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择券码类型', trigger: 'change' }
          ]
        },
        optionInfo: {
          resEndPoint: [
            { type: 'array', required: true, message: '请选择上线端口', trigger: 'change' }
          ]
          // tags: [
          // {
          //   backgroundColor: '',
          //   content: '',
          //   flag: ''
          // }
          // ]
        },
        shippingInfo: {
          desc: [
            { required: true, message: 'Please fill in the description', trigger: 'blur' }
          ],
          linkCopy: [
            { required: true, message: 'Please fill in the Link copy', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: 'Please fill in the Link URL', trigger: 'blur' }
          ],
          method: [
            { required: true, message: 'Select Shipping method', trigger: 'change' }
          ],
          holidayConfigId: [
            { required: true, message: 'Select Holiday', trigger: 'change' }
          ],
          resEndPoint: [
            { type: 'array', required: true, message: 'Select Device', trigger: 'change' }
          ],
          time: [
            { required: true, message: 'Please fill in the Ship within Num', trigger: 'blur' },
            { type: 'number', min: 1, message: 'Quantity cannot be 0', trigger: 'blur' }
          ],
          unit: [
            { type: 'array', required: true, message: 'Select Ship within Unit', trigger: 'change' }
          ]
        },
        refundInfo: {
          desc: [
            { required: true, message: 'Please fill in the description', trigger: 'blur' }
          ],
          linkCopy: [
            { required: true, message: 'Please fill in the Link copy', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: 'Please fill in the Link URL', trigger: 'blur' }
          ],
          policy: [
            { required: true, message: 'Please fill in the Return policy', trigger: 'blur' }
          ],
          resEndPoint: [
            { type: 'array', required: true, message: 'Select Device', trigger: 'change' }
          ]
        }
      },
      collapseActive: ['top', 'right'],
      collapseActiveTop: ['InfoBar'],
      collapseActiveRight: ['Status', 'PriceInfo', 'Notice', 'Coupon', 'Option', 'Shipping', 'Refund']
    }
  },
  watch: {
    'moduleForm.infoBar.status': function(val) {
      if (!val) {
        this.moduleForm.infoBar.resEndPoint = []
        this.moduleForm.infoBar.type = null
        this.moduleForm.infoBar.content = null
      } else {
        this.handleInfoBarTypeChange()
      }
    },
    'moduleForm.productStatusFlag.status': function(val) {
      if (!val) {
        this.moduleForm.productStatusFlag.resEndPoint = []
        this.moduleForm.productStatusFlag.tags = []
      }
    },
    'moduleForm.priceInfo.status': function(val) {
      if (!val) {
        this.moduleForm.priceInfo.resEndPoint = []
        this.moduleForm.priceInfo.type = null
      }
    },
    'moduleForm.noticeInfo.status': function(val) {
      if (!val) {
        this.moduleForm.noticeInfo.resEndPoint = []
        this.moduleForm.noticeInfo.notices = []
      }
    },
    'moduleForm.couponInfo.status': function(val) {
      if (!val) {
        this.moduleForm.couponInfo.resEndPoint = []
        this.moduleForm.couponInfo.alertContent = null
        this.moduleForm.couponInfo.alertTitle = null
        this.moduleForm.couponInfo.buttonTitle = null
        this.moduleForm.couponInfo.code = null
        this.moduleForm.couponInfo.color = null
        this.moduleForm.couponInfo.desc = null
        this.moduleForm.couponInfo.title = null
        this.moduleForm.couponInfo.subTitle = null
        this.moduleForm.couponInfo.type = null
      }
    },
    'moduleForm.optionInfo.status': function(val) {
      if (!val) {
        this.moduleForm.optionInfo.resEndPoint = []
        this.moduleForm.optionInfo.tags = []
      }
    },
    'moduleForm.shippingInfo.status': function(val) {
      if (!val) {
        this.moduleForm.shippingInfo.resEndPoint = []
        this.moduleForm.shippingInfo.descStatus = false
        this.moduleForm.shippingInfo.method = ''
      }
    },
    'moduleForm.shippingInfo.method': function(val) {
      if (!val) {
        this.moduleForm.shippingInfo.descStatus = false
        this.moduleForm.shippingInfo.methodText = ''
        this.moduleForm.shippingInfo.time = ''
        this.moduleForm.shippingInfo.unit = ''
        this.moduleForm.shippingInfo.holidayConfigId = ''
      } else if (val === 1) {
        this.moduleForm.shippingInfo.methodText = 'Free shipping in'
      } else if (val === 2) {
        this.moduleForm.shippingInfo.methodText = 'Standard shipping in'
      } else if (val === 3) {
        this.moduleForm.shippingInfo.methodText = 'LTL shipping in 3-10 business days'
        this.moduleForm.shippingInfo.holidayConfigId = ''
        this.moduleForm.shippingInfo.time = ''
        this.moduleForm.shippingInfo.unit = ''
      }
    },
    'moduleForm.shippingInfo.descStatus': function(val) {
      if (!val) {
        this.moduleForm.shippingInfo.desc = ''
        this.moduleForm.shippingInfo.linkStatus = false
        this.moduleForm.shippingInfo.linkCopy = ''
        this.moduleForm.shippingInfo.linkUrl = ''
      }
    },
    'moduleForm.shippingInfo.linkStatus': function(val) {
      if (!val) {
        this.moduleForm.shippingInfo.linkCopy = ''
        this.moduleForm.shippingInfo.linkUrl = ''
      }
    },
    'moduleForm.refundInfo.status': function(val) {
      if (!val) {
        this.moduleForm.refundInfo.resEndPoint = []
        this.moduleForm.refundInfo.descStatus = false
        this.moduleForm.refundInfo.policy = ''
      }
    },
    'moduleForm.refundInfo.descStatus': function(val) {
      if (!val) {
        this.moduleForm.refundInfo.desc = ''
        this.moduleForm.refundInfo.linkStatus = false
      }
    },
    'moduleForm.refundInfo.linkStatus': function(val) {
      if (!val) {
        this.moduleForm.refundInfo.linkCopy = ''
        this.moduleForm.refundInfo.linkUrl = ''
      }
    }
  },
  mounted() {
    this.initHolidayOptions()
  },
  methods: {
    initHolidayOptions() {
      const data = {
        annual: 2023
      }
      getHolidayList(data).then((res) => {
        this.holidayOptions = res.data.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
      })
    },
    handleSwitchChange() {
      event.stopPropagation()
    },
    conlog() {
      console.log('moduleForm', this.moduleForm)
    },
    pushData() {
      return this.moduleForm
    },
    getData(data) {
      if (data) {
        this.moduleForm = {
          infoBar: {
            ...data.infoBar,
            targetTime: data.infoBar.targetTime ? this.transferDate(data.infoBar.targetTime, data.timeZone) : ''
          },
          productStatusFlag: data.productStatusFlag,
          priceInfo: data.priceInfo,
          noticeInfo: data.noticeInfo,
          couponInfo: data.couponInfo,
          optionInfo: data.optionInfo,
          shippingInfo: data.shippingInfo,
          refundInfo: data.refundInfo
        }
      }
    },
    isEmpty() {
      if (
        !this.moduleForm.infoBar.status &&
        !this.moduleForm.productStatusFlag.status &&
        !this.moduleForm.priceInfo.status &&
        !this.moduleForm.noticeInfo.status &&
        !this.moduleForm.couponInfo.status &&
        !this.moduleForm.optionInfo.status &&
        !this.moduleForm.shippingInfo.status &&
        !this.moduleForm.refundInfo.status
      ) {
        return true
      } else {
        return false
      }
    },
    delate(index, rows) {
      this.$confirm('确认删除？')
        .then((_) => {
          rows.splice(index, 1)
        })
        .catch((_) => { })
    },
    editRow(index, rows) {
      console.log('rows', rows)
      const item = {
        index,
        isEdit: true,
        notices: { ...rows }
      }
      this.$refs.additionNotice.show(item)
    },
    copyRow(rows) {
      const item = {
        isEdit: false,
        notices: { ...rows }
      }
      this.$refs.additionNotice.show(item)
    },
    productStatusFlagAdd() {
      const value = {
        AddTarget: 'isProductStatus',
        isStatus: true
      }
      this.$refs.additionTags.show(value)
    },
    noticeInfoAdd() {
      this.$refs.additionNotice.show()
    },
    optionInfoAdd() {
      const value = {
        AddTarget: 'isOption',
        isOption: true
      }
      this.$refs.additionOptionTags.show(value)
    },
    AddTagSubmit(val) {
      const { tag } = val
      this.moduleForm.productStatusFlag.tags.push({
        base64: tag.base64,
        flag: tag.flag
      })
    },
    AddOptionTagSubmit(val) {
      const { tag } = val
      this.moduleForm.optionInfo.tags.push({
        content: tag.content,
        base64: tag.base64,
        flag: tag.flag
      })
    },
    addNoticeSubmit(val) {
      this.moduleForm.noticeInfo.notices.push({
        action: val.action,
        alertTitle: val.alertTitle,
        alertType: val.alertType,
        color: val.color,
        content: val.content,
        icon: val.icon,
        linkText: val.linkText,
        linkUrl: val.linkUrl,
        title: val.title,
        type: val.type,
        urlTitle: val.urlTitle
      })
    },
    updateNoticeSubmit(val) {
      const { data, index } = val
      this.moduleForm.noticeInfo.notices[index] = {
        action: data.action,
        alertTitle: data.alertTitle,
        alertType: data.alertType,
        color: data.color,
        content: data.content,
        icon: data.icon,
        linkText: data.linkText,
        linkUrl: data.linkUrl,
        title: data.title,
        type: data.type,
        urlTitle: data.urlTitle
      }
      this.moduleForm.noticeInfo.notices = [...this.moduleForm.noticeInfo.notices]
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
    handleInfoBarTypeChange() {
      const type = this.moduleForm.infoBar.type
      if (!type) {
        this.moduleForm.infoBar.quantityCorrelation = null
        this.moduleForm.infoBar.backgroundColor = null
        this.moduleForm.infoBar.linkText = null
        this.moduleForm.infoBar.linkUrl = null
        this.moduleForm.infoBar.targetTime = null
      } else if (type === 'textAndLink') {
        this.moduleForm.infoBar.targetTime = null
      } else if (type === 'flashSaleAndDDl') {
        this.moduleForm.infoBar.linkText = null
        this.moduleForm.infoBar.linkUrl = null
      }
    }
  }
}
</script>

<style lang="scss">
.demo-moduleForm{
  .el-collapse{
    border: 0px;
  }
  .el-collapse-item__header{
    border: 0px;
    color: #333;
    font-size: 14px;
    font-weight: 600;
    .el-icon-arrow-right{
      transition: all 0.5s;
    }
    &.is-active{
      .el-icon-arrow-right{
        transform: rotate(90deg);
      }
    }
    .el-collapse-item__arrow{
      display: none;
    }
  }
  .el-collapse-item__wrap{
    border: 0px;
  }
  .arrow {
    margin-right: 12px;
  }
  .el-collapse-item__content{
    padding-bottom: 0;
  }
  .addendum{
    text-align: center;
    margin-top: 10px;
  }
  .collapseitemNote{
    text-align:center;
    color:#ADADAD;
  }
  .collapseActive{
    padding:10px 30px;
    .el-collapse-item{
      + .el-collapse-item{
        margin-top: 12px;
      }
    }
    .el-collapse-item__header{
      dispaly: flex;
      justify-content: space-between;
      border-radius: 4px;
      background: #FAFAFA;
      padding:0px 15px;
    }
    .el-collapse-item__content{
      padding:10px 20px 25px;
    }
  }
  .optionInfoImg{
    vertical-align: bottom;
    img{
      display: inline-block;
      vertical-align: text-bottom;
    }
  }
  .frontLimit .el-form-item__content{
    display: flex;
    align-items: center;
  }
}
</style>
