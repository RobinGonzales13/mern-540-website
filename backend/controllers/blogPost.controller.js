import BlogPost from "../models/blogPost.model.js";
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export const createPost = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required!" });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required!" });
        }

        const imageUrls = [];
        for (let file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
        }

        const newPost = new BlogPost({ title, content, images: imageUrls });
        await newPost.save();

        res.status(201).json({ success: true, message: "Post created!", post: newPost });
    } catch (error) {
        console.error("Error in createPost:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });

        const formattedPosts = posts.map(post => ({
            ...post.toObject(),
            images: post.images || []
        }));

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const post = await BlogPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        let updatedFields = { title, content };

        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            for (let file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                imageUrls.push(result.secure_url);
            }

            updatedFields.images = imageUrls;
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(id, updatedFields, { new: true });

        res.json({ success: true, message: "Post updated successfully", updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await BlogPost.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
