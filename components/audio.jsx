import { useState } from "react";

const Audio = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = async () => {
    setRecording(true);
    // 获取音频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 创建一个 MediaRecorder 实例来录制音频。
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    // ondataavailable 是 MediaRecorder 对象的一个事件，表示在录制期间可用新数据时触发的事件。
    // 它指定了当 MediaRecorder 获取到新的录制数据时要执行的函数。每当有可用的音频数据片段时，ondataavailable 事件就会被触发一次。
    // 在 ondataavailable 事件处理程序中，将录制的音频数据存储在数组 chunks 中。
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    // 在 onstop 事件处理程序中，将 chunks 数组中的音频数据合并为一个 Blob 对象
    // 录制停止时触发
    mediaRecorder.onstop = () => {
      // Blob（Binary Large Object）对象表示一个不可变、原始数据的类文件对象，通常用于存储二进制数据或大型文本数据。
      // 指定了 MIME 类型为 audio/wav。MIME 类型（Multipurpose Internet Mail Extensions）是一种标准化的互联网媒体类型
      // WAV（Waveform Audio File Format）是一种针对 Windows 平台开发的一种支持无损音频压缩的音频文件格式，因此它的质量相对较高，但是文件比较大。
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      setAudioBlob(audioBlob);
    };

    // 开始录制
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 5000);
  };

  // 用于将录制的音频数据上传到服务器
  const uploadAudio = () => {
    const formData = new FormData();
    // 将录制的音频 Blob 添加到表单中
    formData.append("audio", audioBlob, "recording.wav");

    fetch("/upload-audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Audio uploaded successfully");
        // 处理服务器返回的数据
      })
      .catch((error) => {
        console.error("Error uploading audio: ", error);
      });
  };

  return (
    <div>
      <button className="bg-green-600 p-3 rounded-xl" disabled={recording} onClick={startRecording}>
        {recording ? "Recording..." : "Start Recording"}
      </button>
      <button disabled={!audioBlob} onClick={uploadAudio}>
        Upload Audio
      </button>
    </div>
  );
};

export default Audio;
