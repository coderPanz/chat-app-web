import { connectToDB } from "@/utils/connect-database/connect-database";
import { User, Message } from "@/models/index";

export const POST = async (req) => {
  const { fromId, toId, message } = await req.json();

  try {
    await connectToDB();

    // 创建一个具有聊天双方信息message
    const createMessage = await Message.create({
      sender: fromId,
      receiver: toId,
      message: message,
    });

    // 双方分别保存信息-发送方保存发送的消息(保存的是message对象模型)-接收方保存接收的消息
    // 以便后期可以在聊天列表显示历史聊天
    const userFrom = await User.findById(fromId);
    const userTo = await User.findById(toId);
    if (userFrom) {
      userFrom.sentMessages.push(createMessage._id);
      await userFrom.save();
    } else {
      console.log("保存发送的消息失败!");
    }
    if (userTo) {
      userTo.recievedMessages.push(createMessage._id);
      await userTo.save();
    } else {
      console.log("保存接收的消息失败!");
    }

    return new Response(JSON.stringify(createMessage), { status: 200 });
  } catch (error) {
    return new Response("发送失败!", { status: 500 });
  }
};
