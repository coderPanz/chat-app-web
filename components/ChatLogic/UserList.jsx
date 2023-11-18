import { UserListItem } from "../index"

const UserList = ({ userList }) => {
  const values = Object.values(userList)

  return (
    <div className="rounded-md px-3 py-3 ">
      {
        values.map((item, index) => (
          <UserListItem key={index} item={item} index={index} />       
        ))
      }
      
      {/* 解决滚动到底部时显示不全现象 */}
      <div className="h-[70px]"></div>
    </div>
  )
}

export default UserList