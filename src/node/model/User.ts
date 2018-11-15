import crypto, {HexBase64Latin1Encoding} from 'crypto';

export class User {

    public id: string;
    public name: string;
    public email: string;

    constructor(email: string, name: string) {
        this.name = name;
        this.email = email;
        if (email === '') {
            this.id = '';
        } else {
            this.id = crypto.createHash('sha256').update(this.email).digest("base64");
        }
    }

}