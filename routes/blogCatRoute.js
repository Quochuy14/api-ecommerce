const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    createBlogCat,
    updateBlogCat,
    deleteBlogCat,
    getaBlogCat,
    getallBlogCat,
} = require("../controller/blogCatController");

router.post("/", authMiddleware, createBlogCat);
router.put("/:id", authMiddleware, updateBlogCat);
router.get("/", authMiddleware, getallBlogCat);
router.get("/:id", authMiddleware, getaBlogCat);
router.delete("/:id", authMiddleware, deleteBlogCat);

module.exports = router;