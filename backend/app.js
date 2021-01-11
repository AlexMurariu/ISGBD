const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const utils = require("./utils");
const cors = require('cors');
const { getDatabasesFromDB, insertDataInDB, deleteDataInDB } = require("./dbFunctions");

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
        res.status(404);
        res.send({
            status: 404,
            message: 'Database does not exist'
        });
    } else {
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
            res.send(databaseFromFile.databases[databaseIndex].tables);
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

        if (tableList[tableIndex].foreignKeys.length) {
            res.status(405);
            res.send("Can't delete table, check if there are other tables referenced by the foreign key!");
            return;
        }    
        
        if (tableIndex !== -1) {
            databaseFromFile.databases[databaseIndex].tables.splice(tableIndex, 1);
            fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));
            res.send({tableName});
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
                const attribute = insertedIndex.indexAttribute;
                const attributeIndex = utils.findItemInList(attrList, 'attributeName', attribute);

                if (attributeIndex !== -1) {
                    indexList.push(insertedIndex);
                    fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));
                    res.send(databaseFromFile.databases[databaseIndex].tables);
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

app.get("/database/:databaseName/table/:tableName/data", async (req, res) => {
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
            const dataFromDb = await getDatabasesFromDB(databaseName, tableName);
            if (dataFromDb) {
                res.send(dataFromDb);
            } else {
                res.status(500);
                res.send("Something went wrong!");
            }
        }
    }
});

app.post("/database/:databaseName/table/:tableName/data", async (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.databaseName;
    const tableName = req.params.tableName;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);
    const data = req.body;

    if (databaseIndex === -1) {
        res.status(404);
        res.send('Database not found!');
    } else {
        const tableList = databaseFromFile.databases[databaseIndex].tables;
        const tableIndex = utils.findItemInList(tableList, 'tableName', tableName);

        if (tableIndex !== -1) {
            const dataFromDb = await getDatabasesFromDB(databaseName, tableName);
            const hasDuplicateUniqueValue = !utils.canInsertRecordWithUniqueValue(tableList[tableIndex].attributes, data.value, dataFromDb);
            const hasDuplicatePrimaryKey = !utils.canInsertRecordWithPrimaryKey(data.key, dataFromDb);

            if (hasDuplicatePrimaryKey) {
                res.status(400);
                res.send("Primary key value should not repeat itself");
            } else if (hasDuplicateUniqueValue) {
                res.status(400);
                res.send("One of the attributes is unique, and it's value must be different");
            } else {
                const insertionSuccessful = insertDataInDB(databaseName, tableName, data);
            
                if (insertionSuccessful) {
                    res.send([]);
                } else {
                    res.status(500);
                    res.send('Something went wrong while inserting the record!');
                }   
            }
        }
    }
});

app.post("/database/:databaseName/table/:tableName/delete-data", async (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.databaseName;
    const tableName = req.params.tableName;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);
    const conditions = req.body;

    if (databaseIndex === -1) {
        res.status(404);
        res.send('Database not found!');
    } else {
        const tableList = databaseFromFile.databases[databaseIndex].tables;
        const tableIndex = utils.findItemInList(tableList, 'tableName', tableName);

        if (tableIndex !== -1) {
            const dataFromDb = await getDatabasesFromDB(databaseName, tableName);

            if (!dataFromDb.length) {
                res.status(404);
                res.send('There are no records in this table!');
            } else if (utils.isReferencedByForeignKey(tableList[tableIndex], tableList)) {
                res.status(400);
                res.send('Cannot delete record, because of the foreign key constraint!');
            } else {   
                const processedData = utils.processData(dataFromDb);
                
                const deletionSuccessful = await deleteDataInDB(databaseName, tableList[tableIndex], conditions, processedData);
                
                if (deletionSuccessful) {
                    res.send([]);
                } else {
                    res.status(500);
                    res.send('Something went wrong while deleting the records!');
                }   
            }
        }
    }
});