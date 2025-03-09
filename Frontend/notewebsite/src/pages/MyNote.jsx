import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../context/Logincontext';
const MyNote = () => {
    const navigate = useNavigate();
    const { dark } = useContext(LoginContext)
    const [notes, setNotes] = useState([])
    const [search, setSearch] = useState('');
    const [showPinned, setShowPinned] = useState(false);
    const [edit, setEdit] = useState(null); // Stores the note being edited
    const [editedText, setEditedText] = useState(""); // Stores the updated note text


    const notifySuccess = (msg) => toast.success(msg);

    useEffect(() => {
        fetchNotes();
    }, [])

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('notejwt');
            const response = await fetch('https://noteapp-dmbk.onrender.com/my-note', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json();

            setNotes(data.filter(note => !note.deleted));
            // console.log(data)
        }
        catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    const removenote = async (id) => {
        try {
            const token = localStorage.getItem('notejwt');
            const response = await fetch(`https://noteapp-dmbk.onrender.com/delete-note/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) throw new Error('Failed to delete note');
            notifySuccess('Note moved to trash');
            fetchNotes();
            //fetchTrashNotes();

        }
        catch (error) {
            console.error('Error while deleting');
        }
    }

    const handleEdit = (note) => {
        setEdit(note);
        setEditedText(note.note); //haii
    };

    const updateNote = async () => {
        // console.log('inside update')

        if (!edit) return;

        try {
            const token = localStorage.getItem('notejwt');
            const response = await fetch(`https://noteapp-dmbk.onrender.com/updated-note/${edit._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ note: editedText })
            })

            if (!response.ok) throw new Error('Failed to update note');

            setNotes((prevNotes) =>
                prevNotes.map((note) => (note._id === edit._id ? { ...note, note: editedText } : note))
            )

            notifySuccess('Note updated successfully!');
            setEdit(null);
        }
        catch (error) {
            console.error('Error while updating');
        }
    }

    const togglePin = async (id) => {
        try {
            const token = localStorage.getItem("notejwt");
            const response = await fetch(`https://noteapp-dmbk.onrender.com/pin-note/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to pin/unpin note");

            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note._id === id ? { ...note, pinned: !note.pinned } : note))
        }

        catch (error) {
            console.error("Error pinning/unpinning note:", error);
        }
    }


    return (
        <>
            <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center p-5`}>
                <div className='absolute top-20 right-2 '>
                    <button className='h-10 w-24 p-auto bg-red-600  text-white rounded shadow-md hover:bg-red-700 transition-all'
                        onClick={() => navigate('/trash')}>
                        TrashNotes
                    </button>
                </div>
                <div className="max-w-4xl w-full">
                    <h1 className={` ${dark ? 'text-white' : 'text-black'} text-2xl font-bold text-center mb-5`}>Your Notes</h1>


                    <div>
                        <div className='p-5'>
                            <div className="flex justify-center">
                                <input type="text"
                                    value={search}
                                    placeholder='Search notes..'
                                    className={`${dark ? 'bg-white text-black' : 'bg-gray-700 text-white'} p-2 boder rounded w-full`}
                                    onChange={(e) => setSearch(e.target.value)} />

                                <button
                                    className="ml-2 p-2 bg-gray-600 text-white rounded"
                                    onClick={() => setShowPinned(!showPinned)}
                                >
                                    {showPinned ? "Show All" : "Show Pinned"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 auto-rows-fr">
                        {notes.length > 0 ? (
                            notes
                                .filter((note) => showPinned ? note.pinned : true)
                                .filter((note) => note.note.toLowerCase().includes(search.toLowerCase()))
                                .map((note, index) => (
                                    <div key={index} className="p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out" style={{ backgroundColor: note.color }}>
                                        <div className='flex flex-cols'>
                                            <h2 className="text-lg font-semibold">{note.userId.username}</h2>
                                            <span className="material-symbols-outlined ml-auto mt-auto cursor-pointer"
                                                onClick={() => { handleEdit(note) }}>
                                                edit_note
                                            </span>
                                            <span className="material-symbols-outlined cursor-pointer ml-auto mt-auto"
                                                onClick={() => { removenote(note._id) }}>
                                                delete
                                            </span>
                                            <span className="cursor-pointer ml-auto" onClick={() => togglePin(note._id)}>
                                                {note.pinned ? "📌" : "📍"}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-gray-900">{note.note}</p>
                                    </div>
                                ))
                        ) : (
                            <p className="col-span-3 text-center text-gray-500">No notes found.</p>
                        )}
                    </div>
                </div>
            </div>


            {/* EDIT MODAL */}
            {edit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Note</h2>
                        <textarea
                            className="w-full p-2 border rounded"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                        />
                        <div className="flex justify-end mt-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={updateNote}>
                                Save
                            </button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEdit(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MyNote