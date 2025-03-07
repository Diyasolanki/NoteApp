const express = require('express')
const Note = require('../models/note.model')
const router = express.Router()
const auth = require('../middleware/auth')
router.post('/add-note', auth, async (req, res) => {
    const { note } = req.body;
    const userId = req.user._id;
    try {
        const newnote = new Note({ userId, note });
        await newnote.save();

        res.status(201).json({ success: true, message: 'note added successfully' });
    }

    catch (error) {
        console.log('error in adding note')
        res.status(500).json({ error: "Failed to add note" });
    }
})

router.get('/get-notes', auth, async (req, res) => {
    try {
        const usernotes = await Note.find().populate('userId', 'username').sort({ createdAt: -1 })
        res.json(usernotes);
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/my-note', auth, async (req, res) => {
    try {
        const usernotes = await Note.find({ userId: req.user._id }).populate('userId', 'username').sort({ createdAt: -1 })
        res.json(usernotes)
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.put('/updated-note/:id', auth, async (req, res) => {
    try {
        const { note } = req.body;
        const updatednotes = await Note.findByIdAndUpdate(req.params.id,
            { note: note },
            { new: true })

        if (!updatednotes) return res.json({ Error: "Note couldn't deleted" })
        res.json(updatednotes)
    }

    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.put('/update-rating/:id' , auth , async(req,res)=> {
   try{
    const {rating} = req.body;
    if(rating < 1 || rating > 5){
        return res.status(400).json({ error: "Rating must be between 1 and 5" });   
    }
    const updateNote = await Note.findByIdAndUpdate(req.params.id , {rating : rating} , {new : true})
    res.json(updateNote);
    
   }
   catch (error) {
    res.status(500).json({ error: "Failed to update rating" });
}

})
router.put('/delete-note/:id', auth, async (req, res) => {
    // console.log(req.params.id);
    const noteId = req.params.id
    try {
        const note = await Note.findByIdAndUpdate(noteId , {deleted : true},{new:true});
        if (!note) return res.status(404).json({ error: 'Note not found' });

        res.json({ msg: 'Note moved to trash' })

    }
    catch (error) {
        console.error('Error while moving note to trash:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.put('/restore-note/:id' , auth , async(req,res)=> {
    try{
        const note = await Note.findByIdAndUpdate(req.params.id ,{deleted : false},{new:true});
        if (!note) return res.status(404).json({ error: 'Note not found' });

        res.json({ msg: 'Note restored successfully' });

    } catch (error) {
        console.error('Error while restoring note:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.put('/pin-note/:id' , auth ,async(req,res)=> {
    try{
        const note = await Note.findById(req.params.id);
        // If note.pinned is true, !note.pinned becomes false.
        // If note.pinned is false, !note.pinned becomes true.
        note.pinned = !note.pinned;
        await note.save();

        res.json({ msg: "Note pin status updated" });
    }
    catch (err) {
        res.status(500).send("Server Error");
      }
})
module.exports = router