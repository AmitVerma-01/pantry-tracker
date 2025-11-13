import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useFirebase } from "../context/firebase"

const Navbar = () => {
  const firebase = useFirebase()
  const navigate = useNavigate()
  const [user, setUser] = useState(false)
  useEffect(()=>{
    if(firebase.isLoggedIn) setUser(true)
    else {
      setUser(false)
    }
  },[navigate,firebase])

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
        {!user ? (
          <button 
            className="hover:bg-c4 hover:shadow-md hover:text-white px-2 md:px-3 py-1 rounded-lg transition-smooth active:scale-95" 
            onClick={() => navigate('/signup')}
          >
            LogIn
          </button>
        ) : (
          <button 
            className="hover:bg-c4 hover:shadow-md hover:text-white px-2 md:px-3 py-1 rounded-lg transition-smooth active:scale-95" 
            onClick={(e) => {
              e.preventDefault()
              firebase.logOut()
              navigate('/signup')
            }}
          >
            LogOut
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
