const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createUser,
    loginUser,
    loginAdmin,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    handleBlocked,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    addToWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrder,
    getallOrder,
    updateOrderStatus
} = require('../controller/userController');

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.get("/logout", logout);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", authMiddleware, resetPassword);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart", authMiddleware, userCart);
router.put("/wishlist", authMiddleware, addToWishlist);
router.get("/refresh", handleRefreshToken);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/update-pwd", authMiddleware, updatePassword);
router.get("/user-cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/cart/get-order", authMiddleware, getOrder);

//Admin
router.delete("/delete/:id", authMiddleware, isAdmin, deleteaUser);
router.put("/block-user/:id", authMiddleware, isAdmin, handleBlocked);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.get("/all-users", authMiddleware, isAdmin, getallUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, handleBlocked);
router.get("/all-order", authMiddleware, isAdmin, getallOrder);
router.put("/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;