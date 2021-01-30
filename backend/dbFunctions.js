const MongoClient = require('mongodb').MongoClient;
const MongoUrl = "mongodb://localhost:27017";

async function getDatabasesFromDB(databaseName, tableName) {
    const client = new MongoClient(MongoUrl, {useUnifiedTopology: true});
    await client.connect();

    const db = client.db(databaseName);
    let tableData = await db.collection(tableName).find({}).toArray();

    if (tableData instanceof Error) {
        return null;
    }

    tableData = tableData.map(data => {
        const obj = {
            key: data.key,
            value: data.value
        };

        return obj;
    })

    return tableData;
}

async function createIndexTable(databaseName, tableName, indexName, attributeName, data) {
    const client = new MongoClient(MongoUrl, {useUnifiedTopology: true});
    await client.connect();
    let indexTableName = tableName + attributeName + indexName;

    const db = client.db(databaseName);
    db.collection(indexTableName).insertMany(data, (err, res) => {
        if (err) {
            console.log(`Error for inserting data in ${indexTableName}`);
            return false;
        }

        console.log(`Data inserted in ${indexTableName}`);
        return true;
    })
}

async function insertAllInTable(databaseName, tableName, data) {
    const client = new MongoClient(MongoUrl, {useUnifiedTopology: true});
    await client.connect();

    const db = client.db(databaseName);

    db.collection(tableName).insertMany(data, (err, res) => {
        if (err) {
            return false;
        }
    
        return true;
    });
}

async function insertDataInDB(databaseName, tableName, data) {
    const client = new MongoClient(MongoUrl, {useUnifiedTopology: true});
    await client.connect();

    const db = client.db(databaseName);
    db.collection(tableName).insertOne(data, (err, res) => {
        if (err) {
            console.log(`Error for inserting data in ${tableName}`);
            return false;
        }
        console.log(`Data inserted in ${tableName}`);
        return true;
    });
}

async function deleteAllFromTable(databaseName, tableName, data) {
    const client = new MongoClient(MongoUrl, {useUnifiedTopology: true});
    await client.connect();

    const db = client.db(databaseName);
    db.collection(tableName).deleteMany({});
}

async function deleteDataInDB(databaseName, table, conditions, records) {
    const client = new MongoClient(MongoUrl, {useUnifiedTopology: true});
    await client.connect();

    const db = client.db(databaseName);

    const attributeIndex = table.attributes.findIndex(attribute => attribute.attributeName === conditions.attributeName);

    let recordsList = records.filter(record => {
        if (conditions.condition === 'eq') {
            return record[attributeIndex] !== conditions.value;
        } else if (conditions.condition === 'neq') {
            return record[attributeIndex] === conditions.value;
        } else if (conditions.condition === 'gt') {
            return record[attributeIndex] <= conditions.value;
        } else if (conditions.condition === 'gte') {
            return record[attributeIndex] >= conditions.value;
        } else if (conditions.condition === 'lt') {
            return record[attributeIndex] < conditions.value;
        } else if (conditions.condition === 'lte') {
            return record[attributeIndex] > conditions.value;
        }
    });

    recordsList = recordsList.map(record => {
        let value = '';

        for (let i = 1; i < record.length; i++) {
            value = value + record[i] + '#';
        }

        return {
            key: record[0],
            value: value.substr(0, value.length - 1)
        }
    });

    db.collection(table.tableName).deleteMany({});
    if (recordsList.length) {
        db.collection(table.tableName).insertMany(recordsList, (err, res) => {
            if (err) {
                console.log(`Error for deleting data from ${table.tableName}`);
                return false;
            }
            console.log(`Data delete from ${table.tableName}`);
            return true;
        });
    }

    return true;
}

module.exports = { 
    getDatabasesFromDB,
    insertDataInDB,
    deleteDataInDB,
    createIndexTable,
    deleteAllFromTable,
    insertAllInTable
}