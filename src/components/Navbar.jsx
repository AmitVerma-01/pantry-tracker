import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

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
    <nav className="h-16 w-full bg-c3 flex justify-between items-center px-4 md:px-10 shadow-lg rounded-lg sticky top-0 z-50 transition-smooth">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 hover:text-c4 transition-colors cursor-default">
        Pantry Tracker
      </h2>
      <div className="flex gap-x-3 md:gap-x-6 font-semibold text-sm md:text-base">
        <NavLink 
          to={'/'} 
          className={({isActive}) => 
            `rounded-lg px-2 md:px-3 py-1 transition-smooth ${
              isActive 
                ? 'bg-c4 shadow-md text-white' 
                : 'hover:bg-c4 hover:shadow-md hover:text-white active:scale-95'
            }`
          }
        >
          Home
        </NavLink>
        {isLoggedIn && (
          <NavLink 
            to={'/items'} 
            className={({isActive}) => 
              `rounded-lg px-2 md:px-3 py-1 transition-smooth ${
                isActive 
                  ? 'bg-c4 shadow-md text-white' 
                  : 'hover:bg-c4 hover:shadow-md hover:text-white active:scale-95'
              }`
            }
          >
            Items
          </NavLink>
        )}
        {!isLoggedIn ? (
          <>
            <button 
              className="hover:bg-c4 hover:shadow-md hover:text-white px-2 md:px-3 py-1 rounded-lg transition-smooth active:scale-95" 
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
            <button 
              className="hover:bg-c4 hover:shadow-md hover:text-white px-2 md:px-3 py-1 rounded-lg transition-smooth active:scale-95" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <button 
            className="hover:bg-c4 hover:shadow-md hover:text-white px-2 md:px-3 py-1 rounded-lg transition-smooth active:scale-95" 
            onClick={handleSignOut}
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
