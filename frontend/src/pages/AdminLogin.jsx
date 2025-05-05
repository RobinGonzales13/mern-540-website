import { useState } from "react";
import { Box, Input, Button, Heading, VStack, Text } from "@chakra-ui/react";
import axios from "axios";
import Navbar from '../components/ui/navbar';

const API_URL = import.meta.env.VITE_API_URL || "https://five40airbasegroup-paf-backend.onrender.com";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            alert(response.data.message);
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
            localStorage.setItem("token", response.data.token);
            alert("Login successful!");
            window.location.href = "/admin-dashboard";
        } catch (error) {
            setError(error.response?.data?.message || "OTP verification failed");
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/api/auth/request-password-reset`, { email });
            alert(response.data.message);
            setStep(4); // Move to OTP and new password step
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send password reset email");
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/api/auth/reset-password`, { 
                email, 
                otp, 
                newPassword 
            });
            alert(response.data.message);
            setStep(1); // Return to login step
            setEmail("");
            setOtp("");
            setNewPassword("");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to reset password");
        }
        setLoading(false);
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.500">
            <Navbar showContactButton={false} />
            <VStack spacing={4} p={6} bg="white" boxShadow="md" borderRadius="lg">
                <Heading size="lg">
                    {step === 1 ? "Admin Login" : step === 2 ? "Enter OTP" : "Reset Password"}
                </Heading>

                {error && <Text color="red.500">{error}</Text>}

                {step === 1 ? (
                    <>
                        <Input 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <Input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <Button 
                            colorScheme="blue" 
                            onClick={handleLogin} 
                            isLoading={loading}
                        >
                            Request OTP
                        </Button>
                        <Text 
                            color="blue.500" 
                            cursor="pointer" 
                            onClick={() => setStep(3)}
                        >
                            Forgot Password?
                        </Text>
                    </>
                ) : step === 2 ? (
                    <>
                        <Input 
                            placeholder="Enter OTP" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            required 
                        />
                        <Button 
                            colorScheme="green" 
                            onClick={handleVerifyOtp} 
                            isLoading={loading}
                        >
                            Verify OTP
                        </Button>
                    </>
                ) : step === 3 ? (
                    <>
                        <Input 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <Button 
                            colorScheme="blue" 
                            onClick={handleForgotPassword} 
                            isLoading={loading}
                        >
                            Send Reset Link
                        </Button>
                        <Text 
                            color="blue.500" 
                            cursor="pointer" 
                            onClick={() => setStep(1)}
                        >
                            Back to Login
                        </Text>
                    </>
                ) : step === 4 ? (
                    <>
                        <Input 
                            placeholder="Enter OTP" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            required 
                        />
                        <Input 
                            type="password" 
                            placeholder="New Password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                        <Button 
                            colorScheme="green" 
                            onClick={handleResetPassword} 
                            isLoading={loading}
                        >
                            Reset Password
                        </Button>
                    </>
                ) : null}
            </VStack>
        </Box>
    );
};

export default AdminLogin;
