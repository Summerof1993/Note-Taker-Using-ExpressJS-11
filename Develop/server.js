const express = require("express");

const path = require("path");
const db = require("./db/db.json")
const { readFromFile, writeToFile, readAndAppend } = require("./helpers/fsUtils")

const app = express();

const PORT = 3001


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname), "./public/index.html")
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname), "./public/notes.html")

})

app.get("/api/notes", (req, res) => {
    console.info(`${req.method} received for notes`)

    readFromFile("./db/db.json").then((data) => res.send(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} received for notes`)
    res.json("I posted it")
});

app.listen(PORT, () => {
    console.log(`Server listening at port: ${PORT}`);
})