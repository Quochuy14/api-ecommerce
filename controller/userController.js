const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uniqid = require('uniqid');
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const sendEmail = require("./emailController");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");

const createUser = asyncHandler(async (req, res) => {
    const { email, role } = req.body;
    try {
        const findUser = await User.findOne({ email });
        if (!findUser) {
            req.body.role = "user";
            //Create a new user
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
        else {
            //User already exists
            throw new Error("User already exists");
        }
    } catch (error) {
        throw new Error(error);
    }
});


//Login a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser._id, {
            refreshToken,
        }, {
            new: true,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error("Invalid credentials");
    }
});

//adminLogin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not authorized");
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateAdmin = await User.findByIdAndUpdate(findAdmin._id, {
            refreshToken,
        }, {
            new: true,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        });
    } else {
        throw new Error("Invalid credentials");
    }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in Cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token present in db or matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

//Logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in Cookie");
    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204); //forbiden
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: '',
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204); //forbiden
});

//Update a user
const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new: true,
        }
        );
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

//Get all users
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);

    } catch (error) {
        throw new Error(error);
    }
});

// Get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getUser = await User.findById(id);
        res.json({ getUser });
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({ deleteUser });
    } catch (error) {
        throw new Error(error);
    }
});

//Block a user
const handleBlocked = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const checkBlocked = req?.user?.isBlocked;
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: (checkBlocked ? false : true)
        }, {
            new: true
        });
        res.json({ msg: `Blocker user is ${!checkBlocked}` });

    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(id);
    const { password } = req.body;
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    } else {
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL =
            `Hi, please follow this link to reset Your Password. This link is valid till 10 minutes form now. 
            <a href='http:localhost:5000/api/user/reset-password/${token}'>
                Click Here
            </a>`;
        const data = {
            to: email,
            text: "Hey user!",
            subject: "Forgot password link",
            html: resetURL
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }

});
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token expried, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    validateMongoDbId(prodId);
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId },
            }, {
                new: true
            });
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId },
            }, {
                new: true
            });
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(id);

    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, {
            new: true,
        }
        );
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

const userCart = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { cart } = req.body;
    validateMongoDbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        //check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            await Cart.findOneAndDelete({ orderby: user._id });
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

const getUserCart = asyncHandler(async (req, res,) => {
    const _id = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate(
            //"products.product"
            "products.product", "_id title price totalAfterDiscount"
        );
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async (req, res,) => {
    const _id = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndDelete({ orderby: user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler(async (req, res,) => {
    const _id = req.user;
    const { coupon } = req.body;
    validateMongoDbId(_id);
    try {
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (!validCoupon) throw new Error("Invalid coupon");
        const user = await User.findById(_id);
        let { products, cartTotal } = await Cart.findOne({ orderby: user._id }).populate(
            "products.product"
        );
        let totalAfterDiscount = Math.round(cartTotal - (cartTotal * validCoupon.discount / 100));
        const cart = await Cart.findOneAndUpdate({ orderby: user._id }, {
            totalAfterDiscount
        }, {
            new: true
        });
        res.json(cart);

    } catch (error) {
        throw new Error(error);
    }
});

const createOrder = asyncHandler(async (req, res,) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        if (!COD) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on delivery",
                created: Date.now(),
                currency: "vnd"
            },
            orderby: user._id,
            orderStatus: "Cash on delivery"
        }).save();
        let update = userCart.products.map(item => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json(updated);
    } catch (error) {
        throw new Error(error);
    }
});

const getOrder = asyncHandler(async (req, res,) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userOrders = await Order.findOne({ orderby: _id })
            .populate("products.product").exec();
        res.json(userOrders);
    } catch (error) {
        throw new ErrorEvent(error);
    }
});

const getallOrder = asyncHandler(async (req, res,) => {
    try {
        const userOrders = await Order.find();
        res.json(userOrders);
    } catch (error) {
        throw new ErrorEvent(error);
    }
});

const updateOrderStatus = asyncHandler(async (req, res,) => {
    const { id } = req.params;
    const { status } = req.body;
    validateMongoDbId(id);
    try {
        const update = await Order.findByIdAndUpdate(id, {
            orderStatus: status,
            "paymentIntent.status": status,
        }, {
            new: true
        });
        res.json(update);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createUser,
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
};