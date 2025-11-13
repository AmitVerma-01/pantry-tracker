import { useState } from "react"


function PasswordInput({onChange, value, disabled, onBlur}) {
    const [togglePassword , setTogglePassword] = useState(false)
    function visibilityTogglePassword(){
        setTogglePassword(!togglePassword)
    }

  return (
    <div className="flex flex-col gap-y-1">
        <label htmlFor='password' className="font-semibold md:font-bold text-gray-700">Password : </label>
        <div className="relative flex items-center">
            <input 
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
              id="password" 
              type={togglePassword ? "text" : "password"} 
              className="w-full px-3 py-2 pr-10 rounded-lg shadow-md border-2 border-transparent focus:border-c4 bg-c1 md:font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-smooth hover:shadow-lg" 
              placeholder="Enter Password"
            />
            <button
              type="button"
              onClick={visibilityTogglePassword}
              className="absolute right-2 p-1 hover:bg-c2 rounded transition-colors"
              aria-label={togglePassword ? "Hide password" : "Show password"}
            >
              <img 
                src={togglePassword ? `hide.png` : 'show.png'} 
                alt={togglePassword ? "Hide password" : "Show password"} 
                className="w-6 h-6" 
              />
            </button>
        </div>
    </div>
  )
}

export default PasswordInput
