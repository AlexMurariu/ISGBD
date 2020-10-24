const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const utils = require("./utils");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
  
if (!module.parent) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log("Server is open");
    });
}

const FILE_NAME = 'database.json'

function readFromFile(fileName) {
    const rawData = fs.readFileSync(fileName);
    const database = JSON.parse(rawData);

    return database;
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

app.get("/databases", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseList = databaseFromFile.databases.map(database => database.dataBaseName);
    res.send(databaseList);
});

app.get("/database/:name", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);

    if (databaseIndex !== -1) {
        const databaseTables = databaseFromFile.databases[databaseIndex].tables;
        res.status(200);
        res.send(databaseTables);
    } else {
        res.status(404);
        res.send('Database not found in the system!');
    }
})

app.post("/database", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const newDatabaseName = req.body.databaseName;

    const newDatabase = {
        dataBaseName: newDatabaseName,
        tables: []
    }

    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', newDatabaseName);

    if (databaseIndex !== -1) {
        res.status(400);
        res.send('Database already exists!')
    } else {
        databaseFromFile.databases.push(newDatabase);
        fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));
        res.send('Database was added!');
    }
});

app.delete("/database/:name", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);

    if (databaseIndex === -1) {
        res.status(404);
        res.send("Database not found!");
    } else {
        databaseFromFile.databases.splice(databaseIndex, 1);
        res.status(201);
        fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));
        res.send("Database was deleted!");
    }
});