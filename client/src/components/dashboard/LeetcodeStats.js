"use client"

import { useContext, useEffect, useState } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import axios from "axios"

const LeetcodeStats = () => {
  const { profile } = useContext(ProfileContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      if (!profile) {
        return
      }

      const leetcodePlatform = profile.platforms?.find((p) => p.name === "LeetCode")
      if (!leetcodePlatform) {
        setError("LeetCode profile not configured")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get(`/api/leetcode/stats/${leetcodePlatform.username}`)

        if (response.data && response.data.success) {
          setStats(response.data.data)
          setLastUpdated(new Date().toLocaleString())
        } else {
          setError(response.data.error || "Failed to load LeetCode stats")
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("LeetCode profile not found. Please check your username.")
        } else if (err.response?.status === 500) {
          setError("LeetCode API is currently unavailable. Please try again later.")
        } else {
          setError("Error connecting to LeetCode API")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeetCodeStats()
  }, [profile])

  const refreshStats = async () => {
    if (!profile) return

    const leetcodePlatform = profile.platforms?.find((p) => p.name === "LeetCode")
    if (!leetcodePlatform) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/api/leetcode/stats/${leetcodePlatform.username}`)
      if (response.data && response.data.success) {
        setStats(response.data.data)
        setLastUpdated(new Date().toLocaleString())
      }
    } catch (err) {
      setError("Failed to refresh data")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">LeetCode Stats</h3>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">LeetCode Stats</h3>
          <button
            onClick={refreshStats}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Retry"}
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 mb-2">{error}</p>
          <p className="text-sm text-red-600">
            Make sure your LeetCode username is correct and your profile is public.
          </p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">LeetCode Stats</h3>
        <p className="text-gray-500">Add your LeetCode profile to see stats here.</p>
      </div>
    )
  }

  const formatNumber = (num) => {
    if (num === "N/A" || num === null || num === undefined) return "N/A"
    return typeof num === "number" ? num.toLocaleString() : num
  }

  const getProgressWidth = (solved, total = 100) => {
    if (!solved || solved === 0) return 0
    return Math.min((solved / total) * 100, 100)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">LeetCode Stats</h3>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>}
          <button
            onClick={refreshStats}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg">
          <p className="text-sm text-green-700">Total Solved</p>
          <p className="text-2xl font-bold text-green-800">{formatNumber(stats.problemsSolved?.total || 0)}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-700">Ranking</p>
          <p className="text-2xl font-bold text-blue-800">
            {stats.profile?.ranking ? `#${formatNumber(stats.profile.ranking)}` : "N/A"}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg">
          <p className="text-sm text-purple-700">Contest Rating</p>
          <p className="text-2xl font-bold text-purple-800">{formatNumber(stats.contestStats?.rating || "N/A")}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
          <p className="text-sm text-orange-700">Contests Attended</p>
          <p className="text-2xl font-bold text-orange-800">
            {formatNumber(stats.contestStats?.attendedContestsCount || 0)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-3">Problem Solving Breakdown</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm font-medium">Easy</span>
            </div>
            <span className="text-sm font-bold">{stats.problemsSolved?.easy || 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressWidth(stats.problemsSolved?.easy, 50)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm font-medium">Medium</span>
            </div>
            <span className="text-sm font-bold">{stats.problemsSolved?.medium || 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressWidth(stats.problemsSolved?.medium, 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm font-medium">Hard</span>
            </div>
            <span className="text-sm font-bold">{stats.problemsSolved?.hard || 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressWidth(stats.problemsSolved?.hard, 50)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {stats.additionalStats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Acceptance Rate</p>
            <p className="text-lg font-bold">{formatNumber(stats.additionalStats.acceptanceRate)}%</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Contribution Points</p>
            <p className="text-lg font-bold">{formatNumber(stats.additionalStats.contributionPoints)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeetcodeStats
