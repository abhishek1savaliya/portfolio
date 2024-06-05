// pages/contact.js
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Head from 'next/head';

const Page = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fName: '',
        lName: '',
        message: '',
        email: '',
        doc: null
    });

    const [loading, setLoading] = useState(false);
    const [fileSizeError, setFileSizeError] = useState(null);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    useEffect(() => {
        if (fileSizeError) {
            setFormData((prevData) => ({ ...prevData, doc: null }));
        }
    }, [fileSizeError]);

    useEffect(() => {
        const loadRecaptchaScript = () => {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6Led8OYpAAAAAN9GCsw1Aisnld4YBb8hL6_S2Jne';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('reCAPTCHA script loaded');
            };
            document.head.appendChild(script);
        };

        loadRecaptchaScript();
    }, []);

    const handleChange = (e) => {
        setFileSizeError(null);
        const { name, value, files } = e.target;
        if (name === 'doc' && files.length > 0) {
            if (files[0].size / (1024 * 1024) > 5) {
                e.target.value = '';
                setFileSizeError('You can send only 5 MB of file');
                return;
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: files[0]
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute('6Led8OYpAAAAAN9GCsw1Aisnld4YBb8hL6_S2Jne', { action: 'submit' }).then(token => {
                    setRecaptchaToken(token);
                    submitForm(token);
                });
            });
        } else {
            alert('reCAPTCHA failed to load.');
            setLoading(false);
        }
    };

    const submitForm = async (token) => {
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });
            formDataToSend.append('recaptchaToken', token);

            const response = await axios.post('/api/client', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;
            if (data) {
                setTimeout(() => {
                    setLoading(false);
                    router.push('/thanks');
                }, 2000);
            }
        } catch (error) {
            console.error('Error sending data:', error);
            setLoading(false);
        }
    };

    return (
        <div className="bg-green-500 min-h-screen p-4 md:p-8">
            <Head>
                <script src="https://www.google.com/recaptcha/enterprise.js?render=6Led8OYpAAAAAN9GCsw1Aisnld4YBb8hL6_S2Jne"></script>
            </Head>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-5xl mx-auto">
                <h1 className="text-lg md:text-2xl mb-4 text-center text-gray-800 dark:text-gray-800">Contact Form</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm md:text-base text-gray-800 font-bold mb-2" htmlFor="fName">
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
                            <label className="text-sm md:text-base text-gray-800 font-bold mb-2" htmlFor="lName">
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
                    <div className="flex flex-col">
                        <label className="text-sm md:text-base text-gray-800 font-bold mb-2" htmlFor="email">
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
                    <div className="flex flex-col">
                        <label className="text-sm md:text-base text-gray-800 font-bold mb-2" htmlFor="message">
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
                        <label className="text-sm md:text-base text-gray-800 font-bold mb-2" htmlFor="doc">
                            Document (Optional)
                        </label>
                        <input
                            className="border rounded py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="doc"
                            type="file"
                            name="doc"
                            onChange={handleChange}
                        />
                        {fileSizeError && <p className="text-red-500 text-sm mt-2">{fileSizeError}</p>}
                    </div>

                    <div className="flex items-center justify-center">
                        {loading ? (
                            <button
                                disabled
                                type="button"
                                className="bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center me-2"
                            >
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-4 h-4 me-3 text-white animate-spin"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Submitting...
                            </button>
                        ) : (
                            <>
                                <div id="recaptcha-container"></div>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="submit"
                                    disabled={loading}
                                >
                                    Send a Message
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Page;