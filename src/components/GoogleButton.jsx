import { useFirebase } from "../context/firebase"


const GoogleButton = () => {
  const firebase = useFirebase()
  return (
    <div>
      <button className="p-2 bg-c4 w-full rounded-lg shadow-md hover:bg-c3 md:text-2xl font-bold flex justify-center gap-x-3 mt-1 items-center" onClick={firebase.signinWithGoogle}>SignUp With Google <img src="google.png" alt="" /></button>
    </div>
  )
}

export default GoogleButton
