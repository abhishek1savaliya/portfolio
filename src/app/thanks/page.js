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
        <div className="min-h-screen bg-green-500 flex items-center justify-center p-4 md:p-10">
            <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-yellow-200 p-6 sm:p-8 rounded-lg shadow-md">
                <h1 className="text-xl sm:text-2xl mb-3 sm:mb-4 text-green-600">Thank You for contact me!</h1>
                <p className="text-sm sm:text-base text-gray-700">
                    I have received your response and will get back to you shortly.
                </p>
            </div>
        </div>

    );
}

export default Page;
