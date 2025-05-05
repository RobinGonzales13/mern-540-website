import { useState } from "react";
import { Box, Input, Button, VStack, Heading, Text, useToast, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/gas-logo.png";

const POLLogin = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/send-otp", { email });
            setOtpSent(true);
            toast({ title: "OTP sent to your email", status: "success", duration: 2000 });
        } catch (error) {
            toast({ title: error.response?.data?.message || "Error sending OTP", status: "error", duration: 2000 });
        }
        setLoading(false);
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            localStorage.setItem("token", res.data.token);
            toast({ title: "Login successful!", status: "success", duration: 2000 });
            navigate("/dashboard");
        } catch (error) {
            toast({ title: error.response?.data?.message || "Invalid OTP", status: "error", duration: 2000 });
        }
        setLoading(false);
    };

    return (
        <Box>
            <Box bg="blue.700" px={6} py={4} color="white">
                <Flex align="center">
                    <Image src={logo} alt="Logo" boxSize="40px" mr={3} />
                    <Heading fontSize="xl">POL Dump Inventory System</Heading>
                </Flex>
            </Box>
            
            <VStack spacing={4} p={8} maxW="400px" mx="auto" mt="100px">
                <Heading>Login</Heading>
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    isDisabled={otpSent}
                />
                {otpSent ? (
                    <>
                        <Input
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            type="text"
                            maxLength={6}
                        />
                        <Button onClick={handleVerifyOTP} colorScheme="blue" isLoading={loading}>
                            Verify OTP
                        </Button>
                        <Button onClick={() => setOtpSent(false)} variant="ghost">
                            Back to Email
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleSendOTP} colorScheme="blue" isLoading={loading}>
                        Send OTP
                    </Button>
                )}
            </VStack>
        </Box>
    );
};

export default POLLogin;
