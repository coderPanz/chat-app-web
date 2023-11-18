"use client";
import { useEffect, useState } from "react";
import { MessageList, UserList } from "../../index";
import { useStateProvider } from "@/utils/Context/StateContext";
import { useSession } from "next-auth/react";
import { GET_USER_LIST } from "@/utils/API-Route";

const ChatBarContainer = () => {
  const { data: session } = useSession()
  const [{ contactsPage }] = useStateProvider();
  // 保存用户列表
  const [userList, setUserList] = useState();

  useEffect(() => {
    if (contactsPage) {
      // 获取用户列表
      const getUserList = async () => {
        try {
          const res = await fetch(`${GET_USER_LIST}`, {
            method: 'POST',
            body: JSON.stringify({
              fromId: session?.user.id
            })
          });
          const userList = await res.json();
          setUserList(userList);
        } catch (error) {
          console.log(error);
        }
      };
      getUserList();
    }
  }, [contactsPage]);

  return (
    // 聊天栏容器, 用于显示用户列表和消息列表的切换!
    <div className="bg-search-input-container-background flex-auto custom-scrollbar overflow-auto p-3 h-full">
      {
        // 确保userList有值的时候才传入userlist组件
        contactsPage && userList ? (
          <UserList userList={userList} />
        ) : (
          <MessageList />
        )
      }
    </div>
  );
};
export default ChatBarContainer;
