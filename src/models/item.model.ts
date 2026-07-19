import { Collection, ObjectId, Sort, Filter, WithId } from "mongodb";
import { getDB } from "../config/db.js";
import { CarItem } from "../types/index.js";

function getCollection(): Collection<CarItem> {
  return getDB().collection<CarItem>("items");
}

export async function createItem(item: Omit<CarItem, "_id" | "createdAt" | "updatedAt">): Promise<CarItem> {
  const now = new Date();
  const doc: Omit<CarItem, "_id"> = {
    ...item,
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection().insertOne(doc as CarItem);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function findItemById(id: string): Promise<CarItem | null> {
  const collection = getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) as unknown as CarItem["_id"] });
  if (!doc) return null;
  return { ...doc, _id: doc._id?.toString() };
}

export async function findItems(filter: Filter<CarItem> = {}, options: {
  page?: number;
  limit?: number;
  sort?: Sort;
} = {}): Promise<{ items: CarItem[]; total: number }> {
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

export async function updateItem(id: string, updates: Partial<CarItem>): Promise<CarItem | null> {
  const collection = getCollection();
  updates.updatedAt = new Date();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) as unknown as CarItem["_id"] },
    { $set: updates },
    { returnDocument: "after" },
  );
  if (!result) return null;
  return { ...result, _id: result._id?.toString() };
}

export async function deleteItem(id: string): Promise<boolean> {
  const collection = getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) as unknown as CarItem["_id"] });
  return result.deletedCount > 0;
}

export async function countItems(filter: Filter<CarItem> = {}): Promise<number> {
  return getCollection().countDocuments(filter);
}
