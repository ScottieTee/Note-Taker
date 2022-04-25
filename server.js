const fs = require('fs');
const path = require('path')
const express = require('express')
let store = require('./db/db.json');
const { Router } = require('express');

const uniqueId = require('uniqueId');
const { findById, findByIdAndDelete } = require('./db/db.json');

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

app.get('api/notes/:id', (req, res) => {
    const { id } = req.params;
    const result = findById(id, store);
    res.send(result);
});

app.post('/api/notes', (req, res) =>{
    req.body.id = uniqueId();
    store.push(req.body);
    fs.writeFile('./db/db.json', JSON.stringify(store), err=> {
        if (err) throw err;
    })
    res.json(store);
})

app.delete('/api/notes.:id', (req, res) => {
    const { id } = req.params;
    const result = findByIdAndDelete(id, store);
    res.sendFile(path.join(__dirname, './public/notes.html'));
})


app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));