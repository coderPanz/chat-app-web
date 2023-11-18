// 汉字转换为拼音的库
import { pinyin } from 'pinyin-pro';
// 中英文用户名混合匹配排序
const MatchSort = async (data) => {
  // 创建 A-Z 字母键及对应的空数组
  const result = {};
  for (let i = 0; i < 26; i++) {
    // 获取 A 到 Z 的字母
    const letter = String.fromCharCode(65 + i);
    // 设置对应键的空数组
    result[letter] = [];
  }

  for (let i = 0; i < data.length; i++) {
    // item是一个user对象
    const item = data[i];
    // 获取对象中的用户名
    const username = item.username;
    let initial = "";
  
    if (/^[a-zA-Z]/.test(username)) {
      initial = username.charAt(0).toUpperCase();
    } else {
      // 使用拼音库获取拼音首字母并转化为大写
      initial = pinyin(username, { toneType: "none" }).charAt(0).toUpperCase();
    }
  
    // 将元素放入对应的对象数组中
    if (result.hasOwnProperty(initial)) {
      result[initial].push(item);
    }
  }
  return result
}

export default MatchSort
