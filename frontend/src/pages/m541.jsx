import { useEffect } from "react";
import { Box, Grid, GridItem, Text, VStack, Stack, Badge, Container, Heading } from "@chakra-ui/react";
import Navbar from '../components/ui/navbar';
import Footer from "../components/ui/Footer";

const MissionVision = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box 
      position="relative" 
      minH="100vh"
      background="linear-gradient(135deg, rgb(5, 19, 38) 0%, rgb(8, 28, 54) 100%)"
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
    >
      <Navbar showContactButton={true} />

      <Container maxW="container.xl" pt={{ base: "120px", md: "140px" }} pb={20} position="relative">
        <VStack spacing={12} align="center">
          <Heading 
            fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }} 
            fontWeight="bold" 
            color="white"
            textAlign="center"
            textShadow="0 2px 4px rgba(0,0,0,0.3)"
            position="relative"
            _after={{
              content: '""',
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80vw",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
              borderRadius: "2px"
            }}
          >
            541st SUPPLY SQUADRON
          </Heading>

          <VStack 
            spacing={12} 
            maxW={{ base: "90%", md: "800px" }} 
            color="white"
            bg="rgba(255, 255, 255, 0.05)"
            p={8}
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
          >
            <VStack spacing={4}>
              <Heading 
                fontSize={{ base: "2xl", md: "3xl" }} 
                fontWeight="bold"
                textShadow="0 1px 2px rgba(0,0,0,0.2)"
              >
                MISSION
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                textAlign="center"
                lineHeight="1.8"
              >
                TO PROVIDE LOGISTICS SUPPORT TO ALL UNITS OF BASA AIR BASE.
              </Text>
            </VStack>

            <VStack spacing={4}>
              <Heading 
                fontSize={{ base: "2xl", md: "3xl" }} 
                fontWeight="bold"
                textShadow="0 1px 2px rgba(0,0,0,0.2)"
              >
                VISION
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                textAlign="center"
                lineHeight="1.8"
              >
                A CREDIBLE SUPPLY UNIT WITH AN EFFICIENT SUPPLY SYSTEM, CAPABLE TO SUPPORT 5TH FIGHTER WING UNITS.
              </Text>
            </VStack>

            <VStack spacing={4}>
              <Heading 
                fontSize={{ base: "2xl", md: "3xl" }} 
                fontWeight="bold"
                textShadow="0 1px 2px rgba(0,0,0,0.2)"
              >
                CORE VALUES
              </Heading>
              <Stack 
                direction={{ base: "column", md: "row" }} 
                spacing={4}
                justify="center"
                align="center"
                flexWrap="wrap"
              >
                <Badge 
                  fontSize={{ base: "lg", md: "xl" }}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s"
                  }}
                >
                  INTEGRITY
                </Badge>
                <Badge 
                  fontSize={{ base: "lg", md: "xl" }}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s"
                  }}
                >
                  SERVICE ABOVE SELF
                </Badge>
                <Badge 
                  fontSize={{ base: "lg", md: "xl" }}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s"
                  }}
                >
                  TEAM WORK
                </Badge>
                <Badge 
                  fontSize={{ base: "lg", md: "xl" }}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s"
                  }}
                >
                  EXCELLENCE PROFESSIONALISM
                </Badge>
              </Stack>
            </VStack>
          </VStack>
        </VStack>
      </Container>

      <Footer showLogos={true} showAdminButton={false} />
    </Box>
  );
};

export default MissionVision;
