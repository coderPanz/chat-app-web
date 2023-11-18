"use client"
import { useStateProvider } from "@/utils/Context/StateContext"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useEffect } from "react"
const Container = dynamic(() => import("./Container"), { ssr: false })

const VoiceCall = () => {
  const { data: session } = useSession()
  const [{ voiceCall, socket }] = useStateProvider()

  // 发起通话
  useEffect(() => {
    if(voiceCall.type === 'out-going') {
      socket.current.emit('outgoing-voice-call', {
        toId: voiceCall._id,
        from: {
          _id: session?.user.id,
          image: session?.user.image,
          username: session?.user.name
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId
      })
    }
  }, [voiceCall])
  
  return (
    <Container data={voiceCall}/>
  )
}
export default VoiceCall