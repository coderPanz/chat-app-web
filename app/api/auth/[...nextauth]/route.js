import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectToDB } from "@/utils/connect-database/connect-database";
import { User } from "@/models/index";
const authOptions = NextAuth({
  // 在 providers 中配置更多授权服务
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      httpOptions: {
        timeout: 30000,
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.SECRET,
  session: {
    maxAge: 60 * 60 * 24, // Set the session timeout in seconds (e.g., 24 hours)
  },
  // 用于定义用户身份验证期间的回调函数，例如完成用户身份信息查询、创建用户、更新会话等操作。

  // 在 NextAuth.js 的 signIn 回调中，你可以通过返回一个对象来传递额外的信息给客户端。这个对象会添加到用户会话(session)中，可以在组件中通过 useSession() 钩子访问到
  callbacks: {
    async signIn({ profile }) {
      try {
        // 连接数据库
        await connectToDB();
        // 检查用户是否存在
        const userExists = await User.findOne({
          email: profile.email,
        });

        // 若用户不存在则新建一个用户
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.avatar_url,
            bio: profile.bio.toString(),
            isNewUser: true
          });
        }
        await User.findByIdAndUpdate(userExists._id, { $set: { isNewUser: false } })
        // 登录成功，返回包含用户是否存在的信息给客户端
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    // 在session回调中, 可以给session添加一些属性, 以便组件通过useSession()访问(页面刷新后也会自动)
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      if (sessionUser) {
        session.user.image = sessionUser.image;
        session.user.name = sessionUser.username;
        session.user.bio = sessionUser.bio;
        session.user.id = sessionUser._id;
      }
      return session;
    },
  },
});

// 因为点击登录登出需要匹配这个路由中的GET或者POST请求
export { authOptions as GET, authOptions as POST };
