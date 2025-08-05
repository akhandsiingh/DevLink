"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/auth/AuthContext"
import { ProfileContext } from "../../context/profile/ProfileContext"

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext)
  const { clearProfile } = useContext(ProfileContext)
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    clearProfile()
    // Redirect to home page after logout
    navigate("/")
  }

  const authLinks = (
    <ul className="flex space-x-4">
      <li>
        <Link to="/profiles" className="hover:text-blue-600">
          Developers
        </Link>
      </li>
      <li>
        <Link to="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>
      </li>
      <li>
        <button onClick={onLogout} className="hover:text-blue-600">
          <span className="hide-sm">Logout</span>
        </button>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className="flex space-x-4">
      <li>
        <Link to="/profiles" className="hover:text-blue-600">
          Developers
        </Link>
      </li>
      <li>
        <Link to="/register" className="hover:text-blue-600">
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="hover:text-blue-600">
          Login
        </Link>
      </li>
    </ul>
  )

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          <i className="fas fa-code"></i> DevLink
        </Link>
        <div>{isAuthenticated ? authLinks : guestLinks}</div>
      </div>
    </nav>
  )
}

export default Navbar
