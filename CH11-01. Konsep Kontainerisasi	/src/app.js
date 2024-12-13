const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const { MongoClient } = require('mongodb');
const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://admin:admin@localhost:27017');

async function main() {
    const connection = await mongoClient.connect();
    const db = connection.db('logs');


    app.use((req, res, next) => {
        console.log('Time:', Date().toLocaleString());
        db.collection('logs').insertOne({
            time: Date().toLocaleString(),
            url: req.url,
            method: req.method
        });
        next();
    })
    
    app.get('/', (req, res) => {
        res.send('Hello World!');
    })
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })    
}

main()