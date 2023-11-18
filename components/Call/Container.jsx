"use client";
import { useStateProvider } from "@/utils/Context/StateContext";
import Image from "next/image";
import { MdOutlineCallEnd } from "react-icons/md";
import { reducerCases } from "@/utils/Context/constants";
import { useEffect, useRef, useState } from "react";
import { GET_TOKEN_CALL } from "@/utils/API-Route";
import { useSession } from "next-auth/react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

const Container = ({ data }) => {
  const { data: session } = useSession();
  const [{ socket, isConnect }, dispatch] = useStateProvider();
  const [token, setToken] = useState(undefined);
  const [streamID, setStreamID] = useState(undefined);
  
  const localStream = useRef(null);
  const zg = useRef(null);
  // 获取token用于开启通话的令牌
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch(`${GET_TOKEN_CALL}`, {
          method: 'POST',
          body: JSON.stringify({
            fromId: session?.user.id
          })
        });
        const token = await res.json();
        setToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    if (!token) getToken();
  }, [token]);

  useEffect(() => {
    const startCall = async () => {
      zg.current = new ZegoExpressEngine(
        parseInt(process.env.ZEGO_APP_ID),
        process.env.ZEGO_SERVER
      );

      // 监听roomStreamUpdate事件, 当其他用户加入房间时，SDK会触发回调roomStreamUpdate通知您房间已加流。回调中会携带streamID加入房间的用户的参数。该场景下，您可以startPlayingStream根据参数调用该方法播放远程用户已发布到ZEGOCLOUD服务器的音视频流streamID。
      zg.current.on(
        "roomStreamUpdate",
        async (roomID, updateType, streamList, extendedData) => {
          if (updateType === "ADD") {
            // 添加流后，播放它们
            // 播放新增音视频流列表中的第一个流。在实际业务中，建议您遍历流列表来播放每个流。
            const rmVoice = document.getElementById("remote-video");
            const vd = document.createElement("audio");

            // 创建的媒体元素设置了一个唯一的 ID，这样就可以通过该 ID 来识别和操作这个元素
            vd.id = streamList[0].streamID;
            // 设置媒体元素自动播放
            vd.autoplay = true;
            // 设置媒体元素的静音状态。在这里设置为 false 表示不静音。
            vd.muted = false;

            if (rmVoice) {
              // 把之前创建的媒体元素 vd 添加到 rmVideo 元素中。
              rmVoice.appendChild(vd);
            }

            // 开始播放指定 ID 的音视频流 ,并通过将流赋值给 <video> 元素的 srcObject 属性，以实现视频的显示出来。
            // 播放新增音视频流列表中的第一个流(私人通信)。在实际业务中，建议您遍历流列表来播放每个流(多人视频)。
            const streamID = streamList[0].streamID;
            const remoteStream = await zg.current.startPlayingStream(streamID, {
              audio: true,
              video: false,
            });

            vd.srcObject = remoteStream;
          } else if (updateType === "DELETE" && streamList[0].streamID) {
            // 一、停止发布流并销毁流。
            // 1. 停止向远程用户发布本地音视频流(根据streamID)
            const streamID = streamList[0].streamID;
            zg.current.stopPublishingStream(streamID);
            // 2. 调用该destroyStream方法销毁创建的流数据。
            localStream.current = null;
            // 二. 停止播放流
            // 1. 停止播放远程用户发布的音视频流。
            zg.current.stopPlayingStream(streamID);

            // 三. 退出房间
            zg.current.logoutRoom(data.roomId.toString());
            dispatch({ type: reducerCases.END_CALL });
            // 4. 销毁 ZegoExpressEngine 实例
            zg.current.destroyEngine();
            zg.current = null;
          }
        }
      );

      // 登录房间: 登录到一个房间。如果登录成功，则返回“true”。
      // 调用该loginRoom方法并设置roomID、token、user 、config即可登录房间。如果房间不存在，调用该方法将创建并登录房间。
      // roomID、userID和的值userName是用户定义的。且唯一
      zg.current
        .loginRoom(
          data.roomId.toString(),
          token,
          {
            userID: session?.user.id.toString(),
            userName: session?.user.id.toString(),
          },
          { userUpdate: true }
        )
        .then(async (result) => {
          if (result === true) {
              // 启动本地视频预览并将码流发布到ZEGOCLOUD音视频云
              // 获取媒体流对象。
              localStream.current = await zg.current.createStream({
                // 指定了摄像头选项, 是否包含音视频流!
                camera: {
                  audio: true,
                  video: false,
                },
              });

              // streamID本地生成，同一个AppID下必须全局唯一。用来标识localStream
              const streamID = session?.user.id.toString();
              setStreamID(streamID);

              // 调用该方法并设置streamID和localStream参数，将本地音视频流发布给远程用户，其中localStream表示创建流时获取的媒体流对象。streamID为这个流的标识符
              if(zg.current !== null) zg.current.startPublishingStream(streamID, localStream.current);
          }
        });
    };

    if (token) {
      startCall();
    }
  }, [token]);

  // 语音通话

  // 挂断电话
  // 挂断电话需要设置!isConnect
  const endCall = () => {
    if (zg.current && localStream.current && streamID) {
      zg.current.destroyStream(localStream.current);
      zg.current.stopPublishingStream(streamID);
      zg.current.stopPlayingStream(streamID);
      zg.current.logoutRoom(data.roomId.toString());

      // 4. 销毁 ZegoExpressEngine 实例
      zg.current.destroyEngine();
      zg.current = null;
      localStream.current = null;
    }
    if (data.callType === "voice") {
      socket.current.emit("reject-voice-call", {
        fromId: data._id,
        isEnd: true, // 表示类型为--挂断电话
      });
      dispatch({
        type: reducerCases.IS_CONNECT,
      });
    } else {
      socket.current.emit("reject-video-call", {
        fromId: data._id,
        isEnd: true,
      });
      dispatch({
        type: reducerCases.IS_CONNECT,
      });
    }
    // 挂断电话所有通话相关状态重置
    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  return (
    <div className="bg-search-input-container-background w-full h-full flex justify-center items-center text-gray-300 relative">
      <div className="flex flex-col gap-5 w-[400px] justify-center items-center">
        <span className="text-7xl truncate">{data.username}</span>
        <span className="text-lg">{isConnect ? "通话中" : "正在呼叫..."}</span>
        <Image
          src={data.image}
          alt="avatars"
          width={250}
          height={250}
          className="rounded-full mt-[35px]"
        />
        {/* 视频通话的元素 */}
        <div className="my-5 relative bg-red-600" id="remote-video">
        </div>

        <MdOutlineCallEnd
          onClick={endCall}
          className="mt-[20px] text-[70px] bg-red-600 rounded-full p-3"
        />
      </div>
    </div>
  );
};

export default Container;
