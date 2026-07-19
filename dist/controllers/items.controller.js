import * as ItemModel from "../models/item.model.js";
export async function getAllItems(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const search = req.query.search;
        const make = req.query.make;
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        const fuelType = req.query.fuelType;
        const condition = req.query.condition;
        const bodyType = req.query.bodyType;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { make: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } },
            ];
        }
        if (make)
            filter.make = { $regex: make, $options: "i" };
        if (fuelType)
            filter.fuelType = fuelType;
        if (condition)
            filter.condition = condition;
        if (bodyType)
            filter.bodyType = bodyType;
        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            filter.price = {};
            if (!isNaN(minPrice))
                filter.price.$gte = minPrice;
            if (!isNaN(maxPrice))
                filter.price.$lte = maxPrice;
        }
        const { items, total } = await ItemModel.findItems(filter, {
            page,
            limit,
            sort: { [sortBy]: sortOrder },
        });
        const response = {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
        res.json({ success: true, data: response });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function getItemById(req, res) {
    try {
        const item = await ItemModel.findItemById(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, error: "Item not found" });
            return;
        }
        res.json({ success: true, data: item });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function createItem(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: "Unauthorized" });
            return;
        }
        const itemData = {
            ...req.body,
            sellerId: userId,
            status: "available",
        };
        const item = await ItemModel.createItem(itemData);
        res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function updateItem(req, res) {
    try {
        const userId = req.userId;
        const item = await ItemModel.findItemById(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, error: "Item not found" });
            return;
        }
        if (item.sellerId !== userId) {
            res.status(403).json({ success: false, error: "Forbidden" });
            return;
        }
        const updated = await ItemModel.updateItem(req.params.id, req.body);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function deleteItem(req, res) {
    try {
        const userId = req.userId;
        const item = await ItemModel.findItemById(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, error: "Item not found" });
            return;
        }
        if (item.sellerId !== userId) {
            res.status(403).json({ success: false, error: "Forbidden" });
            return;
        }
        await ItemModel.deleteItem(req.params.id);
        res.json({ success: true, data: { message: "Item deleted" } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function getMyItems(req, res) {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const { items, total } = await ItemModel.findItems({ sellerId: userId }, { page, limit, sort: { createdAt: -1 } });
        const response = {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
        res.json({ success: true, data: response });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=items.controller.js.map