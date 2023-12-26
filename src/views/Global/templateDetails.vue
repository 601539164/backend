<template>
  <div class="EmailTemplate-page">
    <el-form
      v-loading="loading"
      label-position="left"
      label-width="100px"
      :model="formLabelAlign"
    >
      <el-form-item label="邮件模板名称">
        <el-input v-model="formLabelAlign.tempName"></el-input>
      </el-form-item>
      <el-form-item label="模板说明">
        <el-input v-model="formLabelAlign.note"></el-input>
      </el-form-item>
      <el-form-item label="邮件标题">
        <el-input v-model="formLabelAlign.title"></el-input>
      </el-form-item>
      <el-form-item label="邮件状态">
        <div class="switch-title">
          <el-switch
            v-model="formLabelAlign.isActive"
            active-color="#00BC4B"
            inactive-color="#EEEEEE"
            :width="48"
          />
          <div
            class="switch-label"
            :style="{ color: formLabelAlign.isActive ? '#00BC4B' : '#ff4949' }"
          >
            {{ formLabelAlign.isActive ? 'Active' : 'Disabled' }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="编辑邮件">
        <div id="gjs">

          <!--
            <p style="color: red">注意：这是初始模板，需要新建邮件，请删除这句话！！！!</p>
            <div style="width: 600px">
            <p>Welcome!</p>
            <br />
            <p>We are excited to have you as part of Renogy. Here's a $10 coupon code, "<b>CORE7</b>" just for you.
            </p>

            <p>Furthermore, we'd like to give you the chance to
              <a
                href="https://www.renogy.com/referral/"
                target="_blank"
              >
                create your own unique URL
              </a>
              and share it with your friends. By doing so, you can earn up to $20 credit!
            </p>

            <p>Don't hesitate to call us at +1(909)2877111 or contact us via
              <a
                href="https://www.renogy.com/contact-us"
                target="_blank"
              >
                https://www.renogy.com/contact-us</a>
              if you have any questions or concerns.</p>

            <p><b>-What’s New</b></p>
            <div style="text-align: left;">
              <a
                href="https://www.renogy.com/12v-200ah-core-series-deep-cycle-lithium-iron-phosphate-battery/"
              >
                <img
                  src="https://store-fhnch.mybigcommerce.com/content/new-6.5/mail/new_battery_mail_tem_1.jpeg"
                  alt="logo"
                  style="margin: 20px auto;width:550px"
                />
              </a>
            </div>
            <p>Our
              <a
                href="https://www.renogy.com/12v-200ah-core-series-deep-cycle-lithium-iron-phosphate-battery/"
              >
                new Renogy 12V 200Ah Core Series Battery
              </a>
              offers a trusted, one-stop experience for you to upgrade from lead-acid to lithium.
              Explore how it can ease the upgrade for you and score exclusive 7% OFF early bird savings (Use code:
              <b>CORE7</b>) today. </p>

            <br />
            <p>
              Best regards,<br />
              Renogy
            </p>
          </div> -->
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="previewNew()">修改完毕，去预览</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="邮件预览"
      :visible.sync="dialogVisible"
      width="700px"
      top="40px"
      :before-close="handleClose"
      class="Email-dialog"
    >
      <div id="EmailPreviewContent" class="EmailPreviewContent" v-html="EmailTempGJShtml"></div>
      <div id="EmailPreviewCss" v-html="EmailTempGJScss"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleRollback()">回退所有改动</el-button>
        <el-button @click="dialogVisible = false">暂 存</el-button>
        <el-button type="primary" @click="handleSubmit()">提 交</el-button>
      </span>
      <div><div></div></div>
    </el-dialog>
  </div>
</template>

<script>

import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'
import plugin from 'grapesjs-preset-newsletter'
import { getEmailTemplatelist, refreshEmailTemplate } from '@/api/emailTemplate'

export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      pageSize: 20,
      currentPage: 1,
      formLabelAlign: {
        id: '',
        tempName: '',
        note: '',
        title: '',
        isActive: '',
        initData: '',
        content: ''
      },
      EmailTempGJShtml: ``,
      EmailTempGJScss: ``,
      tempRoute: {},
      grapesjsEditor: ''
    }
  },
  created() {
    const id = this.$route.params.id // 获取路由参数中的 ID
    const name = `details-${id}` // 根据 ID 生成页面标题
    document.title = name // 设置页面标题

    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: `邮件模板详情-${id}` })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题
  },
  mounted() {
    this.getTemplate()
    this.initGrapesjs()
  },
  methods: {
    getTemplate() {
      const params = {
        size: this.pageSize,
        currentPage: this.currentPage,
        id: this.$route.params.id || ''
      }
      getEmailTemplatelist(params).then((res) => {
        this.loading = false
        const temp = res.data.temps[0]
        this.formLabelAlign.id = temp.id
        this.formLabelAlign.tempName = temp.tempName
        this.formLabelAlign.note = temp.note
        this.formLabelAlign.title = temp.title
        this.formLabelAlign.isActive = temp.isActive === 1
        this.formLabelAlign.initData = JSON.parse(temp.initData)
        this.formLabelAlign.content = temp.content
        this.grapesjsEditor.loadProjectData(
          {
            'assets': [],
            'styles': this.formLabelAlign.initData.styles,
            'pages': this.formLabelAlign.initData.pages
          }
        )
        // 存放基础模板，为以后开启添加新邮件模板功能使用
        // this.grapesjsEditor.loadProjectData(
        //   {
        //     'assets': [],
        //     'styles': [
        //       {
        //         'selectors': [
        //           '#ikmc'
        //         ],
        //         'style': {
        //           'width': '600px'
        //         }
        //       },
        //       {
        //         'selectors': [
        //           '#ipxek'
        //         ],
        //         'style': {
        //           'text-align': 'left'
        //         }
        //       },
        //       {
        //         'selectors': [
        //           '#ia9vj'
        //         ],
        //         'style': {
        //           'margin': '20px auto',
        //           'width': '550px'
        //         }
        //       }
        //     ],
        //     'pages': [
        //       {
        //         'frames': [
        //           {
        //             'component': {
        //               'type': 'wrapper',
        //               'stylable': [
        //                 'background',
        //                 'background-color',
        //                 'background-image',
        //                 'background-repeat',
        //                 'background-attachment',
        //                 'background-position',
        //                 'background-size'
        //               ],
        //               'components': [
        //                 {
        //                   'attributes': {
        //                     'data-v-ee7f0e46': '',
        //                     'id': 'gjs-content'
        //                   }
        //                 },
        //                 {
        //                   'attributes': {
        //                     'data-v-ee7f0e46': '',
        //                     'id': 'ikmc'
        //                   },
        //                   'components': [
        //                     {
        //                       'tagName': 'p',
        //                       'type': 'text',
        //                       'attributes': {
        //                         'data-v-ee7f0e46': '',
        //                         'id': 'ie8l'
        //                       },
        //                       'components': [
        //                         {
        //                           'type': 'textnode',
        //                           'content': 'Welcome!allen'
        //                         }
        //                       ]
        //                     },
        //                     {
        //                       'tagName': 'br',
        //                       'void': true,
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       }
        //                     },
        //                     {
        //                       'tagName': 'p',
        //                       'type': 'text',
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       },
        //                       'components': [
        //                         {
        //                           'type': 'textnode',
        //                           'content': "We are excited to have you as part of Renogy. Here's a $10 coupon code, \""
        //                         },
        //                         {
        //                           'tagName': 'b',
        //                           'type': 'text',
        //                           'attributes': {
        //                             'data-v-ee7f0e46': ''
        //                           },
        //                           'components': [
        //                             {
        //                               'type': 'textnode',
        //                               'content': 'CORE7'
        //                             }
        //                           ]
        //                         },
        //                         {
        //                           'type': 'textnode',
        //                           'content': '" just for you. '
        //                         }
        //                       ]
        //                     },
        //                     {
        //                       'tagName': 'p',
        //                       'type': 'text',
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       },
        //                       'components': [
        //                         {
        //                           'type': 'textnode',
        //                           'content': "Furthermore, we'd like to give you the chance to "
        //                         },
        //                         {
        //                           'type': 'link',
        //                           'attributes': {
        //                             'data-v-ee7f0e46': '',
        //                             'href': 'https://www.renogy.com/referral/',
        //                             'target': '_blank'
        //                           },
        //                           'components': [
        //                             {
        //                               'type': 'textnode',
        //                               'content': ' create your own unique URL '
        //                             }
        //                           ]
        //                         },
        //                         {
        //                           'type': 'textnode',
        //                           'content': ' and share it with your friends. By doing so, you can earn up to $20 credit! '
        //                         }
        //                       ]
        //                     },
        //                     {
        //                       'tagName': 'p',
        //                       'type': 'text',
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       },
        //                       'components': [
        //                         {
        //                           'type': 'textnode',
        //                           'content': "Don't hesitate to call us at +1(909)2877111 or contact us via "
        //                         },
        //                         {
        //                           'type': 'link',
        //                           'attributes': {
        //                             'data-v-ee7f0e46': '',
        //                             'href': 'https://www.renogy.com/contact-us',
        //                             'target': '_blank'
        //                           },
        //                           'components': [
        //                             {
        //                               'type': 'textnode',
        //                               'content': ' https://www.renogy.com/contact-us'
        //                             }
        //                           ]
        //                         },
        //                         {
        //                           'type': 'textnode',
        //                           'content': ' if you have any questions or concerns.'
        //                         }
        //                       ]
        //                     },
        //                     {
        //                       'tagName': 'p',
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       },
        //                       'components': [
        //                         {
        //                           'tagName': 'b',
        //                           'type': 'text',
        //                           'attributes': {
        //                             'data-v-ee7f0e46': ''
        //                           },
        //                           'components': [
        //                             {
        //                               'type': 'textnode',
        //                               'content': '-What’s New'
        //                             }
        //                           ]
        //                         }
        //                       ]
        //                     },
        //                     {
        //                       'attributes': {
        //                         'data-v-ee7f0e46': '',
        //                         'id': 'ipxek'
        //                       },
        //                       'components': [
        //                         {
        //                           'type': 'link',
        //                           'editable': false,
        //                           'attributes': {
        //                             'data-v-ee7f0e46': '',
        //                             'href': 'https://www.renogy.com/12v-200ah-core-series-deep-cycle-lithium-iron-phosphate-battery/'
        //                           },
        //                           'components': [
        //                             {
        //                               'type': 'image',
        //                               'resizable': {
        //                                 'ratioDefault': 1
        //                               },
        //                               'attributes': {
        //                                 'data-v-ee7f0e46': '',
        //                                 'src': 'https://store-fhnch.mybigcommerce.com/content/new-6.5/mail/new_battery_mail_tem_1.jpeg',
        //                                 'alt': 'logo',
        //                                 'id': 'ia9vj'
        //                               }
        //                             }
        //                           ]
        //                         }
        //                       ]
        //                     },
        //                     {
        //                       'tagName': 'p',
        //                       'type': 'text',
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       },
        //                       'components': [
        //                         {
        //                           'type': 'textnode',
        //                           'content': 'Our '
        //                         },
        //                         {
        //                           'type': 'link',
        //                           'attributes': {
        //                             'data-v-ee7f0e46': '',
        //                             'href': 'https://www.renogy.com/12v-200ah-core-series-deep-cycle-lithium-iron-phosphate-battery/'
        //                           },
        //                           'components': [
        //                             {
        //                               'type': 'textnode',
        //                               'content': ' new Renogy 12V 200Ah Core Series Battery '
        //                             }
        //                           ]
        //                         },
        //                         {
        //                           'type': 'textnode',
        //                           'content': ' offers a trusted, one-stop experience for you to upgrade from lead-acid to lithium. Explore how it can ease the upgrade for you and score exclusive 7% OFF early bird savings (Use code: '
        //                         },
        //                         {
        //                           'tagName': 'b',
        //                           'type': 'text',
        //                           'attributes': {
        //                             'data-v-ee7f0e46': ''
        //                           },
        //                           'components': [
        //                             {
        //                               'type': 'textnode',
        //                               'content': 'CORE7'
        //                             }
        //                           ]
        //                         },
        //                         {
        //                           'type': 'textnode',
        //                           'content': ') today. '
        //                         }
        //                       ]
        //                     },
        //                     {
        //                       'tagName': 'br',
        //                       'void': true,
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       }
        //                     },
        //                     {
        //                       'tagName': 'p',
        //                       'type': 'text',
        //                       'attributes': {
        //                         'data-v-ee7f0e46': ''
        //                       },
        //                       'components': [
        //                         {
        //                           'type': 'textnode',
        //                           'content': ' Best regards,'
        //                         },
        //                         {
        //                           'tagName': 'br',
        //                           'void': true,
        //                           'attributes': {
        //                             'data-v-ee7f0e46': ''
        //                           }
        //                         },
        //                         {
        //                           'type': 'textnode',
        //                           'content': ' Renogy '
        //                         }
        //                       ]
        //                     }
        //                   ]
        //                 }
        //               ]
        //             }
        //           }
        //         ],
        //         'id': 'VfHB33ZH4ZpiygKT'
        //       }
        //     ]
        //   }
        // )
      })
    },
    initGrapesjs() {
      // Set up GrapesJS editor with the Newsletter plugin
      this.grapesjsEditor = grapesjs.init({
        width: '100%',
        container: '#gjs',
        fromElement: true,
        plugins: [plugin],
        storageManager: false
      })
    },
    previewNew() {
      this.EmailTempGJShtml = this.grapesjsEditor.getHtml()
      this.EmailTempGJScss = `<style type="text/css">${this.grapesjsEditor.editor.getCss()}</style>`
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('继续修改？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleRollback() {
      this.$confirm('确认放弃修改？')
        .then(_ => {
          this.dialogVisible = false
          this.getTemplate()
        })
        .catch(_ => {})
    },
    handleSubmit() {
      this.dialogVisible = false
      const UpdateContent = `<div><div>${this.EmailTempGJShtml}</div><div>${this.EmailTempGJScss}</div></div>`
      this.formLabelAlign.initData = this.grapesjsEditor.getProjectData()
      const req = {
        id: this.formLabelAlign.id,
        content: UpdateContent,
        isActive: this.formLabelAlign.isActive ? 1 : 0,
        note: this.formLabelAlign.note,
        tempName: this.formLabelAlign.tempName,
        initData: JSON.stringify(this.formLabelAlign.initData),
        title: this.formLabelAlign.title
      }
      refreshEmailTemplate(req).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.getTemplate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.EmailTemplate-page{
  padding: 20px;
  .flextype{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  #gjs{
    margin-top: 20px;
  }
  .EmailPreviewContent{
    color: #000 !important;
  }
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
</style>
