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

module.exports = { 
    getDatabasesFromDB,
    insertDataInDB
}