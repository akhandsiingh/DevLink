"use client"

import { createContext, useReducer } from "react"
import axios from "axios"
import profileReducer from "./profileReducer"

// Initial state
const initialState = {
  profile: null,
  profiles: [],
  githubStats: null,
  mediumArticles: null,
  leetcodeStats: null,
  hackerrankStats: null,
  linkedinProfile: null,
  twitterTweets: null,
  loading: true,
  error: null,
}

// Create context
export const ProfileContext = createContext(initialState)

// Provider component
export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState)

  // Get current user's profile
  const getCurrentProfile = async () => {
    try {
      const res = await axios.get("/api/profiles")

      dispatch({
        type: "GET_PROFILE",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching profile:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching profile",
      })
    }
  }

  // Get all profiles
  const getProfiles = async () => {
    try {
      const res = await axios.get("/api/profiles/all")

      dispatch({
        type: "GET_PROFILES",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching profiles:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching profiles",
      })
    }
  }

  // Get profile by ID
  const getProfileById = async (id) => {
    try {
      const res = await axios.get(`/api/profiles/${id}`)

      dispatch({
        type: "GET_PROFILE",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching profile by ID:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching profile",
      })
    }
  }

  // Create or update profile
  const createProfile = async (formData, edit = false) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const res = await axios.post("/api/profiles", formData, config)

      dispatch({
        type: "GET_PROFILE",
        payload: res.data.data,
      })

      return {
        success: true,
        msg: edit ? "Profile Updated" : "Profile Created",
      }
    } catch (err) {
      console.error("Error creating/updating profile:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error creating/updating profile",
      })

      return {
        success: false,
        msg: err.response?.data?.error || "Error creating/updating profile",
      }
    }
  }

  // Add platform
  const addPlatform = async (platformData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      console.log("Adding platform:", platformData)
      const res = await axios.post("/api/profiles/platform", platformData, config)
      console.log("Platform response:", res.data)

      dispatch({
        type: "UPDATE_PROFILE",
        payload: res.data.data,
      })

      return {
        success: true,
        msg: "Platform Added",
      }
    } catch (err) {
      console.error("Error adding platform:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error adding platform",
      })

      return {
        success: false,
        msg: err.response?.data?.error || "Error adding platform",
      }
    }
  }

  // Delete platform
  const deletePlatform = async (id) => {
    try {
      const res = await axios.delete(`/api/profiles/platform/${id}`)

      dispatch({
        type: "UPDATE_PROFILE",
        payload: res.data.data,
      })

      return {
        success: true,
        msg: "Platform Removed",
      }
    } catch (err) {
      console.error("Error deleting platform:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error removing platform",
      })

      return {
        success: false,
        msg: err.response?.data?.error || "Error removing platform",
      }
    }
  }

  // Get GitHub stats
  const getGithubStats = async () => {
    try {
      dispatch({ type: "SET_LOADING" })
      const res = await axios.get("/api/github/stats")

      dispatch({
        type: "GET_GITHUB_STATS",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching GitHub stats:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching GitHub stats",
      })
    }
  }

  // Get Medium articles
  const getMediumArticles = async () => {
    try {
      dispatch({ type: "SET_LOADING" })
      const res = await axios.get("/api/medium/articles")

      dispatch({
        type: "GET_MEDIUM_ARTICLES",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching Medium articles:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching Medium articles",
      })
    }
  }

  // Get LeetCode stats
  const getLeetcodeStats = async () => {
    try {
      dispatch({ type: "SET_LOADING" })
      console.log("Fetching LeetCode stats...")
      const res = await axios.get("/api/leetcode/stats")
      console.log("LeetCode response:", res.data)

      dispatch({
        type: "GET_LEETCODE_STATS",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching LeetCode stats:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching LeetCode stats",
      })
    }
  }

  // Get HackerRank stats
  const getHackerrankStats = async () => {
    try {
      dispatch({ type: "SET_LOADING" })
      const res = await axios.get("/api/hackerrank/stats")

      dispatch({
        type: "GET_HACKERRANK_STATS",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching HackerRank stats:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching HackerRank stats",
      })
    }
  }

  // Get LinkedIn profile
  const getLinkedinProfile = async () => {
    try {
      dispatch({ type: "SET_LOADING" })
      const res = await axios.get("/api/linkedin/profile")

      dispatch({
        type: "GET_LINKEDIN_PROFILE",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching LinkedIn profile:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching LinkedIn profile",
      })
    }
  }

  // Get Twitter tweets
  const getTwitterTweets = async () => {
    try {
      dispatch({ type: "SET_LOADING" })
      const res = await axios.get("/api/twitter/tweets")

      dispatch({
        type: "GET_TWITTER_TWEETS",
        payload: res.data.data,
      })
    } catch (err) {
      console.error("Error fetching Twitter tweets:", err)
      dispatch({
        type: "PROFILE_ERROR",
        payload: err.response?.data?.error || "Error fetching Twitter tweets",
      })
    }
  }

  // Clear profile
  const clearProfile = () => dispatch({ type: "CLEAR_PROFILE" })

  return (
    <ProfileContext.Provider
      value={{
        profile: state.profile,
        profiles: state.profiles,
        githubStats: state.githubStats,
        mediumArticles: state.mediumArticles,
        leetcodeStats: state.leetcodeStats,
        hackerrankStats: state.hackerrankStats,
        linkedinProfile: state.linkedinProfile,
        twitterTweets: state.twitterTweets,
        loading: state.loading,
        error: state.error,
        getCurrentProfile,
        getProfiles,
        getProfileById,
        createProfile,
        addPlatform,
        deletePlatform,
        getGithubStats,
        getMediumArticles,
        getLeetcodeStats,
        getHackerrankStats,
        getLinkedinProfile,
        getTwitterTweets,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
