import { connectToDB } from "@/utils/connect-database/connect-database";
import { User } from "@/models/index";
import validateUsername from "@/utils/validateUsername";
export const POST = async (req) => {
  const { username, bio, email, image, isNewUser } = await req.json();
  try {
    // 连接数据库
    await connectToDB();
    if (validateUsername(username)) {
      const data = await User.findOneAndUpdate(
        { email: email },
        { $set: { username: username, bio: bio, image: image, isNewUser: isNewUser } },
        { new: true }
      );
      return new Response(JSON.stringify(data), { status: 201 });
    } else {
      const errorTip = "首字符必须为字母或者汉字且输入长度大于1!";
      return new Response(JSON.stringify(errorTip), { status: 500 });
    }
  } catch (error) {
    return new Response("创建失败!", { status: 500 });
  }
};
