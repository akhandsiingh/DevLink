import axios from "axios"

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
    console.log("Auth token set in axios headers")
  } else {
    delete axios.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
    console.log("Auth token removed from axios headers")
  }
}

export default setAuthToken
