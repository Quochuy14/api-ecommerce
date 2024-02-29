const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

const { createBlog,
    updateBlog,
    deleteBlog,
    getaBlog,
    getallBlog,
    likeBlog,
    dislikeBlog,
    uploadImages,
} = require("../controller/blogController");

router.get("/", authMiddleware, getallBlog);
router.get("/:id", authMiddleware, getaBlog);
router.post("/", authMiddleware, createBlog);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.put("/upload/:id", authMiddleware, isAdmin,
    uploadPhoto.array("images", 5), blogImgResize, uploadImages);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;