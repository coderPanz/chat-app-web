"use client"
import { useState } from "react";
import { AiFillCamera } from "react-icons/ai";

const Avatar = ({ setPhotograph, photograph, photo, setPhoto, isPhotoOption,photoMenuEl, setIsPhotoOption }) => {
  
  // 是否弹出'选择文件'窗口
  const [isUpload, setIsUpload] = useState(false);
  // 是否弹出'预设头像'窗口
  const [isPresets, setIsPresets] = useState(false);

  // 头像菜单以及回调函数
  const photoOptions = [
    {
      name: "照相",
      callback: () => {
        setPhotograph(preState => !preState)
        const photographEl = document.getElementById("photograph");
        if (!photograph) {
          photographEl.classList.add("scale-100");
          photographEl.classList.remove("scale-0");
        }
      },
    },
    {
      name: "预设头像",
      callback: () => {
        setIsPresets((preState) => !preState);
        if (!isPresets) {
          presetsEl.classList.add("scale-100");
          presetsEl.classList.remove("scale-0");
        } else {
          presetsEl.classList.remove("scale-100");
          presetsEl.classList.add("scale-0");
        }
      },
    },
    {
      name: "上传照片",
      callback: () => {
        setIsUpload((preState) => !preState);
        if (!isUpload) {
          uploadImgEl.classList.add("scale-100");
          uploadImgEl.classList.remove("scale-0");
        } else {
          uploadImgEl.classList.remove("scale-100");
          uploadImgEl.classList.add("scale-0");
        }
      },
    },
    {
      name: "删除照片",
      callback: () => {
        setPhoto("/default_avatar.png");
      },
    },
  ];

  // 预设头像
  const presetsAvatars = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  // 选择预设图片
  const presetsEl = document.getElementById("presetsImg");
  const handleSelectAvatars = (e) => {
    setPhoto(e.target.src);
  };

  // 点击弹出头像菜单及其关闭
  const handleShowMenu = () => {
    setIsPhotoOption((preState) => !preState);
    if (!isPhotoOption) {
      photoMenuEl.classList.remove("scale-0");
      photoMenuEl.classList.add("scale-100");
    } else {
      photoMenuEl.classList.remove("scale-100");
      photoMenuEl.classList.add("scale-0");
    }
  };

  // 点击关闭预设头像窗口
  const handleClose = () => {
    presetsEl.classList.remove("scale-100");
    presetsEl.classList.add("scale-0");
    setTimeout(() => {
      photoMenuEl.classList.remove("scale-100");
      photoMenuEl.classList.add("scale-0");
    }, 450);
    setIsPhotoOption((preState) => !preState);
    setIsPresets((preState) => !preState);
  };

  // 上传本地文件
  const uploadImgEl = document.getElementById("uploadImg"); // 获取'选择文件'元素
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 获取用户选择的第一个文件
    uploadImgEl.classList.add("scale-0");
    uploadImgEl.classList.remove("scale-100");
    // 等待uploadImgEl关闭后在关闭photoMenuEl提升视觉效果
    setTimeout(() => {
      photoMenuEl.classList.remove("scale-100");
      photoMenuEl.classList.add("scale-0");
    }, 450);
    setIsPhotoOption((preState) => !preState);
    setIsUpload((preState) => !preState);
    if (file) {
      const reader = new FileReader(); // 创建文件读取器
      // 监听读取完成事件
      reader.onload = () => {
        // 获取图片的 Data URL
        const imageDataUrl = reader.result;
        // 设置图片的 src 属性
        setPhoto(imageDataUrl);
      };
      reader.readAsDataURL(file);
      // 读取文件内容为 Data URL: 通过将 Data URL 赋值给图片的 src 属性，就可以将图片显示在网页中。
      //  Data URL 包含了文件的完整内容，可能会导致相应的数据量大增，特别是对于大型文件。因此，对于较大的文件，最好考虑先压缩或缩放图像，以减小文件大小和网页加载时间。
    }
  };

  // 头像菜单
  const handlePhotoOperate = (index, callback) => {
    switch (index) {
      case 0:
        callback();
        break;

      case 1:
        callback();
        break;

      case 2:
        callback();
        break;

      case 3:
        callback();
        break;

      default:
        console.log("无此选项!");
        break;
    }
  };

  return (
    <div
      id="avatar"
      className="ml-[24px] mt-3 absolute scale-0 transform duration-700 origin-[0%_0%] cursor-pointer"
    >
      {/* 头像和遮罩层 */}
      <div className="w-[50px] h-[50px]">
        {/* 头像 */}
        <img
          src={photo}
          alt="userImage"
          className="rounded w-[50px] h-[50px]"
          id="imageContainer"
        />

        {/* 遮罩层 */}
        <div
          onClick={handleShowMenu}
          className="flex justify-center items-center absolute inset-0 bg-gray-800 opacity-0 hover:opacity-80 transition-opacity duration-300 rounded w-[50px] h-[50px]"
        >
          <AiFillCamera className="h-[30px] w-[30px] text-black" />
        </div>
      </div>

      {/* 头像菜单 */}
      <div
        id="photoMenu"
        className="bg-input-background  rounded absolute top-[-0px] left-[-95px] scale-0 translate duration-700 origin-[115%_2%]"
      >
        {photoOptions.map((item, index) => (
          <p
            onClick={() => handlePhotoOperate(index, item.callback)}
            className="hover:bg-dropdown-background-hover py-2 px-2"
            key={item.name}
          >
            {item.name}
          </p>
        ))}
      </div>

      {/* 从'本地中选择头像'窗口 */}
      <input
        className="w-20 rounded mt-[37px] ml-[-210px] absolute scale-0 translate duration-700 origin-[115%_50%]"
        type="file"
        onChange={handleFileChange}
        id="uploadImg"
      />

      {/* 选择'预设头像'窗口 */}
      <div
        id="presetsImg"
        className="grid grid-cols-3 gap-5 bg-black  mt-[-50px] ml-[-335px] scale-0 translate duration-700 origin-[105%_22%] rounded-xl w-[230px] p-5 text-center"
      >
        {presetsAvatars.map((item, index) => (
          <img
            key={item}
            onClick={(e) => handleSelectAvatars(e, index)}
            src={item}
            alt="预设头像"
            className="w-full h-auto"
          />
        ))}
        <span
          onClick={handleClose}
          className="grid col-span-3 bg-input-background hover:bg-dropdown-background-hover rounded py-[3px]"
        >
          关闭
        </span>
      </div>
    </div>
  );
};
export default Avatar;
