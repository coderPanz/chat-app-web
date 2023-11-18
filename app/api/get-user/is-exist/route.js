import { connectToDB } from "@/utils/connect-database/connect-database";
import { User } from "@/models/index";
export const POST = async (req) => {
  try {
    const { fromId } = await req.json()
    await connectToDB()
    const data = await User.findById(fromId).select('isNewUser image username bio')
    if(data) {
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      return new Response(JSON.stringify('查找失败!'), { status: 500 });
    }
  } catch (error) {
    return new Response("获取失败!", { status: 500 });
  }
}