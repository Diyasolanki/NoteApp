import React, { useState , useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { LoginContext } from '../context/Logincontext';
const CreateNote = () => {
  const {dark} = useContext(LoginContext)
  const navigate = useNavigate();
  const [note, setNote] = useState('')
  const user = JSON.parse(localStorage.getItem('noteuser'));

  // const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const addNote = async () => {
    const token = localStorage.getItem('notejwt');

    const response = await fetch('http://localhost:8000/add-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ note: note })
    })

    const data = await response.json();
    console.log(data)
    notifySuccess("note added successfully")
    navigate('/')
  }
  return (
    <>
      <div className={`flex items-center justify-center min-h-screen ${dark ? 'bg-gray-900 ' : 'bg-slate-200' } `}>
        <div className='h-full border-2 border-solid bg-slate-400 '>
          <div className='w-full border-y-2 '>
            <h2 className='ml-2 text-lg font-semibold'>{user.username}</h2>
          </div>
          <div className='mt-2 ml-3 '>
            <textarea className='w-80 ml-2 pl-2 mr-5' rows={5} placeholder='Enter Your Note'
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
              }}></textarea>
          </div>
          <div className='text-center ml-1'>
            <button
              onClick={addNote}
              className='p-1 m-2 text-lg font-semibold bg-amber-400'>Share</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateNote