import { useNavigate } from "react-router-dom"
import { useFirebase } from "../context/firebase"
import { useEffect, useState } from "react"

const Home = () => {
  const navigate = useNavigate()
  const firebase = useFirebase()
  const [user,setUser] = useState(false)
  
  useEffect(()=>{
    if(firebase.isLoggedIn) setUser(true)
    else setUser(false)
  },[firebase,navigate])

  return (
    <div>
      <main className="p-5 flex flex-col md:flex-row md:items-center gap-y-3 w-full min-h-[calc(100vh-64px)]">
        <div className="md:w-1/2 md:p-5 flex flex-col gap-y-5">
          <h1 className="text-4xl md:text-6xl font-bold mt-5">Take Control of Your Pantry</h1>
          <p className="text-xl md:text-2xl text-gray-700">Pantry Pro is the ultimate solution for managing your kitchen inventory, tracking expiration dates, and discovering new recipes.</p>
          <div className="md:flex gap-x-3">
           {!user && <button onClick={()=>navigate('/signup')} className="w-full md:w-1/3 lg:w-1/5 bg-c4 p-2 text-xl font-semibold rounded-lg shadow-lg my-2">Sign Up</button>}
           {user && <button onClick={()=>navigate('/items')} className="w-full md:w-1/3 lg:w-1/5 bg-c4 p-2 text-xl font-semibold rounded-lg shadow-lg my-2">Items</button>}
            <button className="w-full md:w-1/2 lg:w-1/3 bg-c2 p-2 text-xl font-semibold rounded-lg shadow-lg my-2 hover:bg-c1">Download App</button>
          </div>
        </div>
          <img src="photo.jpeg" alt="img" className="rounded-lg shadow-lg my-3 md:w-1/2 md:h-5/6" />
      </main>
      <footer className="h-16 md:h-20 bg-c2 flex justify-between items-center px-5 text-sm md:text-base border-t border-black">
        <div>© 2024 Pantry Pro. All rights reserved.</div>
        <div className="flex  md:gap-x-6 ">
          <p>Terms of Service</p>
          <p>Privacy</p>
        </div>
      </footer>
    </div>

  )
}

export default Home
