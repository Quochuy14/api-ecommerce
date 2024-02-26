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


module.exports = {
    createColor,
};