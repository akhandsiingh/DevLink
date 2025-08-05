"use client"

import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ProfileContext } from "../context/profile/ProfileContext"
import Spinner from "../components/layout/Spinner"
import axios from "axios"

const Profile = () => {
  const { id } = useParams()
  const { getProfileById, profile, loading } = useContext(ProfileContext)
  const [githubStats, setGithubStats] = useState(null)
  const [mediumArticles, setMediumArticles] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [leetcodeStats, setLeetcodeStats] = useState(null)
  const [hackerrankStats, setHackerrankStats] = useState(null)
  const [linkedinData, setLinkedinData] = useState(null)
  const [twitterData, setTwitterData] = useState(null)

  useEffect(() => {
    getProfileById(id)
  }, [id])

  useEffect(() => {
    const fetchPlatformData = async () => {
      if (profile && profile.platforms.length > 0) {
        setLoadingStats(true)

        // Find platforms
        const githubPlatform = profile.platforms.find((p) => p.name === "GitHub")
        const mediumPlatform = profile.platforms.find((p) => p.name === "Medium")
        const leetcodePlatform = profile.platforms.find((p) => p.name === "LeetCode")
        const hackerrankPlatform = profile.platforms.find((p) => p.name === "HackerRank")
        const linkedinPlatform = profile.platforms.find((p) => p.name === "LinkedIn")
        const twitterPlatform = profile.platforms.find((p) => p.name === "Twitter")

        // Fetch GitHub stats if available
        if (githubPlatform) {
          try {
            const res = await axios.get(`/api/github/stats/${githubPlatform.username}`)
            setGithubStats(res.data.data)
          } catch (err) {
            console.error("Error fetching GitHub stats:", err)
          }
        }

        // Fetch Medium articles if available
        if (mediumPlatform) {
          try {
            const res = await axios.get(`/api/medium/articles/${mediumPlatform.username}`)
            setMediumArticles(res.data.data)
          } catch (err) {
            console.error("Error fetching Medium articles:", err)
          }
        }

        // Fetch LeetCode stats if available
        if (leetcodePlatform) {
          try {
            const res = await axios.get(`/api/leetcode/stats/${leetcodePlatform.username}`)
            setLeetcodeStats(res.data.data)
          } catch (err) {
            console.error("Error fetching LeetCode stats:", err)
          }
        }

        // Fetch HackerRank stats if available
        if (hackerrankPlatform) {
          try {
            const res = await axios.get(`/api/hackerrank/stats/${hackerrankPlatform.username}`)
            setHackerrankStats(res.data.data)
          } catch (err) {
            console.error("Error fetching HackerRank stats:", err)
          }
        }

        // Fetch LinkedIn data if available
        if (linkedinPlatform) {
          try {
            const res = await axios.get(`/api/linkedin/posts/${linkedinPlatform.username}`)
            setLinkedinData(res.data.data)
          } catch (err) {
            console.error("Error fetching LinkedIn data:", err)
          }
        }

        // Fetch Twitter data if available
        if (twitterPlatform) {
          try {
            const res = await axios.get(`/api/twitter/tweets/${twitterPlatform.username}`)
            setTwitterData(res.data.data)
          } catch (err) {
            console.error("Error fetching Twitter data:", err)
          }
        }

        setLoadingStats(false)
      }
    }

    fetchPlatformData()
  }, [profile])

  if (loading || !profile) {
    return <Spinner />
  }

  // Calculate platform stats
  const getPlatformStats = (platform) => {
    switch (platform.name) {
      case "GitHub":
        return githubStats
          ? {
              activeDays: githubStats.contributionHistory?.filter((day) => day.count > 0).length || 0,
              questionsSolved: "N/A",
              contributions: githubStats.contributionsLastYear || 0,
            }
          : null
      case "LeetCode":
        return leetcodeStats
          ? {
              activeDays: leetcodeStats.recentSubmissions?.length || 0,
              questionsSolved: leetcodeStats.totalSolved || 0,
              contributions: leetcodeStats.totalSolved || 0,
            }
          : null
      case "HackerRank":
        return hackerrankStats
          ? {
              activeDays: hackerrankStats.recentSubmissions?.length || 0,
              questionsSolved: hackerrankStats.problemSolving?.total || 0,
              contributions: hackerrankStats.successfulSubmissions || 0,
            }
          : null
      case "Medium":
        return mediumArticles
          ? {
              activeDays: mediumArticles.length || 0,
              questionsSolved: "N/A",
              contributions: mediumArticles.length || 0,
            }
          : null
      case "LinkedIn":
        return linkedinData
          ? {
              activeDays: linkedinData.posts?.length || 0,
              questionsSolved: "N/A",
              contributions: linkedinData.posts?.reduce((sum, post) => sum + post.interactions, 0) || 0,
              interactions: linkedinData.posts?.reduce((sum, post) => sum + post.interactions, 0) || 0,
            }
          : null
      case "Twitter":
        return twitterData
          ? {
              activeDays: twitterData.tweets?.length || 0,
              questionsSolved: "N/A",
              contributions: twitterData.tweets?.reduce((sum, tweet) => sum + tweet.engagement, 0) || 0,
              engagement: twitterData.tweets?.reduce((sum, tweet) => sum + tweet.engagement, 0) || 0,
            }
          : null
      default:
        return null
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-gray-500">
              {profile.name.charAt(0)}
            </div>
          </div>

          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            {profile.location && <p className="text-gray-600 mb-2">{profile.location}</p>}
            {profile.bio && <p className="mb-4">{profile.bio}</p>}

            {profile.website && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Website</h3>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}

            {profile.techStack.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.techStack.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {profile.platforms.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Platforms</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left">Platform</th>
                  <th className="py-2 px-4 text-left">Username</th>
                  <th className="py-2 px-4 text-left">Active Days</th>
                  <th className="py-2 px-4 text-left">Questions Solved</th>
                  <th className="py-2 px-4 text-left">Interactions</th>
                  <th className="py-2 px-4 text-left">Link</th>
                </tr>
              </thead>
              <tbody>
                {profile.platforms.map((platform) => {
                  const stats = getPlatformStats(platform)
                  return (
                    <tr key={platform._id} className="border-t">
                      <td className="py-2 px-4 font-medium">{platform.name}</td>
                      <td className="py-2 px-4">{platform.username}</td>
                      <td className="py-2 px-4">{stats ? stats.activeDays : "Loading..."}</td>
                      <td className="py-2 px-4">{stats ? stats.questionsSolved : "Loading..."}</td>
                      <td className="py-2 px-4">
                        {platform.name === "LinkedIn" || platform.name === "Twitter"
                          ? stats
                            ? platform.name === "LinkedIn"
                              ? stats.interactions
                              : stats.engagement
                            : "Loading..."
                          : stats
                            ? stats.contributions
                            : "Loading..."}
                      </td>
                      <td className="py-2 px-4">
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loadingStats ? (
        <Spinner />
      ) : (
        <>
          {/* Social Media Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Social Media Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LinkedIn Data */}
              {linkedinData && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">LinkedIn Activity</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Connections</p>
                      <p className="text-xl font-bold">{linkedinData.profileSummary.connections}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Profile Views</p>
                      <p className="text-xl font-bold">{linkedinData.profileSummary.profileViews}</p>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-2">Recent Posts</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {linkedinData.posts.slice(0, 3).map((post, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <p className="mb-2">{post.content}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{formatDate(post.date)}</span>
                          <div className="flex space-x-3">
                            <span>👍 {post.likes}</span>
                            <span>💬 {post.comments}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Twitter Data */}
              {twitterData && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Twitter Activity</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Followers</p>
                      <p className="text-xl font-bold">{twitterData.profileSummary.followers}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Following</p>
                      <p className="text-xl font-bold">{twitterData.profileSummary.following}</p>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-2">Recent Tweets</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {twitterData.tweets.slice(0, 3).map((tweet, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <p className="mb-2">{tweet.content}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{formatDate(tweet.date)}</span>
                          <div className="flex space-x-3">
                            <span>❤️ {tweet.likes}</span>
                            <span>🔄 {tweet.retweets}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Developer Platforms Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GitHub Stats */}
            {githubStats && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">GitHub Stats</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="text-xl font-bold">{githubStats.followers}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Following</p>
                    <p className="text-xl font-bold">{githubStats.following}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Public Repos</p>
                    <p className="text-xl font-bold">{githubStats.publicRepos}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Public Gists</p>
                    <p className="text-xl font-bold">{githubStats.publicGists}</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-2">Top Repositories</h4>
                <ul className="divide-y">
                  {githubStats.topRepos.map((repo) => (
                    <li key={repo.name} className="py-2">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {repo.name}
                      </a>
                      <p className="text-sm text-gray-600">{repo.description}</p>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span>⭐ {repo.stars}</span>
                        <span>🍴 {repo.forks}</span>
                        {repo.language && <span>{repo.language}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Medium Articles */}
            {mediumArticles && mediumArticles.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Medium Articles</h3>

                <ul className="divide-y">
                  {mediumArticles.map((article, index) => (
                    <li key={index} className="py-3">
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {article.title}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">{new Date(article.pubDate).toLocaleDateString()}</p>
                      <p className="text-sm mt-1">{article.content.substring(0, 100)}...</p>
                      {article.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {article.categories.map((category, i) => (
                            <span key={i} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* LeetCode Stats */}
            {leetcodeStats && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">LeetCode Stats</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Solved</p>
                    <p className="text-xl font-bold">{leetcodeStats.totalSolved}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Ranking</p>
                    <p className="text-xl font-bold">{leetcodeStats.ranking || "N/A"}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Problem Solving</h4>
                  <div className="flex items-center mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${(leetcodeStats.easySolved / (leetcodeStats.totalSolved || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">Easy: {leetcodeStats.easySolved}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-yellow-500 h-4 rounded-full"
                        style={{ width: `${(leetcodeStats.mediumSolved / (leetcodeStats.totalSolved || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">Medium: {leetcodeStats.mediumSolved}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-red-500 h-4 rounded-full"
                        style={{ width: `${(leetcodeStats.hardSolved / (leetcodeStats.totalSolved || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">Hard: {leetcodeStats.hardSolved}</span>
                  </div>
                </div>
              </div>
            )}

            {/* HackerRank Stats */}
            {hackerrankStats && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">HackerRank Stats</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-xl font-bold">{hackerrankStats.totalSubmissions}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-600">Successful Submissions</p>
                    <p className="text-xl font-bold">{hackerrankStats.successfulSubmissions}</p>
                  </div>
                </div>

                {hackerrankStats.badges && hackerrankStats.badges.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Badges</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {hackerrankStats.badges.map((badge, index) => (
                        <div key={index} className="bg-gray-100 p-2 rounded">
                          <p className="text-sm font-medium">{badge.name}</p>
                          <div className="flex mt-1">
                            {[...Array(badge.stars)].map((_, i) => (
                              <span key={i} className="text-yellow-500">
                                ★
                              </span>
                            ))}
                            {[...Array(5 - badge.stars)].map((_, i) => (
                              <span key={i} className="text-gray-300">
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
