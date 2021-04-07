import { baseURL } from "@/config";
import axios from "axios";
import { postObject } from "@/api/upload.js";

import {
  Encrypt
} from "@/lib/cryptoJS.js";
export default {
  name: "UploadFile",
  props: {
    /**
     * 要上传的文件夹
     */
    uploadFolder: {
      type: String,
      default: "uploadTest"
    },

    /**
     * 上传文件的格式
     */
    format: {
      type: Array,
      default: () => ["jpg", "jpeg", "png", "pdf"]
    },

    /**
     * 要上传的文件大小
     */
    size: {
      type: Number,
      default: 2048
    },

    /**
     * 是否允许多选--开启照片墙
     */
    select: {
      type: Boolean,
      default: false
    },
    /**
     * 是否允许删除图片
     */
    isShowRemoveBtn: {
      type: Boolean,
      defalut: true
    },
    /**
     * 是否允许上传
     */
    disabled: {
      type: Boolean,
      default: true
    },
    /**
     * 默认上传的背景
     */
    initImg: {
      type: String,
      default: "add.png"
    },

    /**
     * 编辑文件上传
     */
    editFile: {
      type: Boolean,
      default: false
    },

    /**
     * 默认文件样式
     */
    listClass: {
      type: String,
      default: ""
    },

    listWidth: {
      type: Number,
      default: 100
    },

    listHeight: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      baseURL, //上传地址前缀
      handleImg:
        "https://business.myxbx.com/" +
        (this.picturePath =
          process.env.NODE_ENV === "production" && !process.env.VUE_APP_FLAG
            ? "xkPics"
            : "xkTestPics"), //图片显示前缀
      list: [],
      previewImg: "",
      visible: false, //是否开启预览
      publicPath: process.env.BASE_URL,
      showAddImg: false
    };
  },
  // watch: {
  //     '`${this.editFile}`'(val) {
  //       this.editFile = this.val;
  //     }
  // },
  computed: {
    //上传路径
    uploadUrl() {
      return (
        this.baseURL + this.uploadPath + "/api/upload/file/" + this.uploadFolder
      );
    },

    headerInfo() {
      const token = sessionStorage.getItem("token");
      const headers = {
        XKTOKENHeader: token
      };
      return headers;
    },
    //默认上传文件背景
    showInitImg() {
      if (
        this.editFile &&
        this.initImg &&
        this.initImg != "add.png" &&
        this.initImg != ""
      ) {
        if (this.initImg.indexOf("https") == 0) {
          return this.initImg;
        } else {
          return this.handleImg + this.initImg;
        }
      } else {
        return this.publicPath + "image/add.png";
      }

      if (!this.editFile) {
        if (this.initImg.length <= 15) {
          return (
            this.publicPath +
            "image/" +
            (this.initImg ? this.initImg : "add.png")
          );
        } else {
          return this.publicPath + "image/add.png";
        }
      }
    },

    //继续上传图片
    continueImg() {
      return (
        (!this.select && !this.list.length) ||
        (!this.list.length && this.select) ||
        (this.list.length && this.select)
      );
    },

    countClass() {
      return ["upload-list", this.uploadImg];
    },

    uploadImg() {
      return {
        width: `${this.listWidth}px`,
        height: `${this.listHeight}` == 1 ? "100%" : `${this.listHeight}px`
      };
    },
    uploadImg_i() {
      return {
        fontSize: `${this.listWidth / 4}px`,
        marginLeft: `${this.listWidth / 5}px`
      };
    },

    //预览
    previewModelImg() {
      if (this.previewImg.indexOf("https") == 0) {
        return this.previewImg;
      } else {
        return this.handleImg + this.previewImg;
      }

      // return this.handleImg + this.previewImg;
    }
    // //图片上传列表样式
    // uploadListClass() {
    //   return ["upload-list", this.listClass];
    // }
  },
  created() {
    this.uploadPath =
      process.env.NODE_ENV === "production" && !process.env.VUE_APP_FLAG
        ? "xk"
        : "xkTest";
    this.$emit("init-upload", this.list);
  },
  methods: {
    fileAjaxUpload(file) {
      const that = this;
      let bucketName;
      this.fileName = file.name;
      if (file.type === "application/pdf") {
        bucketName = "xbx-oss-pdf";
      } else if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
      ) {
        bucketName = "xbx-oss-images";
      }

      const fileName = file.name;

      const obj = {
        bucketName
      };

      that.photoCompress(
        file,
        {
          quality: 0.2
        },
        function (base64Codes) {
          let bl = that.convertBase64UrlToBlob(base64Codes);
          let fd = new FormData(); // FormData 对象
          const obj = {
            bucketName
          };
          const sendObj = {
            data: Encrypt(JSON.stringify(obj)),
          };

          postObject(sendObj).then(res => {
            const key = fileName.split(".")[0];
            let fd = new FormData(); // FormData 对象
            fd.append("OSSAccessKeyId", res.ossAccessKeyId);
            fd.append("policy", res.policy);
            fd.append("Signature", res.signature);
            fd.append("key", key + ~new Date());
            fd.append("callback", res.callback);
            fd.append("file", bl);
            axios
              .post(res.serviceUrl, fd, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              })
              .then(function (resData) {
                let url;
                if (resData.data.code === "1000") {
                  url = resData.data.data.url;
                  that.list.push({
                    path: url
                  });
                  that.$emit("upload-info", that.list);
                  if (!that.select && that.list.length) {
                    that.showAddImg = false;
                    return;
                  }
                } else if (resData.data.code === "2000") {
                  that.$Message.error(resData.data.message);
                } else {
                  that.$Message.error("服务器错误,请联系客服");
                }
              })
              .catch(function (error) {
                that.$Message.error("服务器错误,请联系客服" + error);
              });
          });
        }
      );

      return false;
    },

    //点击文件上传
    handleBefore(file) {
      this.fileAjaxUpload(file);
      // 文件上传限制
      const check = this.list.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "亲，最多只允许上传5张图片"
        });
      }
      return check;
    },

    //文件预览
    handleView(item) {
      if (item) this.previewImg = item.path;
      if (this.editFile) this.previewImg = this.initImg;
      this.visible = true;
    },

    //文件删除
    handleRemove(item, index) {
      if (this.editFile) {
        this.$emit("upload-init", false);
      } else {
        this.list = [];
        this.$emit("upload-init", false);
      }
      if (item) this.list.splice(index, 1);

      if (this.list.length) this.$emit("upload-info", this.list);
    },

    //文件验证
    handleFormat() {
      this.$Notice.warning({
        title: "亲，请上传规定格式的图片"
      });
    },

    //文件超出限制大小
    handleExceeded() {
      // this.$Notice.warning({
      //   title: "亲，请上传规定大小的图片"
      // });
    },

    //文件上传成功
    handleSuccess(event) {
      this.list.push(event);
      this.$emit("upload-info", this.list);
      if (!this.select && this.list.length) {
        this.showAddImg = false;
        return;
      }
    },

    /*
            三个参数
            file：一个是文件(类型是图片格式)，
            w：一个是文件压缩的后宽度，宽度越小，字节越小
            objDiv：一个是容器或者回调函数
            photoCompress()
    */
    photoCompress(file, w, objDiv) {
      const that = this;
      var ready = new FileReader();
      /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
      ready.readAsDataURL(file);
      ready.onload = function () {
        var re = this.result;
        that.canvasDataURL(re, w, objDiv);
      };
    },

    canvasDataURL(path, obj, callback) {
      var img = new Image();
      img.src = path;
      img.onload = function () {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        var quality = 0.7; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     * 用url方式表示的base64图片数据
     */
    convertBase64UrlToBlob(urlData) {
      var arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    },

    //上传进度实现方法，上传过程中会频繁调用该方法
    progressFunction(evt) {
      var progressBar = document.getElementById("progressBar");
      var percentageDiv = document.getElementById("percentage");
      // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
      if (evt.lengthComputable) {
        //
        progressBar.max = evt.total;
        progressBar.value = evt.loaded;
        percentageDiv.innerHTML =
          Math.round((evt.loaded / evt.total) * 100) + "%";
      }
      var time = document.getElementById("time");
      var nt = new Date().getTime(); //获取当前时间
      var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
      ot = new Date().getTime(); //重新赋值时间，用于下次计算
      var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
      oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
      //上传速度计算
      var speed = perload / pertime; //单位b/s
      var bspeed = speed;
      var units = "b/s"; //单位名称
      if (speed / 1024 > 1) {
        speed = speed / 1024;
        units = "k/s";
      }
      if (speed / 1024 > 1) {
        speed = speed / 1024;
        units = "M/s";
      }
      speed = speed.toFixed(1);
      //剩余时间
      var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
      time.innerHTML =
        "，速度：" + speed + units + "，剩余时间：" + resttime + "s";
      if (bspeed == 0) time.innerHTML = "上传已取消";
    }
  }
};
