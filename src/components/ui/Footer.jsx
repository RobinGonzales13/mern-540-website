import { Box, Container, Text, Divider, Grid, GridItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const logos = [
  { src: "/Logos/01.png", alt: "Logo1", link: "/541st-Mission-Vision" },
  { src: "/Logos/02.png", alt: "Logo2", link: "/542nd-Mission-Vision" },
  { src: "/Logos/03.png", alt: "Logo3", link: "/543rd-Mission-Vision" },
  { src: "/Logos/04.png", alt: "Logo4", link: "/544th-Mission-Vision" },
  { src: "/Logos/05.png", alt: "Logo5", link: "/545th-Mission-Vision" },
  { src: "/Logos/06.png", alt: "Logo6", link: "/546th-Mission-Vision" },
  { src: "/Logos/07.png", alt: "Logo7", link: "/547th-Mission-Vision" },
  { src: "/Logos/08.png", alt: "Logo8", link: "/548th-Mission-Vision" },
  { src: "/Logos/09.png", alt: "Logo9", link: "/549th-Mission-Vision" },
];

export default function Footer({ showLogos = true, showAdminButton = true }) {
  return (
    <Box bg="gray.800" color="white" py={20} width="100%">
      <Container maxW="6xl" px={6}>
        {showLogos && (
          <>
            <Text fontSize="lg" fontWeight="bold" mb={12} textAlign="center">
              Related Sites
            </Text>
            <Grid 
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }} 
              gap={{ base: 4, md: 6 }} 
              justifyItems="center" 
              alignItems="center"
            >
              {logos.map((logo, index) => (
                <GridItem key={index} display="flex" justifyContent="center">
                  <Link to={logo.link}>
                    <Image 
                      src={logo.src} 
                      alt={logo.alt} 
                      width={{ base: "100px", md: "130px" }}
                      height={{ base: "100px", md: "130px" }}
                      objectFit="contain"
                      transition="all 0.3s ease-in-out"
                      _hover={{
                        transform: "scale(1.3)",
                        filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))"
                      }}
                    />
                  </Link>
                </GridItem>
              ))}
            </Grid>
          </>
        )}
      </Container>

      <Divider mt={12} mx="auto" w="90%" opacity={0.4} />

      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center" px="5%" width="90%">
        <Text fontSize="sm" opacity={0.7}>
          © 2024 Your Company. All rights reserved.
        </Text>

        {/* Admin Button (conditionally rendered) */}
        {showAdminButton && (
          <Link to="/Admin-Login">
            <Button color={'white'} size="sm" variant="outline">ADMIN SITE</Button>
          </Link>
        )}
      </Box>
    </Box>
  );
}
