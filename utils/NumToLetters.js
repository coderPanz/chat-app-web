const NumToLetters = (num) => {
  if (num < 0 || num > 25) {
    return false; // 数字超出范围时返回 null 或其他错误处理方式
  }

  const offset = 65; // 字符编码中大写字母 A 的值为 65

  return String.fromCharCode(num + offset);
}

export default NumToLetters 