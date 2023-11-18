import { reducerCases } from "./constants";
// 初始状态
export const initialState = {
  contactsPage: false, // 是否显示联系人列表
  createNewChat: undefined, // 新建聊天
  messages: [], // 全局保存于好友的聊天信息
  socket: undefined,
  messagesSearch: false,
  userMessageList: [],
  // 语音-视频电话相关的变量
  videoCall: undefined,
  voiceCall: undefined,
  inComingVideoCall: undefined,
  inComingVoiceCall: undefined,
  // 是否接听
  isConnect: false,
  onlineUsers: [],
  // 当前登录用户消息
  userInfos: undefined,
  // 是否显示好友请求界面
  isShowReq: false,
  // 好友申请的信息
  friendInfos: undefined,
};

// reducer函数: 返回的是更新后的 state
// React 会将状态设置为你从 reducer 返回的状态。
// state是当前的状态
const reducer = (state, action) => {
  switch (action.type) {
    // 是否显示联系人页面
    case reducerCases.SET_ALL_CONTACTS_PAGE:
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };
    // 新建聊天
    case reducerCases.CREATE_NEW_CHAT:
      return {
        ...state,
        createNewChat: action.user,
      };
    // 存储消息列表
    case reducerCases.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    // 设置socket
    case reducerCases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    // 当监听到socket发送过来的数据, 把最新的数据设置到全局messages中
    // 更新接收到的消息
    case reducerCases.ADD_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
      };
    // 查找历史聊天记录
    case reducerCases.SET_MESSAGE_SEARCH:
      return {
        ...state,
        messagesSearch: !state.messagesSearch,
      };
    // 搜索消息列表信息
    case reducerCases.SET_USER_MESSAGE_LIST:
      return {
        ...state,
        userMessageList: action.userMessageList,
      };
    // 语音-视频电话
    case reducerCases.SET_VIDEO_CALL:
      return {
        ...state,
        videoCall: action.videoCall,
      };
    case reducerCases.SET_VOICE_CALL:
      return {
        ...state,
        voiceCall: action.voiceCall,
      };
    case reducerCases.SET_INCOMING_VIDEO_CALL:
      return {
        ...state,
        inComingVideoCall: action.inComingVideoCall,
      };
    case reducerCases.SET_INCOMING_VOICE_CALL:
      return {
        ...state,
        inComingVoiceCall: action.inComingVoiceCall,
      };
    case reducerCases.END_CALL:
      return {
        ...state,
        videoCall: undefined,
        voiceCall: undefined,
        inComingVideoCall: undefined,
        inComingVoiceCall: undefined,
      };
    // 是否接听
    case reducerCases.IS_CONNECT:
      return {
        ...state,
        isConnect: !state.isConnect,
      };
    // 添加在线用户
    case reducerCases.ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    // 退出聊天界面
    case reducerCases.EXIT_CHAT:
      return {
        ...state,
        createNewChat: undefined,
      };
    // 设置当前登录用户
    case reducerCases.USER_INFOS:
      return {
        ...state,
        userInfos: action.userInfos
      }
    // 是否显示好友请求界面并保存好友的信息
    case reducerCases.IS_SHOW_REQ:
      return {
        ...state,
        isShowReq: !state.isShowReq,
        friendInfos: action.friendInfos
      }
    default:
      return state;
  }
};

export default reducer;
