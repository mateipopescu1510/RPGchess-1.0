import * as mongodb from './mongoDB';

export async function isValidCredentials(name: string, password: string) {
    let users = mongodb.getDb().collection('Users');

    let existingUser = await users.findOne({username: name});

    if(existingUser && existingUser.password == password)
        return true;

    return false;
}