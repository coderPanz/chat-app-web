"use client"
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
const Main = dynamic(() => import('../components/HomeUI/Main'))
import { GET_USER } from '@/utils/API-Route'


export default function Home() {

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // 到数据库检查用户是否存在
    if(!session?.user) router.push('/login')
    const isNewUser = async () => {
      const res = await fetch(`${GET_USER}/is-exist`, {
        method: 'POST',
        body: JSON.stringify({
          fromId: session?.user.id
        })
      })
      const data = await res.json()
      if(res.ok && data.isNewUser) {
        router.push('/create-account')
      } else {
        router.push('/')
      }
    }
    if(session?.user.id) {
      isNewUser()
    }
  }, [session?.user.id])

  return (
    <div>
      {session?.user && <Main />}
    </div>
  )
}
