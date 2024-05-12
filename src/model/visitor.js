import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true,
        },
        userDetails: [{
            ipAddress: {
                type: String,
            },
            time: {
                type: Date,
            },
            location: {
                country: String,
                region: String,
                city: String,
                lat: Number,
                lng: Number,
                postalCode: String
            },
            as: {
                asn: {
                    type: Number,
                },
                name: {
                    type: String,
                },
                route: {
                    type: String,
                },
                domain: {
                    type: String,
                },
                type: {
                    type: String,
                }
            }
        }]
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
