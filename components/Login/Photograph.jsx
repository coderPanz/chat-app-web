"use client";

import { useEffect, useRef } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiTwotoneCamera } from "react-icons/ai";

const Photograph = ({photograph,setPhotograph,setPhoto,photoMenuEl,setIsPhotoOption}) => {
  const videoRef = useRef(null);
  let streamRef = useRef(null); // 创建可变引用
  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream; // 将 stream 赋值给可变引用的 current 属性
      videoRef.current.srcObject = stream;
    };
    if (photograph) startCamera();
    return () => {
      const stream = streamRef.current;
      
      if (stream) stream.getTracks().forEach((track) => track.stop());
    }
  }, [photograph]);

  const handleClose = () => {
    setPhotograph((preState) => !preState);
    setIsPhotoOption((preState) => !preState);
    const photographEl = document.getElementById("photograph");
    if (photograph) {
      photographEl.classList.remove("scale-100");
      photographEl.classList.add("scale-0");
      setTimeout(() => {
        photoMenuEl.classList.remove("scale-100");
        photoMenuEl.classList.add("scale-0");
      }, 450);
    }
  };

  const handlePhotograph = () => {
    const canvas = document.createElement("canvas");
    canvas.getContext("2d").drawImage(videoRef.current, -80, -40, 400, 200);
    const newAvatar = canvas.toDataURL("image/jpeg");
    setPhoto(newAvatar);
    handleClose();
  };

  return (
    <div className="bg-gray-300 w-[500px] h-[500px] rounded-2xl text-center py-3">
      <div className="flex justify-center items-center">
        <AiFillCloseCircle className="text-4xl" onClick={handleClose} />
      </div>

      <div className="flex justify-center items-center px-5">
        <video id="video" className="mt-5" autoPlay ref={videoRef}></video>
      </div>
      <div className="flex justify-center items-center mt-3">
        <AiTwotoneCamera className="text-5xl" onClick={handlePhotograph} />
      </div>
    </div>
  );
};
export default Photograph;
