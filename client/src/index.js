import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import axios from "axios"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Set base URL for axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}`, config.data || "")
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data)
    return response
  },
  (error) => {
    console.error("Response error:", error.response || error)
    return Promise.reject(error)
  },
)

// Load token from storage
const token = localStorage.getItem("token")
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer position="bottom-right" />
  </React.StrictMode>,
)
