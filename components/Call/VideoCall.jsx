"use client"
import { useStateProvider } from "@/utils/Context/StateContext"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useEffect } from "react"
const Container = dynamic(() => import("./Container"), { ssr: false })

const VideoCall = () => {
  const { data: session } = useSession()
  const [{ videoCall, socket }] = useStateProvider()

  // 发起通话
  useEffect(() => {
    if(videoCall.type === 'out-going') {
      socket.current.emit('outgoing-video-call', {
        toId: videoCall._id,
        from: {
          _id: session?.user.id,
          image: session?.user.image,
          username: session?.user.name
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId
      })
    }
  }, [videoCall])
  
  return (
    <Container data={videoCall}/>
  )
}
export default VideoCall