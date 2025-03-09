import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import { LoginContext } from '../context/Logincontext';
const TrashNotes = () => {
    const { dark } = useContext(LoginContext)
    const [search, setSearch] = useState('');
    const [trashNotes, setTrashNotes] = useState([]);

    const notifySuccess = (msg) => toast.success(msg);

    useEffect(() => {
        fetchTrashNotes();
    }, [])

    const fetchTrashNotes = async () => {
        try {
            const token = localStorage.getItem('notejwt');
            const response = await fetch('https://noteapp-dmbk.onrender.com/my-note', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setTrashNotes(data.filter(note => note.deleted));
        } catch (error) {
            console.error('Error fetching trash notes:', error);
        }
    }

    const restoreNote = async (id) => {
        try {
            const token = localStorage.getItem('notejwt');
            const response = await fetch(`https://noteapp-dmbk.onrender.com/restore-note/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error('Failed to restore note');

            notifySuccess('Note restored successfully');
            fetchTrashNotes((prevNotes) => prevNotes.filter(note => note._id !== id));

        } catch (error) {
            console.error('Error while restoring note:', error);
        }
    }
    return (
        <>
            <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center p-5`}>
                <div className="max-w-4xl w-full">
                    <h1 className={` ${dark ? 'text-white' : 'text-black'} text-2xl font-bold text-center mb-5`}>Trash</h1>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 auto-rows-fr">
                        {trashNotes.length > 0 ? (
                            trashNotes
                                .filter((note) => note.note.toLowerCase().includes(search.toLowerCase()))
                                .map((note, index) => (
                                    <div key={index} className="p-4 bg-red-100 rounded-lg shadow-md">
                                        <h2 className="text-lg font-semibold">{note.userId.username}</h2>
                                        <p className="mt-2 text-gray-900">{note.note}</p>
                                        <button
                                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                                            onClick={() => restoreNote(note._id)}
                                        >
                                            Restore
                                        </button>
                                    </div>
                                ))
                        ) : (
                            <p className="col-span-3 text-center text-gray-500">No notes in trash.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrashNotes