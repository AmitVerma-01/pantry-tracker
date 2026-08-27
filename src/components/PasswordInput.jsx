import { useState } from "react"
import PropTypes from "prop-types"

function PasswordInput({onChange, value, disabled, onBlur}) {
    const [togglePassword , setTogglePassword] = useState(false)

  return (
    <div className="flex flex-col gap-y-1.5">
        <label htmlFor='password' className="font-semibold text-ink text-sm">Password</label>
        <div className="relative flex items-center">
            <input 
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
              id="password" 
              type={togglePassword ? "text" : "password"} 
              className="input-field pr-11 disabled:opacity-50 disabled:cursor-not-allowed" 
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setTogglePassword(!togglePassword)}
              className="absolute right-3 p-1 hover:bg-c2 rounded-lg transition-colors"
              aria-label={togglePassword ? "Hide password" : "Show password"}
            >
              <img 
                src={togglePassword ? `hide.png` : 'show.png'} 
                alt="" 
                className="w-5 h-5 opacity-60" 
              />
            </button>
        </div>
    </div>
  )
}

PasswordInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func
};

export default PasswordInput
