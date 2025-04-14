import { Box, Heading, Text } from "@chakra-ui/react";

const Articles = () => {
  return (
    <Box
      w={{ base: "100%", md: "25%" }}
      p={4}
      borderRight={{ base: "none", md: "1px solid gray" }}
      borderTop={{ base: "1px solid gray", md: "none" }}
      minH={{ base: "auto", md: "100vh" }}
    >
      <Heading size="md" mb={4}>Latest Articles</Heading>
      <Text mt={2}>Article 1</Text>
      <Text mt={2}>Article 2</Text>
      <Text mt={2}>Article 3</Text>
    </Box>
  );
};

export default Articles;
