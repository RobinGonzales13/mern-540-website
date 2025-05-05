import { useEffect, useState } from "react";
import { Box, Button, Spinner, Text, Flex, Image, VStack, Heading, Input, Textarea } from "@chakra-ui/react";
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
            const response = await axios.get("https://mern-540-backend.onrender.com/api/posts");
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
    
        if (files.length > 10) {
            alert("You can only upload up to 10 images!");
            return;
        }
    
        setImages(files);
    
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };   

    const handleUpload = async (e) => {
        e.preventDefault();
    
        if (images.length === 0) {
            alert("Please select at least one image!");
            return;
        }
    
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        images.forEach(image => formData.append("images", image));
    
        try {
            await axios.post("https://mern-540-backend.onrender.com/api/posts/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            alert("Post created successfully!");
            setTitle("");
            setContent("");
            setImages([]);
            setPreviews([]);
            fetchPosts();
        } catch (error) {
            alert("Error uploading post");
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post._id);
        setUpdatedTitle(post.title);
        setUpdatedContent(post.content);
        setNewImages([]);
    };

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length > 10) {
            alert("You can only upload up to 10 images!");
            return;
        }

        setNewImages(files);
    };

    const handleSaveEdit = async (postId) => {
        const formData = new FormData();
        formData.append("title", updatedTitle);
        formData.append("content", updatedContent);
        
        if (newImages.length > 0) {
            newImages.forEach((image) => formData.append("images", image));
        }
    
        try {
            await axios.put(`https://mern-540-backend.onrender.com/api/posts/${postId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            alert("Post updated successfully!");
            setEditingPost(null);
            fetchPosts();
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Error updating post");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://mern-540-backend.onrender.com/api/posts/${id}`);
            alert("Post deleted successfully!");
            fetchPosts();
        } catch (error) {
            alert("Error deleting post");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/Admin-Login";
    };

    if (loading) {
        return <Box textAlign="center" mt={10}><Spinner size="xl" /></Box>;
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

            <Box p={6}>
                <Heading mb={4}>Create a New Post</Heading>
                <VStack spacing={4} align="start">
                    <Box 
                        bg="yellow.100" 
                        border="1px solid" 
                        borderColor="yellow.400" 
                        borderRadius="md" 
                        p={3} 
                        mb={4} 
                        textAlign="center"
                    >
                        <Text fontSize="sm" color="yellow.700" fontWeight="bold">
                            Recommended image resolution is **1200x800px**. 
                            You can upload up to **10 images** per post.
                        </Text>
                    </Box>

                    <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                    <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
                    {previews.length > 0 && previews.map((src, index) => (
                        <Image key={index} src={src} alt={`Preview ${index}`} boxSize="100px" />
                    ))}
                    <Button colorScheme="blue" onClick={handleUpload}>Submit</Button>
                </VStack>
            </Box>

            <Box p={6} display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Heading mb={4}>Manage Posts</Heading>
                <VStack spacing={6} align="center" w={{ base: "90%", md: "33.33%" }}>
                    {posts.length === 0 ? (
                        <Text>No posts available</Text>
                    ) : (
                        posts.map((post) => (
                            <Box key={post._id} p={4} borderWidth="1px" borderRadius="lg" w="100%" textAlign="center" position="relative">
                                {post.images && post.images.length > 0 ? (
                                    <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }}>
                                        {post.images.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <Image src={`${API_URL}${img}`} alt={`Slide ${index}`} boxSize="100%" objectFit="cover" />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <Text>No images available</Text>
                                )}

                                {editingPost === post._id ? (
                                    <>
                                        <Input value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
                                        <Textarea value={updatedContent} onChange={(e) => setUpdatedContent(e.target.value)} />
                                        <Input type="file" multiple accept="image/*" onChange={handleNewImageChange} />
                                        <Button colorScheme="green" onClick={() => handleSaveEdit(post._id)}>Save</Button>
                                        <Button colorScheme="gray" onClick={() => setEditingPost(null)}>Cancel</Button>
                                    </>
                                ) : (
                                    <>
                                        <Text fontSize="xl" fontWeight="bold" mt={2}>{post.title}</Text>
                                        <Text>{post.content}</Text>

                                        {post.createdAt && (
                                            <Text fontSize="sm" color="gray.500" position="absolute" bottom={2} right={2}>
                                                {format(new Date(post.createdAt), "MMMM d, yyyy")}
                                            </Text>
                                        )}

                                        <Button colorScheme="blue" mt={2} onClick={() => handleEdit(post)}>Edit</Button>
                                        <Button colorScheme="red" mt={2} onClick={() => handleDelete(post._id)}>Delete</Button>
                                    </>
                                )}
                            </Box>
                        ))
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
