const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const querystring = require("querystring");
const fs = require("fs");
const databaseModel = require("./models/databaseModel");
const utils = require("./utils");
const { FILE } = require("dns");

const app = express();
const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));

if (!module.parent) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Da tati te ascult!");
    });
}

const FILE_NAME = 'database.json'

function readFromFile(fileName) {
    const rawData = fs.readFileSync(fileName);
    const database = JSON.parse(rawData);

    return database;
}

app.get("/database", (req, res) => {
    const database = readFromFile(FILE_NAME);
    res.send(database);
});

app.post("/database", (req, res) => {
    const database = readFromFile(FILE_NAME);
    const insertedDatabase = req.body;

    const isPresent = utils.findInDatabaseList(database.databases, insertedDatabase.databaseName);

    if (isPresent !== -1) {
        res.status(400);
    } else {
        database.databases.push(insertedDatabase);
        fs.writeFileSync(FILE_NAME, JSON.stringify(database));
    }

    res.send();
});

app.delete("/database/:name", (req, res) => {
    const database = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const isPresent = utils.findInDatabaseList(database.databases, databaseName);

    if (isPresent === -1) {
        res.status(404);
    } else {
        database.databases.splice(isPresent, 1);
        res.status(201);
        fs.writeFileSync(FILE_NAME, JSON.stringify(database));
    }

    res.send();
});

app.post("/database/:name/table", (req, res) => {
    const database = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const insertedTable = req.body;
    const isDbPresent = utils.findInDatabaseList(database.databases, databaseName);

    if (isDbPresent === -1) {
        res.status(404);
    } else {
        const tableList = database.databases[isDbPresent].tables;
        const isTablePresent = utils.findInTableList(tableList, insertedTable.tableName);

        if (isTablePresent === -1) {
            database.databases[isDbPresent].tables.push(insertedTable);
            fs.writeFileSync(FILE_NAME, JSON.stringify(database));
        } else {
            res.status(204);    
        }
    }

    res.send();
});

app.delete("/database/:name/table/:tableName", (req, res) => {
    const database = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const tableName = req.params.tableName;
    const isDbPresent = utils.findInDatabaseList(database.databases, databaseName);

    if (isDbPresent === -1) {
        res.status(404);
    } else {
        const tableList = database.databases[isDbPresent].tables;
        const isTablePresent = utils.findInTableList(tableList, tableName);

        if (isTablePresent !== -1) {
            database.databases[isDbPresent].tables.splice(isTablePresent, 1);
            fs.writeFileSync(FILE_NAME, JSON.stringify(database));
        } else {
            res.status(404);    
        }
    }

    res.send();
});

app.post("/database/:name/table/:tableName/index", (req, res) => {
    const database = readFromFile(FILE_NAME);
    const databaseName = req.params.name;
    const tableName = req.params.tableName;
    const insertedIndex = req.body;
    const isDbPresent = utils.findInDatabaseList(database.databases, databaseName);

    if (isDbPresent === -1) {
        res.status(404);
    } else {
        const tableList = database.databases[isDbPresent].tables;
        const isTablePresent = utils.findInTableList(tableList, tableName);

        if (isTablePresent !== -1) {
            const indexList = tableList[isTablePresent].indexFiles;
            const isIndexPresent = utils.findInIndexList(indexList, insertedIndex.indexName);

            if (isIndexPresent !== -1) {
                res.status(400);
            } else {
                const attrList = tableList[isTablePresent].attributes;
                const attribute = insertedIndex.indexAttributes.IAttribute;
                const isAttributePresent = utils.findInAttrList(attrList, attribute);

                if (isAttributePresent !== -1) {
                    indexList.push(insertedIndex);
                    fs.writeFileSync(FILE_NAME, JSON.stringify(database));
                } else {
                    res.status(404);
                }
            }
        } else {
            res.status(404);   
        }
    }

    res.send();
})