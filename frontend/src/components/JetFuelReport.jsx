import { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Divider } from "@chakra-ui/react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import axios from "axios";

const JetFuelReport = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [fuelTotals, setFuelTotals] = useState({});

    useEffect(() => {
        fetchData();
        fetchTotals();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/xcs/totals");
            if (response.data.monthly) {
                setMonthlyData(response.data.monthly);
            }
        } catch (error) {
            console.error("Error fetching XCS data:", error);
            setMonthlyData([]);
        }
    };

    const fetchTotals = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/xcs/totals");
            setFuelTotals(response.data);
        } catch (error) {
            console.error("Error fetching XCS totals:", error);
        }
    };

    if (monthlyData.length === 0) return <p>Loading...</p>;

    return (
        <Box p={6}>
            <Heading size="lg" mb={4}>XCS Jet Fuel Totals</Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                <StatBox label="Today's Total" value={fuelTotals.daily || 0} />
                <StatBox label="This Week's Total" value={fuelTotals.weekly || 0} />
                <StatBox label="This Month's Total" value={fuelTotals.monthlyTotal || 0} />
                <StatBox label="Year to Date" value={fuelTotals.quarterly?.reduce((sum, q) => sum + q.totalLiters, 0) || 0} />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                {fuelTotals.quarterly?.map((q, index) => (
                    <StatBox key={`Q${index + 1}`} label={`Quarter ${index + 1}`} value={q.totalLiters} />
                ))}
            </SimpleGrid>

            <Divider my={8} />

            <Heading size="lg" mb={4}>Monthly XCS Usage</Heading>
            <Box mb={8}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData} margin={{ top: 20 }}>
                        <XAxis 
                            dataKey="month"
                            tickFormatter={(month) => {
                                const date = new Date(month + "-01");
                                return date.toLocaleString("en-US", { month: "short", year: "numeric" });
                            }}                    
                            interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="totalLiters" 
                            stroke="#E53E3E" 
                            name="XCS Liters" 
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            <Heading size="lg" mb={4}>Quarterly Distribution</Heading>
            <Box>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fuelTotals.quarterly || []} margin={{ top: 20 }}>
                        <XAxis dataKey="quarter" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                            dataKey="totalLiters" 
                            fill="#E53E3E" 
                            name="XCS Liters"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

const StatBox = ({ label, value }) => (
    <Stat p={4} border="1px solid" borderRadius="lg">
        <StatLabel>{label}</StatLabel>
        <StatNumber>{typeof value === "number" ? value : 0} Liters</StatNumber>
    </Stat>
);

export default JetFuelReport; 