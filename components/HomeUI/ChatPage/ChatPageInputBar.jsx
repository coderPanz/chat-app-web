"use client";
import { BsEmojiSunglasses } from "react-icons/bs";
import { BsLink45Deg } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useStateProvider } from "@/utils/Context/StateContext";
import { SENT_TEXT_MESSAGE, SENT_IMG_MESSAGE } from "@/utils/API-Route";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { reducerCases } from "@/utils/Context/constants";
import { AiFillAudio } from "react-icons/ai";

// 使用延迟加载禁用服务端渲染(因为该组件使用到浏览器api)
import dynamic from 'next/dynamic'
const AudioVisualizer = dynamic(() => import('../../ChatLogic/AudioVisualizer'), {
  ssr: false
})

const ChatPageInputBar = () => {
  // 获取当前用户登录的数据
  const { data: session } = useSession();
  // 获取当前要联系的联系人数据
  const [{ createNewChat, socket }, dispatch] = useStateProvider();
  // 输入的消息
  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef();

  // 是否显示语音输入
  const [isAudioInput, setIsAudioInput] = useState(false);

  // 记录鼠标是否已经按下
  const [isMousedown, setIsMousedown] = useState(false);

  // 是否显示表情
  const handleShowEmoji = () => {
    setShowEmojiPicker((preState) => !preState);
  };

  // 发送表情信息
  const handleEmojiMessages = (emoji) => {
    setMessage((preState) => (preState += emoji.emoji));
  };

  // 发送文本信息
  const handleSentMessage = async () => {
    try {
      // 点击前先检查是否输入内容
      if (message.length > 0) {
        const res = await fetch(SENT_TEXT_MESSAGE, {
          method: "POST",
          body: JSON.stringify({
            // 用户id
            fromId: session?.user?.id,
            // 聊天好友id
            toId: createNewChat?._id,
            message: message,
          }),
        });
        const data = await res.json();
        socket.current.emit("send-msg", data);
        setMessage("");
        // 缓存该消息进入本地进行聊天窗口的更新
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessage: data,
        });
      }
    } catch (error) {
      console.log(`发送消息出现了错误:${error}`);
    }
  };

  // 当点击emoji图标栏外的地方, 图标栏关闭
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // 图片上传
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(SENT_IMG_MESSAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        fromId: session?.user.id,
        toId: createNewChat._id,
      },
    });

    // 发送socket消息
    const data = res.data.message;
    if (res.status === 201) {
      socket.current.emit("send-msg", data);
    }
    // 缓存该消息进入本地进行聊天窗口的更新
    dispatch({
      type: reducerCases.ADD_MESSAGES,
      newMessage: data,
    });
  };

  // 点击切换到输入音频输入
  const handleAudioInput = () => {
    setIsAudioInput((preState) => !preState);
  };

  // 处理音频输入逻辑
  useEffect(() => {
    const audioInput = document.getElementById("audioInput");
    if (isAudioInput) {
      // 当鼠标按下(录制音频)时监听鼠标移动, 若移动到'取消发送'的范围则取消发送
      audioInput.addEventListener("mousedown", async () => {
        setIsMousedown(true);
      });

      // 这里也是监听全局鼠标放开, 因为当按下说话的时候可能会移动鼠标到输入框以外的地方松开
      document.addEventListener("mouseup", () => {
        setIsMousedown(false);
      });
    }
    
    // 添加清理函数(这里需要移除全局的mousedown和mouseup事件, 移除某个dom则会出现dom没有渲染完成因而无法调用对应方法方法!)
    return () => {
      document.removeEventListener("mousedown", () => {});
      document.removeEventListener("mouseup", () => {});
    };
  }, [isAudioInput]);
 
  return (
    <div className="h-[70px] bg-panel-header-background px-3 py-2 flex items-center relative">
      {/* 左侧图标 */}
      <div className="flex justify-center items-center">
        <BsEmojiSunglasses
          id="emoji-open"
          onClick={handleShowEmoji}
          className="text-xl text-gray-400 mx-4 cursor-pointer"
        />

        {/* emoji表情 */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="bottom-[70px] left-[0px] z-990 absolute"
          >
            <EmojiPicker onEmojiClick={handleEmojiMessages} theme="dark" />
          </div>
        )}

        {/* 将文件选择器与图标进行集成，以实现更友好的用户界面。 */}
        <label htmlFor="image-upload">
          <BsLink45Deg className="text-2xl text-gray-400 cursor-pointer" />
        </label>
        <input
          className="hidden"
          id="image-upload"
          type="file"
          onChange={handleImageChange}
        />
      </div>
      {/* 中间输入框 */}
      {isAudioInput ? (
        <div className="grow mx-5">
          <button
            id="audioInput"
            className={`${
              isMousedown ? "bg-gray-700" : "bg-gray-600"
            } text-gray-300 w-full py-2 rounded-md`}
          >
            {isMousedown ? "松开发送" : "按住说话"}
          </button>
        </div>
      ) : (
        <div className="grow mx-5">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="w-full h-[38px] rounded-md bg-input-background focus:outline-none px-3 py-1"
          />
        </div>
      )}

      {/* 按下说话时弹出语音输入界面 */}
      {/* 语音输入效果 */}
      <div className={isMousedown ? "" : "hidden"}>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[100px] flex gap-7">
          <div className="h-[80px] w-[180px] rounded-lg flex justify-center items-center">
            <AudioVisualizer
              isMousedown={isMousedown}
              session={session}
              createNewChat={createNewChat}
            />
          </div>
        </div>
      </div>

      {/* 右侧语音图标 */}
      <div className="mr-3 cursor-pointer" onClick={handleAudioInput}>
        <AiFillAudio className="text-xl text-gray-400" />
      </div>
      {/* 右侧发送按钮 */}
      <div
        onClick={handleSentMessage}
        className="mx-2 bg-green-600 hover:bg-green-700 shadow-lg transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer rounded px-3 py-1"
      >
        <BiSolidSend className="text-gray-200 text-xl" />
      </div>
    </div>
  );
};
export default ChatPageInputBar;
