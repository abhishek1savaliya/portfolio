import { connectDb } from '@/helper/db';
import user from '@/model/user';
import { NextResponse } from 'next/server';
import { generateToken } from '@/helper/authMiddleware';
import userLog from '@/model/userLog';


// export async function POST(req) {
//     try {
//         await connectDb();

//         // const { id, password, userType } = request.body;

//         const id = "krishna"
//         const password = "radhakrishna@@"
//         const userType = "admin"

//         const newUser = new user({
//             id,
//             password,
//             userType
//         });

//         await newUser.save();

//         return NextResponse.json({ message: "User added successfully", user: newUser });

//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ message: "Failed to add user" });
//     }
// }

export async function POST(req) {
    try {
        await connectDb();

        let { id, password, userType } = await req.json();

        const foundUser = await user.findOne({ id, password, userType });

        if (foundUser) {
            const token = await generateToken({ id, userType })

            const newLog = new userLog({
                userId: foundUser._id,
                event: 'login',
            });

            await newLog.save()

            return NextResponse.json({ message: true, token: token });
        } else {
            return NextResponse.json({ message: false });
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch user" });
    }
}
