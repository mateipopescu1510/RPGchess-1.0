const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://RPGChess:iftEFTAOtJtMU9VG@rpgchess.6vcgjc3.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'RPGChessDB';

let db : any;

export async function connectToDb() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        console.log('Connected to database server');
        db = client.db(dbName);
    } catch (err : any) {
        console.log(err.stack);
    }
}

export function getDb() {
    return db;
}

export async function getUser(username) {
    return db.collection('Users').findOne({username: username});
}
