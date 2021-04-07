import { formatDate, getDefaultDate_Year } from "@/lib/tools";
export default {
  data() {
    return {
      date: getDefaultDate_Year()
    };
  },
  methods: {
    setDefaultTime() {
      return {
        defaultStartTime: this.setStartTime(getDefaultDate_Year()[0]),
        defaultEndTime: this.setEndTime(getDefaultDate_Year()[1]),
        defaultStartDate: formatDate(getDefaultDate_Year()[0], "yyyy-MM-dd"),
        defaultEndDate: formatDate(getDefaultDate_Year()[1], "yyyy-MM-dd")
      };
    },
    setStartTime(val) {
      val.setHours(0);
      val.setMinutes(0);
      val.setSeconds(0);
      return formatDate(val, "yyyy-MM-dd hh:mm:ss");
    },
    setEndTime(val) {
      val.setHours(23);
      val.setMinutes(59);
      val.setSeconds(59);
      return formatDate(val, "yyyy-MM-dd hh:mm:ss");
    },
    resetForm(obj) {
      const formName = obj.formName;
      const func = obj.func;
      const startTimeName = obj.startTimeName;
      const endTimeName = obj.endTimeName;
      this.$refs[formName].resetFields();
      this[formName][startTimeName] = '';
      this[formName][endTimeName] = '';
      this.date = getDefaultDate_Year();
      this[func]();
    }
  }
};
