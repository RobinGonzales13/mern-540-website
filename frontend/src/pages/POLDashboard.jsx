import { useEffect, useState } from "react";
import { Box, Button, Spinner, Text, Flex, Image, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const POLDashboard = () => {
    const [activeTab, setActiveTab] = useState("Inventory");
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [groundFuel, setGroundFuel] = useState([]);
    const [jetFuel, setJetFuel] = useState([]);
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [invRes, groundRes, jetRes, recRes] = await Promise.all([
                axios.get("http://localhost:5000/api/inventory"),
                axios.get("http://localhost:5000/api/ground-fuel"),
                axios.get("http://localhost:5000/api/jet-fuel"),
                axios.get("http://localhost:5000/api/records")
            ]);
            setInventory(invRes.data);
            setGroundFuel(groundRes.data);
            setJetFuel(jetRes.data);
            setRecords(recRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        navigate("/pol-home");
    };

    const tabs = ["Inventory", "Ground Fuel Report", "Jet Fuel Report", "Gas Slip Records"];

    return (
        <Box minH="100vh" display="flex" bg="gray.100">
            {/* Sidebar Tabs */}
            <VStack
                w="250px"
                bg="white"
                p={4}
                boxShadow="md"
                align="stretch"
            >
                <Flex align="center" mb={4}>
                    <Image src="/logo.png" alt="Logo" boxSize="40px" mr={2} />
                    <Heading size="md">POL Dashboard</Heading>
                </Flex>
                {tabs.map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
                <Box mt="auto" w="100%">
                    <Button
                        variant="solid"
                        colorScheme="red"
                        w="100%"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </VStack>
            
            {/* Main Content */}
            <Box flex={1} p={6}>
                <Heading size="lg" mb={4}>{activeTab}</Heading>
                {loading ? (
                    <Spinner size="xl" />
                ) : (
                    <>
                        {activeTab === "Inventory" && (
                            <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
                                <Thead><Tr><Th>Item</Th><Th>Quantity</Th></Tr></Thead>
                                <Tbody>{inventory.map((item) => (
                                    <Tr key={item._id}><Td>{item.name}</Td><Td>{item.quantity}</Td></Tr>
                                ))}</Tbody>
                            </Table>
                        )}

                        {activeTab === "Ground Fuel Report" && (
                            <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
                                <Thead><Tr><Th>Date</Th><Th>Consumption (L)</Th></Tr></Thead>
                                <Tbody>{groundFuel.map((entry) => (
                                    <Tr key={entry._id}><Td>{entry.date}</Td><Td>{entry.amount}</Td></Tr>
                                ))}</Tbody>
                            </Table>
                        )}

                        {activeTab === "Jet Fuel Report" && (
                            <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
                                <Thead><Tr><Th>Date</Th><Th>Consumption (L)</Th></Tr></Thead>
                                <Tbody>{jetFuel.map((entry) => (
                                    <Tr key={entry._id}><Td>{entry.date}</Td><Td>{entry.amount}</Td></Tr>
                                ))}</Tbody>
                            </Table>
                        )}

                        {activeTab === "Gas Slip Records" && (
                            <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
                                <Thead><Tr><Th>QR Code</Th><Th>Date</Th></Tr></Thead>
                                <Tbody>{records.map((record) => (
                                    <Tr key={record._id}><Td>{record.qrCode}</Td><Td>{record.date}</Td></Tr>
                                ))}</Tbody>
                            </Table>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default POLDashboard;