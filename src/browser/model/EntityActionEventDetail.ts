export class EntityActionEventDetail {
    action: string;
    description: string;
    constructor(action: string, state: string) {
        this.action = action;
        this.description = state;
    }
}