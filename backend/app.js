const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const utils = require("./utils");
const cors = require('cors');
const { 
    getDatabasesFromDB, 
    insertDataInDB, 
    deleteDataInDB, 
    createIndexTable, 
    deleteAllFromTable, 
    insertAllInTable 
} = require("./dbFunctions");

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

app.post("/database/:databaseName/table/:tableName/index", async (req, res) => {
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
            const indexList = tableList[tableIndex].indexFiles || [];
            const indexPozition = utils.findItemInList(indexList, 'indexName', insertedIndex.indexName);

            if (indexPozition !== -1) {
                res.status(400);
                res.send('Index already in database');
            } else {
                const attrList = tableList[tableIndex].attributes;
                const attribute = insertedIndex.indexAttribute;
                const attributeIndex = utils.findItemInList(attrList, 'attributeName', attribute);
                const isForeignKey = !!utils.isForeignKey(attribute, tableList[tableIndex].foreignKeys);
                const isUnique = utils.isUniqueAttribute(attribute, attrList);
                const indexPositionInAttributeList = utils.getIndexPositionFromAttributeList(attribute, attrList) - tableList[tableIndex].primaryKey.length;

                if (attributeIndex !== -1) {
                    indexList.push(insertedIndex);
                    fs.writeFileSync(FILE_NAME, JSON.stringify(databaseFromFile));

                    const dataFromDb = await getDatabasesFromDB(databaseName, tableName);
                    
                    if (isForeignKey || isUnique) {
                        const indexGeneratedData = utils.generateIndexData(dataFromDb, indexPositionInAttributeList, isForeignKey, isUnique);
                        createIndexTable(databaseName, tableName, insertedIndex.indexName, attribute, indexGeneratedData);
                    }

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
            const hasDuplicatePrimaryKey = !utils.canInsertRecordWithPrimaryKey(data.key, dataFromDb);
            let foreignKeyValueExists = true;
            let isUniqueValue = true;

            for (let i = 0; i < tableList[tableIndex].foreignKeys.length; i++) {   
                const foreignKey = tableList[tableIndex].foreignKeys[i];
                const parentTableData = await getDatabasesFromDB(databaseName, foreignKey.referencedTableName);
                const foreignKeyValueExistsInParentTable = await utils.foreignKeyValueExists(parentTableData, foreignKey, data, tableList[tableIndex].attributes, tableList[tableIndex].primaryKey.length);
                                
                if (!foreignKeyValueExistsInParentTable) {
                    foreignKeyValueExists = false;
                }
            }

            for (let i = 0; i < tableList[tableIndex].indexFiles.length; i++) {
                const index = tableList[tableIndex].indexFiles[i];
                const isIndexUnique = utils.isUniqueAttribute(index.indexAttribute, tableList[tableIndex].attributes);

                if (isIndexUnique) {
                    const indexData = await getDatabasesFromDB(databaseName, tableName + index.indexAttribute + index.indexName);
                    const attributePosition = utils.findItemInList(tableList[tableIndex].attributes, 'attributeName', index.indexAttribute) - tableList[tableIndex].primaryKey.length;
                    const values = data.value.split("#");
                    const valueExists =  indexData.find(indexValue => indexValue.key === values[attributePosition])
                    
                    if (valueExists) {
                        isUniqueValue = false;
                    }
                }
            }

            if (hasDuplicatePrimaryKey) {
                res.status(400);
                res.send("Primary key value should not repeat itself");
            } else if (!foreignKeyValueExists) {
                res.status(400);
                res.send("The value inserted for the foreign key does not exist!");
            } else if (!isUniqueValue) {
                res.status(400);
                res.send("The value inserted for the unique attribute is not unique!");
            } else {
                const newDataForDb = dataFromDb.concat([data]);

                for (let i = 0; i < tableList[tableIndex].indexFiles.length; i++) {
                    const indexFile = tableList[tableIndex].indexFiles[i];
                    const isForeignKey = !!utils.isForeignKey(indexFile.indexAttribute, tableList[tableIndex].foreignKeys);
                    const isUnique = utils.isUniqueAttribute(indexFile.indexAttribute, tableList[tableIndex].attributes);
                    const indexPositionInAttributeList = 
                        utils.getIndexPositionFromAttributeList(indexFile.indexAttribute, tableList[tableIndex].attributes) - 
                        tableList[tableIndex].primaryKey.length;
                    const indexGeneratedData = utils.generateIndexData(newDataForDb, indexPositionInAttributeList, isForeignKey, isUnique);
                    
                    deleteAllFromTable(databaseName, tableName + indexFile.indexAttribute + indexFile.indexName);
                    createIndexTable(databaseName, tableName, indexFile.indexName, indexFile.indexAttribute, indexGeneratedData);
                }
               
            
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
            } else { 
                const childTables = utils.getChildTables(tableName, tableList) || [];
                const parentTableProcessedData = utils.processData(dataFromDb);
                let canDeleteData = true;

                for (let i = 0; i < childTables.length; i++) {
                    const childTable = childTables[i];
                    const fkIndex = utils.geyFKIndex(childTable.indexFiles, childTable.foreignKeys);
                    let indexData = [];

                    if (fkIndex) {
                        const attributePosition = tableList[tableIndex].attributes.findIndex(attribute => attribute.attributeName === conditions.attributeName);

                        indexData = await getDatabasesFromDB(databaseName, childTable.tableName + fkIndex.indexAttribute + fkIndex.indexName);
                        canDeleteData = utils.checkIfValuesCanBeDeleted(parentTableProcessedData, indexData, conditions, attributePosition);
                    }
                }

                if (canDeleteData) {
                    const deletionSuccessful = await deleteDataInDB(databaseName, tableList[tableIndex], conditions, parentTableProcessedData);

                    if (deletionSuccessful) {
                        const dataAfterDeletionFromDb = await getDatabasesFromDB(databaseName, tableName);

                        for (let i = 0; i < tableList[tableIndex].indexFiles.length; i++) {
                            const indexFile = tableList[tableIndex].indexFiles[i];
                            const isForeignKey = !!utils.isForeignKey(indexFile.indexAttribute, tableList[tableIndex].foreignKeys);
                            const isUnique = utils.isUniqueAttribute(indexFile.indexAttribute, tableList[tableIndex].attributes);
                            const indexPositionInAttributeList = 
                                utils.getIndexPositionFromAttributeList(indexFile.indexAttribute, tableList[tableIndex].attributes) - 
                                tableList[tableIndex].primaryKey.length;
                            const indexGeneratedData = utils.generateIndexData(dataAfterDeletionFromDb, indexPositionInAttributeList, isForeignKey, isUnique);
  
                            deleteAllFromTable(databaseName, tableName + indexFile.indexAttribute + indexFile.indexName);
                            createIndexTable(databaseName, tableName, indexFile.indexName, indexFile.indexAttribute, indexGeneratedData);
                        }

                        res.send([]);
                    } else {
                        res.status(500);
                        res.send('Something went wrong while deleting the records!');
                    }          
                } else {
                    res.status(400);
                    res.send("Can't delete records because the value is used in a child table!");
                }
            }
        }
    }
});

app.post("/database/:databaseName/table/:tableName/select-data", async (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.databaseName;
    const tableName = req.params.tableName;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);
    let attributes = req.body.attributes;
    const conditions = req.body.conditions;
    const distinct = req.body.distinct;

    if (databaseIndex === -1) {
        res.status(404);
        res.send('Database not found!');
    } else {
        const tableList = databaseFromFile.databases[databaseIndex].tables;
        const tableIndex = utils.findItemInList(tableList, 'tableName', tableName);

        if (tableIndex !== -1) {
            const dataFromDb = await getDatabasesFromDB(databaseName, tableName);
            
            if (attributes[0] === "*") {
                attributes = tableList[tableIndex].attributes.map(attr => attr.attributeName);
            }

            if (!dataFromDb.length) {
                res.status(404);
                res.send('There are no records in this table!');
            } else { 
                let records = dataFromDb.map(record => {
                    let value = [record.key];
                    
                    record.value.split('#').forEach(val => value.push(val));
                    return value;
                });

                conditions.forEach(condition => {
                    const attributeIndex = tableList[tableIndex].attributes.findIndex(attr => condition.attributeName === attr.attributeName);
                    
                    records = records.filter(record => {
                        if (condition.condition === 'eq') {
                            return record[attributeIndex] === condition.value;
                        } else if (condition.condition === 'neq') {
                            return record[attributeIndex] !== condition.value;
                        } else if (condition.condition === 'gt') {
                            return record[attributeIndex] > condition.value;
                        } else if (condition.condition === 'gte') {
                            return record[attributeIndex] >= condition.value;
                        } else if (condition.condition === 'lt') {
                            return record[attributeIndex] < condition.value;
                        } else if (condition.condition === 'lte') {
                            return record[attributeIndex] <= condition.value;
                        }
                    })
                });

                
                    const indexValues = attributes.map(attr => {
                        return tableList[tableIndex].attributes.findIndex(attribute => attr === attribute.attributeName);
                    });

                    let finalArray = [];

                    for (let i = 0; i < records.length; i++) {
                        let val = '';
                        const recordVal = [];

                        for (let indexI = 0; indexI < indexValues.length; indexI++) {
                            val = val + records[i][indexValues[indexI]];
                            recordVal.push(records[i][indexValues[indexI]]);
                        }

                        if (finalArray.length === 0 && distinct) {
                            finalArray.push(recordVal);
                        }
                        
                        if (distinct) {
                            let isInArray = false;
                            for(let j = 0; j < finalArray.length; j++) {
                                let valJ = '';

                                for (let indexJ = 0; indexJ < indexValues.length; indexJ++) {
                                    valJ = valJ + records[j][indexValues[indexJ]];
                                }

                                if (val === valJ) {
                                    isInArray = true;
                                }
                            }

                            if (!isInArray) {
                                finalArray.push(recordVal);
                            }
                        } else {
                            finalArray.push(recordVal);
                        }
                    }
                    records = finalArray;

                attributes = attributes.map(attr => {
                    return tableList[tableIndex].attributes.find(attribute => attribute.attributeName === attr);
                });

                const response = {
                    data: records,
                    attributesList: attributes
                };

                res.send(response);
            }
        }
    }
});

app.post("/database/:databaseName/generate-records", async (req, res) => {
    const databaseFromFile = readFromFile(FILE_NAME);
    const databaseName = req.params.databaseName;
    const tableName = req.body.tableName;
    const databaseIndex = utils.findItemInList(databaseFromFile.databases, 'dataBaseName', databaseName);
    
    if (databaseIndex === -1) {
        res.status(404);
        res.send('Database not found!');
    } else {
        const tableList = databaseFromFile.databases[databaseIndex].tables;
        const tableIndex = utils.findItemInList(tableList, 'tableName', tableName);

        if (tableIndex !== -1) {
            const attributes = tableList[tableIndex].attributes;
            const primaryKeys = tableList[tableIndex].primaryKey;
            let attributeNames = [];

            attributes.forEach(attribute => {
                if (primaryKeys.find(primaryKey => primaryKey === attribute.attributeName)) {
                    attributeNames.push({
                        attributeName: attribute.attributeName,
                        isPrimaryKey: true
                    });
                } else {
                    attributeNames.push({
                        attributeName: attribute.attributeName,
                        isPrimaryKey: false
                    });
                }
            });

            let records = [];

            for (let j = 0; j < 1000000; j++) {
                let key = '';
                let value = '';
                
                attributeNames.forEach(attribute => {
                    if (attribute.isPrimaryKey) {
                        key = attribute.attributeName + j
                    } else {
                        value = value + attribute.attributeName + j + '#';
                    }
                });
                
                value = value.substring(0, value.length - 1);
                records.push({key, value});
            }

            const insertionSuccessfull = insertAllInTable(databaseName, tableName, records);

            if (insertionSuccessfull) {
                res.send([]);
            } else {
                res.status(500);
                res.send('Something went wrong while inserting the record!');
            }  
        }
    }
});