import * as mongodb from './mongoDB';

export async function isValidCredentials(name : string, password : string){
    let db = mongodb.getDb();
    let users = db.collection('Users');
    console.log(name + " " + password);
    let existingPlayer = await users.findOne({username: name});
    if(existingPlayer && existingPlayer.password == password)
        return true;
    return false;
}