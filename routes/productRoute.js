const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const {
    createProduct,
    getaProduct,
    getallProducts,
    updateProduct,
    deleteProduct,
    ratingProduct,
    uploadImages,
} = require("../controller/productController");

router.get("/:id", getaProduct);

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/upload/:id", authMiddleware, isAdmin,
    uploadPhoto.array("images", 10), productImgResize, uploadImages);
router.put("/rating", authMiddleware, ratingProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/", getallProducts);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;