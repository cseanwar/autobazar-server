import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
function getCollection() {
    return getDB().collection("items");
}
export async function createItem(item) {
    const now = new Date();
    const doc = {
        ...item,
        createdAt: now,
        updatedAt: now,
    };
    const result = await getCollection().insertOne(doc);
    return { ...doc, _id: result.insertedId.toString() };
}
export async function findItemById(id) {
    const collection = getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc)
        return null;
    return { ...doc, _id: doc._id?.toString() };
}
export async function findItems(filter = {}, options = {}) {
    const collection = getCollection();
    const page = options.page || 1;
    const limit = options.limit || 12;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        collection.find(filter)
            .sort(options.sort || { createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
        collection.countDocuments(filter),
    ]);
    return {
        items: items.map((doc) => ({ ...doc, _id: doc._id?.toString() })),
        total,
    };
}
export async function updateItem(id, updates) {
    const collection = getCollection();
    updates.updatedAt = new Date();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: "after" });
    if (!result)
        return null;
    return { ...result, _id: result._id?.toString() };
}
export async function deleteItem(id) {
    const collection = getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}
export async function countItems(filter = {}) {
    return getCollection().countDocuments(filter);
}
//# sourceMappingURL=item.model.js.map