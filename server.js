const express = require('express');
const path = require("path")
const fs = require("fs")
const dataBase = require ("./db/db.json")

const PORT = process.env.PORT || 3001;  
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));  
app.use(express.static('public'));  
//connects to index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

//Connects to notes file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    res.json(dataBase.slice(1))
})

app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, dataBase)
    res.json(newNote)
})
// Creates notes
const createNote = (body, notesArr) => {
    const newNote = body;
    if (!Array.isArray(notesArr)) {
        notesArr = [];
    }
    if(notesArr.length === 0) {
        notesArr.push(0);
    }

    body.id = notesArr.length;
    notesArr[0]++
    notesArr.push(newNote)
    
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArr, null, 2)
    )
    return newNote
}
//Deletes old note
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, dataBase);
    res.json(true);
})
const deleteNote = (id, notesArr) => {
    for (let i = 0; i < notesArr.length; i++) {
        let note = notesArr[i];
        if (note.id == id) {
            notesArr.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArr, null, 2)
            );
            break;
        }
    }
};

//local:3000
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
