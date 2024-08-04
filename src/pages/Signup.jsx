import { useState,useEffect } from "react";
import Input from "../components/Input"
import PasswordInput from "../components/PasswordInput"
import  {useFirebase}  from "../context/firebase"
import { NavLink, useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";

const Signup = () => {
  const [isLoading, setLoading] = useState(false)
  const firebase = useFirebase();
  
  const navigate = useNavigate()
  useEffect(()=>{
    if(firebase.isLoggedIn)
      navigate('/')
  },[firebase,navigate])

  const [fullName, setFullName ] = useState('')
  const [password, setPassword ] = useState('')
  const [email, setEmail ] = useState('')
  const [er,setEr] = useState('')

  const signUp =async (e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      if(fullName && email && password ){
        const user = await firebase.signupUserWithEmailPassword(email,password)
        // console.log("success ",user);
      }else{
        alert("Please provide your credentials")
      }
    } catch (error) {
      setEr(error.message)
      setTimeout(() => {
        setEr('')
      }, 5000);
    }
    setLoading(false)
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full md:py-5  flex justify-center items-center ">
     <div className=" w-11/12 md:w-1/2 bg-c3 rounded-lg shadow-lg p-5">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4">Sign Up</h1>
        <div className=" flex flex-col gap-y-3">
            <Input onChange={(e) => setFullName(e.target.value)} type={"text"} id={'fullname'} label={"Full Name"} placeholder={"Amit Verma"}/>
            <Input onChange={(e) => setEmail(e.target.value)} type={"email"} id={'email'} label={"Email"} placeholder={"example@xyz.com"}/>
            <PasswordInput onChange={e => setPassword(e.target.value)} />
        </div>
        {er && <p className="text-red-700 text-center">{er}</p>}
        <button className="p-2 bg-c4 w-full rounded-lg my-2 mt-5 shadow-md hover:bg-c3 md:text-2xl font-bold" onClick={signUp}>Sign Up</button>
        {/* <GoogleButton/> */}
        <p className="text-opacity-55 text-center my-2 md:my-5">Already have an account? <NavLink to={'/signin'} className="text-c4 underline">Sign In</NavLink></p>
     </div>
    </div>
  )
}

export default Signup
