import { Box, Flex, Text, Button, Spacer, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../assets/gas-logo.png";

const Navbar = () => {
    return (
        <Box bg="blue.700" px={6} py={4} color="white">
            <Flex align="center">
                
                <Flex align="center">
                    <Image src={logo} alt="Logo" boxSize="40px" mr={2} />
                    <Text fontSize="xl" fontWeight="bold">Gas Station Inventory</Text>
                </Flex>

                <Spacer />

                <Flex>
                    <Button as={Link} to="/" variant="ghost" color="white" _hover={{ bg: "blue.600" }} mr={4}>
                        Home
                    </Button>
                    <Button as={Link} to="/" variant="ghost" color="white" _hover={{ bg: "blue.600" }}>
                        About Us
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;
