import { connectDb } from '@/helper/db';
import Visitor from '@/model/visitor';
import { NextResponse } from 'next/server';
import moment from 'moment-timezone';
import axios from 'axios';

export async function POST(request) {
    try {
        const body = await request.json();
        const ip = body.ip;

        const locationResp = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_xVkfvej9Ld6Gh23G3nbb6TT9FwJVy&ipAddress=${ip}`);
        const data = locationResp.data;

        const today = moment().tz('Asia/Kolkata');
        const specificDate = moment(today.format('YYYY-MM-DD'), 'YYYY-MM-DD');
        const startOfSpecificDate = specificDate.clone().startOf('day');
        const endOfSpecificDate = specificDate.clone().endOf('day');

        await connectDb()

        // Update or create a visitor entry for the day
        const totalVisit = await Visitor.findOneAndUpdate(
            { createdAt: { $gte: startOfSpecificDate.toDate(), $lte: endOfSpecificDate.toDate() } },
            { $inc: { day: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Add IP address entry with location and AS details
        totalVisit.userDetails.push({
            ipAddress: ip,
            time: new Date(),
            location: {
                country: data.location.country,
                region: data.location.region,
                city: data.location.city,
                lat: data.location.lat,
                lng: data.location.lng,
                postalCode: data.location.postalCode || ''
            },
            as: {
                asn: data.as.asn, // Ensure asn is correctly accessed from data object
                name: data.as.name,
                route: data.as.route,
                domain: data.as.domain,
                type: data.as.type
            }
        });

        await totalVisit.save();

        // Calculate total visitors for the day
        const totalVisitor = await Visitor.aggregate([{ $group: { _id: null, totalVisit: { $sum: "$day" } } }]).then(result => (result.length > 0 ? result[0].totalVisit : 0));

        return NextResponse.json({ totalVisitor });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to get users" });
    }
}