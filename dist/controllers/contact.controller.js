import { getDB } from "../config/db.js";
export async function submitContact(req, res) {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            res.status(400).json({ success: false, error: "All fields are required" });
            return;
        }
        const db = getDB();
        const result = await db.collection("contacts").insertOne({
            name,
            email,
            subject,
            message,
            createdAt: new Date(),
        });
        res.status(201).json({
            success: true,
            data: { id: result.insertedId.toString(), message: "Message sent successfully" },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=contact.controller.js.map