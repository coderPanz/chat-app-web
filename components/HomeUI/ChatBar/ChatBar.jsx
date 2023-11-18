import { ChatBarHeader, ChatBarContainer } from "../../index";
const ChatBar = () => {

  return (
    <div className="bg-search-input-container-background h-[100vh] border-r-[1px] border-r-gray-600 overflow-hidden">
      {/* 头部 */}
      <ChatBarHeader />
      {/* 内容列表 */}
      <ChatBarContainer />
    </div>
  );
};
export default ChatBar;
