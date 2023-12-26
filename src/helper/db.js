import mongoose from 'mongoose';
require('dotenv').config()

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("db Connected");
    } catch (error) {
        console.error("Failed to connect with database");
        console.error(error);
    }
};
