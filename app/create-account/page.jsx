'use client'
// 使用React.lazy()Suspense 时，客户端组件将默认进行预渲染（SSR）, 使用浏览器api时会出现报错, 这时候需要进行'延迟加载跳过ssr渲染'进行优化
import dynamic from 'next/dynamic'
const CreateAccountSub = dynamic(() => import('../../components/Login/create-account-sub'), { ssr: false })

const CreateAccount = () => {
  return <CreateAccountSub />
}

export default CreateAccount