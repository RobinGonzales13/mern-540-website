import { 
  Box, Flex, Image, Text, Button, IconButton, Drawer, DrawerOverlay, 
  DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, 
  useBreakpointValue, useDisclosure, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Textarea 
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import axios from 'axios';
import ContactUs from "./ContactUs";

const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar({ showContactButton = true }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
      if (!name || !email || !message) {
          alert("Please fill in all fields.");
          return;
      }

      setIsSubmitting(true);
      try {
          const response = await axios.post(`${API_URL}/api/contact`, {
              name,
              email,
              message,
          });

          if (response.data.success) {
              alert("Message sent successfully!");
              setName("");
              setEmail("");
              setMessage("");
              closeModal();
          } else {
              alert("Error sending message.");
          }
      } catch (error) {
          console.error("Contact form error:", error);
          alert("Failed to send message. Try again later.");
      } finally {
          setIsSubmitting(false);
      }
  };

  const logoSize = useBreakpointValue({ base: "70px", sm: "80px", md: "90px", lg: "100px" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      w="100%"
      bg="rgba(255, 255, 255, 0)"
      zIndex="1000"
      padding={"3%"}
      px={{ base: 4, md: 10 }}
    >
      <Flex h="100%" alignItems="center" w="100%" justifyContent="space-between">
        <Flex as={Link} to="/" alignItems="center" _hover={{ textDecoration: 'none', opacity: 0.8 }}>
          <Image src="/logo.png" alt="Logo" boxSize={logoSize} mr={3} />
          <Text fontSize="2xl" fontWeight="bold" color="white" display={{ base: "none", md: "block" }}>
            540th AIR BASE GROUP
          </Text>
        </Flex>

        {isMobile ? (
          <IconButton icon={<HamburgerIcon />} variant="ghost" color="white" fontSize="2xl" onClick={onOpen} _hover={{ bg: "rgba(255, 255, 255, 0.2)" }} />
        ) : (
          <Flex gap={3}>
            <Button as={Link} to="/" variant="ghost" color="white" fontWeight="bold" _hover={{ bg: "rgba(255, 255, 255, 0.52)" }}>
              HOME
            </Button>
            <Button as={Link} to="/history" variant="ghost" color="white" fontWeight="bold" _hover={{ bg: "rgba(255, 255, 255, 0.52)" }}>
              HISTORY
            </Button>
            <Button as={Link} to="/achievements" variant="ghost" color="white" fontWeight="bold" _hover={{ bg: "rgba(255, 255, 255, 0.52)" }}>
              ACHIEVEMENTS
            </Button>
            {showContactButton && (
              <Button 
                variant="outline" 
                borderColor="white" 
                color="white" 
                fontWeight="bold" 
                _hover={{ bg: "rgba(255, 255, 255, 0.52)" }} 
                onClick={openModal}
              >
                CONTACT US
              </Button>
            )}
          </Flex>
        )}

        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="gray.800" color="white">
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <Button as={Link} to="/" variant="ghost" onClick={onClose} _hover={{ bg: "gray.600" }} color={'white'}>
                  HOME
                </Button>
                <Button as={Link} to="/history" variant="ghost" onClick={onClose} _hover={{ bg: "gray.600" }} color={'white'}>
                  HISTORY
                </Button>
                <Button as={Link} to="/achievements" variant="ghost" onClick={onClose} _hover={{ bg: "gray.600" }} color={'white'}>
                  ACHIEVMENTS
                </Button>
                {showContactButton && (
                  <Button 
                    variant="outline" 
                    borderColor="white" 
                    color="white" 
                    fontWeight="bold" 
                    _hover={{ bg: "rgba(255, 255, 255, 0.52)" }} 
                    onClick={openModal}
                  >
                    CONTACT US
                  </Button>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contact Us</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ContactUs />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
