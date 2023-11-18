import { useStateProvider } from "@/utils/Context/StateContext";
import { reducerCases } from "@/utils/Context/constants";
import Image from "next/image";

const InComingVoiceCall = () => {
  const [{ inComingVoiceCall, socket }, dispatch] = useStateProvider();

  // 接通电话
  const acceptCall = () => {
    // 由于是通话接收方所以初始的inComingVoiceCall和voiceCall都为undefined
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: { ...inComingVoiceCall, tyep: "in-coming" },
    });
    socket.current.emit("accept-voice-call", {
      _id: inComingVoiceCall._id,
    }),
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      inComingVoiceCall: undefined,
    });
    // 设置isConnect
    dispatch({
      type: reducerCases.IS_CONNECT
    })
  };

  // 拒接电话(需要一个标识符表示拒接还是挂断)
  // 拒接电话不需要设置!isConnect
  const rejectCall = () => {
    socket.current.emit("reject-voice-call", {
      fromId: inComingVoiceCall._id,
      isEnd: false // 表示类型为--拒接电话
    });
    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  return (
    <div className="fixed flex gap-5 bottom-[80px] right-[30px] z-50 bg-search-input-container-background border-green-800 border rounded-lg px-5 py-3">
      <div>
        <Image
          src={inComingVoiceCall.image}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div className="text-gray-300 text-2xl truncate">{`${inComingVoiceCall.username}的通话邀请`}</div>
        <div className="flex justify-center gap-8 mt-3">
          <button
            onClick={acceptCall}
            className="bg-green-500 py-1 px-5 text-sm rounded-lg"
          >
            接受
          </button>
          <button
            onClick={rejectCall}
            className="bg-red-500 py-1 px-5 text-sm rounded-lg text-gray-300"
          >
            拒绝
          </button>
        </div>
      </div>
    </div>
  );
};
export default InComingVoiceCall;
