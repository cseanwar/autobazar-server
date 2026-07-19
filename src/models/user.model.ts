import { Collection } from "mongodb";
import { getDB } from "../config/db.js";

export interface UserProfile {
  _id?: string;
  userId: string;
  displayName: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

function getCollection(): Collection<UserProfile> {
  return getDB().collection<UserProfile>("userProfiles");
}

export async function createProfile(profile: Omit<UserProfile, "_id" | "createdAt" | "updatedAt">): Promise<UserProfile> {
  const now = new Date();
  const doc: Omit<UserProfile, "_id"> = {
    ...profile,
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection().insertOne(doc as UserProfile);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function findProfileByUserId(userId: string): Promise<UserProfile | null> {
  return getCollection().findOne({ userId });
}
