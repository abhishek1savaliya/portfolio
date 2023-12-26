import mongoose from 'mongoose';

export const connectDb = async () => {
    try {
        await mongoose.connect('mongodb+srv://abhisheksavaliya555:client1221@cluster0.zxwvggf.mongodb.net/client', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("db Connected");
    } catch (error) {
        console.error("Failed to connect with database");
        console.error(error);
    }
};
