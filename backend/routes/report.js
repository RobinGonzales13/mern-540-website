const express = require("express");
const Adf = require("../models/Adf");
const Xcs = require("../models/Xcs"); 
const GroundFuel = require("../models/GroundFuel");

const router = express.Router();

const getTotalLiters = async (model, startDate) => {
    const result = await model.aggregate([
        { $match: { date: { $gte: startDate } } },
        { $group: { _id: null, totalLiters: { $sum: "$liters" } } }
    ]);

    return result.length > 0 ? result[0].totalLiters : 0;
};

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
                totalLiters: { $sum: "$liters" },
            },
        },
    ]);

    result.forEach((item) => {
        const formattedMonth = new Date(item._id.year, item._id.month - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
        const monthIndex = months.findIndex((m) => m.month === formattedMonth);
        if (monthIndex !== -1) {
            months[monthIndex].totalLiters = item.totalLiters;
        }
    });

    return months;
};


router.get("/ground-fuel", async (req, res) => {
    try {
        const monthlyData = await getMonthlyLiters(GroundFuel);
        res.json({ monthly: monthlyData });
    } catch (error) {
        console.error("Error fetching Ground Fuel data:", error);
        res.status(500).json({ error: "Error fetching Ground Fuel data", details: error.message });
    }
});

const getCurrentMonthTotal = async (model) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    const result = await model.aggregate([
        { $match: { date: { $gte: startOfMonth } } },
        { $group: { _id: null, totalLiters: { $sum: "$liters" } } }
    ]);

    return result.length > 0 ? result[0].totalLiters : 0;
};

router.get("/adf-xcs", async (req, res) => {
    try {
        const adfData = await getMonthlyLiters(Adf);
        const xcsData = await getMonthlyLiters(Xcs);

        const combinedData = adfData.map((adfMonth, index) => ({
            month: adfMonth.month,
            adfLiters: adfMonth.totalLiters,
            xcsLiters: xcsData[index] ? xcsData[index].totalLiters : 0,
        }));

        res.json(combinedData);
    } catch (error) {
        console.error("Error fetching ADF and XCS data:", error);
        res.status(500).json({ error: "Error fetching ADF and XCS data" });
    }
});


module.exports = router;
