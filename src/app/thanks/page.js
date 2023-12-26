'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'

const Page = () => {

    const router = useRouter()

    useEffect(() => {

        setTimeout(() => {
            router.push('/');
        }, 4000);

    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="bg-yellow-200 p-8 rounded-lg shadow-md">
                <h1 className="text-2xl mb-4 text-green-600">Thank You for Submitting!</h1>
                <p className="text-gray-700">
                    We have received your submission and will get back to you shortly.
                </p>
            </div>
        </div>
    );
}

export default Page;
