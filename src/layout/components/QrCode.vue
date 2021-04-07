<template>
  <div>
    <div class="qrCode text_center" @click="qrcodeDlgHandle">
      <img src="../../assets/side-code.png" alt="">
      <p class="fz_18 fc_404040">邀请注册个体户</p>
      <a class="fc_1D4ABC fz_14">点击查看邀请二维码</a>
    </div>
    <el-dialog
      class="shareDlg"
      width="1080px"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <img v-if="imgData !== ''" :src="imgData" alt="">
      <div class="dis_flex" style="margin-top: -30px;">
        <div class="text_center">
          <div ref="box" class="qr-code">
            <div id="qrCode" ref="qrCodeDiv">
              <div>
                <p class="qrcodeFamily" :class="enterpriseName.length <= 16 ? 'QrtextActive' : ''">
                  {{ enterpriseName }}
                </p>
              </div>
              <img class="code-bg" src="../../assets/shareBg.png" alt="">
            </div>
          </div>
          <el-button
            plain
            type="primary"
            class="downBtn"
            @click="downInviteCode"
          >下载邀请二维码</el-button>
        </div>
        <div class="dlg-content">
          <p class="fz_30">邀请注册个体户</p>
          <p class="tit fc_acacac fz_18 mt_20 mb_20">
            请相关人员扫描左侧二维码进入小程序注册
          </p>
          <div>
            <p class="fz_24 fc_404040 mt_20 mb_20">提交审核设置</p>
            <div>
              <el-switch
                v-model="autoAudit"
                active-color="#1D4ABC"
                inactive-color="#acacac"
                @change="changeAudit"
              /><span
                style="display: inline-block;margin-left: 10px;"
              >自动通过提交审核</span>
            </div>
            <p v-if="autoAudit" class="mt_20" style="line-height:25px">
              说明：自动通过提交审核已开启，伙伴上传的个体工商户注册资料将自动通过并提交至平台
            </p>
            <p v-else class="mt_20">
              说明：自动通过提交审核已关闭，您需要手动提交员工的个体工商注册资料
            </p>
          </div>
          <div class="invite-warning">
            <p class="fz_28">一企一码，内部专用</p>
            <p class="fz_24">请勿将二维码发送给不相关人员</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { XKUpdateContractor } from '@/api/partner'
import { mapState } from 'vuex'
import html2canvas from 'html2canvas'
import QRCode from 'qrcodejs2'
// import { XKGetContractorByEnterpriseId } from '@/api/account.js'
export default {
  data() {
    return {
      dialogVisible: false,
      imgData: '',
      autoAudit: true,
      merchantInfo: {},
      enterpriseId: this.$store.state.user.enterprise.id, // this.$store.state.user.enterprise.id 暂时用1做测试
      enterpriseCode: this.$store.state.user.enterprise.enterprise_code,
      enterpriseName: this.$store.state.user.enterprise.name
    }
  },
  mounted() {
    this.getContractor()
  },
  methods: {
    changeAudit(status) {
      const obj = {
        contractorId: this.merchantInfo.contractorId,
        businessAuto: this.autoAudit ? 1 : 0
      }
      XKUpdateContractor(obj).then(res => {
        this.$message.success('操作成功')
      })
    },
    getContractor() {
      XKGetContractorByEnterpriseId({
        enterpriseId: this.enterpriseId
      }).then(res => {
        this.merchantInfo = res
        this.$store.state.merchantInfo = this.merchantInfo
        this.autoAudit = res.businessAuto === 1
      })
    },
    qrcodeDlgHandle() {
      this.dialogVisible = true
      this.bindQRCode()
    },
    bindQRCode() {
      this.$nextTick(() => {
        new QRCode(this.$refs.qrCodeDiv, {
          text:
            'https://business.myxbx.com/xckFront/enterpriseCode?id=' +
            this.enterpriseCode, // 设置二维码内容或跳转地址
          width: 150,
          height: 150,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        })
      })
    },
    createPicture() {
      sessionStorage.setItem(
        'curH',
        document.getElementById('qrCode').scrollTop
      )
      const myCanvas = document
        .getElementById('qrCode')
        .getElementsByTagName('canvas')
      const img = document.getElementById('qrCode').getElementsByTagName('img')
      // // //创建一个a标签节点
      const a = document.createElement('a')
      // //设置a标签的href属性（将canvas变成png图片）
      // let imgURL = myCanvas[0].toDataURL('image/jpg');
      const poster = document.getElementById('qrCode')

      html2canvas(poster, {
        dpi: window.devicePixelRatio * 2,
        scale: 2,
        useCORS: true // 【重要】开启跨域配置
      }).then(imgURL => {
        this.posterDataUrl = imgURL.toDataURL()
      })

      const ua = navigator.userAgent
      if (ua.indexOf('Trident') != -1 && ua.indexOf('Windows') != -1) {
        var bstr = atob(this.posterDataUrl.split(',')[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        var blob = new Blob([u8arr])
        window.navigator.msSaveOrOpenBlob(
          blob,
          '注册个体户邀请码IE' + '.' + 'png'
        )
      } else if (ua.indexOf('Firefox') > -1) {
        const blob = this.base64ToBlob(imgURL)
        const evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true)
        a.download = ' '
        a.href = URL.createObjectURL(blob)
        a.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          })
        ) // 兼容火狐
      } else {
        // 谷歌兼容下载
        const poster = document.getElementById('qrCode')
        html2canvas(poster).then(imgURL => {
          this.posterDataUrl = imgURL.toDataURL()
          a.href = this.posterDataUrl
          a.download = '注册个体户邀请码'
          a.click()
          window.scrollTo(0, sessionStorage.getItem('curH'))
        })
      }
    },
    // base64转blob
    base64ToBlob(code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {
        type: contentType
      })
    },
    downInviteCode() {
      // 下载邀请二维码
      this.createPicture() // 二维码执行生成图片
    }
  }
}
</script>
<style lang="scss">
.qrCode {
  position: fixed;
  width: 164px;
  height: 179px;
  background-color: rgba(29, 74, 188, 0.08);
  cursor: pointer;
  bottom: 10px;
  left: 18px;
  z-index: 1002;
  img {
    margin-top: 22px;
    margin-bottom: 8px;
  }
}

#qrCode {
  width: 375px;
  height: 670px;
  position: relative;
  div {
    width: 100%;
    text-align: center;
    color: #ffffff;
    font-size: 26px;
    position: absolute;
    top: 20px;
    font-weight: bold;
    z-index: 9999;
  }
  img {
    width: 40%;
    margin: auto;
    margin-top: 165px;
    background-color: #fff; //设置白色背景色
    padding: 5px; // 利用padding的特性，挤出白边
    position: absolute;
    top: -33px;
    left: 112px;
  }
  img.code-bg {
    position: static !important;
    width: 100%;
    height: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }
}
.shareDlg {
  .downBtn {
    margin-top: 20px;
  }
  .dlg-content {
    margin-top: 20px;
    margin-left: 40px;
    p.line {
      color: #ccc;
      text-align: right;
    }
  }
}
.invite-warning {
  background-color: rgba(252, 135, 135, 0.2);
  position: absolute;
  bottom: 90px;
  padding: 20px 200px 20px 40px;
  p {
    color: red;
    line-height: 45px;
  }
}

.qrcodeFamily {
  font-size: 18px;
  font-family: "微软雅黑";
  font-weight: bold;
  padding-top: 0px;
  text-align: center;
}

.QrtextActive {
  font-size: 20px;
  margin-top: 10px !important;
}
</style>
