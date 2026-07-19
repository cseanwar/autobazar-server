import { Sort, Filter } from "mongodb";
import { CarItem } from "../types/index.js";
export declare function createItem(item: Omit<CarItem, "_id" | "createdAt" | "updatedAt">): Promise<CarItem>;
export declare function findItemById(id: string): Promise<CarItem | null>;
export declare function findItems(filter?: Filter<CarItem>, options?: {
    page?: number;
    limit?: number;
    sort?: Sort;
}): Promise<{
    items: CarItem[];
    total: number;
}>;
export declare function updateItem(id: string, updates: Partial<CarItem>): Promise<CarItem | null>;
export declare function deleteItem(id: string): Promise<boolean>;
export declare function countItems(filter?: Filter<CarItem>): Promise<number>;
//# sourceMappingURL=item.model.d.ts.map