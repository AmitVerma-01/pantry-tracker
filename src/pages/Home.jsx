import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Home = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8 lg:p-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-8 w-full bg-gradient-to-br from-c1 via-white to-c2">
        <div className="md:w-1/2 flex flex-col gap-y-5 md:gap-y-6 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 text-gray-800 leading-tight">
            Take Control of Your Pantry
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
            Pantry Pro is the ultimate solution for managing your kitchen inventory and discovering new recipes with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {!isLoggedIn && (
              <>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="w-full sm:w-auto px-6 py-3 bg-c4 text-white text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-smooth hover-lift active:scale-95"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => navigate('/signin')} 
                  className="w-full sm:w-auto px-6 py-3 bg-c2 text-gray-800 text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:bg-c1 hover:shadow-xl transition-smooth hover-lift active:scale-95"
                >
                  Sign In
                </button>
              </>
            )}
            {isLoggedIn && (
              <button 
                onClick={() => navigate('/items')} 
                className="w-full sm:w-auto px-6 py-3 bg-c4 text-white text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-smooth hover-lift active:scale-95"
              >
                View Items
              </button>
            )}
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center items-center animate-fade-in">
          <img 
            src="photo.jpeg" 
            alt="Pantry management illustration" 
            className="rounded-lg shadow-2xl w-full max-w-lg hover:shadow-3xl transition-shadow duration-300 object-cover" 
          />
        </div>
      </main>
      <footer className="h-auto md:h-20 bg-c2 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 md:py-0 text-xs sm:text-sm md:text-base border-t-2 border-c4">
        <div className="text-gray-700 mb-2 md:mb-0">© 2024 Pantry Pro. All rights reserved.</div>
        <div className="flex gap-x-4 md:gap-x-6 text-gray-700">
          <span className="text-gray-500">Terms of Service</span>
          <span className="text-gray-500">Privacy</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
