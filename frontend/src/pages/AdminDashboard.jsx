import { useEffect, useState } from "react";
import { Box, Button, Spinner, Text, Flex, Image, VStack, Heading, Input, Textarea, useToast, FormControl, FormLabel, FormErrorMessage, Alert, AlertIcon, AlertTitle, AlertDescription, Grid } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { format } from "date-fns"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://five40airbasegroup-paf-backend.onrender.com";

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedContent, setUpdatedContent] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast({
                title: "Error",
                description: "Failed to fetch posts. Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!content.trim()) newErrors.content = "Content is required";
        if (images.length === 0) newErrors.images = "At least one image is required";
        if (images.length > 10) newErrors.images = "Maximum 10 images allowed";
        return newErrors;
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setErrors({});
    
        if (files.length > 10) {
            setErrors({ images: "You can only upload up to 10 images!" });
            return;
        }
    
        setImages(files);
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };   

    const handleUpload = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsUploading(true);
    
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        images.forEach(image => formData.append("images", image));
    
        try {
            const response = await axios.post(`${API_URL}/api/posts/create`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });
    
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: "Post created successfully!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setTitle("");
                setContent("");
                setImages([]);
                setPreviews([]);
                setErrors({});
                fetchPosts();
            }
        } catch (error) {
            console.error("Error uploading post:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error uploading post. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post._id);
        setUpdatedTitle(post.title);
        setUpdatedContent(post.content);
        setNewImages([]);
        setErrors({});
    };

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        setErrors({});
        
        if (files.length > 10) {
            setErrors({ newImages: "You can only upload up to 10 images!" });
            return;
        }

        setNewImages(files);
    };

    const handleSaveEdit = async (postId) => {
        const formErrors = {};
        if (!updatedTitle.trim()) formErrors.updatedTitle = "Title is required";
        if (!updatedContent.trim()) formErrors.updatedContent = "Content is required";
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formData = new FormData();
        formData.append("title", updatedTitle);
        formData.append("content", updatedContent);
        
        if (newImages.length > 0) {
            newImages.forEach((image) => formData.append("images", image));
        }
    
        try {
            await axios.put(`${API_URL}/api/posts/${postId}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });
    
            toast({
                title: "Success",
                description: "Post updated successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setEditingPost(null);
            setErrors({});
            fetchPosts();
        } catch (error) {
            console.error("Error updating post:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error updating post. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/api/posts/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            toast({
                title: "Success",
                description: "Post deleted successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Error deleting post. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/Admin-Login";
    };

    if (loading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading dashboard...</Text>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Unauthorized Access</AlertTitle>
                <AlertDescription>
                    Please log in to access the admin dashboard.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Box minH="100vh" bg="gray.100">
            <Flex bg="white" p={4} align="center" boxShadow="md">
                <Image src="/logo.png" alt="Logo" boxSize="50px" mr={3} />
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    Admin Dashboard
                </Text>
                <Button colorScheme="red" ml="auto" onClick={handleLogout}>
                    Logout
                </Button>
            </Flex>

            <Box maxW="1200px" mx="auto" p={6}>
                <Grid
                    templateColumns={{ base: "1fr", md: "1fr 2fr" }}
                    gap={6}
                >
                    {/* Create Post Section */}
                    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
                        <Heading mb={4}>Create a New Post</Heading>
                        <VStack spacing={4} align="start">
                            <Alert status="info" variant="subtle">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Image Guidelines</AlertTitle>
                                    <AlertDescription>
                                        Recommended image resolution is 1200x800px. You can upload up to 10 images per post.
                                    </AlertDescription>
                                </Box>
                            </Alert>

                            <FormControl isInvalid={errors.title}>
                                <FormLabel>Title</FormLabel>
                                <Input 
                                    placeholder="Enter post title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                />
                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.content}>
                                <FormLabel>Content</FormLabel>
                                <Textarea 
                                    placeholder="Enter post content" 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                />
                                <FormErrorMessage>{errors.content}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.images}>
                                <FormLabel>Images</FormLabel>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={handleImageChange} 
                                />
                                <FormErrorMessage>{errors.images}</FormErrorMessage>
                            </FormControl>

                            {previews.length > 0 && (
                                <Flex wrap="wrap" gap={2}>
                                    {previews.map((src, index) => (
                                        <Image 
                                            key={index} 
                                            src={src} 
                                            alt={`Preview ${index}`} 
                                            boxSize="100px" 
                                            objectFit="cover"
                                        />
                                    ))}
                                </Flex>
                            )}

                            <Button 
                                colorScheme="blue" 
                                onClick={handleUpload} 
                                isLoading={isUploading}
                                loadingText="Uploading..."
                                w="100%"
                            >
                                Create Post
                            </Button>
                        </VStack>
                    </Box>

                    {/* Posts Section */}
                    <Box>
                        <Heading mb={4}>Manage Posts</Heading>
                        <VStack spacing={4}>
                            {posts.map((post) => (
                                <Box 
                                    key={post._id} 
                                    bg="white" 
                                    p={4} 
                                    borderRadius="lg" 
                                    boxShadow="md" 
                                    w="100%"
                                >
                                    {editingPost === post._id ? (
                                        <VStack spacing={4} align="start">
                                            <FormControl isInvalid={errors.updatedTitle}>
                                                <FormLabel>Title</FormLabel>
                                                <Input 
                                                    value={updatedTitle} 
                                                    onChange={(e) => setUpdatedTitle(e.target.value)} 
                                                />
                                                <FormErrorMessage>{errors.updatedTitle}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={errors.updatedContent}>
                                                <FormLabel>Content</FormLabel>
                                                <Textarea 
                                                    value={updatedContent} 
                                                    onChange={(e) => setUpdatedContent(e.target.value)} 
                                                />
                                                <FormErrorMessage>{errors.updatedContent}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={errors.newImages}>
                                                <FormLabel>Add New Images</FormLabel>
                                                <Input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    multiple 
                                                    onChange={handleNewImageChange} 
                                                />
                                                <FormErrorMessage>{errors.newImages}</FormErrorMessage>
                                            </FormControl>

                                            <Flex gap={2}>
                                                <Button 
                                                    colorScheme="green" 
                                                    onClick={() => handleSaveEdit(post._id)}
                                                >
                                                    Save
                                                </Button>
                                                <Button 
                                                    colorScheme="gray" 
                                                    onClick={() => setEditingPost(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </Flex>
                                        </VStack>
                                    ) : (
                                        <>
                                            <Text fontSize="xl" fontWeight="bold">{post.title}</Text>
                                            <Text>{post.content}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Created: {format(new Date(post.createdAt), 'PPP')}
                                            </Text>
                                            <Swiper
                                                modules={[Navigation, Pagination]}
                                                navigation
                                                pagination={{ clickable: true }}
                                                spaceBetween={30}
                                                slidesPerView={1}
                                            >
                                                {post.images.map((image, index) => (
                                                    <SwiperSlide key={index}>
                                                        <Image 
                                                            src={image} 
                                                            alt={`Post image ${index}`} 
                                                            w="100%" 
                                                            h="300px" 
                                                            objectFit="cover"
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                            <Flex gap={2} mt={4}>
                                                <Button 
                                                    colorScheme="blue" 
                                                    onClick={() => handleEdit(post)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    colorScheme="red" 
                                                    onClick={() => handleDelete(post._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Flex>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                </Grid>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
