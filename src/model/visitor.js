import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true,
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

mongoose.models = {};

export default mongoose.model("Visitor", visitorSchema);
