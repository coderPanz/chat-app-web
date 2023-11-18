"use client";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { useStateProvider } from "@/utils/Context/StateContext";
import { reducerCases } from "@/utils/Context/constants";
import { useEffect, useState } from "react";
import dateFormat from "@/utils/dateFormat";

const SearchMessages = () => {
  // 搜索框数据
  const [searchTerm, setSearchTerm] = useState("");
  // 查询的结果列表
  const [searchedMessages, setSearchedMessages] = useState([]);

  const [{ createNewChat, messages }, dispatch] = useStateProvider();

  // 搜索消息实时响应
  useEffect(() => {
    if (searchTerm) {
      setSearchedMessages(
        messages.filter(
          (message) =>
            message.type === "text" && message.message.includes(searchTerm)
        )
      );
    } else {
      setSearchedMessages([]);
    }
  }, [searchTerm]);
  return (
    <div className="bg-search-input-container-background overflow-hidden h-[100vh] w-full border-l-[1px] border-l-gray-600">
      {/* 头部 */}
      <div className="bg-panel-header-background h-[64px] w-full flex items-center p-3 gap-3">
        <AiOutlineClose
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
          className="cursor-pointer text-gray-300"
        />
        <span className="text-gray-300">查找消息</span>
      </div>
      {/* 搜索输入框 */}
      <div className="flex justify-center items-center pl-3 pr-4 my-4">
        <input
          type="text"
          className="w-full bg-dropdown-background-hover rounded-l-md h-[32px] px-3 py-1 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AiOutlineSearch className="bg-dropdown-background-hover h-[32px] rounded-r-md w-[32px] px-1 text-gray-600 cursor-pointer" />
      </div>
      {/* 主要显示区域 */}
      <div className="h-full overflow-auto custom-scrollbar">
        {/* 搜索 */}
        <div>
          {/* 搜索提示 */}
          <div className=" text-gray-600 text-center">
            {!searchTerm.length && `搜索与${createNewChat.username}相关的消息!`}
          </div>
          {/* 搜索结果 */}
          <div className="flex flex-col px-3">
            {/* 无结果 */}
            {searchTerm.length > 0 && !searchedMessages.length && (
              <div className="text-gray-600 text-center">没有找到对应消息!</div>
            )}
            {/* 有结果 */}
            <div className="h-full flex flex-col gap-4">
              {searchedMessages.map((item) => (
                <div key={item._id} className="bg-green-900 text-gray-300 rounded-lg py-2 px-3 flex flex-col">
                  {/* time */}
                  <span>
                    {dateFormat(item.createdAt, "YYYY-MM-DD HH:mm:ss")}
                  </span>
                  {/* info of Message */}
                  <span className="text-lg">{item.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 底部填充, 确保能够看到完整的底部消息 */}
        <div className="h-[138px]"></div>
      </div>
    </div>
  );
};
export default SearchMessages;
