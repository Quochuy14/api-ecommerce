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

router.post("/", authMiddleware, createBrand);
router.put("/:id", authMiddleware, updateBrand);
router.get("/", authMiddleware, getallBrand);
router.get("/:id", authMiddleware, getaBrand);
router.delete("/:id", authMiddleware, deleteBrand);

module.exports = router;