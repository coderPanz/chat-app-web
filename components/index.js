
export { default as Provider } from "./Provider";

// 登录组件
export { default as LoginForm } from "./Login/LoginForm";
export { default as Avatar } from "./Login/Avatar";
export { default as Photograph } from "./Login/Photograph";

// 主页
export { default as Main } from "./HomeUI/Main";
// 主页-聊天界面
export { default as ChatPage } from "./HomeUI/ChatPage/ChatPage";
export { default as ChatPageInputBar } from "./HomeUI/ChatPage/ChatPageInputBar";
export { default as ChatPageHeader } from "./HomeUI/ChatPage/ChatPageHeader";
export { default as ChatPageContainer } from "./HomeUI/ChatPage/ChatPageContainer";

// 主页-侧边栏界面
export { default as ChatBar } from "./HomeUI/ChatBar/ChatBar";
export { default as ChatBarHeader } from "./HomeUI/ChatBar/ChatBarHeader";
export { default as ChatBarSearch } from "./HomeUI/ChatBar/ChatBarSearch";
export { default as ChatBarContainer } from "./HomeUI/ChatBar/ChatBarContainer";

// 聊天逻辑组件
export { default as MessageList } from "./ChatLogic/MessageList";
export { default as UserList } from "./ChatLogic/UserList";
export { default as UserListItem } from "./ChatLogic/UserListItem";
export { default as SearchMessages } from "./ChatLogic/SearchMessages";

// 未进入聊天界面时显示的背景
export { default as Empty } from "./Empty";

// 通话组件
export { default as VideoCall } from "./Call/VideoCall";
export { default as VoiceCall } from "./Call/VoiceCall";
export { default as InComingVideoCall } from "./Call/InComingVideoCall";
export { default as InComingVoiceCall } from "./Call/InComingVoiceCall";

// 添加好友组件
export { default as AddFriends } from './AddFriends/AddFriends'