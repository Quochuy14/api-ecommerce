const mongoose = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfuly!")
    }
    catch (error) {
        console.log("Database connect Failed!")
    }
}

module.exports = dbConnect;