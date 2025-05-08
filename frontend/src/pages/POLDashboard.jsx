import { useEffect, useState } from "react";
import { Box, Heading, Text, Button, VStack, HStack, Spinner, Image, Flex, Spacer, Input, Select, FormControl, FormLabel } from "@chakra-ui/react";
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


    const [inventoryType, setInventoryType] = useState("adf");
    const [controlNumber, setControlNumber] = useState("");
    const [purpose, setPurpose] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [liters, setLiters] = useState("");
    const [message, setMessage] = useState("");


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


    const handleSubmit = async () => {
        if (!controlNumber || !purpose || !receivedBy || !liters) {
            setMessage("Please fill in all fields.");
            return;
        }

        const date = new Date();

        try {
            const response = await axios.post(`https://five40airbasegroup-paf-backend.onrender.com/api/${inventoryType}`, {
                date,
                controlNumber,
                purpose,
                receivedBy,
                liters,
            });            

            setMessage("Record added successfully!");
            setControlNumber("");
            setPurpose("");
            setReceivedBy("");
            setLiters("");
        } catch (error) {
            console.error("Error adding record:", error);
            setMessage("Error adding record. Please try again.");
        }
    };


    const renderContent = () => {
        switch (selectedTab) {
            case "Inventory":
                return <Inventory />;
            case "Ground Fuel Report":
                return <GroundFuelReport />;
            case "Jet Fuel Report":
                return <JetFuelReport />;
            case "Gas Slip Records":
                return (
                    <Box p={6} w="100%">
                        <Text fontSize="lg" mb={4}>Add New Gas Slip Record</Text>
    
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel>Inventory Type</FormLabel>
                                <Select value={inventoryType} onChange={(e) => setInventoryType(e.target.value)}>
                                    <option value="adf">ADF</option>
                                    <option value="xcs">XCS</option>
                                </Select>
                            </FormControl>
    
                            <FormControl isRequired>
                                <FormLabel>Control Number</FormLabel>
                                <Input 
                                    type="text" 
                                    value={controlNumber} 
                                    onChange={(e) => setControlNumber(e.target.value)} 
                                />
                            </FormControl>
    
                            <FormControl isRequired>
                                <FormLabel>Purpose</FormLabel>
                                <Input 
                                    type="text" 
                                    value={purpose} 
                                    onChange={(e) => setPurpose(e.target.value)} 
                                />
                            </FormControl>
    
                            <FormControl isRequired>
                                <FormLabel>Received By</FormLabel>
                                <Input 
                                    type="text" 
                                    value={receivedBy} 
                                    onChange={(e) => setReceivedBy(e.target.value)} 
                                />
                            </FormControl>
    
                            <FormControl isRequired>
                                <FormLabel>Liters</FormLabel>
                                <Input 
                                    type="number" 
                                    value={liters} 
                                    onChange={(e) => setLiters(e.target.value)} 
                                />
                            </FormControl>
    
                            {message && <Text color="red.500">{message}</Text>}
    
                            <Button colorScheme="blue" onClick={handleSubmit}>Submit</Button>
                        </VStack>
                    </Box>
                );
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
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default POLDashboard;