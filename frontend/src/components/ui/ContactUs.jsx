import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Button, Input, Textarea, Text, useToast, FormControl, FormLabel, FormErrorMessage, Alert, AlertIcon } from "@chakra-ui/react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://five40airbasegroup-paf-backend.onrender.com";

const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    console.log("Environment Variables:", {
        siteKey,
        apiUrl: API_URL,
        env: import.meta.env
    });

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
        if (!message.trim()) newErrors.message = "Message is required";
        if (!captchaValue) newErrors.captcha = "Please complete the CAPTCHA verification";
        return newErrors;
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        setErrors(prev => ({ ...prev, captcha: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/api/contact`, {
                name,
                email,
                message,
                captcha: captchaValue,
            });

            toast({
                title: "Success",
                description: "Your message has been sent successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            setName("");
            setEmail("");
            setMessage("");
            setCaptchaValue(null);
            setErrors({});
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error.response?.data?.message || "Error sending message. Please try again.";
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Contact Us</Text>
            
            <FormControl isInvalid={errors.name} mb={3}>
                <FormLabel>Name</FormLabel>
                <Input 
                    placeholder="Your Name" 
                    value={name} 
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors(prev => ({ ...prev, name: "" }));
                    }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email} mb={3}>
                <FormLabel>Email</FormLabel>
                <Input 
                    type="email"
                    placeholder="Your Email" 
                    value={email} 
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({ ...prev, email: "" }));
                    }}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.message} mb={3}>
                <FormLabel>Message</FormLabel>
                <Textarea 
                    placeholder="Your Message" 
                    value={message} 
                    onChange={(e) => {
                        setMessage(e.target.value);
                        setErrors(prev => ({ ...prev, message: "" }));
                    }}
                    minH="150px"
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
            </FormControl>
            
            {siteKey ? (
                <FormControl isInvalid={errors.captcha} mb={3}>
                    <Box>
                        <ReCAPTCHA 
                            sitekey={siteKey}
                            onChange={handleCaptchaChange} 
                        />
                    </Box>
                    <FormErrorMessage>{errors.captcha}</FormErrorMessage>
                </FormControl>
            ) : (
                <Alert status="error" mb={3}>
                    <AlertIcon />
                    <Text>⚠ reCAPTCHA site key is missing!</Text>
                </Alert>
            )}

            <Button 
                mt={4} 
                colorScheme="blue" 
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Sending..."
                w="100%"
            >
                Send Message
            </Button>
        </Box>
    );
};

export default ContactUs;