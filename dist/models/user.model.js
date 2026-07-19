import { getDB } from "../config/db.js";
function getCollection() {
    return getDB().collection("userProfiles");
}
export async function createProfile(profile) {
    const now = new Date();
    const doc = {
        ...profile,
        createdAt: now,
        updatedAt: now,
    };
    const result = await getCollection().insertOne(doc);
    return { ...doc, _id: result.insertedId.toString() };
}
export async function findProfileByUserId(userId) {
    return getCollection().findOne({ userId });
}
//# sourceMappingURL=user.model.js.map