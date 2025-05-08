import { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Divider, Button } from "@chakra-ui/react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import axios from "axios";

const GroundFuelReport = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [fuelTotals, setFuelTotals] = useState({
        daily: 0,
        weekly: 0,
        monthlyTotal: 0,
        monthly: [],
        quarterly: []
    });
    const [adfQuarterly, setAdfQuarterly] = useState([]);
    const [xcsQuarterly, setXcsQuarterly] = useState([]);

    useEffect(() => {
        fetchData();
        fetchTotals();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("https://five40airbasegroup-paf-backend.onrender.com/api/reports/adf-xcs");
            setMonthlyData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchTotals = async () => {
        try {
            const [adfResponse, xcsResponse] = await Promise.all([
                axios.get("https://five40airbasegroup-paf-backend.onrender.com/api/adf/totals"),
                axios.get("https://five40airbasegroup-paf-backend.onrender.com/api/xcs/totals")
            ]);            

            setAdfQuarterly(adfResponse.data.quarterly || []);
            setXcsQuarterly(xcsResponse.data.quarterly || []);

            const combinedTotals = {
                daily: (adfResponse.data.daily || 0) + (xcsResponse.data.daily || 0),
                weekly: (adfResponse.data.weekly || 0) + (xcsResponse.data.weekly || 0),
                monthlyTotal: (adfResponse.data.monthlyTotal || 0) + (xcsResponse.data.monthlyTotal || 0),
                monthly: (adfResponse.data.monthly || []).map((month, index) => ({
                    ...month,
                    totalLiters: (month.totalLiters || 0) + ((xcsResponse.data.monthly?.[index]?.totalLiters) || 0)
                })),
                quarterly: (adfResponse.data.quarterly || []).map((quarter, index) => ({
                    ...quarter,
                    totalLiters: (quarter.totalLiters || 0) + ((xcsResponse.data.quarterly?.[index]?.totalLiters) || 0)
                }))
            };

            setFuelTotals(combinedTotals);
        } catch (error) {
            console.error("Error fetching totals:", error);
            setFuelTotals({
                daily: 0,
                weekly: 0,
                monthlyTotal: 0,
                monthly: [],
                quarterly: []
            });
            setAdfQuarterly([]);
            setXcsQuarterly([]);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!monthlyData.length || !fuelTotals.monthly.length) {
        return <Box p={4}>Loading...</Box>;
    }

    return (
        <Box p={4}>
            <Button 
                position="absolute" 
                top="10px" 
                right="10px" 
                onClick={handlePrint}
            >
                Print
            </Button>

            <Heading mb={6}>Ground Fuel Report</Heading>

            {/* Current Statistics */}
            <Box borderWidth="1px" borderRadius="lg" p={4} mb={6}>
                <Heading size="md" mb={4}>Current Statistics</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    <Stat>
                        <StatLabel>Today's Total</StatLabel>
                        <StatNumber>{fuelTotals.daily.toLocaleString()} L</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>This Week's Total</StatLabel>
                        <StatNumber>{fuelTotals.weekly.toLocaleString()} L</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>This Month's Total</StatLabel>
                        <StatNumber>{fuelTotals.monthlyTotal.toLocaleString()} L</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Year-to-Date Total</StatLabel>
                        <StatNumber>
                            {fuelTotals.monthly.reduce((sum, month) => sum + month.totalLiters, 0).toLocaleString()} L
                        </StatNumber>
                    </Stat>
                </SimpleGrid>
            </Box>

            <Divider my={6} />

            {/* Quarterly Breakdown */}
            <Box borderWidth="1px" borderRadius="lg" p={4} mb={6}>
                <Heading size="md" mb={4}>Quarterly Breakdown</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    {fuelTotals.quarterly.map((quarter) => (
                        <Stat key={quarter.quarter}>
                            <StatLabel>{quarter.quarter}</StatLabel>
                            <StatNumber>{quarter.totalLiters.toLocaleString()} L</StatNumber>
                        </Stat>
                    ))}
                </SimpleGrid>
            </Box>

            <Divider my={6} />

            {/* ADF vs XCS Comparison Chart */}
            <Box borderWidth="1px" borderRadius="lg" p={4} mb={6}>
                <Heading size="md" mb={4}>ADF vs XCS Monthly Comparison</Heading>
                <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="adfLiters" stroke="#3182CE" name="ADF" />
                            <Line type="monotone" dataKey="xcsLiters" stroke="#E53E3E" name="XCS" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Box>

            {/* Quarterly Distribution Chart */}
            <Box borderWidth="1px" borderRadius="lg" p={4}>
                <Heading size="md" mb={4}>Quarterly Distribution</Heading>
                <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adfQuarterly}>
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalLiters" fill="#3182CE" name="ADF" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
                <Box h="300px" mt={4}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={xcsQuarterly}>
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalLiters" fill="#E53E3E" name="XCS" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>

            {/* ADF Table for Printing */}
            <Box display={{ base: "none", print: "block" }} mt={6}>
                <Heading size="md" mb={4}>ADF Quarterly Table</Heading>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quarter</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Liters</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adfQuarterly.map((quarter, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{quarter.quarter}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {quarter.totalLiters.toLocaleString()} L
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default GroundFuelReport;