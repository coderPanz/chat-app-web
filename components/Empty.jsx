import Image from "next/image"
const Empty = () => {
  return (
    <div className="bg-panel-header-background h-[100vh] flex justify-center items-center">
      <Image 
      src={'/whatsapp.gif'}
      alt="chat-app.gif"
      height={300}
      width={300}
      priority
      />
    </div>
  )
}
export default Empty