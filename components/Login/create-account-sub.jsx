"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LoginForm, Avatar } from "@/components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { GET_USER } from "@/utils/API-Route";

const Photograph = dynamic(() => import("./Photograph"), { ssr: false });

const CreateAccountSub = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userID = session?.user.id;
  // 记录表单是否弹出
  const [isShowForm, setIsShowForm] = useState(false);
  // 头像url
  const [photo, setPhoto] = useState(session?.user.image);
  // 是否弹出头像菜单
  const [isPhotoOption, setIsPhotoOption] = useState(false);
  // 记录bio
  const [bio, setBio] = useState("");
  // 重置username
  const [userName, setUserName] = useState("");

  // 初始化username,和头像, 若没有session则跳转到登录界面
  useEffect(() => {
    if (session) {
      setPhoto(session?.user.image);
      setUserName(session?.user.name || "");
      setBio(session?.user.bio);
    } else {
      router.push("/login");
    }
  }, [session]);

  useEffect(() => {
    // 到数据库检查用户是否存在
    const isNewUser = async () => {
      const res = await fetch(`${GET_USER}/is-exist`, {
        method: "POST",
        body: JSON.stringify({
          fromId: userID,
        }),
      });
      const data = await res.json();
      if (data.isNewUser === false) {
        router.push("/");
      } else if (!res.ok) {
        router.push("/login");
      }
    };
    isNewUser();
  }, []);

  // 是否启用相机
  const [photograph, setPhotograph] = useState(false);

  // 监听表单输入
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  // 点击弹出表单
  const handleCreate = () => {
    const loginFormEl = document.getElementById("LoginForm");
    const avatarEl = document.getElementById("avatar");
    setIsShowForm((preState) => !preState);
    if (!isShowForm) {
      loginFormEl.classList.remove("scale-0");
      loginFormEl.classList.add("scale-100");
      avatarEl.classList.remove("scale-0");
      avatarEl.classList.add("scale-100");
    } else {
      loginFormEl.classList.add("scale-0");
      loginFormEl.classList.remove("scale-100");
      avatarEl.classList.add("scale-0");
      avatarEl.classList.remove("scale-100");
    }
  };
  // 头像菜单元素
  // 使用React.lazy()Suspense 时，客户端组件将默认进行预渲染（SSR）, 使用浏览器api时会出现报错, 这时候需要进行'延迟加载跳过ssr渲染'进行优化
  const photoMenuEl = document.getElementById("photoMenu");

  return (
    <div className="bg-panel-header-background h-screen w-screen flex justify-center items-center">
      <Image
        src="/whatsapp.gif"
        width={300}
        height={300}
        alt="whatsapp.gif"
        priority // 高优先级并 预加载
      />
      <div className="text-white ml-10 text-center">
        <p className="text-7xl text-white italic font-semibold">畅聊</p>
        <div className="relative">
          <button
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50 transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 px-4 py-1 rounded mt-5 text-gray-200"
          >
            创建用户
          </button>
          <Avatar
            photoMenuEl={photoMenuEl}
            setPhotograph={setPhotograph}
            photograph={photograph}
            photo={photo}
            setPhoto={setPhoto}
            isPhotoOption={isPhotoOption}
            setIsPhotoOption={setIsPhotoOption}
          />
          <LoginForm
            userName={userName}
            email={session?.user.email}
            handleBioChange={handleBioChange}
            handleUserNameChange={handleUserNameChange}
            bio={bio}
            photo={photo}
          />
        </div>
      </div>

      <div id="photograph" className="absolute scale-0 translate duration-700">
        <Photograph
          photoMenuEl={photoMenuEl}
          photograph={photograph}
          setPhotograph={setPhotograph}
          setPhoto={setPhoto}
          setIsPhotoOption={setIsPhotoOption}
        />
      </div>
    </div>
  );
};
export default CreateAccountSub;
