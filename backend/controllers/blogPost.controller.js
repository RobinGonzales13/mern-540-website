import BlogPost from "../models/blogPost.model.js";

export const createPost = async (req, res) => {
    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required!" });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required!" });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

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
        // ✅ Check if post exists
        const post = await BlogPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        let updatedFields = { title, content };

        // ✅ Handle image updates (if new images are uploaded)
        if (req.files && req.files.length > 0) {
            updatedFields.images = req.files.map((file) => `/uploads/${file.filename}`);
        }

        // ✅ Update post
        const updatedPost = await BlogPost.findByIdAndUpdate(id, updatedFields, { new: true });

        res.json({ success: true, message: "Post updated successfully", updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete posts
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
