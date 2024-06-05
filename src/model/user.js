import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true 
        },
        password: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            enum: ['normal', 'mid', 'admin'],
            required: true
        }
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                delete ret.__v;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    }
);

mongoose.models = {}

export default mongoose.model("User", userSchema);