const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const utils = require("./utils");
const cors = require('cors');
const { table } = require("console");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
  
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

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

        const databaseList = databaseFromFile.databases.map(database => database.dataBaseName);
        res.send(databaseList);
    }
});

app.delete("/database/:name", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);
 
    if (databaseIndex === -1) {
        console.log('Bad')
        res.status(404);
        res.send({
            status: 404,
            message: 'Database does not exist'
        });
    } else {
        console.log('Good');
        databaseFromFile.databases.splice(databaseIndex, 1);
        fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));
        res.send({databaseName});
    }
});

app.post("/database/:name/table", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const insertedTable = req.body;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);

    if (databaseIndex === -1) {
        res.status(404);
        res.send('Database not found!')
    } else {
        const tableList = databaseFromFile.databases[databaseIndex].tables;
        const tableIndex = utils.findItemInList(tableList, 'tableName', insertedTable.tableName);

        if (tableIndex === -1) {
            databaseFromFile.databases[databaseIndex].tables.push(insertedTable);
            fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));
            res.send('Table was added!');
        } else {
            res.status(400);
            res.send('Table name was already in the database');    
        }
    }
});

app.delete("/database/:databaseName/table/:tableName", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.databaseName;
    const tableName = req.params.tableName;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);

    if (databaseIndex === -1) {
        res.status(404);
        res.send('Database not found!');
    } else {
        const tableList = databaseFromFile.databases[databaseIndex].tables;
        const tableIndex = utils.findItemInList(tableList, 'tableName', tableName);

        if (tableIndex !== -1) {
            databaseFromFile.databases[databaseIndex].tables.splice(tableIndex, 1);
            fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));
            res.send('Table deleted succesfully!')
        } else {
            res.status(404);
            res.send('Table not found!');
        }
    }
});

app.post("/database/:databaseName/table/:tableName/index", (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.databaseName;
    const tableName = req.params.tableName;
    const insertedIndex = req.body;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);

    if (databaseIndex === -1) {
        res.status(404);
        res.send('Database not found!');
    } else {
        const tableList = databaseFromFile.databases[databaseIndex].tables;
        const tableIndex = utils.findItemInList(tableList, 'tableName', tableName);

        if (tableIndex !== -1) {
            const indexList = tableList[tableIndex].indexFiles;
            const indexPozition = utils.findItemInList(indexList, 'indexName', insertedIndex.indexName);

            if (indexPozition !== -1) {
                res.status(400);
                res.send('Index already in database');
            } else {
                const attrList = tableList[tableIndex].attributes;
                const attribute = insertedIndex.indexAttributes.IAttribute;
                const attributeIndex = utils.findItemInList(attrList, 'attributeName', attribute);

                if (attributeIndex !== -1) {
                    indexList.push(insertedIndex);
                    fs.writeFileSync(FILE_NAME, JSON.stringify(database));
                } else {
                    res.status(404);
                    res.send('Attribute not found!');
                }
            }
        } else {
            res.status(404); 
            res.send('Table not found!');  
        }
    }
})