import { useState } from "react";
import { Box, Input, Button, Heading, VStack, Text } from "@chakra-ui/react";
import axios from "axios";
import Navbar from '../components/ui/navbar';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("https://mern-540-backend.onrender.com/api/auth/login", { email, password });
            alert(response.data.message);
            setStep(2);
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("https://mern-540-backend.onrender.com/api/auth/verify-otp", { email, otp });
            
            localStorage.setItem("token", response.data.token);

            alert("Login successful!");
            window.location.href = "/admin-dashboard";
        } catch (error) {
            alert(error.response?.data?.message || "OTP verification failed");
        }
        setLoading(false);
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.500">
            <Navbar showContactButton={false} />
            <VStack spacing={4} p={6} bg="white" boxShadow="md" borderRadius="lg">
                <Heading size="lg">
                    {step === 1 ? "Admin Login" : "Enter OTP"}
                </Heading>

                {step === 1 ? (
                    <>
                        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Button colorScheme="blue" onClick={handleLogin} isLoading={loading}>Request OTP</Button>
                        <Text color="blue.500" cursor="pointer" onClick={() => setStep(3)}>Forgot Password?</Text>
                    </>
                ) : step === 2 ? (
                    <>
                        <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        <Button colorScheme="green" onClick={handleVerifyOtp} isLoading={loading}>Verify OTP</Button>
                    </>
                ) : null}
            </VStack>
        </Box>
    );
};

export default AdminLogin;
