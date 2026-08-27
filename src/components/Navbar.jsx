import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const navLinkClass = ({ isActive }) =>
  `tab-pill text-sm ${isActive ? 'tab-pill-active' : 'tab-pill-inactive'}`

const Navbar = () => {
  const { isLoggedIn, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async (e) => {
    e.preventDefault()
    try {
      await signOut()
      navigate('/signin')
    } catch {
      // Error handled by auth context
    }
  }

  return (
    <nav className="h-16 w-full glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 md:px-8">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-c4 to-c5 text-white text-lg shadow-soft group-hover:shadow-card transition-shadow">
            🥫
          </span>
          <span className="text-lg md:text-xl font-bold text-ink group-hover:text-c5 transition-colors">
            Pantry Tracker
          </span>
        </NavLink>

        <div className="flex items-center gap-1.5 md:gap-2">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          {isLoggedIn && (
            <NavLink to="/items" className={navLinkClass}>Pantry</NavLink>
          )}
          {!isLoggedIn ? (
            <>
              <button className="btn-ghost text-sm" onClick={() => navigate('/signin')}>
                Sign In
              </button>
              <button className="btn-primary text-sm !py-2 !px-4" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </>
          ) : (
            <button className="btn-ghost text-sm" onClick={handleSignOut}>
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
