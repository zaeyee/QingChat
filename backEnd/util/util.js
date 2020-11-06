module.exports = {
  // 验证是否日期
  isVaildDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
}