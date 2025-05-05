import { useState } from "react";
import { Box, Input, Button, Heading, VStack, Text, useToast, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
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
    const [errors, setErrors] = useState({});
    const toast = useToast();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateOtp = (otp) => {
        return otp.length === 6 && /^\d+$/.test(otp);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!validateEmail(email)) {
            setErrors({ email: "Please enter a valid email address" });
            return;
        }
        if (!validatePassword(password)) {
            setErrors({ password: "Password must be at least 6 characters long" });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            toast({
                title: "Success",
                description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setStep(2);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed";
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!validateOtp(otp)) {
            setErrors({ otp: "Please enter a valid 6-digit OTP" });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
            localStorage.setItem("token", response.data.token);
            toast({
                title: "Success",
                description: "Login successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            window.location.href = "/admin-dashboard";
        } catch (error) {
            const errorMessage = error.response?.data?.message || "OTP verification failed";
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!validateEmail(email)) {
            setErrors({ email: "Please enter a valid email address" });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/request-password-reset`, { email });
            toast({
                title: "Success",
                description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setStep(4);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send password reset email";
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!validateOtp(otp)) {
            setErrors({ otp: "Please enter a valid 6-digit OTP" });
            return;
        }
        if (!validatePassword(newPassword)) {
            setErrors({ newPassword: "Password must be at least 6 characters long" });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/reset-password`, { 
                email, 
                otp, 
                newPassword 
            });
            toast({
                title: "Success",
                description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to reset password";
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.500">
            <Navbar showContactButton={false} />
            <VStack spacing={4} p={6} bg="white" boxShadow="md" borderRadius="lg" w="400px">
                <Heading size="lg">
                    {step === 1 ? "Admin Login" : step === 2 ? "Enter OTP" : "Reset Password"}
                </Heading>

                {step === 1 ? (
                    <>
                        <FormControl isInvalid={errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input 
                                type="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>
                        <Button 
                            colorScheme="blue" 
                            onClick={handleLogin} 
                            isLoading={loading}
                            w="100%"
                        >
                            Request OTP
                        </Button>
                        <Text 
                            color="blue.500" 
                            cursor="pointer" 
                            onClick={() => setStep(3)}
                            _hover={{ textDecoration: "underline" }}
                        >
                            Forgot Password?
                        </Text>
                    </>
                ) : step === 2 ? (
                    <>
                        <FormControl isInvalid={errors.otp}>
                            <FormLabel>OTP</FormLabel>
                            <Input 
                                placeholder="Enter 6-digit OTP" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required 
                            />
                            <FormErrorMessage>{errors.otp}</FormErrorMessage>
                        </FormControl>
                        <Button 
                            colorScheme="green" 
                            onClick={handleVerifyOtp} 
                            isLoading={loading}
                            w="100%"
                        >
                            Verify OTP
                        </Button>
                    </>
                ) : step === 3 ? (
                    <>
                        <FormControl isInvalid={errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input 
                                type="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                        <Button 
                            colorScheme="blue" 
                            onClick={handleForgotPassword} 
                            isLoading={loading}
                            w="100%"
                        >
                            Send Reset Link
                        </Button>
                        <Text 
                            color="blue.500" 
                            cursor="pointer" 
                            onClick={() => setStep(1)}
                            _hover={{ textDecoration: "underline" }}
                        >
                            Back to Login
                        </Text>
                    </>
                ) : step === 4 ? (
                    <>
                        <FormControl isInvalid={errors.otp}>
                            <FormLabel>OTP</FormLabel>
                            <Input 
                                placeholder="Enter 6-digit OTP" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required 
                            />
                            <FormErrorMessage>{errors.otp}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.newPassword}>
                            <FormLabel>New Password</FormLabel>
                            <Input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                            />
                            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                        </FormControl>
                        <Button 
                            colorScheme="green" 
                            onClick={handleResetPassword} 
                            isLoading={loading}
                            w="100%"
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
