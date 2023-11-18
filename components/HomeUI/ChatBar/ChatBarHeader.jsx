"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { useStateProvider } from "@/utils/Context/StateContext";
import { reducerCases } from "@/utils/Context/constants";
import { GET_USER } from "@/utils/API-Route";

const ChatBarHeader = () => {
  const { data: session } = useSession();
  // 控制点击切换联系人列表和消息列表
  const [{ socket }, dispatch] = useStateProvider();

  // 头像
  const [avatar, setAvatar] = useState("/default_avatar.png");

  // 用户名
  const [userName, setUserName] = useState('')

  // 是否显示退出登录框
  const [isShow, setIsShow] = useState(false);

  // 是否显示添加好友界面
  const [isShowAddUser, setIsShowAddUser] = useState(false);

  // 添加好友输入框
  const [input, setInput] = useState("");

  // 实时更新头像框已经用户名
  useEffect(() => {
    // 到数据库检查用户是否存在
    const isNewUser = async () => {
      const res = await fetch(`${GET_USER}/is-exist`, {
        method: 'POST',
        body: JSON.stringify({
          fromId: session?.user.id
        })
      })
      const data = await res.json()
      setAvatar(data.image)
      setUserName(data.username)
    }
    isNewUser()
  }, [session?.user.id])


  // 点击切换联系人列表和消息列表
  const handleShowList = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    });
  };

  // 是否显示退出登录框
  const handleExit = () => {
    setIsShow((preState) => !preState);
  };

  // 退出登录
  const handleLoginOut = () => {
    socket.current.emit("login-out", session?.user.id);
    signOut();
  };

  // 是否显示添加好友界面
  const handleShowMore = () => {
    setIsShowAddUser(preState => (!preState));
  };

  // 发送好友申请
  const handleAddFriend = async () => {
    setIsShowAddUser(preState => (!preState));
    setInput('')
    const getUser = async () => {
      const res = await fetch(`${GET_USER}`, {
        method: "POST",
        body: JSON.stringify({
          email: input,
          fromId: session?.user.id,
        }),
      });
      const data = await res.json();
      return data;
    };
    const data = await getUser();
    const friendId = data._id;
    // 找到用户id并且用户没有成为好友才发送请求, 否则提示已经添加了好友
    if (friendId && !data.isExist) {
      socket.current.emit("add-friend", {
        // 请求者的id
        friendId: friendId,
        // 自己的id以及image, username
        username: session?.user.name,
        fromId: session?.user.id,
        image: session?.user.image,
      });
    } else {
      dispatch({
        type: reducerCases.IS_SHOW_REQ,
        friendInfos: {
          image: data.image,
          username: data.username,
          isExist: data.isExist,
        },
      });
    }
  };

  return (
    <div className="bg-panel-header-background flex justify-between items-center p-3">
      <img src={avatar} alt="avatar" className="rounded-full cursor-pointer w-10 h-10" onClick={handleExit}/>
      {isShow && (
        <div
          className="bg-green-700 absolute ml-[50px] w-[80px] h-[40px] rounded-lg flex justify-center items-center cursor-pointer text-gray-300"
          onClick={handleLoginOut}
        >
          <span>退出登录</span>
        </div>
      )}
      <div className="grow ml-3 text-gray-300">
        <span>{userName}</span>
      </div>
      <div className="flex justify-center items-center">
        <BsFillPersonFill
          onClick={handleShowList}
          className="mr-2 text-gray-400 cursor-pointer text-xl"
        />
        <AiOutlineUserAdd
          onClick={handleShowMore}
          className="text-gray-400 cursor-pointer text-xl"
        />
        {isShowAddUser && (
          <div className="absolute mr-[-387px] flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入好友邮箱"
              type="text"
              className="py-2 px-2 rounded focus:outline-none bg-gray-700"
            />
            <div
              onClick={handleAddFriend}
              className="rounded flex justify-center items-center bg-slate-600 px-3 cursor-pointer"
            >
              添加
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatBarHeader;
