const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");
const validateMongoDbId = require("../utils/validateMongodbId");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getallProducts = asyncHandler(async (req, res) => {
    try {
        //Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));
        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("createAt");
        }
        //Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }
        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page does not exits");
        }
        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const ratingProduct = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body;
    validateMongoDbId(prodId);
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
        if (alreadyRated) {
            await Product.findOneAndUpdate({
                ratings: { $elemMatch: alreadyRated },
            }, {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment,
                }
            }, {
                new: true
            });
        } else {
            await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedby: _id,
                    }
                },
            }, {
                new: true,
            });
        }
        const getallRating = await Product.findById(prodId);
        let totalRating = getallRating.ratings.length;
        let ratingSum = getallRating.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => (prev + curr), 0);
        let actualRating = (ratingSum / totalRating).toFixed(1);
        const finalProduct = await Product.findByIdAndUpdate(prodId, {
            totalrating: actualRating,
        }, {
            new: true,
        });
        res.json(finalProduct);

    } catch (error) {
        throw new Error(error);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = path => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            console.log(urls);
            fs.unlinkSync(path);
        };
        const images = urls.map(file => {
            return file;
        });
        res.json(images);
    } catch (error) {
        ;
        throw new Error(error);
    }
});

const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, "images");

        res.json({ msg: "deleted" });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getaProduct,
    getallProducts,
    updateProduct,
    deleteProduct,
    ratingProduct,
    uploadImages,
    deleteImages,
};