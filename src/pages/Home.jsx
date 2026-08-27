import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const features = [
  {
    icon: "📦",
    title: "Track Inventory",
    desc: "Add, edit, and organize everything in your pantry in one place."
  },
  {
    icon: "🍳",
    title: "AI Recipes",
    desc: "Select ingredients and get custom recipe ideas powered by Gemini AI."
  },
  {
    icon: "⚡",
    title: "Real-time Sync",
    desc: "Your items update instantly across sessions with Firebase."
  },
  {
    icon: "🔖",
    title: "Saved Recipes",
    desc: "Previously generated recipes are cached so you never lose a good idea."
  }
]

const Home = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

        {/* Hero */}
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <div className="md:w-1/2 flex flex-col gap-y-6 animate-slide-up">
            <span className="badge w-fit">Smart kitchen management</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink leading-[1.1] tracking-tight">
              Take control of{" "}
              <span className="text-gradient">your pantry</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-lg">
              Track what you have, reduce waste, and discover delicious recipes from the ingredients already in your kitchen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {!isLoggedIn ? (
                <>
                  <button onClick={() => navigate('/signup')} className="btn-primary text-base !py-3 !px-7">
                    Get started free
                  </button>
                  <button onClick={() => navigate('/signin')} className="btn-secondary text-base !py-3 !px-7">
                    Sign in
                  </button>
                </>
              ) : (
                <button onClick={() => navigate('/items')} className="btn-primary text-base !py-3 !px-7">
                  Open my pantry →
                </button>
              )}
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-c3/40 to-c4/20 rounded-3xl blur-2xl" />
              <img
                src="photo.jpeg"
                alt="Pantry management illustration"
                className="relative rounded-3xl shadow-float w-full max-w-lg object-cover border-4 border-white/80 animate-float"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
          <div className="text-center mb-10 animate-slide-up">
            <h2 className="section-title mb-2">Everything you need</h2>
            <p className="section-subtitle">Built for home cooks who want less guesswork and more great meals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card p-5 md:p-6 hover:shadow-card hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-bold text-ink mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-c3 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-5 text-sm text-ink-muted gap-2">
          <span>© 2024 Pantry Pro. All rights reserved.</span>
          <div className="flex gap-6 text-ink-faint">
            <span>Terms of Service</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
