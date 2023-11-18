"use client";
import Image from "next/image";
import { useStateProvider } from "../../utils/Context/StateContext";
import { reducerCases } from "../../utils/Context/constants";

const UserListItemObj = ({ item }) => {
  // 为什么需要数组解构, 因为value={useReducer(reducer, initialState)
  // 为什么需要对象解构, 因为initialState是一个对象, 若需要具体的值, 则需要从对象中解构出来!
  // 注意, dispatch位于数组解构的第二个参数, 所以前面的全局state不能省略, 若是不想使用state写一个'{}'即可
  const [{}, dispatch] = useStateProvider();
  // 点击选择指定的联系人创建一个聊天
  const handleCreateNewChat = () => {
    // 全局保存对应点击的联系人对象数据
    dispatch({
      type: reducerCases.CREATE_NEW_CHAT,
      user: { ...item },
    });
    // 关闭联系人列表界面
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    });
  };
  return (
    <div
      onClick={handleCreateNewChat}
      className="my-2 flex items-center gap-5 rounded-md cursor-pointer hover:bg-panel-header-background p-2"
    >
      <Image
        src={item?.image}
        alt="avatar"
        height={50}
        width={50}
        className="rounded-full"
      />
      {/* name and bio */}
      {/* 文字溢出显示省略号并禁止换行 */}
      <div className="flex flex-col gap-1 grow border-b-gray-700 border-b">
        <span className="truncate text-lg w-[150px]">{item?.username}</span>
        <span className="truncate text-gray-400 w-[150px] italic text-[13px] mb-2">
          {item?.bio}
        </span>
      </div>
    </div>
  );
};
export default UserListItemObj;
