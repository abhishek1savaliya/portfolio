import mongoose from 'mongoose';

const userLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        event: {
            type: String,
            enum: ['login', 'signup'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
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

export default mongoose.model("userLog", userLogSchema);