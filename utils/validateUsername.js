const validateUsername = (username) => {
  // // 匹配首字符为单词或汉字，后面可以是字母、数字、下划线或汉字的组合，且长度大于1
  const regex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{1,}$/;
  return regex.test(username)
}

export default validateUsername  