const express = require('express');
const app = express();
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const dbConnect = require("./config/dbConnect");

//commic Router
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const proCatRouter = require("./routes/proCatRoute");
const blogCatRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const colorRouter = require("./routes/colorRoute");
const enquiryRouter = require("./routes/enqRoute");

const { notFound, errorHandler } = require('./middlewares/errorHandler');

//connect db
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/procat', proCatRouter);
app.use('/api/blogcat', blogCatRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/color', colorRouter);
app.use('/api/enquiry', enquiryRouter);

app.use(notFound);
app.use(errorHandler);


//run server
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});
