import Navbar from "./components/Navbar"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Items from "./pages/Items"
import SignIn from "./pages/SignIn"
import ErrorBoundary from "./components/common/ErrorBoundary"
import { ToastProvider } from "./components/common/Toast"


function App() {
  

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/items" element={<Items/>}/>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
