import {User} from "../model/User";
const jwt = require('jsonwebtoken');
import config from 'config';

export function createIdToken(user: User) {
    let privateKeyEncoded = config.get("IdToken.privateKey") as string;
    let issuer = config.get("IdToken.issuer") as string;
    let privateKey: string;
    if (privateKeyEncoded.startsWith('-')) {
        privateKey = privateKeyEncoded;
    } else {
        privateKey = Buffer.from(privateKeyEncoded, 'base64').toString();
    }

    var token = jwt.sign({
        iss: issuer,
        id: user.id,
        name: user.name,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, {
        key: privateKey,
        passphrase: 'top secret'
    }, {
        algorithm: 'RS256'
    });
    return token;
}

export function validateIdToken(idToken: string) : Map<String, String> {
    let publicKeyEncoded = config.get("IdToken.publicKey") as string;
    let issuer = config.get("IdToken.privateKey") as string;
    let publicKey: string;
    if (publicKeyEncoded.startsWith('-')) {
        publicKey = publicKeyEncoded;
    } else {
        publicKey = Buffer.from(publicKeyEncoded, 'base64').toString();
    }

    var decoded = jwt.verify(idToken, publicKey, { algorithm: 'RS256'});
    const map = new Map<String, String>();
    Object.keys(decoded).forEach(key => {
        map.set(key, decoded[key]);
    });
    return map;
}