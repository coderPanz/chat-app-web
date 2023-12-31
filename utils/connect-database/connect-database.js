import mongoose from "mongoose";
import { configInfos } from "./config";

const { HOST, PORT, NAME } = configInfos

export const connectToDB = async () => {
  // 启用严格模式:使用未定义的字段进行查询时，将会得到一个错误。
  mongoose.set('strictQuery', true)
  try {
    console.log('Data is connecting...')
    await mongoose.connect(`mongodb://${HOST}:${PORT}/${NAME}`)
    console.log('Database connected!')

  } catch (error) {
    console.log(error)
  }
}