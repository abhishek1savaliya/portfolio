import { connectDb } from '@/helper/db';
import Visitor from '@/model/visitor';
import { NextResponse } from 'next/server';
import moment from 'moment-timezone';

export async function GET() {
    try {
        await connectDb();

        const today = moment().tz('Asia/Kolkata');
        const currentDay = today.date();
        const currentMonth = today.month() + 1;
        const currentYear = today.year();

        const specificDate = moment(`${currentYear}-${currentMonth}-${currentDay}`, 'YYYY-MM-DD');
        const startOfSpecificDate = specificDate.clone().startOf('day');
        const endOfSpecificDate = specificDate.clone().endOf('day');

        let visitorForSpecificDate = await Visitor.findOne({
            createdAt: {
                $gte: startOfSpecificDate.toDate(),
                $lte: endOfSpecificDate.toDate()
            }
        });

        if (!visitorForSpecificDate) {
            visitorForSpecificDate = new Visitor({
                day: 0
            });
            await visitorForSpecificDate.save();
        }

        const data = await Visitor.findOneAndUpdate(
            {
                createdAt: {
                    $gte: startOfSpecificDate.toDate(),
                    $lte: endOfSpecificDate.toDate()
                }
            },
            { $inc: { day: 1 } },
            { new: true }
        );

        return NextResponse.json({ totalVisitor: Math.trunc(data.day / 2) });

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message: "Failed to get users"
        });
    }
}