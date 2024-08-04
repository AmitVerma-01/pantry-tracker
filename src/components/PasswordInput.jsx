import { useState } from "react"


function PasswordInput({onChange}) {
    const [togglePassword , setTogglePassword] = useState(false)
    function visibilityTogglePassword(){
        setTogglePassword(!togglePassword)
    }

  return (
    <div className="flex flex-col gap-y-1">
        <label htmlFor='password' className="font-semibold md:font-bold">Password : </label>
        <div className="relative flex items-center">
            <input onChange={onChange} id="password" type={togglePassword ? "text" : "password"} className="w-full px-2 flex items-center rounded-lg shadow-md h-9 outline-c4 border-none bg-c1 md:font-semibold" placeholder="Enter Password"/>
            <img src={togglePassword ? `hide.png` : 'show.png'} alt="hide&show" className="absolute right-2 cursor-pointer w-6 h-6" onClick={visibilityTogglePassword}/>
        </div>
    </div>
  )
}

export default PasswordInput
