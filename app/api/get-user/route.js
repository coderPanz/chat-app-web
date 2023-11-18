import { connectToDB } from "@/utils/connect-database/connect-database";
import { User } from "@/models/index";
export const POST = async (req) => {
  try {
    const { email, fromId } = await req.json();
    await connectToDB()
    // 点击添加好友时到数据库查询好友列表, 若好友已经存在者不需要发送申请
    const user = await User.findById(fromId).select('friends')
    const userList = user.friends.map(item => item.toString());
    // 查询对应用户
    const res = await User.findOne({ email }).select('email image username')
    const isUserExist = userList.includes(res._id.toString())

    // 整合数据
    const data = {
      email: res.email,
      image: res.image,
      username: res.username,
      isExist: isUserExist,
      _id: res._id
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("获取失败!", { status: 500 });
  }
}