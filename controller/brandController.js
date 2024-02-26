const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const brand = await Brand.findByIdAndUpdate(id, req.body,
            {
                new: true
            });
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const brand = await Brand.findByIdAndDelete(id,);
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
});

const getaBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const brand = await Brand.findById(id);
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
});

const getallBrand = asyncHandler(async (req, res) => {
    try {
        const brand = await Brand.find();
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getaBrand,
    getallBrand,
};