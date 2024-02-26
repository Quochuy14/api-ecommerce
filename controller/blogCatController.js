const asyncHandler = require("express-async-handler");
const BlogCategory = require("../models/blogCatModel");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBlogCat = asyncHandler(async (req, res) => {
    try {
        const blogCat = await BlogCategory.create(req.body);
        res.json(blogCat)
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlogCat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const blogCat = await BlogCategory.findByIdAndUpdate(id, req.body,
            {
                new: true
            });
        res.json(blogCat)
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlogCat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const blogCat = await BlogCategory.findByIdAndDelete(id,);
        res.json(blogCat)
    } catch (error) {
        throw new Error(error);
    }
});

const getaBlogCat = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const blogCat = await BlogCategory.findById(id);
        res.json(blogCat)
    } catch (error) {
        throw new Error(error);
    }
});

const getallBlogCat = asyncHandler(async (req, res) => {
    try {
        const blogCat = await BlogCategory.find();
        res.json(blogCat)
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createBlogCat,
    updateBlogCat,
    deleteBlogCat,
    getaBlogCat,
    getallBlogCat,
}