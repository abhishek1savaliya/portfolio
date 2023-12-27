import { connectDb } from '@/helper/db';
import client from '@/model/client';
import { NextResponse } from 'next/server';
const firebase = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')

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

export async function POST(req, res) {
    try {
        await connectDb();

        let transformedData = {};

        const data = await req.formData();

        for (let [key, value] of data.entries()) {
            transformedData[key] = value;
        }

       if('doc' in transformedData && !(transformedData.doc.size===0)){
        const fileUrl = await fileUpload(data.get('doc'))
        transformedData['doc'] = fileUrl
       }
       else{
        transformedData['doc'] = ''
       }

        const clientData = new client(transformedData)
        clientData.save()

        return NextResponse.json(clientData,{ status: 201 });
    } catch (err) {
        return NextResponse.json({ message: 'Error in add user' }, { status: 401 });
    }
}

const fileUpload = async (file) => {

    const storage = getStorage();
    const storageRef = ref(storage, `files/${file.name}`);

    try {
        uploadBytes(storageRef, file)

        const fileUrl = await getDownloadURL(storageRef)

        return fileUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

export async function GET() {
    try {
        await connectDb();
        const allClient = await client.find().sort({ createdAt: -1 })

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


