import dayjs from "dayjs"

const dateFormat = (date, format) => {
  const formattedDate = dayjs(date).format(format)
  return formattedDate 
}
export default dateFormat