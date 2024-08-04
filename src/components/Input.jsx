
const Input = ({type, label ,id, placeholder,onChange}) => {
  return (
    <div className="flex flex-col gap-y-1">
        <label htmlFor={id} className="font-semibold md:font-bold">{label} : </label>
        <input type={type} id={id} onChange={onChange} className="w-full px-2 flex items-center rounded-lg shadow-md h-9 outline-c4 border-none bg-c1 md:font-semibold" placeholder={placeholder} minLength={8}/>
    </div>
  )
}

export default Input
