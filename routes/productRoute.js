const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const {
    createProduct,
    getaProduct,
    getallProducts,
    updateProduct,
    deleteProduct,
    ratingProduct,
    uploadImages,
    deleteImages,
} = require("../controller/productController");

router.get("/", getallProducts);
router.get("/:id", getaProduct);

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/upload-imgs/", authMiddleware, isAdmin,
    uploadPhoto.array("images", 10), productImgResize, uploadImages);
router.put("/rating", authMiddleware, ratingProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete-imgs/:id", authMiddleware, isAdmin, deleteImages);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;