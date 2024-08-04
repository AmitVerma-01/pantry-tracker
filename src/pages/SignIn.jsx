import { useEffect, useState } from "react";
import Input from "../components/Input"
import PasswordInput from "../components/PasswordInput"
import { useFirebase } from "../context/firebase"
import { NavLink, useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";

const SignIn = () => {
  const firebase = useFirebase();
  const navigate = useNavigate()

  useEffect(()=>{
    if(firebase.isLoggedIn)
      navigate('/')
  },[firebase,navigate])


  const [loading , setLoading] = useState(false)
  const [password, setPassword ] = useState('')
  const [email, setEmail ] = useState('')
  
  const signIn = async ()=>{
    try {
      setLoading(true)
     const user = await firebase.signInWithEmailPassword(email,password)
     console.log(user);
      
    } catch (error) {
      console.log(error.message);
      
    }
   setLoading(false)
  }
  
  return (
    <div className="h-[calc(100vh-64px)] w-full md:py-5  flex justify-center items-center ">
     <div className=" w-11/12 md:w-1/2 bg-c3 rounded-lg shadow-lg p-5">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4">Sign Up</h1>
        <div className=" flex flex-col gap-y-3">
            <Input onChange={(e) => setEmail(e.target.value)} type={"email"} id={'email'} label={"Email"} placeholder={"example@xyz.com"}/>
            <PasswordInput onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="p-2 bg-c4 w-full rounded-lg my-2 mt-5 shadow-md hover:bg-c3 md:text-2xl font-bold" onClick={signIn}>{loading ? "Sign In..." : "Sign In"}</button>
        {/* <GoogleButton/> */}
        <p className="text-opacity-55 text-center my-2 md:my-5">Already have an account? <NavLink to={'/signup'} className="text-c4 underline">Sign Up</NavLink></p>
     </div>
    </div>
  )
}

export default SignIn
