import {Object3D} from "three";

export class CollidableCrawler {
    self: Object3D;
    root: Object3D;

    children: Array<Object3D>;
    queuedChildren: Array<Array<Object3D>>;
    collidablesFinal: Array<Object3D>;
    collideablesTemporary: Array<Object3D>;
    queuedChildrenIndex: number;
    childrenIndex: number;
    initialCrawlDone: boolean;

    constructor(self: Object3D,root: Object3D) {
        this.self = self;
        this.root = root;
        this.queuedChildren = [];
        this.queuedChildren.push(this.root.children);
        this.queuedChildrenIndex = 0;
        this.children = [];
        this.childrenIndex = 0;
        this.collidablesFinal = [];
        this.collideablesTemporary = [];
        this.initialCrawlDone = false;
    }

    start() {
        this.crawl()
    }

    collideables(): Array<Object3D> {
        return this.collidablesFinal;
    }

    fullCrawl() {
        while (!this.crawl()) ;
    }

    crawl() {
        if (!this.initialCrawlDone) {
            this.initialCrawlDone = true;
            this.fullCrawl();
            return;
        }
        if (this.children.length > this.childrenIndex) {
            const current = this.children[this.childrenIndex];
            this.childrenIndex++;
            if (current === this.self) {
                return;
            }
            this.queuedChildren.push(current.children);
            if (current.type === 'Mesh') {
                this.collideablesTemporary.push(current)
            }
        } else {
            if (this.queuedChildren.length > this.queuedChildrenIndex) {
                this.children = this.queuedChildren[this.queuedChildrenIndex];
                this.childrenIndex = 0;
                this.queuedChildrenIndex++;
            } else {
                this.queuedChildren = [];
                this.queuedChildren.push(this.root.children);
                this.queuedChildrenIndex = 0;
                this.collidablesFinal = this.collideablesTemporary;
                this.collideablesTemporary = [];
                return true;
            }
        }
        return false;
    }
}