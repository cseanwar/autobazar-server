export interface UserProfile {
    _id?: string;
    userId: string;
    displayName: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare function createProfile(profile: Omit<UserProfile, "_id" | "createdAt" | "updatedAt">): Promise<UserProfile>;
export declare function findProfileByUserId(userId: string): Promise<UserProfile | null>;
//# sourceMappingURL=user.model.d.ts.map