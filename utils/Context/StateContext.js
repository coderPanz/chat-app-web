"use client"

import { createContext, useContext, useReducer } from "react";
export const StateContext = createContext()
export const StateProvider = ({ initialState, reducer, children }) => (
  // 由StateContext的provider包裹起来通过value向子组件传递state和dispatch
  // 这里的value相当于state和dispatch
  // 事实上已经把state和dispatc放入context中, 若需要在子组件中使用则需要在useContext中解构出来
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

export const useStateProvider = () => useContext(StateContext)