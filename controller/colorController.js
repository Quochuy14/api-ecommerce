const asyncHandler = require("express-async-handler");
const Color = require("../models/colorModel");
const validateMongoDbId = require("../utils/validateMongodbId");

const createColor = asyncHandler(async (req, res) => {
    try {
        const color = await Color.create(req.body);
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
});

const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const color = await Color.findByIdAndUpdate(id, req.body,
            {
                new: true
            });
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const color = await Color.findByIdAndDelete(id,);
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
});

const getaColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const color = await Color.findById(id);
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
});

const getallColor = asyncHandler(async (req, res) => {
    try {
        const color = await Color.find();
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getaColor,
    getallColor,
};