import { MongoClient, Db } from "mongodb";
export declare function connectDB(): Promise<Db>;
export declare function getDB(): Db;
export declare function getClient(): MongoClient;
export declare function disconnectDB(): Promise<void>;
//# sourceMappingURL=db.d.ts.map