import { connectDb } from '@/helper/db';
import client from '@/model/client';
import client from '@/model/client';
import { NextResponse } from 'next/server';
require('dotenv').config()

export async function POST(req, res) {
    try {
        connectDb()
        console.log("hello World")
        const { fName, lName, email, message, doc } = await req.json();

        const c = new client({ fName, lName, email, message, doc })
        c.save()

        return NextResponse.json(c, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: 'Error in add user' }, { status: 401 });
    }
}

export async function GET() {
    try {
        const allClient = await client.find()

        const totalCount = await client.countDocuments({});

        return NextResponse.json({
            data: allClient,
            totalCount: totalCount,
        });
    } catch (err) {
        return NextResponse.json({
            message: "Failed to get users"
        });
    }
}


