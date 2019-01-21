import 'mocha';
import {createIdToken, validateIdToken} from "../../../src/node/util/jwt";
import {User} from "../../../src/node/model/User";
import * as assert from "assert";
const { generateKeyPairSync } = require('crypto');
const jwt = require('jsonwebtoken');
import { expect } from 'chai';

describe('JWT Test', () => {

    it('It should generate key pair, create and validate json web token.', async () => {
        const result =  generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        });
        const publicKey: string = result.publicKey;
        const privateKey: string = result.privateKey;
        console.log(publicKey);
        console.log(Buffer.from(publicKey).toString('base64'));
        console.log(privateKey);
        console.log(Buffer.from(privateKey).toString('base64'));

        var token = jwt.sign({ foo: 'bar' }, { key: privateKey, passphrase: 'top secret' }, { algorithm: 'RS256'});

        var decoded = jwt.verify(token, publicKey, { algorithm: 'RS256'});
        console.log(decoded.foo)

    });

    it('It should create and validate id token.', async () => {
        const token = createIdToken(new User("test@test", "test"));
        const claims = validateIdToken(token);
        console.log(claims);
        expect(claims.get("iss")).equal("test-issuer");
        expect(claims.get("id")).equal("mer/wU4OHCTVUiscKHeMxH5mjIik0Cl65dDoLmoHyG4=");
        expect(claims.get("email")).equal("test@test");
        expect(claims.get("name")).equal("test");
    });

});