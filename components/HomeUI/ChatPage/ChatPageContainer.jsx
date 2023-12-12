"use client";
import { useStateProvider } from "@/utils/Context/StateContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  AiFillCaretRight,
  AiFillCaretLeft,
} from "react-icons/ai";


const ChatPageContainer = () => {
  const { data: session } = useSession();

  const [{ createNewChat, messages }] = useStateProvider();

  const containerRef = useRef(null);

  // 当切换聊天好友和发送/接收消息时回滚到底部
  useEffect(() => {
    // 加上if确保获取dom在操作dom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [createNewChat, messages]);

  const [isPlayIndex, setIsPlayIndex] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const [allTime, setAllTime] = useState(0);

  const handlePlay = (index) => {
    const audioEl = document.getElementById(`audio${index}`);
    const allTimeCurrent = audioEl.duration;
    // Infinity NaN 也是数字类型, 所以要避免显示它们的字符串, 而是显示真正的数字
    // 目前还是由bug待解决
    if (
      typeof allTimeCurrent === "number" &&
      allTimeCurrent.toString() !== "Infinity" &&
      allTimeCurrent.toString() !== "NaN"
    ) {
      setAllTime(allTimeCurrent);
    }

    setIsPlayIndex(index);
    setIsPlay((preState) => !preState);

    if (!isPlay) {
      audioEl.play();
    } else {
      audioEl.pause();
    }

    // 监听播放结束
    audioEl.addEventListener("ended", () => {
      setIsPlayIndex(null);
      setIsPlay(false);
    });
  };

  return (
    <div className="h-[83vh] w-full">
      <div ref={containerRef} className="h-full overflow-auto custom-scrollbar">
        {/* 文本消息 */}
        {/* 若是发送者的消息者显示在左边, 若是发送者收到的消息则显示在右边 */}
        {messages?.map((item, index) => {
          const isRecieve = item.sender === createNewChat._id;
          return isRecieve ? (
            <div
              key={item._id}
              className="flex items-center gap-2 justify-start p-4"
            >
              <Image
                src={createNewChat?.image}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              {/* 文本消息 */}
              {item.type === "text" && (
                <>
                  <AiFillCaretLeft className=" text-green-700" />
                  <span className="bg-green-700 rounded p-2 ml-[-13px] text-gray-200">
                    {item.message}
                  </span>
                </>
              )}
              {/* 图片消息 */}
              {item.type === "image" && (
                <img
                  src={`https://coderpanz.xyz/port1/${item.message}`}
                  alt=""
                  className="w-auto h-[200px] rounded-lg"
                />
              )}

              {/* 音频消息 */}
              {item.type === "audio" && (
                <div className="flex justify-center items-center">
                  <audio
                    id={`audio${index}`}
                    src={`https://coderpanz.xyz/port1/${item.message}`}
                  ></audio>
                  <AiFillCaretLeft className=" text-green-600" />
                  <div
                    id={`audio${index}`}
                    onClick={() => handlePlay(index)}
                    className={`bg-green-600 flex px-2 pt-[10px] pb-2 justify-center items-center rounded ml-[-5px]`}
                  >
                    <div
                      className={`load_11 ${
                        isPlayIndex === index && isPlay ? "audioPlay" : ""
                      }`}
                    >
                      <div className="rect1"></div>
                      <div className="rect2"></div>
                      <div className="rect3"></div>
                      <div className="rect4"></div>
                      <div className="rect5"></div>
                    </div>
                  </div>
                  <span className="text-green-600">
                    {isPlayIndex === index && isPlay && allTime + "s"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              key={item._id}
              className="flex items-center gap-2 justify-end p-4"
            >
              {/* 文本消息 */}
              {item.type === "text" && (
                <>
                  <span className="bg-green-600 rounded p-2 text-gray-200">
                    {item.message}
                  </span>
                  <AiFillCaretRight className="ml-[-13px] text-green-600" />
                </>
              )}

              {/* 图片消息 */}
              {item.type === "image" && (
                <img
                  src={`https://coderpanz.xyz/port1/s${item.message}`}
                  alt=""
                  className="w-[200px] h-[200px] rounded-lg mr-1"
                />
              )}

              {/* 音频消息 */}
              {item.type === "audio" && (
                <div className="flex justify-center items-center">
                  <audio
                    id={`audio${index}`}
                    src={`https://coderpanz.xyz/port1/${item.message}`}
                  ></audio>
                  <div
                    id={`audio${index}`}
                    onClick={() => handlePlay(index)}
                    className={`bg-green-600 flex px-2 pt-[10px] pb-2 justify-center items-center rounded `}
                  >
                    <div
                      className={`load_11 ${
                        isPlayIndex === index && isPlay ? "audioPlay" : ""
                      }`}
                    >
                      <div className="rect1"></div>
                      <div className="rect2"></div>
                      <div className="rect3"></div>
                      <div className="rect4"></div>
                      <div className="rect5"></div>
                    </div>
                  </div>
                  <AiFillCaretRight className=" text-green-600 ml-[-5px]" />
                  <span className="text-green-600">
                    {isPlayIndex === index && isPlay && allTime + "s"}
                  </span>
                </div>
              )}

              {/* 头像 */}
              <Image
                src={session?.user.image}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChatPageContainer;
