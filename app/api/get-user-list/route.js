import { connectToDB } from "@/utils/connect-database/connect-database";
import { User } from "@/models/index";
import MatchSort from "@/utils/match-sort";
export const POST = async (req) => {
  try {
    const { fromId } = await req.json()
    await connectToDB();
    const userData = await User.findById(fromId)
    .select('friends').populate('friends')
    
    // 获取好友列表
    const friends = userData.friends

    // 中英文用户名混合匹配排序
    const res = await MatchSort(friends);

    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response("获取失败!", { status: 500 });
  }
};
