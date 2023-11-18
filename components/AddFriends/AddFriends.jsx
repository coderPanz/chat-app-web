import { useStateProvider } from "@/utils/Context/StateContext";
import { ACCEPT_REQ } from "@/utils/API-Route";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { reducerCases } from "@/utils/Context/constants";

const AddFriends = () => {
  const { data: session } = useSession();
  const [{ friendInfos, socket }, dispatch] = useStateProvider();

  // 同意好友申请
  const handleAccept = async () => {
    // 把好友添加到数据库并同时也在好友的数据库添加自己
    const res = await fetch(ACCEPT_REQ, {
      method: "POST",
      body: JSON.stringify({
        fromId: session?.user.id,
        friendId: friendInfos.fromId,
      }),
    });
    const friendId = await res.json();
    // 若添加成功者从新获取用户列表, 并发出socket事件告诉好友, 让好友刷新获取
    if (res.ok && friendId) {
      dispatch({
        type: reducerCases.SET_ALL_CONTACTS_PAGE,
      });
      // 同意申请后告知好友
      socket.current.emit("accept-req", {
        toId: friendId,
        fromId: session?.user.id,
        username: session?.user.name,
        image: session?.user.image,
        isAccept: true,
      });
    }
    // 关闭弹出的申请界面
    dispatch({
      type: reducerCases.IS_SHOW_REQ,
    });
  };

  // 关闭提示窗口
  const handleColse = () => {
    dispatch({
      type: reducerCases.IS_SHOW_REQ,
    });
  };

  // 拒绝添加好友
  const handelRejected = () => {
    socket.current.emit("reject-add", {
      fromId: session?.user.id,
      toId: friendInfos.fromId,
      username: session?.user.name,
      image: session?.user.image,
      isAccept: false,
      reject: true
    });
    dispatch({
      type: reducerCases.IS_SHOW_REQ,
    });
  };

  return (
    <div className="flex gap-5 bg-search-input-container-background border-green-800 border rounded-lg px-5 py-3 absolute right-[30px] top-[20px]">
      {/* 好友申请提示 */}
      {(!friendInfos?.isExist && !friendInfos.isAccept && !friendInfos.reject) && (
          <>
            <div>
              <Image
                src={friendInfos.image}
                alt="avatar"
                width={70}
                height={70}
                className="rounded-full"
              />
            </div>
            <div>
              <div className="text-gray-300 text-2xl truncate">
                {friendInfos.username}的好友申请
              </div>
              <div className="flex justify-center gap-8 mt-3">
                <button
                  onClick={handleAccept}
                  className="bg-green-500 py-1 px-5 text-sm rounded-lg"
                >
                  接受
                </button>
                <button
                  onClick={handelRejected}
                  className="bg-red-500 py-1 px-5 text-sm rounded-lg text-gray-300"
                >
                  拒绝
                </button>
              </div>
            </div>
          </>
        )}

      {/* 申请同意提示 */}
      {friendInfos.isAccept && (
        <>
          <div>
            <Image
              src={friendInfos.image}
              alt="avatar"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="text-gray-300 text-2xl truncate">
              {friendInfos.username}同意申请!
            </div>
            <div className="flex justify-center gap-8 mt-3">
              <button
                onClick={handleColse}
                className="bg-green-500 py-1 px-5 text-sm rounded-lg"
              >
                好的
              </button>
            </div>
          </div>
        </>
      )}

      {(!friendInfos.isAccept && friendInfos?.reject)  && (
        <>
          <div>
            <Image
              src={friendInfos.image}
              alt="avatar"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="text-gray-300 text-2xl truncate">
              {friendInfos.username}拒绝申请!
            </div>
            <div className="flex justify-center gap-8 mt-3">
              <button
                onClick={handleColse}
                className="bg-red-500 py-1 px-5 text-sm rounded-lg"
              >
                好的
              </button>
            </div>
          </div>
        </>
      )}
      {/* 提示好友已经添加过了 */}
      {friendInfos?.isExist && (
        <>
          <div>
            <Image
              src={friendInfos.image}
              alt="avatar"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="text-gray-300 text-2xl truncate">
              {friendInfos.username}已经是好友!
            </div>
            <div className="flex justify-center gap-8 mt-3">
              <button
                onClick={handleColse}
                className="bg-green-500 py-1 px-5 text-sm rounded-lg"
              >
                好的
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default AddFriends;
