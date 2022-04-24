const fs = require('fs');
const path = require('path')
const express = require('express')
let store = require('./db/db.json');
const { Router } = require('express');

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

app.delete('/notes/:id', (req, res) => {
    storeData
    .removeNote(req.params.id)
    .then(()=> res.jason({ ok: true}))
    .catch((err) => res.status(500).json(err));
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));