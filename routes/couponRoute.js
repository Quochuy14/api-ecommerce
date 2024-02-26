const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    createCoupon,
    createCouponSimul,
    getCoupon,
    getallCoupons,
    deleteCoupon,
    updateCoupon,
} = require("../controller/couponController");

router.post("/simul", authMiddleware, isAdmin, createCouponSimul);
router.post("/", authMiddleware, isAdmin, createCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.get("/", authMiddleware, isAdmin, getallCoupons);
router.get("/:id", authMiddleware, isAdmin, getCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;