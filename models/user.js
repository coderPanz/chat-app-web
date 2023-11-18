import mongoose, { Schema, model, models } from "mongoose";

// 推荐使用无密码登录, 所以只需要建立第三方验证登录返回的这三个数据存入数据库即可!

// 通过将 ref 的值修改为字符串 "User"，即使在模型导入的过程中，也能正常引用并建立与 Message 模型的关系。
const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "邮件已存在!"],
    required: [true, "邮件是必须的!"],
  },
  username: {
    type: String,
    unique: [true, "用户名已存在!"],
    required: [true, "用户名是必须的!"],
  },
  image: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  // 好友列表
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  // 是否是新用户
  isNewUser: {
    type: Boolean,
  },
  // 与Message模型建立关系，表示用户发送的消息数组
  sentMessages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Message",
  },
  // 与Message模型建立关系，表示用户接收的消息数组
  recievedMessages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Message",
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = models.User || model("User", UserSchema);
export default User;
