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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate email
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    // Validate password
    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/pol/login`, {
        email,
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
                POL Dump Login
              </Heading>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={errors.email}>
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
                  <FormControl isRequired isInvalid={errors.password}>
                    <FormLabel fontWeight="medium">Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="lg"
                      focusBorderColor="blue.500"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
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
                </VStack>
              </form>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default POLLogin;
