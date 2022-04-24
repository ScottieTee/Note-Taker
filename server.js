const fs = require('fs');
const path = require('path')
const express = require('express')
let store = require('./db/db.json');

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// ######################API#####################
app.get('/api/notes', (req, res) => {
    res.json(store);
});
app.post('/api/notes', (req, res) =>{
    store.push(req.body);
    fs.writeFile('./db/db.json', JSON.stringify(store), err=> {
        if (err) throw err;
    })
    res.json(store);
})

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, store);
    res.json(true);
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));