import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Button, Input, Textarea, Text } from "@chakra-ui/react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://five40airbasegroup-paf-backend.onrender.com";

const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null);
    const [error, setError] = useState("");
    
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    console.log("Environment Variables:", {
        siteKey,
        apiUrl: API_URL,
        env: import.meta.env
    });

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaValue) {
            setError("Please complete the CAPTCHA verification.");
            return;
        }

        try {
            await axios.post(`${API_URL}/api/contact`, {
                name,
                email,
                message,
                captcha: captchaValue,
            });

            alert("Message sent successfully!");
            setName("");
            setEmail("");
            setMessage("");
            setCaptchaValue(null);
            setError("");
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Error sending message. Please try again.");
        }
    };

    return (
        <Box p={6} borderWidth="1px" borderRadius="lg">
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Contact Us</Text>
            <Input 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                mb={3} 
            />
            <Input 
                placeholder="Your Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                mb={3} 
            />
            <Textarea 
                placeholder="Your Message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                mb={3} 
            />
            
            {siteKey ? (
                <Box mb={3}>
                    <ReCAPTCHA 
                        sitekey={siteKey}
                        onChange={handleCaptchaChange} 
                    />
                </Box>
            ) : (
                <Text color="red.500" mb={3}>⚠ reCAPTCHA site key is missing!</Text>
            )}

            {error && <Text color="red.500" mb={3}>{error}</Text>}

            <Button mt={4} colorScheme="blue" onClick={handleSubmit}>Send</Button>
        </Box>
    );
};

export default ContactUs;