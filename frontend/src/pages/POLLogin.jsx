import { useState } from "react";
import { Box, Input, Button, VStack, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

const POLDashboard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/POLDashboard");
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.300">
            <Navbar showContactButton={false} />
            <VStack spacing={6} p={6} bg="white" boxShadow="lg" borderRadius="lg">
                <Heading size="lg">POL Home Login</Heading>
                
                <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
            </VStack>
        </Box>
    );
};

export default POLDashboard;
