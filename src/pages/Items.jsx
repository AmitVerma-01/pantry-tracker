import { useNavigate } from "react-router-dom"
import Item from "../components/Item"
import { useFirebase } from "../context/firebase"
import { useEffect} from "react"

function Items() {
  const firebase = useFirebase()
  const navigate = useNavigate()
  useEffect(()=>{
    if(!firebase.isLoggedIn) 
        navigate('/signup')
  },[navigate,firebase])
  return (
    <div>
      <Item/>
    </div>
  )
}

export default Items
