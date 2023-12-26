'use client'
import React, { useState } from 'react'
import { DNA } from 'react-loader-spinner';
import { useRouter } from 'next/navigation'
require('dotenv').config()

const page = () => {

    const router = useRouter()

    const URL = 'http://localhost:3000' || 'https://abhishek-lake.vercel.app';

    const [formData, setFormData] = useState({
        fName: '',
        lName: '',
        message: '',
        email: '',
        doc: ''
    });
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch(`${URL}/api/client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = res.json().then((data)=>{
                console.log(data)
            })

            if (data) {
                setTimeout(() => {
                    setLoading(false)
                    router.push('/thanks');
                }, 2000);
            }

        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    return (
        <div className="bg-green-500 min-h-screen p-8">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
                <h1 className="text-2xl mb-4 text-center text-gray-800 dark:text-gray-800">Contact Form</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-gray-800 text-sm font-bold mb-2" htmlFor="fName">
                                First Name
                            </label>
                            <input
                                className="border rounded py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="fName"
                                type="text"
                                name="fName"
                                value={formData.fName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-800 text-sm font-bold mb-2" htmlFor="lName">
                                Last Name
                            </label>
                            <input
                                className="border rounded py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="lName"
                                type="text"
                                name="lName"
                                value={formData.lName}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                required
                            />
                        </div>
                    </div>
                    {/* Email Field */}
                    <div className="flex flex-col">
                        <label className="text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="border rounded py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    {/* End of Email Field */}
                    <div className="flex flex-col">
                        <label className="text-gray-800 text-sm font-bold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            className="border rounded py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type your message here..."
                            required
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 text-sm font-bold mb-2" htmlFor="doc">
                            Document (Optional)
                        </label>
                        <input
                            className="border rounded py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="doc"
                            type="file"
                            name="doc"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        {
                            loading ? (
                                <DNA
                                    visible={true}
                                    height="80"
                                    width="80"
                                    ariaLabel="dna-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="dna-wrapper"
                                />
                            ) : (<button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="submit"
                            >
                                Send a Message
                            </button>)
                        }

                    </div>
                </form>
            </div>
        </div>

    );
};


export default page
