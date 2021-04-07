export default {
  methods: {
    limitMoneyInput(value, name, formName) {
      let str = (value && value.split("")) || [];
      let reg1 = /\d/;
      let reg2 = /\./;
      // 第一个字符不能为小数点
      if (str[0] == ".") {
        this.form[name] = "";
        return;
      }
      // 过滤掉除数字和小数点外的字符
      value = str.filter(e => reg1.test(e) || reg2.test(e));
      // 匹配小数点后只能有两位小数
      let valJoin = value.join("");
      this[formName][name] = valJoin.match(/^\d*(\.?\d{0,2})/g)[0] || null;
    }
  }
};
