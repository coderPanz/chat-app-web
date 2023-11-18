import { connectToDB } from "@/utils/connect-database/connect-database";
import { User } from "@/models/index";

export const POST = async (req) => {
  try {
    const { fromId, friendId } = await req.json()
    // 同意好友请求将好友添加到自己的friends字段, 同时也让自己保存到好友的friends字段
    await connectToDB()
    const userFriends = await User.findById(fromId).select('friends')
    const friendFriends = await User.findById(friendId).select('friends')

    // 分别找到两边的好友列表, 若好友列表中已经存在对方, 则不重复添加
    const userList = userFriends.friends.map(item => item.toString());
    const friendList = friendFriends.friends.map(item => item.toString());

    const isUserExist = userList.includes(friendId)
    const isFriendExist = friendList.includes(fromId)

    if(userFriends && friendFriends && !isUserExist & !isFriendExist) {
      userFriends.friends.push(friendId)
      await userFriends.save()
      friendFriends.friends.push(fromId)
      await friendFriends.save()
    }
    
    return new Response(JSON.stringify(friendId), { status: 201 });
  } catch (error) {
    return new Response("创建失败!", { status: 500 });
  }
}