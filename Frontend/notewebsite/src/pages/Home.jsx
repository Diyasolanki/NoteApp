import React, { useState, useEffect, useContext } from 'react'
import { LoginContext } from '../context/Logincontext'
import { toast } from 'react-toastify';

const Home = () => {
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState("");
  const { dark } = useContext(LoginContext)


  useEffect(() => {
    fetchNotes();
  }, [])

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('notejwt');

      const response = await fetch('https://noteapp-dmbk.onrender.com/get-notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json();
      setNotes(data.filter(note => !note.deleted));

    }
    catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  const updateRating = async (id, newRating) => {
    try {
      const token = localStorage.getItem('notejwt');
      const response = await fetch(`http://localhost:8000/update-rating/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: newRating })
      });

      if (!response.ok) throw new Error('Failed to update rating');

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? { ...note, rating: newRating } : note));

    } catch (error) {
      console.error('Error updating rating:', error);
    }
  }
  const renderStars = (id, rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`cursor-pointer text-xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
        onClick={() => updateRating(id, star)} // Clicking updates the rating
      >
        ★
      </span>
    ));
  };

  return (
    <>
      <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center p-5`}>
        <div className="max-w-4xl w-full">
          <h1 className={`${dark ? 'text-white' : 'text-black'}  text-2xl font-bold text-center mb-5`}>Notes</h1>

          <div>
            <div className='p-5'>
              <div className="flex justify-center">
                <input type="text"
                  value={search}
                  placeholder='Search notes..'
                  className={`${dark ? 'bg-white text-black' : 'bg-gray-700 text-white'} p-2 boder rounded w-full`}
                  onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {notes.length > 0 ? (
              notes
                .filter((note) => note.note.toLowerCase().includes(search.toLowerCase()))
                .map((note, index) => (
                  <div key={index} className="p-4 rounded-lg shadow-md" style={{ backgroundColor: note.color }} >
                    <h2 className="text-lg font-semibold">{note.userId.username}</h2>
                    <p className="mt-2 text-gray-900">{note.note}</p>
                    <div className="mt-2">{renderStars(note._id, note.rating)}</div>
                  </div>
                ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No notes found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home