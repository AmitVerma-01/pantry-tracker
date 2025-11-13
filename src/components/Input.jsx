const Input = ({type, label, id, placeholder, onChange, value, disabled, onBlur}) => {
  return (
    <div className="flex flex-col gap-y-1">
        <label htmlFor={id} className="font-semibold md:font-bold text-gray-700">{label} : </label>
        <input 
          type={type} 
          id={id} 
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          disabled={disabled}
          className="w-full px-3 py-2 rounded-lg shadow-md border-2 border-transparent focus:border-c4 bg-c1 md:font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-smooth hover:shadow-lg" 
          placeholder={placeholder} 
          minLength={8}
        />
    </div>
  )
}

export default Input
