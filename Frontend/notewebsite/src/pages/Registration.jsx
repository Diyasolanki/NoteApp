import React,{useState} from 'react'
import {Link , useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

const Registration = () => {
 const navigate = useNavigate();
 const [username , setUsername] = useState('');
 const [password , setPassword] = useState('');
 const [email , setEmail] = useState('');

const notifyError = (msg) => toast.error(msg);
const notifySuccess = (msg) => toast.success(msg);

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

const handleuserdata  = async() => {
  try{
    if(!emailRegex.test(email)){
      notifyError('Invalid Emmail');
      return
    }
    else if(!passRegex.test(password)){
      notifyError("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")
      return
    }
    
    const response = await fetch('http://localhost:8000/register',{
      method: 'POST',
      headers : {
        'Content-Type': 'application/json'
        },
      body : JSON.stringify({username , password ,email})
    })
    const data = await response.json();
    if(data.error){
      notifyError(data.error)
      console.log('error at frontend register')
    }
    else{
        notifySuccess(data.message)
        navigate('/login')
        console.log(data)
      }
  }catch(err){
    console.log('error in registration' ,err);
    notifyError("Registration failed! Please try again.");
  }
}

  return (
    <>
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={(e)=> {
       e.preventDefault();
       handleuserdata();
      }}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">Register</h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e)=> {setUsername(e.target.value)}}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e)=> {setEmail(e.target.value)}}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            autoComplete='false'
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>
        <div className='flex mt-3 text-center text-md ml-2 gap-1'>
          Already have an account ? 
          <Link to='/login'>
          <span className='text-blue-600 '>Login</span>
          </Link>
        </div>
      </form>
    </div>
    </>
  )
}

export default Registration