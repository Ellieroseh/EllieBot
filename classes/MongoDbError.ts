export default class MongoDbError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.name = "MongoDbError";
    }
}