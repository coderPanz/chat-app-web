import NumToLetters from "@/utils/NumToLetters"
import UserListItemObj from "./UserListItemObj"
const UserListItem = ({ item, index }) => {
  return (
    <div>
      {
        (item.length !== 0) ? 
        <p className="px-[16px] mb-5 rounded-md text-xl text-blue-500">
          {NumToLetters(index)}
        </p> :
        null
      }
      {
        item.map((item, index) => (
          <UserListItemObj key={index} item={item}/>
        ))
      }
    </div>
  )
}
export default UserListItem