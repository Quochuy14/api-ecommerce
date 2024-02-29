const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    createEnquiry,
    getEnquiry,
    getallEnquiry,
    updateEnquiry,
    deleteEnquiry,
} = require("../controller/enqController");

router.get("/", authMiddleware, getallEnquiry);
router.get("/:id", authMiddleware, getEnquiry);
router.post("/", authMiddleware, createEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);

module.exports = router;