import { Box, Heading, Text } from "@chakra-ui/react";

const Articles = () => {
  return (
    <Box
      w={{ base: "100%", md: "25%" }} // Full width on mobile, 25% on desktop
      p={4}
      borderRight={{ base: "none", md: "1px solid gray" }} // Sidebar effect only on desktop
      borderTop={{ base: "1px solid gray", md: "none" }} // Adds separation when below content
      minH={{ base: "auto", md: "100vh" }} // Full height only on desktop
    >
      <Heading size="md" mb={4}>Latest Articles</Heading>
      <Text mt={2}>Article 1</Text>
      <Text mt={2}>Article 2</Text>
      <Text mt={2}>Article 3</Text>
    </Box>
  );
};

export default Articles;
