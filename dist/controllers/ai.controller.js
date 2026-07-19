import { Groq } from "groq-sdk";
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});
const DESCRIPTION_TEMPLATES = {
    professional: "Write a professional, detailed car listing description. Focus on specifications, condition, and value proposition. Be factual and precise.",
    enthusiast: "Write an engaging, passionate car listing description. Highlight performance, driving experience, and unique characteristics. Use energetic language.",
    luxury: "Write an elegant, refined car listing description. Emphasize craftsmanship, premium features, and exclusivity. Use sophisticated language.",
};
const DESCRIPTION_LENGTHS = {
    short: "Keep the description concise, around 50-80 words.",
    medium: "Write a moderate-length description, around 100-150 words.",
    long: "Write a comprehensive description, around 200-300 words.",
};
export async function generateDescription(req, res) {
    try {
        const { make, model, year, condition, mileage, fuelType, transmission, color, features, tone, length } = req.body;
        if (!make || !model || !year) {
            res.status(400).json({ success: false, error: "Make, model, and year are required" });
            return;
        }
        const toneGuide = DESCRIPTION_TEMPLATES[tone || "professional"];
        const lengthGuide = DESCRIPTION_LENGTHS[length || "medium"];
        const featuresList = features?.length ? `Key features: ${features.join(", ")}.` : "";
        const prompt = `Generate a car listing description for a ${year} ${make} ${model}.

Details:
- Condition: ${condition || "N/A"}
- Mileage: ${mileage ? `${mileage.toLocaleString()} miles` : "N/A"}
- Fuel Type: ${fuelType || "N/A"}
- Transmission: ${transmission || "N/A"}
- Color: ${color || "N/A"}
${featuresList}

Style: ${toneGuide}
${lengthGuide}

Generate only the description text, no additional commentary.`;
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a professional automotive copywriter specializing in car listings. Generate compelling, accurate, and well-structured descriptions.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: length === "short" ? 200 : length === "medium" ? 400 : 600,
        });
        const description = completion.choices[0]?.message?.content || "";
        res.json({ success: true, data: { description } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function chat(req, res) {
    try {
        const { message, history } = req.body;
        if (!message) {
            res.status(400).json({ success: false, error: "Message is required" });
            return;
        }
        const messages = [
            {
                role: "system",
                content: "You are AutoBazaar Assistant, a helpful AI assistant for an automotive marketplace. You help users with:\n" +
                    "- Answering questions about cars, specifications, and the marketplace\n" +
                    "- Providing car buying/selling advice\n" +
                    "- Suggesting what to look for when inspecting vehicles\n" +
                    "- Explaining automotive terms and concepts\n\n" +
                    "Keep responses concise, informative, and friendly. If asked about specific listings, guide users to use the search feature.\n" +
                    "You do NOT have real-time access to the marketplace database, so you cannot check specific listings or user data.",
            },
            ...(history || []).slice(-10),
            { role: "user", content: message },
        ];
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
        });
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function analyzeData(req, res) {
    try {
        const { data, analysisType } = req.body;
        if (!data || !Array.isArray(data) || data.length === 0) {
            res.status(400).json({ success: false, error: "Data array is required and must not be empty" });
            return;
        }
        const dataSample = JSON.stringify(data.slice(0, 50), null, 2);
        const totalRecords = data.length;
        const prompts = {
            trend: `Analyze the following ${totalRecords} records and identify key trends, patterns, and insights. Focus on what the data reveals about the market.\n\nData:\n${dataSample}`,
            summary: `Provide a concise summary of the following ${totalRecords} records. Highlight the most important metrics and key takeaways.\n\nData:\n${dataSample}`,
            kpi: `Extract and calculate key performance indicators from the following ${totalRecords} records. Include averages, totals, and notable outliers.\n\nData:\n${dataSample}`,
        };
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a data analyst for an automotive marketplace. Analyze data and provide actionable insights in a clear, structured format.",
                },
                {
                    role: "user",
                    content: prompts[analysisType] || prompts.summary,
                },
            ],
            temperature: 0.3,
            max_tokens: 1024,
        });
        const analysis = completion.choices[0]?.message?.content || "";
        res.json({ success: true, data: { analysis, recordCount: totalRecords } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=ai.controller.js.map