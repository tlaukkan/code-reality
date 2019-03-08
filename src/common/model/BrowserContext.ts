export class BrowserContext {
    userId: string;
    userName: string;
    groups: Array<string>;
    idToken: string;
    clusterUrl: string;
    space: string;

    constructor(userId: string, userName: string, groups: Array<string>, idToken: string, clusterUrl: string, space: string) {
        this.userId = userId;
        this.userName = userName;
        this.groups = groups;
        this.idToken = idToken;
        this.clusterUrl = clusterUrl;
        this.space = space;
    }
}