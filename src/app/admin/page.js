'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';
import moment from 'moment';


const Page = () => {
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/client', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response) {
        setClient(response.data.data);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const deleteClient = async (id) => {

    try {
      await axios.delete(`/api/client?id=${id}`);
      setClient(prevClients => prevClients.filter(item => item._id !== id));

    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  return (
    <div className='bg-green-500 min-h-screen p-4 md:p-8'>
      <div className="container mx-auto p-6 bg-blue-500 rounded-lg shadow-md ">
        <h1 className="text-3xl font-bold mb-6 text-white">User Data</h1>
        <p className="mb-6 text-white text-3xl flex font-semibold items-center justify-center">Total Count: {client.length}</p>
        <div className="overflow-x-auto">
          {
            loading ? (<div className='flex items-center justify-center'>
              <Bars
                height="80"
                width="80"
                color="#ffffff"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />

            </div>) : (<table className="min-w-full bg-white border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border bg-gray-200 px-6 py-3">First Name</th>
                  <th className="border bg-gray-200 px-6 py-3">Last Name</th>
                  <th className="border bg-gray-200 px-6 py-3">Email</th>
                  <th className="border bg-gray-200 px-6 py-3">Message</th>
                  <th className="border bg-gray-200 px-6 py-3">Document</th>
                  <th className="border bg-gray-200 px-6 py-3">Created At</th>
                </tr>
              </thead>

              <tbody className='items-start'>
                {client.map((user) => (
                  <tr key={user._id} className="text-center relative group hover:bg-gray-100">
                    <td className="border px-6 py-4">{user.fName}</td>
                    <td className="border px-6 py-4">{user.lName}</td>
                    <td className="border px-6 py-4">{user.email}</td>
                    <td className="border px-6 py-4">{user.message}</td>
                    <td className="border px-6 py-4">
                      {user.doc ? (
                        <a href={user.doc} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>

                    <td className="border px-6 py-4 relative">
                      <span className="absolute right-0 top-1/2 transform -translate-y-1/2 transition-opacity opacity-0 group-hover:opacity-100 mr-2">
                        <button className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600" onClick={() => { deleteClient(user._id) }}>
                          X
                        </button>
                      </span>

                      {moment(user.createdAt).fromNow()}, {moment(user.createdAt).format('hh:mm A')} {moment(user.createdAt).format('MM/DD/YYYY')}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>)
          }
        </div>
      </div>
    </div>
  );
};

export default Page;
