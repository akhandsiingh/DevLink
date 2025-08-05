"use client"

import { createContext, useReducer } from "react"
import { v4 as uuidv4 } from "uuid"
import alertReducer from "./alertReducer"

// Initial state
const initialState = []

// Create context
export const AlertContext = createContext(initialState)

// Provider component
export const AlertProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState)

  // Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuidv4()
    dispatch({
      type: "SET_ALERT",
      payload: { msg, type, id },
    })

    setTimeout(() => dispatch({ type: "REMOVE_ALERT", payload: id }), timeout)
  }

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}
