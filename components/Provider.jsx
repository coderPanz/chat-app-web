"use client";

// 注意: SessionProvider 需要在客户端组件上使用
import { SessionProvider } from "next-auth/react";
import { StateProvider } from "../utils/Context/StateContext";
import reducer, { initialState } from "../utils/Context/StateReducers";

// 为全局提供session回调数据和状态数据
const Provider = ({ children, session }) => (
  <SessionProvider session={session}>
    <StateProvider initialState={initialState} reducer={reducer}>
      {children}
    </StateProvider>
  </SessionProvider>
);

export default Provider;
