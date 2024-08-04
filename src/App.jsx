import Navbar from "./components/Navbar"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Items from "./pages/Items"
import SignIn from "./pages/SignIn"


function App() {
  

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/items" element={<Items/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
