const asyncHandler = require("express-async-handler");
const ProductCategory = require("../models/proCatModel");
const validateMongoDbId = require("../utils/validateMongodbId");

const createProCat = asyncHandler(async (req, res) => {
    try {
        const category = await ProductCategory.create(req.body);
        res.json(category)
    } catch (error) {
        throw new Error(error);
    }
});

const updateProCat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await ProductCategory.findByIdAndUpdate(id, req.body,
            {
                new: true
            });
        res.json(updateCategory)
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProCat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await ProductCategory.findByIdAndDelete(id,);
        res.json(deleteCategory)
    } catch (error) {
        throw new Error(error);
    }
});

const getaProCat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const category = await ProductCategory.findById(id);
        res.json(category)
    } catch (error) {
        throw new Error(error);
    }
});

const getallProCat = asyncHandler(async (req, res) => {
    try {
        const category = await ProductCategory.find();
        res.json(category)
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createProCat,
    updateProCat,
    deleteProCat,
    getaProCat,
    getallProCat,
}