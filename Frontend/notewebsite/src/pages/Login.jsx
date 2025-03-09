import React, { useState , useContext } from 'react'
import { toast } from 'react-toastify';
import {Link , useNavigate} from 'react-router-dom'
import { LoginContext } from '../context/Logincontext';
const Login = () => {
   const navigate = useNavigate();
   const {setIslogin} = useContext(LoginContext)
   const [password , setPassword] = useState('');
   const [email , setEmail] = useState('');

   const notifyError = (msg) => toast.error(msg);
   const notifySuccess = (msg) => toast.success(msg);
   
   const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  const handleSubmit = async() => {
    try{
      if(!emailRegex.test(email)){
        notifyError('Invalid Emmail');
        return
      }
      else if(!passRegex.test(password)){
        notifyError("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")
        return
      }
      const response = await fetch('https://noteapp-dmbk.onrender.com/login' , {
        method: 'POST',
        headers : { 
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({password , email})
      })

      const data = await response.json()
      console.log("Login responsed data", data);
      const token = data?.token;
      const user = data?.user;
      if(data.error){
      notifyError(data.error)
        return
      }
      else{
        notifySuccess("User Login successfully")
        if(token){
          localStorage.setItem('notejwt', token);
          localStorage.setItem('noteuser' , JSON.stringify(user));
          setIslogin(true);
          navigate('/')
        }
        else {
          console.error("Token not found in response!");
      }   
      }
    }
    catch(err){
    console.log('error in registration' ,err);
    notifyError("Registration failed! Please try again.");
  }}
  return (
    <>
      <div className="flex justify-center items-center h-screen">
      <form 
      onSubmit={(e)=> {
        e.preventDefault();
        handleSubmit();
      }}
      className="p-4 border rounded w-96">
        <h2 className="text-lg font-bold mb-3 mt-2">Login</h2>
        <label className="block mb-1 text-gray-600">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          className="w-full border p-2 mb-2"
          required
        />
         <label className="block mb-1 mt-2 text-gray-600">Password</label>
        <input
          type="password"
          name="password"
          autoComplete='false'
          placeholder="Password"
          value={password}
          onChange={(e)=> {setPassword(e.target.value)}}
          className="w-full border p-2 mb-2"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2" >
          Login 
        </button>
        <div className='flex text-center mt-3 text-md ml-2 gap-1'>
          Don't have an account?
        <Link to='/registration'>
                <span className='text-blue-600 '>Registration</span>
        </Link>
        </div>
      </form>
    </div>
    </>
  )
}

export default Login