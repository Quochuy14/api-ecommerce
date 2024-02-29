const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    createProCat,
    updateProCat,
    deleteProCat,
    getaProCat,
    getallProCat,
} = require("../controller/proCatController");

router.get("/", authMiddleware, getallProCat);
router.get("/:id", authMiddleware, getaProCat);
router.post("/", authMiddleware, createProCat);
router.put("/:id", authMiddleware, updateProCat);
router.delete("/:id", authMiddleware, deleteProCat);

module.exports = router;