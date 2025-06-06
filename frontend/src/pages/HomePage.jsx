import { useEffect, useState } from "react";
import { Box, VStack, Text, Grid, GridItem, Image, Heading, Divider, Button, Spinner, useToast, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay"
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import Navbar from '../components/ui/navbar';
import Footer from "../components/ui/Footer";

const API_URL = import.meta.env.VITE_API_URL || "https://five40airbasegroup-paf-backend.onrender.com";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
      const fetchPosts = async () => {
          try {
              setLoading(true);
              setError(null);
              const response = await axios.get(`${API_URL}/api/posts`);
              setPosts(response.data);
          } catch (error) {
              console.error("Error fetching posts:", error);
              setError("Failed to load posts. Please try again later.");
              toast({
                  title: "Error",
                  description: "Failed to load posts. Please try again later.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
              });
          } finally {
              setLoading(false);
          }
      };
      fetchPosts();
  }, [toast]);

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const truncateText = (text, limit = 250) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

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
      {/* Background Video Layer */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="100vh"
        overflow="hidden"
        zIndex={0}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source src="/homepage-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
      
      <Navbar showContactButton={true} />

      <Grid
        templateAreas={{
          base: `"header" "slogan" "main" "nav1" "nav2" "footer"`,
          md: `"header header header" "slogan slogan slogan" "nav1 main nav2" "footer footer footer"`
        }}
        gridTemplateRows={{ base: "auto", md: "auto auto auto" }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 1.5fr 1fr" }}
        w="100vw"
        maxW="100vw"
        boxSizing="border-box"
        alignItems="start"
      >
      {/* Header Section */}
      <GridItem 
        area="header" 
        w="100vw" 
        h={{ base: "auto", md: "100vh" }} 
        minH={{ base: "100vh", md: "100vh" }} 
        position="relative"
      >
        <Box
          w="100vw"
          h="100%"
          bgImage={{ base: "url('/mobile-bg.gif')", md: "url('/bg1.gif')" }}
          bgSize={{ base: "contain", md: "cover" }}
          bgPosition={{ base: "top center", md: "center" }}
          bgRepeat="no-repeat"
          display="flex"
          alignItems="center"
          justifyContent="center"
        />
      </GridItem>

        {/* Slogan Section */}
        <GridItem 
          area="slogan" 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          textAlign="center" 
          p={{ base: 4, md: 20 }}
        >
          <Image 
            src="/elephant.png" 
            alt="Slogan Logo"
            w={{ base: "100px", md: "400px" }}
            h={{ base: "100px", md: "400px" }}
            objectFit="contain"
            mb={-6}
          />

          <VStack spacing={4} maxW={{ base: "90%", md: "800px" }} textColor="white" fontFamily="Arial">
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="extrabold">MISSION</Text>
            <Text fontSize={{ base: "md", md: "lg" }}>
              TO MANAGE, ADMINISTER, OPERATE AND MAINTAIN BASE FACILITIES AND PROVIDE BASE SERVICES AT BASA&nbsp;&nbsp;AIR BASE IN SUPPORT TO AIBDC MISSION
            </Text>

            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">VISION</Text>
            <Text fontSize={{ base: "md", md: "lg" }}>
              A CREDIBLE AND AGILE AIR FORCE ADAPTABLE TO MODERN WARFARE AND RESPONSIVE TO NATIONAL AND REGIONAL SECURITY AND DEVELOPMENT
            </Text>
          </VStack>
        </GridItem>

        {/* Main Content Section */}
        <GridItem area="main" bg="white" mx="auto" mt={10} mb={10} w={{ base: "90%", md: "600px" }}>
          <VStack spacing={6} p={6}>
              <Heading fontSize="2xl">Latest Posts</Heading>
              {loading ? (
                  <Box textAlign="center" py={10}>
                      <Spinner size="xl" />
                      <Text mt={4}>Loading posts...</Text>
                  </Box>
              ) : error ? (
                  <Alert status="error">
                      <AlertIcon />
                      <AlertTitle>Error Loading Posts</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                  </Alert>
              ) : posts.length === 0 ? (
                  <Alert status="info">
                      <AlertIcon />
                      <AlertTitle>No Posts Available</AlertTitle>
                      <AlertDescription>Check back later for updates.</AlertDescription>
                  </Alert>
              ) : (
                posts.map((post) => (
                  <Box 
                    key={post._id} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    w="100%" 
                    position="relative"
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                    transition="all 0.2s"
                  >
                      <Swiper
                          modules={[Navigation, Pagination, Autoplay]}
                          spaceBetween={10}
                          slidesPerView={1}
                          navigation
                          pagination={{ clickable: true }}
                          autoplay={{ delay: 5000, disableOnInteraction: false }}
                          loop={true}
                          style={{ width: "100%", height: "100%" }}
                      >
                          {post.images.map((img, index) => (
                              <SwiperSlide key={index}>
                                  <Image 
                                      src={img} 
                                      alt={`Slide ${index}`} 
                                      boxSize="100%" 
                                      objectFit="cover"
                                      fallbackSrc="/placeholder-image.jpg"
                                  />
                              </SwiperSlide>
                          ))}
                      </Swiper>
              
                      <Text fontSize="xl" fontWeight="bold" mt={2}>{post.title}</Text>
                      <Text color="gray.600" fontSize="sm" mb={2}>
                          {format(new Date(post.createdAt), 'PPP')}
                      </Text>
                      <Text>
                        {expandedPosts[post._id] ? post.content : truncateText(post.content)}
                      </Text>
                      {post.content.length > 250 && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => togglePostExpansion(post._id)}
                          mt={2}
                        >
                          {expandedPosts[post._id] ? "Show Less" : "Read More"}
                        </Button>
                      )}
                  </Box>
                ))
              )}
          </VStack>
        </GridItem>

        {/* Sidebar Navigation 1 */}
        <GridItem 
          bg="white" 
          area="nav1" 
          display="flex" 
          flexDirection="column"
          alignItems="center"
          justifyContent="left" 
          ml={{ base: 0, md: 10 }} 
          mt={10} 
          mb={10}
          p={4}
          height="auto"
          alignSelf="flex-start"
        >
          <Box w="100%" h="auto" position="relative">
            <Link to="/pol-login" style={{ display: "block", width: "100%" }}>
              <Image 
                src="/pol.jpg" 
                alt="POL Dump Image" 
                w="100%" 
                h="auto" 
                objectFit="cover"
                transition="transform 0.3s ease-in-out" 
                _hover={{ transform: "scale(1.05)" }} 
              />
            </Link>

            <Box 
              position="absolute" 
              bottom="10px" 
              left="10px" 
              bg="rgba(0, 0, 0, 0.6)" 
              color="white" 
              p={2} 
              borderRadius="5px"
            >
              <Text fontSize="md" fontWeight="bold">POL Dump - Fuel Station</Text>
            </Box>
          </Box>
          
          <Divider borderColor="gray.400" my={6} />

          {/* PAF Facebook Page */}
          <Box w="100%" mt={4}>
            <iframe 
              title="PAF Facebook Page"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com/187474468048442&tabs=timeline&width=360&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
              width="100%" 
              height="500px" 
              style={{ border: "none", overflow: "hidden" }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </Box>
          
          <Divider borderColor="gray.400" my={6} />

          {/* YouTube Video Embed */}
          <Box w="100%" mt={4} textAlign="center">
            <iframe 
              title="PAF YouTube Channel"
              width="100%" 
              height="315" 
              src="https://www.youtube.com/embed/0LNf0E5P0B4"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </Box>
          
          <Divider borderColor="gray.400" my={6} />
          
          {/* BASA Facebook Page */}
          <Box w="100%" mt={4} textAlign="center">
            <iframe 
              title="BASA Facebook Page"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com/61566369316560&tabs=timeline&width=360&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
              width="100%" 
              height="500px" 
              style={{ border: "none", overflow: "hidden" }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </Box>
        </GridItem>
        
        {/* Sidebar Navigation 2 (Now Below Nav1 on Mobile) */}
        <GridItem 
          bg="white" 
          area="nav2" 
          display="flex" 
          flexDirection="column"
          alignItems="center"
          justifyContent="left" 
          mr={{ base: 0, md: 10 }} 
          mt={10} 
          mb={10}
          p={4}
          height="auto"
          alignSelf="flex-start"
        >
          {/* PAF Facebook Page */}
          <Box w="100%" mt={4}>
            <iframe 
              title="PAF Facebook Page"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fhttps://www.facebook.com/187474468048442?ref=embed_page&tabs=timeline&width=360&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
              width="100%" 
              height="500px" 
              style={{ border: "none", overflow: "hidden" }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </Box>
          
          <Divider borderColor="gray.400" my={6} />
        </GridItem>

        {/* Footer Section */}
        <GridItem area="footer" bg="blue.300" textAlign="left" zIndex={1} position="relative">
          <Footer showLogos={true} showAdminButton={true} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default HomePage;
