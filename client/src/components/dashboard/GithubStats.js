"use client"

import { useContext, useEffect, useState } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import axios from "axios"

const GithubStats = () => {
  const { profile } = useContext(ProfileContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchGitHubStats = async () => {
      if (!profile) {
        return
      }

      const githubPlatform = profile.platforms?.find((p) => p.name === "GitHub")
      if (!githubPlatform) {
        setError("GitHub profile not configured")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        let username = githubPlatform.username
        if (username.includes("github.com/")) {
          username = username.split("github.com/")[1].replace(/\/$/, "")
        }

        const response = await axios.get(`/api/github/stats/${username}`)

        if (response.data && response.data.success) {
          setStats(response.data.data)
          setLastUpdated(new Date().toLocaleString())
        } else {
          setError(response.data.error || "Failed to load GitHub stats")
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("GitHub profile not found. Please check your username.")
        } else if (err.response?.status === 429) {
          setError("GitHub API rate limit exceeded. Please try again later.")
        } else {
          setError("Error connecting to GitHub API")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchGitHubStats()
  }, [profile])

  const refreshStats = async () => {
    if (!profile) return

    const githubPlatform = profile.platforms?.find((p) => p.name === "GitHub")
    if (!githubPlatform) return

    setIsLoading(true)
    setError(null)

    try {
      let username = githubPlatform.username
      if (username.includes("github.com/")) {
        username = username.split("github.com/")[1].replace(/\/$/, "")
      }

      const response = await axios.get(`/api/github/stats/${username}`)
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
          <h3 className="text-xl font-semibold">GitHub Stats</h3>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
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
          <h3 className="text-xl font-semibold">GitHub Stats</h3>
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
          <p className="text-sm text-red-600">Make sure your GitHub username is correct and your profile is public.</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">GitHub Stats</h3>
        <p className="text-gray-500">Add your GitHub profile to see stats here.</p>
      </div>
    )
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0"
    return num.toLocaleString()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">GitHub Stats</h3>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.stats?.public_repos)}</div>
          <div className="text-sm text-gray-600">Repositories</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.stats?.followers)}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.stats?.total_stars)}</div>
          <div className="text-sm text-gray-600">Total Stars</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.stats?.total_forks)}</div>
          <div className="text-sm text-gray-600">Total Forks</div>
        </div>
      </div>

      {stats.languages && Object.keys(stats.languages).length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Top Languages</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(stats.languages)
              .slice(0, 6)
              .map(([language, count]) => (
                <div key={language} className="bg-blue-50 rounded-lg p-2 text-center">
                  <div className="text-sm font-medium text-blue-800">{language}</div>
                  <div className="text-xs text-blue-600">{count} repos</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {stats.topRepositories && stats.topRepositories.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Top Repositories</h4>
          <div className="space-y-3">
            {stats.topRepositories.slice(0, 3).map((repo, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {repo.name}
                  </a>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>⭐ {repo.stars}</span>
                    <span>🍴 {repo.forks}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{repo.description || "No description available"}</p>
                {repo.language && (
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {repo.language}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GithubStats
