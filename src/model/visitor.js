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
                required: true
            },
            time: {
                type: Date,
                required: true
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
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                route: {
                    type: String,
                    required: true
                },
                domain: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    required: true
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
