"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ProfileContext } from "../context/profile/ProfileContext"
import { AlertContext } from "../context/alert/AlertContext"

const CreateProfile = () => {
  const { createProfile } = useContext(ProfileContext)
  const { setAlert } = useContext(AlertContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    techStack: "",
  })

  const { name, bio, location, website, techStack } = formData

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()

    // Convert techStack string to array
    const profileData = {
      ...formData,
      techStack: techStack.split(",").map((tech) => tech.trim()),
    }

    const result = await createProfile(profileData)

    if (result.success) {
      setAlert(result.msg, "success")
      navigate("/dashboard")
    } else {
      setAlert(result.msg, "danger")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Your Profile</h1>
      <p className="mb-4">Let's get some information to make your profile stand out</p>

      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="website">
            Website
          </label>
          <input
            type="text"
            id="website"
            name="website"
            value={website}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="techStack">
            Tech Stack (comma separated)
          </label>
          <input
            type="text"
            id="techStack"
            name="techStack"
            value={techStack}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="JavaScript, React, Node.js"
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Profile
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProfile
