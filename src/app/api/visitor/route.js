import { connectDb } from '@/helper/db';
import Visitor from '@/model/visitor';
import { NextResponse } from 'next/server';
import moment from 'moment-timezone';

export async function GET() {
    try {
        const today = moment().tz('Asia/Kolkata');
        const specificDate = moment(today.format('YYYY-MM-DD'), 'YYYY-MM-DD');
        const startOfSpecificDate = specificDate.clone().startOf('day');
        const endOfSpecificDate = specificDate.clone().endOf('day');

        await connectDb();

        const visitorForSpecificDate = await Visitor.findOneAndUpdate(
            {
                createdAt: {
                    $gte: startOfSpecificDate.toDate(),
                    $lte: endOfSpecificDate.toDate()
                }
            },
            { $inc: { day: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ totalVisitor: visitorForSpecificDate.day });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to get users" });
    }
}
