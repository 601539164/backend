<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="580"
    :show-close="false"
    top="60px"
    class="incentive-edit-modal"
    :before-close="handleClose"
  >
    <div slot="title" class="edit-title">
      <div>{{ modalTitle }}</div>
    </div>
    <div style="text-align: right;color: #D8D8D8;">
      <i class="el-icon-refresh"></i> <span>同步间隔：{{ syncInterval }}minutes 最新同步：{{ syncTs }}</span>
    </div>
    <div
      style="
        margin: 12px 0;
        height: 1px;
        background-color: #eeeeee;
        width: 100%;
      "
    />
    <el-container>
      <el-aside width="198px" style="background: white;">
        <el-image style="width: 150px; height: auto" :src="formData.imageUrl" fit="fit">
        </el-image>
      </el-aside>
      <el-main>
        <div class="enableStatus">
          <div class="statusPoint" :style="{ background: formData.enabled ? '#00BC4B' : '#9b9191' }"></div>
          <el-tag v-if="formData.enabled" type="success">ENABLED</el-tag>
          <el-tag v-else type="danger">UNENABLE</el-tag>
        </div>
        <div class="prodName">{{ formData.prodName }}</div>
        <div class="sku">Product ID:{{ formData.productId }}</div>
        <div class="sku">SKU:{{ formData.sku }}</div>

      </el-main>
    </el-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础信息" name="productBasic">
        <el-table
          :data="formData.variants"
        >
          <el-table-column width="60">
            <template slot-scope="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.imageUrl"
                fit="fit"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in variantColumns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
          />
          <el-table-column>
            <template slot-scope="scope">
              <div
                v-for="item in scope.row.optionName"
                :key="item.label"
                style="text-align: left;"
              >
                {{ item.option_display_name }}: {{ item.label }} <br v-if="item.$index !== 1" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="tagsRelated">
        <template v-slot:label>
          关联标记 ({{ tagsAssemble.length }})
        </template>
        <el-table
          :data="tagsAssemble"
        >
          <el-table-column label="SKU">
            <template slot-scope="scope">{{ scope.row.sku }}</template>
          </el-table-column>
          <el-table-column
            v-for="item in tagsColumns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
          />

        </el-table>
        <template>
          <div class="comment">
            注：无法直接在商品详情完成对关联标记的修改，需要点击跳转，在标记和活动管理处进行统一调整。
          </div>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane label="记录" name="record">记录</el-tab-pane> -->
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button size="large" @click="cancel">
        取消
      </el-button>
      <el-button type="primary" size="large" @click="save">
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      modalTitle: '商品详情',
      site: '',
      syncTs: '',
      syncInterval: ' ',
      formData: {},
      tagsColumns: [
        {
          prop: 'flag',
          label: '标记参数'
        },
        {
          prop: 'updatedTime',
          label: '更新时间'
        }
      ],
      variantColumns: [
        {
          prop: 'sku',
          label: 'SKUs'
        }
      ],
      activeName: 'productBasic',
      tagsAssemble: [],
      dialogVisible: false
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    show(item) {
      if (item) {
        this.formData = {
          ...item
        }
        this.syncTs = item.syncTs
        this.syncInterval = item.syncInterval
        this.tagsAssembleInit(item)
      }
      this.dialogVisible = true
    },
    tagsAssembleInit(item) {
      const mainTags = [{
        tags: item.tags,
        sku: item.sku
      }]
      const variantTags = item.variants.map((variant) => {
        return {
          tags: variant.tags,
          sku: variant.sku
        }
      })
      const allTags = mainTags.concat(...variantTags)
      const itemTags = []
      for (let i = 0; i < allTags.length; i++) {
        const item_i = allTags[i]
        for (let j = 0; j < allTags[i].tags.length; j++) {
          const item_j = allTags[i].tags[j]
          itemTags.push({
            sku: item_i.sku,
            flag: item_j.flag,
            updatedTime: item_j.updatedTime.replace('T', ' ')
          })
        }
      }
      this.tagsAssemble = itemTags
    },
    handleClose(done) {
      this.$confirm('确认关闭?')
        .then((_) => {
          done()
        })
        .catch((_) => { })
    },
    cancel() {
      this.$confirm('确认取消?')
        .then((_) => {
          this.activeName = 'productBasic'
          this.dialogVisible = false
        })
        .catch((_) => { })
    },
    save() {
      this.activeName = 'productBasic'
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
.enableStatus {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .statusPoint {
    margin-right: 5px;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }
  .el-tag{
    background-color: white;
    border-color: white;
  }
}
.prodName{
  color: #333;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
}
.sku{
  color: #808080;
  font-size: 12px;
  font-weight: 400;
  margin-top: 8px;
}
.productBasic{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  background: #FAFAFA;
  padding: 13px 40px;
  .level{
    width: 15%;
    color: #333;
    font-size: 24px;
    font-weight: 500;
  }
  .instruction{
    flex: 1;
    color: #808080;
    font-size: 12px;
    font-weight: 400;
  }
  .updateTime{
    width: 20%;
    color: #D8D8D8;
    text-align: right;
    font-size: 10px;
    font-weight: 400;
  }
}
.comment{
  text-align: center;
  margin-top: 20px;
  color: #D8D8D8;
  font-size: 12px;
  font-weight: 400;
}
</style>
