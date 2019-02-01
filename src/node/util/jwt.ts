const jwt = require('jsonwebtoken');
import uuid = require("uuid");

export function createIdToken(issuer: String, userId: string, userName: string, groups: string, privateKeyEncoded: string, privateKeyPassword: string): string {
    let privateKey: string;
    if (privateKeyEncoded.startsWith('-')) {
        privateKey = privateKeyEncoded;
    } else {
        privateKey = Buffer.from(privateKeyEncoded, 'base64').toString();
    }

    var token = jwt.sign({
        iss: issuer,
        id: userId,
        jti: uuid.v4(),
        name: userName,
        groups: groups,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, {
        key: privateKey,
        passphrase: privateKeyPassword
    }, {
        algorithm: 'RS256'
    });
    return token;
}

export function validateIdToken(idToken: string, publicKeyEncoded: string) : Map<String, String> {
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

export function decodeIdToken(idToken: string) : Map<String, String> {
    var decoded = jwt.decode(idToken);
    const map = new Map<String, String>();
    Object.keys(decoded).forEach(key => {
        map.set(key, decoded[key]);
    });
    return map;
}


