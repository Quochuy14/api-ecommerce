const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    createColor,
    updateColor,
    deleteColor,
    getaColor,
    getallColor,
} = require("../controller/colorController");

router.get("/", authMiddleware, isAdmin, deleteColor);
router.get("/:id", authMiddleware, isAdmin, getaColor);
router.post("/", authMiddleware, isAdmin, createColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, getallColor);

module.exports = router;