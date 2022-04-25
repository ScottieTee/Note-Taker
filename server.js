const fs = require('fs');
const path = require('path')
const express = require('express')
let store = require('./db/db.json');
const { Router } = require('express');


const app = express()
const PORT = process.env.PORT || 3000;

const findById = (id, notesArray) => {
    const result = notesArray.filter(note => note.id === id)[0];

    return result;
}

const findByIdAndDelete = (id, notesArray) => {
   const removeIndex = notesArray.map((item) => { return item.id }).indexOf(id);
   notesArray.splice(removeIndex, 1);
   return removeIndex;
}

module.exports = {
    findById,
    findByIdAndDelete
}

//use
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Get routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// ##################   API   ################
app.get('/api/notes', (req, res) => {
    res.json(store);
});

app.get('api/notes/:id', (req, res) => {
    const { id } = req.params;
    const result = findById(id, store);
    res.send(result);
});

//post route
app.post('/api/notes', (req, res) =>{
    store.push(req.body);
    fs.writeFile('./db/db.json', JSON.stringify(store), err=> {
        if (err) throw err;
    })
    res.json(store);
})

//delete note
app.delete('/api/notes.:id', (req, res) => {
    const { id } = req.params;
    const result = findByIdAndDelete(id, store);
    res.sendFile(path.join(__dirname, './public/notes.html'));
})


app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

