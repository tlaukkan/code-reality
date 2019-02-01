import 'mocha';
import {expect} from 'chai';
import uuid from "uuid";
import config from "config";
import {createIdToken, validateIdToken} from "../../../src/node/util/jwt";
const jwt = require('jsonwebtoken');

describe('JWT tests', function () {

    before(async () => {
    });

    beforeEach(async () => {
    });

    after(async () => {
    });

    it('test JWT library functions.', async () => {
        const userId = "1";
        const username = "test";
        const groups =  "administrators,viewers";
        const issuer: string = config.get("IdToken.issuer");
        const privateKeyEncoded: string = config.get("IdToken.privateKey");
        const privateKeyPassword: string = config.get("IdToken.privateKeyPassword");
        const publicKeyEncoded: string = config.get("IdToken.publicKey");

        let privateKey: string;
        if (privateKeyEncoded.startsWith('-')) {
            privateKey = privateKeyEncoded;
        } else {
            privateKey = Buffer.from(privateKeyEncoded, 'base64').toString();
        }

        let publicKey: string;
        if (publicKeyEncoded.startsWith('-')) {
            publicKey = publicKeyEncoded;
        } else {
            publicKey = Buffer.from(publicKeyEncoded, 'base64').toString();
        }

        const tokenId = uuid.v4();
        const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 100);
        const token = jwt.sign({
            iss: issuer,
            id: userId,
            jti: tokenId,
            name: username,
            groups: groups,
            exp: expiration,
        }, {
            key: privateKey,
            passphrase: privateKeyPassword
        }, {
            algorithm: 'RS256'
        });

        //console.log(token);
        const decoded = jwt.verify(token, publicKey, { algorithm: 'RS256'});
        expect(decoded.iss).eq(issuer);
        expect(decoded.id).eq(userId);
        expect(decoded.jti).eq(tokenId);
        expect(decoded.name).eq(username);
        expect(decoded.groups).eq(groups);
        expect(decoded.exp).eq(expiration);
    });

    it('test JWT create and verify.', async () => {
        const userId = "1";
        const username = "test";
        const groups =  "administrators,viewers";
        const issuer: string = config.get("IdToken.issuer");
        const privateKeyEncoded: string = config.get("IdToken.privateKey");
        const privateKeyPassword: string = config.get("IdToken.privateKeyPassword");
        const publicKeyEncoded: string = config.get("IdToken.publicKey");

        const idToken = createIdToken(issuer, userId, username, groups, privateKeyEncoded, privateKeyPassword);

        const claims = validateIdToken(idToken, publicKeyEncoded);
        expect(claims.get('iss')).eq(issuer);
        expect(claims.get('id')).eq(userId);
        expect(claims.get('jti')).exist;
        expect(claims.get('name')).eq(username);
        expect(claims.get('groups')).eq(groups);
        expect(claims.get('exp')).greaterThan(Date.now() / 1000);
    });

});