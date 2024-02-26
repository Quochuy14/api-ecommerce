const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

const { createBlog,
    updateBlog,
    deleteBlog,
    getaBlog,
    getallBlog,
    likeBlog,
    dislikeBlog,
    uploadImages,
} = require("../controller/blogController")

router.post("/", authMiddleware, createBlog);

router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.put("/upload/:id", authMiddleware, isAdmin,
    uploadPhoto.array("images", 5), blogImgResize, uploadImages);

router.get("/:id", authMiddleware, getaBlog);
router.get("/", authMiddleware, getallBlog);

router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;