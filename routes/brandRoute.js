const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    createBrand,
    updateBrand,
    deleteBrand,
    getaBrand,
    getallBrand,
} = require("../controller/brandController");

router.get("/", authMiddleware, getallBrand);
router.get("/:id", authMiddleware, getaBrand);
router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;