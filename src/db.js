const { MongoClient, ServerApiVersion } = require('mongodb');

function getClient(path){
    require('dotenv').config({path: path});
    const url = `mongodb+srv://${process.env.mongoDBUsername}:${process.env.mongoDBPassword}@pkcserver.kucpp.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(url, {
        serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
        }
    });
    return client;
}

module.exports = getClient;