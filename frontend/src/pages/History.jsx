import { Box, VStack, Heading, Text, Container, useBreakpointValue } from "@chakra-ui/react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/footer";

const History = () => {
  const videoWidth = useBreakpointValue({ base: "100%", md: "80%", lg: "70%" });
  const videoHeight = useBreakpointValue({ base: "300px", md: "500px", lg: "600px" });

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
        <VStack spacing={8} align="center">
          <Heading 
            color="white" 
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} 
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
            History of 540 ABG
          </Heading>
          
          <Text 
            color="white" 
            fontSize={{ base: "md", md: "lg" }} 
            textAlign="center" 
            maxW="800px"
            opacity={0.9}
            textShadow="0 1px 2px rgba(0,0,0,0.2)"
          >
            Watch this video to learn about the rich history and heritage of the 540 Air Base Group.
          </Text>

          <Box 
            w={"90%"} 
            h={"auto"} 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "lg",
              pointerEvents: "none"
            }}
          >
            <video
              width="100%"
              height="100%"
              controls
              style={{ objectFit: "cover" }}
            >
              <source src="/history.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>

          <Text 
            color="white" 
            fontSize={{ base: "sm", md: "md" }} 
            textAlign="center" 
            maxW="600px"
            opacity={0.9}
            textShadow="0 1px 2px rgba(0,0,0,0.2)"
          >
            The 540 Air Base Group has a proud history of service and dedication to the Philippine Air Force. 
            This video showcases our journey, achievements, and commitment to excellence.
          </Text>
        </VStack>
      </Container>

      <Footer showLogos={false} showAdminButton={false} />
    </Box>
  );
};

export default History; 