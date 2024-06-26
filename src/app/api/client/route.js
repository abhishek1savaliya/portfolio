const firebase = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage')
const nodemailer = require('nodemailer');
import moment from 'moment';
import { connectDb } from '@/helper/db';
import client from '@/model/client';
import information from '@/model/information';
import visitor from '@/model/visitor';
import { NextResponse } from 'next/server';
import userLog from '@/model/userLog';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

const fileUpload = async (file) => {

    const fileName = file.name.replace(/\s+/g, '');
    const currentDate = Date.now();
    const extension = fileName.split('.').pop();
    const newFileName = `${fileName.split('.').slice(0, -1).join('_')}_${currentDate}.${extension}`;

    const storage = getStorage();
    const storageRef = ref(storage, `files/${newFileName}`);

    try {
        await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(storageRef);
        return fileUrl;

    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

export async function POST(req, res) {
    try {

        let transformedData = {};

        const data = await req.formData();

        for (let [key, value] of data.entries()) {
            transformedData[key] = value;
        }

        if ('doc' in transformedData && !(transformedData.doc.size === 0) && transformedData.doc !== 'null') {
            const fileUrl = await fileUpload(data.get('doc'))
            transformedData['doc'] = fileUrl
        }
        else {
            transformedData['doc'] = '';
        }

        await connectDb();

        const clientData = new client(transformedData)
        await clientData.save()

        await email(clientData.email, clientData.fName, clientData.lName)

        const currentInfo = await information.findOne();

        if (currentInfo === null) {
            const informationData = new information({
                addOps: 1,
                deleteOps: 0
            });
            await informationData.save();
        } else {
            currentInfo.addOps = currentInfo.addOps + 1;
            await currentInfo.save();
        }

        return NextResponse.json(clientData, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: 'Error in add user' }, { status: 401 });
    }
}

export async function GET() {
    try {
        await connectDb();
        const allClient = await client.find().sort({ createdAt: -1 })

        const currentInfo = await information.findOne();

        const totalVisits = await visitor.aggregate([{ $group: { _id: null, totalVisit: { $sum: "$day" } } }]);
        const totalVisit = totalVisits.length > 0 ? totalVisits[0].totalVisit : 0;

        const dayWiseVisitorData = await dayWiseVisitor()

        const userLogDetails = await userLog.find().populate('userId').then(logs => logs.map(log => ({ username: log.userId.id, event: log.event, timestamp: log.timestamp })));

        return NextResponse.json({
            data: allClient,
            OpsInfo: {
                addOps: currentInfo ? currentInfo.addOps : 0,
                deleteOps: currentInfo ? currentInfo.deleteOps : 0,
                totalOps: (currentInfo ? currentInfo.deleteOps : 0) + (currentInfo ? currentInfo.addOps : 0),
                totalVisitor: totalVisit,
            },
            dayWiseVisitor: dayWiseVisitorData,
            userLogDetails: userLogDetails
        });


    } catch (err) {
        return NextResponse.json({
            message: "Failed to get users"
        });
    }
}

export async function DELETE(req) {
    try {
        await connectDb();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        const deletedClient = await client.findByIdAndDelete(id);

        if (!deletedClient) {
            return NextResponse.json({
                message: 'Client does not exist',
            });
        }

        const currentInfo = await information.findOne();

        if (currentInfo === null) {
            const informationData = new information({
                addOps: 0,
                deleteOps: 1
            });
            await informationData.save();
        } else {
            currentInfo.deleteOps = currentInfo.deleteOps + 1;
            await currentInfo.save();
        }

        const docUrl = deletedClient.doc;

        if (docUrl) {
            const encodedFilename = docUrl.split('/').pop();
            const decodedFilename = decodeURIComponent(encodedFilename.split('?')[0]);

            const storage = getStorage();
            const storageRef = ref(storage, `${decodedFilename}`);

            await getDownloadURL(storageRef);
            await deleteObject(storageRef);
        }

        return NextResponse.json({ message: "Deleted successfully" });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            message: "Failed to delete user"
        });
    }
}

const dayWiseVisitor = async () => {
    const dayWiseVisit = await visitor.find()

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDateO = moment();

    if (dayWiseVisit.length === 0) {
        return [{
            date: currentDateO.format('YYYY-MM-DD'),
            day: dayNames[currentDateO.day()],
            visitor: 0,
            visitorDetail: []
        }];
    }

    if (dayWiseVisit.length === 1) {
        const date = moment(dayWiseVisit[0].createdAt);
        const visitorDetail = dayWiseVisit[0].userDetails || [];
        return [{
            date: date.format('YYYY-MM-DD'),
            day: dayNames[date.day()],
            visitor: dayWiseVisit[0].day,
            visitorDetail: visitorDetail
        }];
    }

    const startDate = moment(dayWiseVisit[0].createdAt);
    const dateRange = [];
    let currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(currentDateO, 'day')) {
        dateRange.push(moment(currentDate));
        currentDate.add(1, 'day');
    }

    const mappedData = dateRange.map(date => {
        const formattedDate = date.format('YYYY-MM-DD');
        const dayIndex = date.day();
        const day = dayNames[dayIndex];
        const matchingVisit = dayWiseVisit.find(item => moment(item.createdAt).isSame(date, 'day'));
        const visitorCount = matchingVisit ? matchingVisit.day : 0;
        const visitorDetail = matchingVisit ? matchingVisit.userDetails : [];
        return {
            date: formattedDate,
            day: day,
            visitor: visitorCount,
            visitorDetail: visitorDetail
        };
    });
    return mappedData
}


let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const email = async (email, fName, lName) => {

    let mailOptions = {
        from: `"Abhishek Savaliya" <${process.env.SMTP_USER}>`,
        to: `${email}`,
        subject: 'Thank You for Contacting Abhishek Savaliya',
        html: `
        <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        font-size: 10px;
        color: #333;
        line-height: 1.6;
        text-align: left;
        background-color: #f5f5f5;
      }

      .container {
        max-width: 600px;
        margin: 20px; /* Changed margin to place container to the left */
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        text-align: left;
      }

      .header {
        background-color: #3f51b5;
        padding: 10px;
        color: #fff;
        text-align: left;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      .content {
        padding: 10px;
      }

      .footer {
        background-color: #3f51b5;
        padding: 10px;
        color: #fff;
        margin-top: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      .signature {
        margin-top: 20px;
        font-style: italic;
        color: #3f51b5;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h3>Greetings from Abhishek Savaliya</h3>
      </div>
      <div class="content">
        <p>Hello ${fName} ${lName},</p>
        <p>
          Thank you for reaching out to me through my website. I have received
          your message and appreciate for connecting me.
        </p>
        <p>
          Thanks for giving your valuable time. I will soon reply of your message.
        </p>
        <p class="signature">Best regards,<br />Abhishek Savaliya</p>
      </div>
      <div class="footer">
        <p>
          Copyright &copy; ${new Date().getFullYear()} Abhishek Savaliya. All
          rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return error;
        }
        else {
            return info.messageId
        }
    });
}