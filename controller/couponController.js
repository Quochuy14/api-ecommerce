const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
    try {

        const coupon = await Coupon.create(req.body);
        res.json(coupon)
    } catch (error) {
        throw new Error(error);
    }
});

const createCouponSimul = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    try {
        for (let i = 0; i < quantity; i++) {
            req.body.name = Math.random().toString(36).substr(2, 15);
            await Coupon.create(req.body);
        }
        res.json({ message: "Saved" })
    } catch (error) {
        throw new Error(error);
    }
});

const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const coupon = await Coupon.findById(id);
        res.json(coupon)
    } catch (error) {
        throw new Error(error);
    }
});

const getallCoupons = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.find();
        res.json(coupon)
    } catch (error) {
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(coupon)
    } catch (error) {
        throw new Error(error);
    }
});


const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const coupon = await Coupon.findByIdAndDelete(id);
        res.json(coupon)
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCoupon,
    createCouponSimul,
    getCoupon,
    getallCoupons,
    deleteCoupon,
    updateCoupon,
}