import express from "express";
import Xcs from "../models/Xcs.js";

const router = express.Router();

// Get paginated and sorted XCS records
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 25, sortBy = "date", order = "asc" } = req.query;
        const skip = (page - 1) * limit;

        const sortOptions = {};
        sortOptions[sortBy] = order === "asc" ? 1 : -1;

        const records = await Xcs.find()
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Xcs.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.json({
            records,
            totalPages,
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error("Error fetching XCS records:", error);
        res.status(500).json({ error: "Error fetching XCS records", details: error.message });
    }
});

// Get XCS totals
router.get("/totals", async (req, res) => {
    try {
        const daily = await getTotalLiters(Xcs, new Date(new Date().setHours(0, 0, 0, 0)));
        const weekly = await getTotalLiters(Xcs, new Date(new Date().setDate(new Date().getDate() - new Date().getDay())));
        const monthlyTotal = await getTotalLiters(Xcs, new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        const monthly = await getMonthlyLiters(Xcs);
        const quarterly = await getQuarterlyLiters(Xcs);

        res.json({
            daily,
            weekly,
            monthlyTotal,
            monthly,
            quarterly
        });
    } catch (error) {
        console.error("Error fetching XCS data:", error);
        res.status(500).json({ error: "Error fetching XCS data", details: error.message });
    }
});

// Add multiple XCS records
router.post("/addMany", async (req, res) => {
    try {
        const { xcs } = req.body;
        if (!xcs || !Array.isArray(xcs)) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        await Xcs.insertMany(xcs);
        res.status(201).json({ message: "Records added to XCS successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding XCS records", details: error.message });
    }
});

// Helper: Total liters since a given date
const getTotalLiters = async (model, startDate) => {
    const result = await model.aggregate([
        { $match: { date: { $gte: startDate } } },
        { $group: { _id: null, totalLiters: { $sum: "$liters" } } }
    ]);

    return result.length > 0 ? result[0].totalLiters : 0;
};

// Helper: Monthly liters for past 12 months
const getMonthlyLiters = async (model) => {
    const today = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = monthDate.toLocaleString("en-US", { month: "long", year: "numeric" });
        months.push({ month: monthName, totalLiters: 0 });
    }

    const result = await model.aggregate([
        {
            $group: {
                _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                totalLiters: { $sum: "$liters" }
            }
        }
    ]);

    result.forEach((item) => {
        const formattedMonth = new Date(item._id.year, item._id.month - 1, 1)
            .toLocaleString("en-US", { month: "long", year: "numeric" });
        const monthIndex = months.findIndex((m) => m.month === formattedMonth);
        if (monthIndex !== -1) {
            months[monthIndex].totalLiters = item.totalLiters;
        }
    });

    return months;
};

// Helper: Quarterly liters
const getQuarterlyLiters = async (model) => {
    const quarters = {
        Q1: { totalLiters: 0 },
        Q2: { totalLiters: 0 },
        Q3: { totalLiters: 0 },
        Q4: { totalLiters: 0 }
    };

    const result = await model.aggregate([
        {
            $group: {
                _id: { quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } } },
                totalLiters: { $sum: "$liters" }
            }
        }
    ]);

    result.forEach((item) => {
        const quarterKey = `Q${item._id.quarter}`;
        if (quarters[quarterKey]) {
            quarters[quarterKey].totalLiters = item.totalLiters;
        }
    });

    return Object.entries(quarters).map(([key, value]) => ({
        quarter: key,
        totalLiters: value.totalLiters
    }));
};

export default router;