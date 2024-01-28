import * as mongodb from './mongoDB';

export const GOOD_CREDENTIALS = 1;
export const EXISTING_EMAIL = 2;
export const EXISTING_USERNAME = 3;

export async function validations(name: string, email: string) {
    let users = mongodb.getDb().collection('Users');

    let existingUser = await users.findOne({username: name});
    let existingEmail = await users.findOne({email: email});

    if (existingUser) {
        return EXISTING_USERNAME;
    }
    else if (existingEmail) {
        return EXISTING_EMAIL;
    }
    else {
        return GOOD_CREDENTIALS;
    }
}