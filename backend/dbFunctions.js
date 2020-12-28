const MongoClient = require('mongodb').MongoClient;
const MongoUrl = "mongodb://localhost:27017";

async function getDatabasesFromDB() {
    const client = new MongoClient(MongoUrl);
    await client.connect();

    const admin = client.db().admin();
    console.log(await admin.listDatabases());
};

module.exports = { 
    getDatabasesFromDB 
}