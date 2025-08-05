"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/auth/AuthContext"
import Spinner from "../components/layout/Spinner"
import { toast } from "react-toastify"

const Register = () => {
  const { register, isAuthenticated, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const { name, email, password, password2 } = formData

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error("Passwords do not match")
      return
    }

    setSubmitting(true)

    const success = await register({
      name,
      email,
      password,
    })

    setSubmitting(false)

    if (success) {
      navigate("/dashboard")
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      <p className="text-center mb-6">Create your DevLinker account</p>

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
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            minLength="6"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password2">
            Confirm Password
          </label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            minLength="6"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}

export default Register
