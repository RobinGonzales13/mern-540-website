import { useState, useEffect } from "react";
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
  Container,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminResetPassword = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pol/verify-reset-token/${token}`);
        if (response.data.success) {
          setUsername(response.data.username);
          setTokenValid(true);
        }
      } catch (error) {
        toast({
          title: "Invalid Link",
          description: "This password reset link is invalid or has expired.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/admin-login");
      }
    };

    verifyToken();
  }, [token, toast, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/pol/reset-password`, {
        token,
        newPassword,
      });

      toast({
        title: "Success",
        description: "Password has been reset successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/pol-login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return null;
  }

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
      <Container maxW="container.xl" py={10}>
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          w="100%"
          maxW="400px"
          mx="auto"
          mt={20}
          border="1px solid"
          borderColor="gray.200"
          position="relative"
          zIndex={1}
        >
          <VStack spacing={6} align="stretch">
            <Heading 
              textAlign="center" 
              size="lg"
              color="blue.600"
              fontWeight="bold"
            >
              Reset Password
            </Heading>

            <Text textAlign="center" color="gray.600">
              Reset password for user: <strong>{username}</strong>
            </Text>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
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

                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
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
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminResetPassword; 