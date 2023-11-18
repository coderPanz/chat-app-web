"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Main } from "@/components";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    localStorage.setItem("loginInfos", session?.user);
    const isLogin = localStorage.getItem("loginInfos");
    console.log(!isLogin);
    if (isLogin) {
      router.push("/login");
    } else {
      setIsLogin(true);
    }
  }, [session?.user.email]);

  return <div>{isLogin && <Main />}</div>;
}
