"use client"

import { useContext, useEffect, useState } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import Spinner from "../layout/Spinner"
import axios from "axios"

const LinkedInPosts = () => {
  const { profile } = useContext(ProfileContext)
  const [linkedinData, setLinkedinData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLinkedInData = async () => {
      if (profile) {
        const linkedinPlatform = profile.platforms.find((p) => p.name === "LinkedIn")
        if (linkedinPlatform) {
          try {
            setLoading(true)
            const res = await axios.get("/api/linkedin/profile")

            if (res.data.success === false && res.data.apiSetup) {
              setError({
                message: res.data.message,
                apiSetup: res.data.apiSetup,
              })
            } else if (res.data.success && res.data.data) {
              setLinkedinData(res.data.data)
            } else {
              setError({
                message: "Failed to fetch LinkedIn data",
                apiSetup: { required: true, platform: "LinkedIn" },
              })
            }
          } catch (err) {
            console.error("Error fetching LinkedIn data:", err)
            setError({
              message: "LinkedIn API integration required",
              apiSetup: {
                required: true,
                platform: "LinkedIn",
                description: "LinkedIn requires official API credentials for data access",
              },
            })
          } finally {
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      }
    }

    fetchLinkedInData()
  }, [profile])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">LinkedIn Activity</h3>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">LinkedIn Profile</h4>
          <p className="text-blue-700 mb-4">
            LinkedIn doesn't provide a public API for profile data. Please visit the profile directly.
          </p>

          {profile && profile.platforms.find((p) => p.name === "LinkedIn") && (
            <a
              href={profile.platforms.find((p) => p.name === "LinkedIn").url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              View LinkedIn Profile
            </a>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">
            LinkedIn doesn't provide a public API for accessing profile data. To view complete profile information,
            please visit the LinkedIn profile directly.
          </p>

          {error.apiSetup && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <p className="font-medium">For advanced integration:</p>
              <ul className="list-disc pl-5 mt-1 text-xs">
                <li>Use the External API Configuration feature</li>
                <li>Configure your LinkedIn API credentials</li>
                <li>Enable automated data fetching</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!linkedinData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">LinkedIn Activity</h3>
        <p>Add your LinkedIn profile to see your activity here.</p>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">LinkedIn Activity</h3>

      {/* Profile Summary */}
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">{linkedinData.name}</h4>
        <p className="text-sm text-blue-700 mb-2">{linkedinData.headline}</p>
        <p className="text-sm text-blue-600 mb-3">{linkedinData.location}</p>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-800">{linkedinData.connections}</p>
            <p className="text-xs text-blue-600">Connections</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-800">{linkedinData.followers}</p>
            <p className="text-xs text-blue-600">Followers</p>
          </div>
        </div>

        <a
          href={linkedinData.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
        >
          View LinkedIn Profile
        </a>
      </div>

      {/* Experience */}
      {linkedinData.experience && linkedinData.experience.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Experience</h4>
          {linkedinData.experience.map((exp, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded mb-2">
              <p className="font-medium">{exp.title}</p>
              <p className="text-sm text-gray-600">{exp.company}</p>
              <p className="text-xs text-gray-500">
                {exp.duration} {exp.current && "(Current)"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {linkedinData.skills && linkedinData.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {linkedinData.skills.slice(0, 10).map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      <h4 className="font-semibold mb-2">Recent Posts</h4>
      {linkedinData.recentPosts && linkedinData.recentPosts.length > 0 ? (
        <div className="space-y-3">
          {linkedinData.recentPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-3">
              <p className="mb-2 text-sm">{post.content}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{formatDate(post.date)}</span>
                <div className="flex space-x-3">
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              </div>
              <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {post.type === "article" ? "Article" : "Post"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">No recent posts available.</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">Data source: {linkedinData.dataSource}</div>
    </div>
  )
}

export default LinkedInPosts
