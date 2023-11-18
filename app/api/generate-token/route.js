import { generateToken04 } from "@/utils/TokenGenerator";

export const POST = async (req) => {
  try {
    const { fromId } = await req.json()
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER;
    const userId = fromId;
    const effectiveTime = 3600;
    const payload = "";
    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );
      return new Response(JSON.stringify(token), { status: 200 });
    }
    return new Response("获取token失败!", { status: 400 });
  } catch (error) {
    return new Response("获取token失败!", { status: 500 });
  }
};
