import React,{useState}from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import Navbar from '../src/pages/Navbar'
import Registation from '../src/pages/Registration'
import Login from '../src/pages/Login'
import CreateNote from '../src/pages/CreateNote'
import Home from '../src/pages/Home'
import MyNote from '../src/pages/MyNote'
import { LoginContext } from './context/Logincontext';
import TrashNotes from './pages/TrashNotes';
function App() {
  const [islogin , setIslogin] = useState(false);
  const [dark , setDark] = useState(false);
  return (
    <>
    <Router>
      <LoginContext.Provider value={{setIslogin , setDark , dark}}>
      <Navbar islogin={islogin}/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/trash' element={<TrashNotes/>} />
        <Route path='/registration' element={<Registation/>}/>
        <Route path='/login' element={<Login/>} setIslogin={setIslogin}/>
        <Route path='/create-note' element={<CreateNote/>} />
        <Route path='/my-note' element={<MyNote/>} />
      </Routes>
      <ToastContainer theme="dark" />
      </LoginContext.Provider>
    </Router>
    </>
  )
}

export default App
