import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const Contact = () => {
  return (
    <Box minH="100vh" p={8}>
      <VStack spacing={6} maxW="800px" mx="auto">
        <Heading>Contact Us</Heading>
        <Text>
          For any inquiries, please reach out to us through the contact form on the homepage.
        </Text>
      </VStack>
    </Box>
  );
};

export default Contact; 