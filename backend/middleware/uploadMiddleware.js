import multer from "multer";

// ✅ Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images inside "uploads/"
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// ✅ Allow multiple file uploads
const upload = multer({ storage });

export default upload;
