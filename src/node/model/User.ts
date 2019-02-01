import {Principal} from "reality-space/lib/src/node/http/Principal";

export class User extends Principal {

    idToken: string;

    constructor(idToken: string, tokenId: string, requestId: string, userId: string, userName: string, groups: Array<string> | undefined, issuer: string) {
        super(issuer, tokenId, requestId, userId, userName, groups);
        this.idToken = idToken;
    }
}