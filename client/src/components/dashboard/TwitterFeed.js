"use client"

import { useContext, useEffect, useState } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import Spinner from "../layout/Spinner"
import axios from "axios"

const XFeed = () => {
  const { profile } = useContext(ProfileContext)
  const [xData, setXData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchXData = async () => {
      if (profile) {
        const xPlatform = profile.platforms.find((p) => p.name === "X (Twitter)")
        if (xPlatform) {
          try {
            setLoading(true)
            const res = await axios.get("/api/twitter/tweets")

            if (res.data.success) {
              setXData(res.data.data)
            } else {
              setError({
                message: res.data.message || "Failed to fetch X data",
                details: res.data.requiredSetup || res.data.alternatives || [],
              })
            }
          } catch (err) {
            console.error("Error fetching X data:", err)
            setError({
              message: "Failed to connect to X API",
              details: ["X API integration requires developer credentials"],
            })
          } finally {
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      }
    }

    fetchXData()
  }, [profile])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">X (Twitter) Activity</h3>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="font-medium text-yellow-800 mb-2">{error.message}</p>
          {error.details && error.details.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-yellow-700">
              {error.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <p className="text-gray-600">
            X (formerly Twitter) requires developer credentials to access its API. To integrate with X:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>Register an X Developer account</li>
            <li>Create an X Developer application</li>
            <li>Configure API keys and access tokens</li>
            <li>Implement OAuth authentication</li>
          </ul>
          <p className="mt-2 text-gray-600">
            For now, you can manually add your X profile URL to your DevLink profile.
          </p>
        </div>
      </div>
    )
  }

  if (!xData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">X (Twitter) Activity</h3>
        <p>Add your X profile to see your activity here.</p>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">X (Twitter) Activity</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Followers</p>
          <p className="text-xl font-bold">{xData.profileSummary?.followers || "N/A"}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Following</p>
          <p className="text-xl font-bold">{xData.profileSummary?.following || "N/A"}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Total Posts</p>
          <p className="text-xl font-bold">{xData.profileSummary?.totalTweets || "N/A"}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Impressions</p>
          <p className="text-xl font-bold">{xData.profileSummary?.impressions || "N/A"}</p>
        </div>
      </div>

      <h4 className="font-semibold mb-2">Recent Posts</h4>
      {xData.tweets && xData.tweets.length > 0 ? (
        <div className="space-y-3">
          {xData.tweets.map((tweet) => (
            <div key={tweet.id} className="border rounded-lg p-3">
              <p className="mb-2">{tweet.content}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{formatDate(tweet.date)}</span>
                <div className="flex space-x-3">
                  <span>❤️ {tweet.likes}</span>
                  <span>🔄 {tweet.retweets}</span>
                  <span>💬 {tweet.replies}</span>
                </div>
              </div>

              {tweet.recentReplies && tweet.recentReplies.length > 0 && (
                <div className="mt-3 border-t pt-2">
                  <p className="text-sm font-medium mb-1">Recent Replies:</p>
                  {tweet.recentReplies.map((reply, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded mb-1 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">@{reply.username}</span>
                        <span className="text-xs text-gray-500">{formatDate(reply.date)}</span>
                      </div>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-md">
          <p>No posts available. X API integration requires developer credentials.</p>
        </div>
      )}
    </div>
  )
}

export default XFeed
