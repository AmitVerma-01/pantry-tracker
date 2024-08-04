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
    <div className="h-16 md:w-full  bg-c3 flex justify-between items-center md:px-10 px-2 shadow-lg rounded-lg">
      <h2 className="md:text-3xl font-bold">Pantry Tracker</h2>
      <div className="flex gap-x-6 font-semibold">
        <NavLink to={'/'} className={({isActive}) => isActive ? `rounded-lg md:px-3 p-1 bg-c4 shadow-lg` : "hover:bg-c4 p-1 rounded-lg"}>
          Home
        </NavLink>
        <NavLink to={'/items'} className={({isActive}) => isActive ? `rounded-lg md:px-3 p-1 bg-c4 shadow-lg` : "hover:bg-c4 p-1 rounded-lg"}>
          Items
        </NavLink>
        {!user ? <button className="hover:bg-c4 p-1 rounded-lg" onClick={() => navigate('/signup')}>
          LogIn
        </button> : <button className="hover:bg-c4 p-1 rounded-lg" onClick={(e) => {
            e.preventDefault()
            firebase.logOut()
            navigate('/signup')
          }}>
          LogOut
        </button> }
      </div>
    </div>
  )
}

export default Navbar
