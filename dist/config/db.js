import { MongoClient } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "autobazar_db";
let client = null;
let db = null;
export async function connectDB() {
    if (db)
        return db;
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB: ${DB_NAME}`);
    return db;
}
export function getDB() {
    if (!db)
        throw new Error("Database not initialized. Call connectDB() first.");
    return db;
}
export function getClient() {
    if (!client)
        throw new Error("Database not initialized. Call connectDB() first.");
    return client;
}
export async function disconnectDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}
//# sourceMappingURL=db.js.map