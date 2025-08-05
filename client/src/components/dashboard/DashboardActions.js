"use client"

import { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { ProfileContext } from "../../context/profile/ProfileContext"
import { toast } from "react-toastify"
import axios from "axios"

const DashboardActions = () => {
  const { profile, addPlatform } = useContext(ProfileContext)
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddPlatform, setShowAddPlatform] = useState(false)
  const [useCustomUrl, setUseCustomUrl] = useState(false)
  const [platformData, setPlatformData] = useState({
    name: "",
    username: "",
    url: "",
  })

  useEffect(() => {
    // Fetch available platforms
    const fetchPlatforms = async () => {
      setLoading(true)
      try {
        const response = await axios.get("/api/platforms")
        console.log("Platforms response:", response.data)

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setPlatforms(response.data.data)
        } else {
          console.error("Invalid platforms data format:", response.data)
          toast.error("Failed to load platforms: Invalid data format")
        }
      } catch (err) {
        console.error("Error fetching platforms:", err)
        toast.error("Failed to load platforms")
      } finally {
        setLoading(false)
      }
    }

    fetchPlatforms()
  }, [])

  const { name, username, url } = platformData

  const onChange = (e) => {
    const { name: fieldName, value } = e.target
    setPlatformData({ ...platformData, [fieldName]: value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!name) {
      toast.error("Please select a platform")
      return
    }

    let dataToSubmit = {
      name,
      username: "",
      url: "",
    }

    if (useCustomUrl) {
      if (!url) {
        toast.error("Please provide a custom URL")
        return
      }

      // For custom URL, extract username from URL if possible
      let extractedUsername = ""
      try {
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split("/").filter(Boolean)
        extractedUsername = pathParts[0] || name.toLowerCase()
      } catch (error) {
        extractedUsername = url.split("/").filter(Boolean).pop() || name.toLowerCase()
      }

      dataToSubmit = {
        name,
        username: extractedUsername,
        url: url,
      }
    } else {
      if (!username) {
        toast.error("Please provide a username")
        return
      }

      const platform = platforms.find((p) => p.name === name)
      dataToSubmit = {
        name,
        username: username,
        url: platform ? `${platform.baseUrl}${username}` : "",
      }
    }

    console.log("Submitting platform data:", dataToSubmit)

    setLoading(true)
    try {
      const result = await addPlatform(dataToSubmit)

      if (result.success) {
        toast.success(result.msg)
        setPlatformData({
          name: "",
          username: "",
          url: "",
        })
        setShowAddPlatform(false)
        setUseCustomUrl(false)
      } else {
        toast.error(result.msg || "Failed to add platform")
      }
    } catch (error) {
      console.error("Error adding platform:", error)
      toast.error("Failed to add platform: " + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Auto-fill URL based on platform and username
  useEffect(() => {
    if (name && username && platforms.length > 0 && !useCustomUrl) {
      const platform = platforms.find((p) => p.name === name)
      if (platform) {
        setPlatformData((prev) => ({
          ...prev,
          url: `${platform.baseUrl}${username}`,
        }))
      }
    }
  }, [name, username, platforms, useCustomUrl])

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profile Actions</h2>
        <div className="flex gap-2">
          <Link to="/edit-profile" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Edit Profile
          </Link>
          <button
            onClick={() => {
              setShowAddPlatform(!showAddPlatform)
              if (showAddPlatform) {
                // Reset form when closing
                setPlatformData({ name: "", username: "", url: "" })
                setUseCustomUrl(false)
              }
            }}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            {showAddPlatform ? "Cancel" : "Add Platform"}
          </button>
        </div>
      </div>

      {showAddPlatform && (
        <form onSubmit={onSubmit} className="border-t pt-4">
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useCustomUrl}
                onChange={(e) => setUseCustomUrl(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Use custom URL instead of auto-generated</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="name">
                Platform *
              </label>
              {loading && platforms.length === 0 ? (
                <div className="w-full px-3 py-2 border rounded flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                  <span>Loading platforms...</span>
                </div>
              ) : (
                <select
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {!useCustomUrl && (
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="username">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={onChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1" htmlFor="url">
                {useCustomUrl ? "Custom URL *" : "Generated URL"}
              </label>
              <input
                type="text"
                id="url"
                name="url"
                value={url}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded ${!useCustomUrl ? "bg-gray-50" : ""}`}
                placeholder={
                  useCustomUrl ? "https://example.com/yourprofile" : "Auto-generated based on platform and username"
                }
                readOnly={!useCustomUrl}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Adding..." : "Add Platform"}
          </button>
        </form>
      )}
    </div>
  )
}

export default DashboardActions
