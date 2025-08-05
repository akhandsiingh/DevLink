"use client"

import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { ProfileContext } from "../context/profile/ProfileContext"
import Spinner from "../components/layout/Spinner"

const Profiles = () => {
  const { profiles, loading, getProfiles } = useContext(ProfileContext)

  useEffect(() => {
    getProfiles()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Developer Profiles</h1>
      <p className="mb-8">Browse and connect with developers from around the world</p>

      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {profiles.map((profile) => (
            <div key={profile._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-gray-500">
                  {profile.name.charAt(0)}
                </div>
              </div>

              <div className="md:w-3/4">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                {profile.location && <p className="text-gray-600 mb-2">{profile.location}</p>}
                {profile.bio && <p className="mb-4">{profile.bio}</p>}

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

                {profile.platforms.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.platforms.map((platform) => (
                        <a
                          key={platform._id}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                        >
                          {platform.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to={`/profile/${profile._id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-xl">No profiles found</p>
          <p className="mt-2">Be the first to create a profile!</p>
          <Link to="/register" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  )
}

export default Profiles
