import { useEffect, useState } from "react";
import { Box, Heading, Text, Button, VStack, HStack, Spinner, Image, Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import logo from "../assets/gas-logo.png";
import inventoryIcon from "../assets/inventory-logo.png";
import groundFuelIcon from "../assets/gfr-logo.png";
import jetFuelIcon from "../assets/jfr-logo.png";
import gasSlipIcon from "../assets/gsr-logo.png";
import Inventory from "../components/Inventory";
import GroundFuelReport from "../components/GroundFuelReport";
import JetFuelReport from "../components/JetFuelReport";

const POLDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("Inventory");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("polToken");
            if (!token) {
                navigate("/pol-login");
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pol/verify`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            
                setUser(res.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/pol-login");
            } finally {
                setLoading(false);
            }            
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("polToken");
        navigate("/pol-login");
    };

    if (loading) {
        return <Spinner size="xl" mt="50px" />;
    }

    const renderContent = () => {
        switch (selectedTab) {
            case "Inventory":
                return <Text fontSize="lg">Inventory Content Here</Text>;
            case "Ground Fuel Report":
                return <Text fontSize="lg">Ground Fuel Report Content Here</Text>;
            case "Jet Fuel Report":
                return <Text fontSize="lg">Jet Fuel Report Content Here</Text>;
            case "Gas Slip Records":
                return <Text fontSize="lg">Gas Slip Records Content Here</Text>;
            default:
                return <Text fontSize="lg">Select an option from the left navigation.</Text>;
        }
    };

    return (
        <Box h="100vh">
            <Box bg="blue.700" px={6} py={4} color="white" w="100%">
                <Flex align="center">
                    <Image src={logo} alt="Logo" boxSize="40px" mr={3} />
                    <Heading fontSize="xl">POL Dump Inventory System</Heading>

                    <Spacer />

                    <HStack spacing={4}>
                        <Text>{user?.email || "Admin"}</Text>
                        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
                    </HStack>
                </Flex>
            </Box>

            <Box display="flex" flex="1">
                <Box bg="gray.800" color="white" w="250px" p={6} h="auto" minH="100vh">
                    <VStack spacing={4} align="stretch">
                        <Button
                            leftIcon={
                                <Image 
                                    src={inventoryIcon} 
                                    boxSize="20px" 
                                    filter={selectedTab === "Inventory" ? "invert(1)" : "none"} 
                                />
                            }  colorScheme={selectedTab === "Inventory" ? "blue" : "gray"} onClick={() => setSelectedTab("Inventory")}>
                            Inventory
                        </Button>

                        <Button 
                            leftIcon={
                                <Image 
                                    src={groundFuelIcon} 
                                    boxSize="20px" 
                                    filter={selectedTab === "Ground Fuel Report" ? "invert(1)" : "none"} 
                                />
                            } 
                            colorScheme={selectedTab === "Ground Fuel Report" ? "blue" : "gray"} 
                            variant="solid" 
                            onClick={() => setSelectedTab("Ground Fuel Report")}
                        >
                            Ground Fuel Report
                        </Button>

                        <Button 
                            leftIcon={
                                <Image 
                                    src={jetFuelIcon} 
                                    boxSize="20px" 
                                    filter={selectedTab === "Jet Fuel Report" ? "invert(1)" : "none"} 
                                />
                            } 
                            colorScheme={selectedTab === "Jet Fuel Report" ? "blue" : "gray"} 
                            variant="solid" 
                            onClick={() => setSelectedTab("Jet Fuel Report")}
                        >
                            Jet Fuel Report
                        </Button>

                        <Button 
                            leftIcon={
                                <Image 
                                    src={gasSlipIcon} 
                                    boxSize="20px" 
                                    filter={selectedTab === "Gas Slip Records" ? "invert(1)" : "none"} 
                                />
                            } 
                            colorScheme={selectedTab === "Gas Slip Records" ? "blue" : "gray"} 
                            variant="solid" 
                            onClick={() => setSelectedTab("Gas Slip Records")}
                        >
                            Gas Slip Records
                        </Button>
                    </VStack>
                </Box>

                <Box flex="1" p={6}>
                    {selectedTab === "Inventory" && <Inventory />}
                    {selectedTab === "Ground Fuel Report" && <GroundFuelReport />}
                    {selectedTab === "Jet Fuel Report" && <JetFuelReport />}
                </Box>
            </Box>
        </Box>
    );
};

export default POLDashboard;
