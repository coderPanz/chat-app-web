import { User } from "@/models";
import { connectToDB } from "@/utils/connect-database/connect-database";

export const POST = async (req) => {
  try {
    const { userId } = await req.json()
    connectToDB();
    // 获取用户发出的消息和收到的消息并填充收发件人
    // 填充前500条数据
    const messageObj = await User.findById(userId)
      .select("sentMessages recievedMessages")
      .populate({
        path: "sentMessages",
        options: { limit: 500, sort: { createdAt: 'desc' }, }, // 指定返回 sentMessages 数组中的最大数量并进行根据创建日期降序排序
        populate: {
          path: "sender receiver",
        },
      })
      .populate({
        path: "recievedMessages",
        options: { limit: 500, sort: { createdAt: 'desc' },}, // 指定返回 recievedMessages 数组中的最大数量并进行根据创建日期降序排序
        populate: {
          path: "sender receiver",
        },
      });
    // 分别保存到对应的数组中
    const sentMessages = [...messageObj.sentMessages];
    const recievedMessages = [...messageObj.recievedMessages]

    // 1. 处理用户发送消息时不同的接收者!
    let UniqueSenderId = []
    let sentMessagesHandle = []
    for (const obj of sentMessages) {
      const receiverId = obj.receiver._id
      if(!UniqueSenderId.includes(receiverId)) {
        UniqueSenderId.push(receiverId)
        sentMessagesHandle.push(obj)
      }
    }

    // 2. 处理用户接收消息时不同的发送者!
    let recievedMessagesHandle = []
    let UniqueReceiverId = []
    for (const obj of recievedMessages) {
      const senderId = obj.sender._id
      if(!UniqueReceiverId.includes(senderId)) {
        UniqueReceiverId.push(senderId)
        recievedMessagesHandle.push(obj)
      }
    }

    // 合并
    const userMessageList = [
      ...recievedMessagesHandle,
      ...sentMessagesHandle
    ]
    // 虽然经过上述对创建日期的降序排序以及去重操作后, 可以得到最新并且不重复的消息, 但是在合并过程中会出现重复现象: 发送消息的接收者=接收信息的发送者: A发给B=B发给A 这个是重复的信息.所以需要再次对重复的信息进行创建创建时间的降序排序, 拿到唯一且最新的那个数据.
    
    const findMatchingElements = (userMessageList) => {
      // 保存最终处理数据
      const messagesHandle = []
      for (let i = 0; i < userMessageList.length; i++) {
        const elementA = userMessageList[i];
        const elementB = userMessageList.find(item => {
          return item.receiver._id.toString() === elementA.sender._id.toString() && item.sender._id.toString() === elementA.receiver._id.toString();
        });
        
        // 若找到两组对应的互发信息，那么就需要比较它们的创建时间。只保存最新的那一个！
        if (elementB) {
          let tempArr = [elementA, elementB]
          tempArr.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          // 先判断messagesHandle是否已经存在该数组，若不存在则push
          const exists = messagesHandle.some(obj => 
            obj.sender._id.toString() === tempArr[0].sender._id.toString() &&
            obj.receiver._id.toString() === tempArr[0].receiver._id.toString()
          )
          if(!exists) messagesHandle.push(tempArr[0])
        } else {
          messagesHandle.push(elementA)
        }
      }
      return messagesHandle
    }

    const messagesHandle = findMatchingElements(userMessageList)
    // 最后进行降序排序
    messagesHandle.sort((a,b) => b.createdAt.getTime()-a.createdAt.getTime())
    return new Response(JSON.stringify(messagesHandle), { status: 200 });
  } catch (error) {
    return new Response("获取消息失败!", { status: 500 });
  }
};
