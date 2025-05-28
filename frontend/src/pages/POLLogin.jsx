import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Text,
  Image,
  Flex,
  Container,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ui/navbar";

const API_URL = import.meta.env.VITE_API_URL;

const POLLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("API_URL is:", API_URL);
      console.log("POSTing to:", `${API_URL}/api/pol/login`);
      const response = await axios.post(`${API_URL}/api/pol/login`, {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("polToken", response.data.token);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/pol-dashboard");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
      const response = await axios.post(`${API_URL}/api/pol/request-password-reset`, { email });
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
      const response = await axios.post(`${API_URL}/api/pol/reset-password`, { 
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
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, rgb(5, 19, 38) 0%, rgb(8, 28, 54) 100%)"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        opacity: 0.5,
        pointerEvents: "none"
      }}
      position="relative"
    >
      <Navbar showContactButton={false} />
      <Container maxW="container.xl" py={10}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="calc(100vh - 100px)"
        >
          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            w="100%"
            maxW="400px"
            border="1px solid"
            borderColor="gray.200"
            position="relative"
            zIndex={1}
          >
            <VStack spacing={6} align="stretch">
              <Image
                src="/pol.jpg"
                alt="POL Dump Logo"
                w="200px"
                h="auto"
                mx="auto"
                mb={4}
                borderRadius="md"
              />
              <Heading 
                textAlign="center" 
                size="lg"
                color="blue.600"
                fontWeight="bold"
              >
                {step === 1 ? "POL Dump Login" : step === 3 ? "Forgot Password" : "Reset Password"}
              </Heading>

              {step === 1 ? (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel fontWeight="medium">Username</FormLabel>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        size="lg"
                        focusBorderColor="blue.500"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontWeight="medium">Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        size="lg"
                        focusBorderColor="blue.500"
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      w="100%"
                      size="lg"
                      isLoading={loading}
                      loadingText="Logging in..."
                      mt={4}
                    >
                      Login
                    </Button>
                    <Text 
                      color="blue.500" 
                      cursor="pointer" 
                      onClick={() => setStep(3)}
                      _hover={{ textDecoration: "underline" }}
                      textAlign="center"
                    >
                      Forgot Password?
                    </Text>
                  </VStack>
                </form>
              ) : step === 3 ? (
                <form onSubmit={handleForgotPassword}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={errors.email}>
                      <FormLabel fontWeight="medium">Email</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        size="lg"
                        focusBorderColor="blue.500"
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      w="100%"
                      size="lg"
                      isLoading={loading}
                      loadingText="Sending reset link..."
                      mt={4}
                    >
                      Send Reset Link
                    </Button>
                    <Text 
                      color="blue.500" 
                      cursor="pointer" 
                      onClick={() => setStep(1)}
                      _hover={{ textDecoration: "underline" }}
                      textAlign="center"
                    >
                      Back to Login
                    </Text>
                  </VStack>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={errors.otp}>
                      <FormLabel fontWeight="medium">OTP</FormLabel>
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        size="lg"
                        focusBorderColor="blue.500"
                      />
                      <FormErrorMessage>{errors.otp}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.newPassword}>
                      <FormLabel fontWeight="medium">New Password</FormLabel>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        size="lg"
                        focusBorderColor="blue.500"
                      />
                      <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      w="100%"
                      size="lg"
                      isLoading={loading}
                      loadingText="Resetting password..."
                      mt={4}
                    >
                      Reset Password
                    </Button>
                  </VStack>
                </form>
              )}
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default POLLogin;
