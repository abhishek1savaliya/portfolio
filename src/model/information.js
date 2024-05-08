import mongoose from 'mongoose';

const informationSchema = new mongoose.Schema(
    {
        addOps: {
            type: Number,
            required: true,
        },
        deleteOps: {
            type: Number,
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

export default mongoose.model("Information", informationSchema);
