import { connectToDB } from "@/utils/connect-database/connect-database";
import { Message } from "@/models";

// 获取该用户的所有消息, 包括接收和发送的信息
export const POST = async (req) => {
  try {
    // 这样可以获取到发送方为 "A" 并且接收方为 "B" 的消息，以及发送方为 "B" 并且接收方为 "A" 的消息。
    const { fromId, toId } = await req.json()
    await connectToDB()
    const messages = await Message.find({
      sender: { $in: [fromId, toId] },
      receiver: { $in: [fromId, toId] },
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new Response("获取消息失败!", { status: 500 });
  }
};
