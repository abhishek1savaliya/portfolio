'use client'
import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import moment from 'moment-timezone';
moment().tz('Asia/Kolkata')

const Page = ({ onClose, usersDetails }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openPopup = (user) => {
        setSelectedUser(user);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto">
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto">
                    <div className="relative p-8 bg-white rounded-lg max-w-lg w-full mx-4 my-8 max-h-screen overflow-y-auto">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">User Information:</h2>
                        {selectedUser && (
                            <div>
                                <div className="text-gray-700">
                                    <h3 className="font-bold mb-2">User Details:</h3>
                                    <p>
                                        <span className="font-bold text-red-500">Ip Address:</span> {selectedUser.ipAddress}<br />
                                        <span className="font-bold text-blue-500">Time:</span> {moment(selectedUser.time).format('DD/MM/YYYY hh:mm:ss A')}<br />
                                        <span className="font-bold text-green-500">Country:</span> {selectedUser.location.country}<br />
                                        <span className="font-bold text-yellow-500">Region:</span> {selectedUser.location.region}<br />
                                        <span className="font-bold text-purple-500">City:</span> {selectedUser.location.city}<br />
                                        <span className="font-bold text-pink-500">Lat:</span> {selectedUser.location.lat}<br />
                                        <span className="font-bold text-cyan-500">Lng:</span> {selectedUser.location.lng}<br />
                                        <span className="font-bold text-indigo-500">Postal Code:</span> {selectedUser.location.postalCode}<br />
                                    </p>
                                </div>
                                <div className="text-gray-700">
                                    <h3 className="font-bold mb-2">ISP Provider Detail:</h3>
                                    <p>
                                        <span className="font-bold text-red-500">ASN:</span> {selectedUser.as.asn}<br />
                                        <span className="font-bold text-blue-500">ASN Name:</span> {selectedUser.as.name}<br />
                                        <span className="font-bold text-green-500">ASN Route:</span> {selectedUser.as.route}<br />
                                        <span className="font-bold text-yellow-500">ASN Domain:</span> {selectedUser.as.domain}<br />
                                        <span className="font-bold text-purple-500">ASN Type:</span> {selectedUser.as.type}<br />
                                    </p>
                                </div>
                            </div>
                        )}
                        <button
                            className="mt-3 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded shadow-lg transform hover:translate-y-1 transition-all duration-200 ease-in-out"
                            onClick={closePopup}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}


            <div className="relative p-8 bg-white rounded-lg max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-bold text-green-600 mb-4">All User Information:</h2>

                {usersDetails && usersDetails.length === 0 ? (
                    <div className="text-gray-700">No users found</div>
                ) : (
                    usersDetails && usersDetails.map((data, index) => (
                        <div key={index} className="mb-4">
                            <p className="flex items-center">
                                <span className="mr-2 text-blue-500">{data.ipAddress}</span>
                                <span className="mr-2 text-green-500">{data.location.country}</span>
                                <span className="mr-2 text-yellow-500">{data.location.region}</span>
                                <span className="mr-2 text-red-500">{data.location.city}</span>
                                <FaEye className="cursor-pointer text-green-600" onClick={() => openPopup(data)} />
                            </p>
                        </div>
                    ))
                )}
                <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>

    );
};

export default Page;