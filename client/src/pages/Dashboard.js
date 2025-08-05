"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/auth/AuthContext"
import { ProfileContext } from "../context/profile/ProfileContext"
import Spinner from "../components/layout/Spinner"
import DashboardActions from "../components/dashboard/DashboardActions"
import PlatformList from "../components/dashboard/PlatformList"
import GithubStats from "../components/dashboard/GithubStats"
import MediumArticles from "../components/dashboard/MediumArticles"
import LeetcodeStats from "../components/dashboard/LeetcodeStats"
import HackerrankStats from "../components/dashboard/HackerrankStats"
import LinkedInPosts from "../components/dashboard/LinkedInPosts"
import XFeed from "../components/dashboard/XFeed"
import EnhancedAnalyticsDashboard from "../components/dashboard/EnhancedAnalyticsDashboard"
import ExternalApiConfig from "../components/dashboard/ExternalApiConfig"
import DownloadAnalytics from "../components/dashboard/DownloadAnalytics"

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const {
    profile,
    loading: profileLoading,
    getCurrentProfile,
    getGithubStats,
    getMediumArticles,
    getLeetcodeStats,
    getHackerrankStats,
    getLinkedinProfile,
    getTwitterTweets,
  } = useContext(ProfileContext)
  const [apiStatus, setApiStatus] = useState({
    github: { available: false, message: "Checking GitHub API..." },
    linkedin: { available: true, message: "Using public profile data" },
    x: { available: false, message: "X API requires developer credentials" },
  })

  useEffect(() => {
    getCurrentProfile()

    // Check GitHub API status
    const checkGitHubApi = async () => {
      try {
        const response = await fetch("https://api.github.com/rate_limit")
        const data = await response.json()

        if (data.resources) {
          setApiStatus((prev) => ({
            ...prev,
            github: {
              available: true,
              message: `GitHub API available (${data.resources.core.remaining}/${data.resources.core.limit} requests remaining)`,
            },
          }))
        }
      } catch (error) {
        setApiStatus((prev) => ({
          ...prev,
          github: { available: false, message: "GitHub API unavailable" },
        }))
      }
    }

    checkGitHubApi()
  }, [])

  useEffect(() => {
    if (profile) {
      const hasGithub = profile.platforms.some((p) => p.name === "GitHub")
      const hasMedium = profile.platforms.some((p) => p.name === "Medium")
      const hasLeetcode = profile.platforms.some((p) => p.name === "LeetCode")
      const hasHackerrank = profile.platforms.some((p) => p.name === "HackerRank")
      const hasLinkedin = profile.platforms.some((p) => p.name === "LinkedIn")
      const hasX = profile.platforms.some((p) => p.name === "X" || p.name === "Twitter")

      if (hasGithub) {
        getGithubStats()
      }

      if (hasMedium) {
        getMediumArticles()
      }

      if (hasLeetcode) {
        getLeetcodeStats()
      }

      if (hasHackerrank) {
        getHackerrankStats()
      }

      if (hasLinkedin) {
        getLinkedinProfile()
      }

      if (hasX) {
        getTwitterTweets()
      }
    }
  }, [profile])

  if (authLoading || profileLoading) {
    return <Spinner />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-xl mb-4">Welcome {user && user.name}</p>

      {profile ? (
        <>
          <DashboardActions />

          <div className="mt-6">
            <DownloadAnalytics />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Your Platforms</h2>
            <PlatformList platforms={profile.platforms} />
          </div>

          <div className="mt-8">
            <ExternalApiConfig />
          </div>

          <div className="mt-8">
            <EnhancedAnalyticsDashboard />
          </div>

          <div className="mt-6">
            <DownloadAnalytics />
          </div>

          {/* Social Media Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Social Media Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.platforms.some((p) => p.name === "LinkedIn") && <LinkedInPosts />}
              {profile.platforms.some((p) => p.name === "X" || p.name === "Twitter") && <XFeed />}
            </div>
          </div>

          {/* Developer Platforms Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Developer Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.platforms.some((p) => p.name === "GitHub") && <GithubStats />}
              {profile.platforms.some((p) => p.name === "Medium") && <MediumArticles />}
              {profile.platforms.some((p) => p.name === "LeetCode") && <LeetcodeStats />}
              {profile.platforms.some((p) => p.name === "HackerRank") && <HackerrankStats />}
            </div>
          </div>

          {/* API Integration Status - Moved to bottom */}
          <div className="mt-12 bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                API Integration Status
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Real-time Status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${apiStatus.github.available ? "bg-green-500" : "bg-yellow-500"} shadow-sm`}
                ></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">GitHub API</div>
                  <div className="text-xs text-gray-600">{apiStatus.github.message}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-3 h-3 rounded-full mr-3 bg-green-500 shadow-sm"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">LinkedIn</div>
                  <div className="text-xs text-gray-600">{apiStatus.linkedin.message}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-3 h-3 rounded-full mr-3 bg-yellow-500 shadow-sm"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">X (Twitter)</div>
                  <div className="text-xs text-gray-600">{apiStatus.x.message}</div>
                </div>
              </div>
            </div>

            <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
              <svg
                className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div className="text-sm font-medium text-blue-800 mb-1">Integration Notice</div>
                <div className="text-xs text-blue-700">
                  We use publicly available data from GitHub and LinkedIn profiles. Some data may be simulated if public
                  access is limited or API quotas are exceeded.
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">You haven't set up your profile yet</p>
          <Link to="/create-profile" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Profile
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
