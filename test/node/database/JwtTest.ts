import 'mocha';
const { generateKeyPairSync } = require('crypto');
const jwt = require('jsonwebtoken');

describe('JWT Test', () => {

    it('It should generate key pair.', async () => {
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
        console.log(privateKey);

        var token = jwt.sign({ foo: 'bar' }, { key: privateKey, passphrase: 'top secret' }, { algorithm: 'RS256'});

        var decoded = jwt.verify(token, publicKey, { algorithm: 'RS256'});
        console.log(decoded.foo)

    });

});