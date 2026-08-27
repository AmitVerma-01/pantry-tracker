import { useNavigate } from "react-router-dom"
import Item from "../components/Item"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"
import LoadingSpinner from "../components/common/LoadingSpinner"

function Items() {
  const { isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/signin')
    }
  }, [navigate, isLoggedIn, loading])

  if (loading) {
    return (
      <div className="page-bg flex min-h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner variant="inline" size="lg" text="Loading your pantry..." />
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div>
      <Item />
    </div>
  )
}

export default Items
