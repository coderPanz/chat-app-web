"use client";
import axios from "axios";
import { useEffect, useRef } from "react";
import { SENT_AUDIO_MESSAGE } from "@/utils/API-Route";
import { useStateProvider } from "@/utils/Context/StateContext";
import { reducerCases } from "@/utils/Context/constants";

const AudioVisualizer = ({ isMousedown, session, createNewChat }) => {
  const [{ socket }, dispatch] = useStateProvider();
  let canvasRef = useRef(null);
  let streamRef = useRef(null);
  let mediaRecorderRef = useRef(null);

  // 音频可视化(同时调用音频录制)
  useEffect(() => {
    let audioContext;
    let analyser;
    let dataArray;
    const canvas = canvasRef.current;
    const HEIGHT = canvas.height;
    const WIDTH = canvas.width;
    const ctx = canvas.getContext("2d");
    let bufferLength;

    const initAudio = async () => {
      try {
        // 获取用户设备的麦克风输入流。
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // 音频录制函数
        await audioRecord(stream);
        // 开始录制
        mediaRecorderRef.current.start();

        streamRef.current = stream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();

        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // 创建音频流接口
        const source = audioContext.createMediaStreamSource(stream);
        // 接口连接分析器
        source.connect(analyser);
        const draw = () => {
          requestAnimationFrame(draw);

          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, WIDTH, HEIGHT);
          ctx.fillStyle = "rgb(0, 0, 0)";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          let barWidth = (WIDTH / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
            ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
          }
        };
        draw();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    if (isMousedown) initAudio();
    return () => {
      const stream = streamRef.current;
      const mediaRecorder = mediaRecorderRef.current;
      // 关闭音频上下文
      if (audioContext) audioContext.close();
      // 关闭音频流
      if (stream) stream.getTracks().forEach((track) => track.stop());
      // 停止录制-录制实例引用清空防止多次重复执行代码!
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorderRef.current = null;
      }
    };
  }, [isMousedown]);

  // 音频录制(录制结束时上传数据)
  const audioRecord = async (stream) => {
    // 创建一个 MediaRecorder 实例来录制音频。
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks = [];
    // 实时储存音频数据到chunks中
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    // 监听录制结束
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/mp3" });
      uploadAudio(audioBlob)
    };
  };

  // 上传音频数据到服务器
  const uploadAudio = async (audioBlob) => {
    // 将录制的音频 Blob 添加到表单中
    const formData = new FormData();
    // 指定了文件名为 "recording.mp3"
    formData.append("audio", audioBlob, "recording.mp3");
    const res = await axios.post(SENT_AUDIO_MESSAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        fromId: session?.user.id,
        toId: createNewChat?._id,
      },
    });

    const data = res.data.message;
    // 发送socket消息
    if (res.status === 201) {
      socket.current.emit("send-msg", data);
      // 缓存该消息进入本地进行聊天窗口的更新
      dispatch({
        type: reducerCases.ADD_MESSAGES,
        newMessage: data,
      });
    }
  };

  return <canvas ref={canvasRef} className="h-full w-full rounded-lg" />;
};
export default AudioVisualizer;
