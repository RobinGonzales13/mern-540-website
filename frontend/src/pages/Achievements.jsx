import { Box, Image, Text, SimpleGrid, Heading, Container, useBreakpointValue } from "@chakra-ui/react";
import { Navbar } from '../components/ui/navbar';
import Footer from "../components/ui/Footer";

const achievements = [
  { id: 1, image: "/Awards/1.png", title: "Plaque of Recognition", description: "is hereby presented to 540th Air Base Group for the Unit's commendable effort and exemplary innovation being adjudged as the 1st Place in the AIBDC Innovation Challenge 2025 \"Best Enhanced Model Portable Runway Lights\" Given this day 4th day of February 2025 during the AIBDC 3rd Founding Anniversary at PAF Multi-purpose Gymnasium, Col Jesus Villamor Air Base, Pasay City." },
  { id: 2, image: "/Awards/2.png", title: "Certificate of Achievement in Safety", description: "is presented to 540th AIR BASE GROUP For having greatly contributed to the outstanding safety performance of the Wing and Peace" },
  { id: 3, image: "/Awards/3.png", title: "PLAQUE OF COMMENDATION", description: "is hereby presented to 540th AIR BASE GROUP for emerging as the FOOTBALL 1st Runner-Up in the 2009 Inter-Group Sports Tournament Given this 28th day of August 2008 at Fightertown, Basa Air Base, Pampanga" },
  { id: 4, image: "/Awards/4.png", title: "PLAQUE OF RECOGNITION", description: "is hereby presented in the 540th AIR BASE GROUP for having been adjudged as the 5FW SERVICES SPORT GROUP OF THE YEAR 2003 Given this 27th day of October 2003 at 5th Fighter Wing, Fightertown, Basa Air Base, Pampanga" },
  { id: 5, image: "/Awards/5.png", title: "PLAQUE OF COMMENDATION", description: "is hereby presented to 540th AIR BASE GROUP For emerging as the BASKETBALL CHAMPION at the 2009 - 2010 Inter-Group Sports Tournament Given this 2nd day of March 2010 at Basa Air Base, Floridablanca, Pampanga" },
  { id: 6, image: "/Awards/6.png", title: "PLAQUE OF COMMENDATION", description: "Is hereby presented to 540th AIR BASE GROUP For emerging as the BADMINTON CHAMPION in the 2008 Inter-Group Sports Tournament Given this 28th day of August 2008 at Fightertown Basa Air Base Pampanga" },
  { id: 7, image: "/Awards/7.png", title: "PLAQUE OF COMMENDATION", description: "I hereby presented to 540th AIR BASE GROUP 5th FW Basa Air Base, Floridablanca, Pampanga For having been adjudged as the CG, PAF Streamer AY-2023 1st Runner-up Awardee (Group Service Support Air Base Category – Non-Flying) Given on the occasion of the Philippines Air Force 76th Founding Anniversary at Colonel Jesus Villamor Air Base, Pasay City" },
  { id: 8, image: "/Awards/8.png", title: "PLAQUE OF RECOGNITION", description: "Is hereby presented to 540th AIR BAS GROUP, 5th FW Basa Air Base, Floridablanca, Pampanga For having been adjudged as the CG, PAF Streamer AY-2022 Awardee (Group Service Support Air Base Category – Non-Flying) Given on the occasion of the Philippine Air Force 75th Founding Anniversary at Clark Air Base, Mabalacat City, Pampanga" },
  { id: 9, image: "/Awards/9.png", title: "PLAQUE OF RECOGNITION", description: "Is hereby presented to BASA AIR BASE Floridablanca, Pampanga For having been adjudged as the PAF Base of the Year 2023 Given on the occasion of the Philippine Air Force 76th Founding Anniversary at Clark Air Base, Mabalacat City, Pampanga" },
  { id: 10, image: "/Awards/10.png", title: "PLAQUE OF RECOGNITION", description: "Presented to 540th AIR BASE GROUP GROUP OF THE YEAR for having been adjudged as the Air Defense Command Group of the Year for CY-2019 (Service Support Category) given this 16th day of September 2019 on the occasion of the 5th Founding Anniversary of Air Defense Command, Philippine Air Force " },
];

export default function Achievements() {
  const cardWidth = useBreakpointValue({ base: "100%", md: "300px" });
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

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
        <Heading 
          as="h1" 
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} 
          color="white" 
          mb={20} 
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
          540 ABG Achievements
        </Heading>

        <SimpleGrid columns={columns} spacing={8} justifyItems="center">
          {achievements.map((achieve) => (
            <Box
              key={achieve.id}
              w={cardWidth}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
              transition="all 0.3s"
              _hover={{ 
                transform: "translateY(-5px)", 
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                "& .image-container": {
                  transform: "scale(1.05)"
                }
              }}
              bg="rgba(255, 255, 255, 0.95)"
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
              <Box 
                overflow="hidden" 
                className="image-container"
                transition="transform 0.3s"
                bg="white"
                p={4}
              >
                <Image 
                  src={achieve.image} 
                  alt={achieve.title} 
                  width="100%" 
                  height="200px"
                  objectFit="contain" 
                />
              </Box>
              <Box p={6}>
                <Text 
                  fontWeight="bold" 
                  fontSize="lg" 
                  textAlign="center" 
                  color="gray.800"
                  mb={3}
                >
                  {achieve.title}
                </Text>
                <Text 
                  fontSize="sm" 
                  textAlign="center" 
                  color="gray.600"
                  lineHeight="1.6"
                >
                  {achieve.description}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      <Footer showLogos={false} showAdminButton={false} />
    </Box>
  );
}