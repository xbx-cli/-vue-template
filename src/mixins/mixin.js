import {
  formatDate
} from "@/lib/tools";
export default {
  computed: {},
  mounted() {},
  filters: {
    formatStatus(val) {
      switch (val) {
        case "10201":
          return "待提交资料";
        case "10301":
          return "待企业确认";
        case "10101":
          return "平台审核中";
        case "10102":
          return "平台审核中";
        case "10302":
          return "平台审核中";
        case "-1":
          return "已驳回";
        case "10203":
          return "工商出照中";
        case "10210":
          return "已出照";
        case "10215":
          return "注销中";
        case "10216":
          return "已注销";
        case "10304":
          return "已拒绝";
        case "10103":
          return "已出照";
        default:
          return val;
      }
    },
    formatIsEnterprise(val) {
      switch (val) {
        case 0:
          return "自然人";
        case 1:
          return "个体工商户";
      }
    },
    formatTaskStauts(val) {
      switch (val) {
        case "10301":
          return "未开始";
        case "10302":
          return "进行中";
        case "10303":
          return "已完成";
        case "-1":
          return "已废弃";
      }
    },
    formatDate(time) {
      if (time) {
        var date = new Date(time);
        return formatDate(date, "yyyy-MM-dd");
      } else {
        return "暂无"
      }

    },
    formatDateHMS(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {}
};
