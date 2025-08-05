"use client"

import { createContext, useReducer } from "react"
import axios from "axios"
import authReducer from "./authReducer"
import setAuthToken from "../../utils/setAuthToken"
import { toast } from "react-toastify"

// Initial state
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
}

// Create context
export const AuthContext = createContext(initialState)

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load User
  const loadUser = async () => {
    // Set token in headers
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    try {
      console.log("Loading user with token:", localStorage.token ? "Token exists" : "No token")
      const res = await axios.get("/api/auth/me")

      dispatch({
        type: "USER_LOADED",
        payload: res.data.data,
      })
      console.log("User loaded successfully:", res.data.data)
    } catch (err) {
      console.error("Load user error:", err.response?.data || err.message)
      dispatch({ type: "AUTH_ERROR" })
    }
  }

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      console.log("Registering user:", formData.email)
      const res = await axios.post("/api/auth/register", formData, config)

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      })

      // Set token in headers
      setAuthToken(res.data.token)

      // Load user after registration
      await loadUser()

      toast.success("Registration successful!")
      return true
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed"
      console.error("Registration error:", errorMessage)

      dispatch({
        type: "REGISTER_FAIL",
        payload: errorMessage,
      })

      toast.error(errorMessage)
      return false
    }
  }

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      console.log("Logging in user:", formData.email)
      const res = await axios.post("/api/auth/login", formData, config)
      console.log("Login response:", res.data)

      if (!res.data.token) {
        console.error("Login failed: No token received")
        toast.error("Login failed: No authentication token received")
        return false
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      })

      // Set token in headers
      setAuthToken(res.data.token)

      // Load user after login
      await loadUser()

      toast.success("Login successful!")
      return true
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed"
      console.error("Login error:", err.response?.data || err.message)

      dispatch({
        type: "LOGIN_FAIL",
        payload: errorMessage,
      })

      toast.error(errorMessage)
      return false
    }
  }

  // Logout
  const logout = () => {
    setAuthToken(null)
    dispatch({ type: "LOGOUT" })
    toast.info("Logged out successfully")
    // Note: We don't need to use navigate here as we'll handle redirection in the Navbar component
  }

  // Clear Errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" })

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
