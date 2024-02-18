const express = require("express");

const path = require("path");
const db = require("./db/db.json");
const uuid = require("./helpers/uuid");
const { readFromFile, writeToFile, readAndAppend } = require("./helpers/fsUtils");
const { write } = require("fs");

const app = express();

const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    console.info(`we received ${req.method}`)

    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} received for notes`)
    console.info(req.body)

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }
        readAndAppend(newNote, "./db/db.json");

        readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));


    }

});

app.delete('/api/notes/:id', (req, res) => {
    if (req.params.id) {
        console.info(`${req.method} request received to delete note`);
        const noteId = req.params.id;
        for (let i = 0; i < db.length; i++) {
            const currentNote = db[i];
            if (currentNote.id === noteId) {
                db.splice(i,1);
                writeToFile("./db/db.json", db);
                readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
                return;
            }
        }
        res.status(404).send('note not found');
    } else {
        res.status(400).send('ID not provided');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening at port: ${PORT}`);
})