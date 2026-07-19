import { Request, Response } from "express";
import { Filter, Sort } from "mongodb";
import * as ItemModel from "../models/item.model.js";
import { CarItem, PaginatedResponse } from "../types/index.js";

export async function getAllItems(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string | undefined;
    const make = req.query.make as string | undefined;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    const fuelType = req.query.fuelType as string | undefined;
    const condition = req.query.condition as string | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    const filter: Filter<CarItem> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }
    if (make) filter.make = { $regex: make, $options: "i" } as any;
    if (fuelType) filter.fuelType = fuelType as CarItem["fuelType"];
    if (condition) filter.condition = condition as CarItem["condition"];
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      filter.price = {} as any;
      if (!isNaN(minPrice)) (filter.price as any).$gte = minPrice;
      if (!isNaN(maxPrice)) (filter.price as any).$lte = maxPrice;
    }

    const { items, total } = await ItemModel.findItems(filter, {
      page,
      limit,
      sort: { [sortBy]: sortOrder } as Sort,
    });

    const response: PaginatedResponse<CarItem> = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getItemById(req: Request, res: Response) {
  try {
    const item = await ItemModel.findItemById(req.params.id as string as string);
    if (!item) {
      res.status(404).json({ success: false, error: "Item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function createItem(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const itemData: Omit<CarItem, "_id" | "createdAt" | "updatedAt"> = {
      ...req.body,
      sellerId: userId,
      status: "available",
    };

    const item = await ItemModel.createItem(itemData);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function updateItem(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const item = await ItemModel.findItemById(req.params.id as string);

    if (!item) {
      res.status(404).json({ success: false, error: "Item not found" });
      return;
    }
    if (item.sellerId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    const updated = await ItemModel.updateItem(req.params.id as string, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function deleteItem(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const item = await ItemModel.findItemById(req.params.id as string);

    if (!item) {
      res.status(404).json({ success: false, error: "Item not found" });
      return;
    }
    if (item.sellerId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    await ItemModel.deleteItem(req.params.id as string);
    res.json({ success: true, data: { message: "Item deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getMyItems(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { items, total } = await ItemModel.findItems(
      { sellerId: userId },
      { page, limit, sort: { createdAt: -1 } },
    );

    const response: PaginatedResponse<CarItem> = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
