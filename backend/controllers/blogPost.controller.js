import BlogPost from "../models/blogPost.model.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required!" });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required!" });
        }

        const imageUrls = req.files.map(file => file.path);

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
        res.status(200).json(posts);
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
            const imageUrls = req.files.map(file => file.path);
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
        const post = await BlogPost.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Delete images from Cloudinary
        if (post.images && post.images.length > 0) {
            for (const imageUrl of post.images) {
                try {
                    // Extract public_id from the Cloudinary URL
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`mern-blog-images/${publicId}`);
                } catch (error) {
                    console.error("Error deleting image from Cloudinary:", error);
                    // Continue with other images even if one fails
                }
            }
        }

        // Delete the post from database
        await BlogPost.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Post and associated images deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
