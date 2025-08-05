"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/auth/AuthContext"
import Spinner from "../components/layout/Spinner"

const Login = () => {
  const { login, isAuthenticated, loading, error } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const { email, password } = formData

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
    }

    // Clear form error when auth context error changes
    if (error) {
      setFormError(error)
    }
  }, [isAuthenticated, navigate, error])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!email || !password) {
      setFormError("Please provide both email and password")
      return
    }

    setSubmitting(true)

    try {
      const success = await login({
        email,
        password,
      })

      if (success) {
        navigate("/dashboard")
      } else {
        setFormError("Login failed. Please check your credentials and try again.")
      }
    } catch (err) {
      setFormError("Login failed. Please check your credentials and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      <p className="text-center mb-6">Log in to your DevLink account</p>

      {formError && <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mb-4">{formError}</div>}

      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
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

        <div className="mb-6">
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
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default Login
