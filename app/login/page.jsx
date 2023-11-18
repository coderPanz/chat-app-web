"use client"
import Image from "next/image"
import { signIn, useSession } from "next-auth/react"
import { AiFillGithub } from "react-icons/ai";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GET_USER } from "@/utils/API-Route";

const Login = () => {
  const { data: session } = useSession()
  const userID = session?.user.id
  const router = useRouter()
  useEffect(() => {
    // 到数据库检查用户是否存在
    const isNewUser = async () => {
      const res = await fetch(`${GET_USER}/is-exist`, {
        method: 'POST',
        body: JSON.stringify({
          fromId: userID
        })
      })
      const data = await res.json()
      if(res.ok && data.isNew) {
        router.push('/create-account')
      } else {
        router.push('/')
      }
    }
    if(userID) {
      isNewUser()
    }
  }, [userID])
  
  return (
    <div className="bg-panel-header-background h-screen w-screen flex justify-center items-center">
      <Image 
        src='/whatsapp.gif'
        width={300}
        height={300}
        alt="whatsapp.gif"
        priority // 高优先级并 预加载
      />
      <div className="text-white ml-10 text-center">
        <p className="text-7xl text-white italic font-semibold">
          畅聊
        </p> 
        <div onClick={() => signIn()} className="bg-green-600 px-7 py-2 flex justify-center items-center text-white rounded hover:bg-green-700 shadow-lg shadow-green-500/50 transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 mt-5 cursor-pointer">
          <AiFillGithub className="bg-black rounded w-[25px] h-[25px]"/>
          <span className="ml-3">登录</span>
        </div>
      </div>
    </div>
  )
  }
export default Login