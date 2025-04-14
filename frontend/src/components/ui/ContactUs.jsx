import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Button, Input, Textarea, Text } from "@chakra-ui/react";
import axios from "axios";

const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null);
    
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    console.log("Loaded reCAPTCHA Site Key:", import.meta.env.VITE_RECAPTCHA_SITE_KEY);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaValue) {
            alert("Please complete the CAPTCHA verification.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/contact", {
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
        } catch (error) {
            alert("Error sending message.");
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
                <ReCAPTCHA 
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} 
                onChange={handleCaptchaChange} 
              />
            ) : (
                <Text color="red.500">⚠ reCAPTCHA site key is missing!</Text>
            )}

            <Button mt={4} colorScheme="blue" onClick={handleSubmit}>Send</Button>
        </Box>
    );
};

export default ContactUs;