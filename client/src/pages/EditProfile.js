"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ProfileContext } from "../context/profile/ProfileContext"
import { AuthContext } from "../context/auth/AuthContext"

const EditProfile = () => {
  const navigate = useNavigate()
  const { profile, updateProfile, getCurrentProfile } = useContext(ProfileContext)
  const { user } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  })

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
  } = formData

  useEffect(() => {
    getCurrentProfile()

    if (profile) {
      setFormData({
        company: profile.company || "",
        website: profile.website || "",
        location: profile.location || "",
        status: profile.status || "",
        skills: profile.skills ? profile.skills.join(", ") : "",
        githubusername: profile.githubusername || "",
        bio: profile.bio || "",
        twitter: profile.social?.twitter || "",
        facebook: profile.social?.facebook || "",
        linkedin: profile.social?.linkedin || "",
        youtube: profile.social?.youtube || "",
        instagram: profile.social?.instagram || "",
      })
    }
  }, [getCurrentProfile, profile])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData, navigate, true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your Profile</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Professional Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Status *</label>
              <select
                name="status"
                value={status}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Professional Status</option>
                <option value="Developer">Developer</option>
                <option value="Junior Developer">Junior Developer</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Manager">Manager</option>
                <option value="Student or Learning">Student or Learning</option>
                <option value="Instructor">Instructor or Teacher</option>
                <option value="Intern">Intern</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={company}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={website}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={location}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills *</label>
            <input
              type="text"
              name="skills"
              value={skills}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="JavaScript, Python, React, Node.js (comma separated)"
            />
            <p className="text-sm text-gray-500 mt-1">Please use comma separated values</p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Username</label>
            <input
              type="text"
              name="githubusername"
              value={githubusername}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="GitHub username"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={bio}
              onChange={onChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us a little about yourself"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <p className="text-gray-600 mb-4">Add your social network links (optional)</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
              <input
                type="url"
                name="twitter"
                value={twitter}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={linkedin}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
              <input
                type="url"
                name="facebook"
                value={facebook}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
              <input
                type="url"
                name="youtube"
                value={youtube}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/channel/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={instagram}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
