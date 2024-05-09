'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { Bars } from 'react-loader-spinner';
import { ClipLoader } from "react-spinners";

const Page = () => {
  const [client, setClient] = useState([]);
  const [info, setInfo] = useState({
    addOps: 0,
    deleteOps: 0,
    totalOps: 0,
  })
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/client', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response) {
        setClient(response.data.data);
        setInfo(response.data.OpsInfo)
        setPopupData(response.data.dayWiseVisitor)
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDaywiseVisitorClick = () => {
    setShowPopup(true);
  }

  const deleteClient = async (id) => {

    try {
      await axios.delete(`/api/client?id=${id}`);
      setClient(prevClients => prevClients.filter(item => item._id !== id));

    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
  const infoLoader = (<>&nbsp;<ClipLoader color="#ffffff" size={14} /></>)
  const handleExport = (dataArray, filename) => {
    if (dataArray.length === 0) {
      alert("No data to export");
      return;
    }
  
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    const wbDataUrl = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
  
    const a = document.createElement('a');
    a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${wbDataUrl}`;
    a.download = filename;
    a.click();
  };
  
  const handleExportDataOfUser = () => {
    const dataArray = client.map(item => [item.fName, item.lName, item.email, item.message, item.doc, item.createdAt]);
    handleExport([['First Name', 'Last Name', 'Email', 'Message', 'Document', 'Created At'], ...dataArray], 'client_data.xlsx');
  };
  
  const handleExportData = () => {
    const dataArray = popupData.map(item => [item.date, item.day, item.visitor]);
    handleExport([['Date', 'Day', 'Visitor Count'], ...dataArray], 'data.xlsx');
  };

  return (
    <div className='bg-green-500 min-h-screen p-4 md:p-8'>
      <div className="container mx-auto p-6 bg-blue-500 rounded-lg shadow-md ">
        <h1 className="text-3xl font-bold mb-6 text-white">User Data</h1>

        <div className="flex justify-between items-center mb-6 text-white text-xs font-semibold">
          <div>
            <span className="mr-4">Total Message Count: <span>{loading ? infoLoader : client.length}</span></span>
            <span className="mr-4">Total add Operation: <span>{loading ? infoLoader : info.addOps}</span></span>
            <span className="mr-4">Total Delete Operation: <span>{loading ? infoLoader : info.deleteOps}</span></span>
            <span className="mr-4">Total Operation: <span>{loading ? infoLoader : info.totalOps}</span></span>
            <span className='mr-4'>Total Visitors: <span>{loading ? infoLoader : info.totalVisitor}</span></span>
          </div>
          <div>
            <button className="bg-blue-400 hover:bg-blue-300 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 border-b-2 border-blue-700 hover:border-blue-500 rounded" onClick={handleDaywiseVisitorClick}>
              Daywise Visitor
            </button>

          </div>
        </div>
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
                        <button
                          className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
                          onClick={() => {
                            deleteClient(user._id);
                            fetchData();
                          }}
                        >
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

        <div className='flex justify-end'>

          <button className="bg-green-500 mt-2 hover:bg-green-400 text-white font-bold text-xs py-1 px-4 border-b-4 border-green-700 hover:border-green-500 rounded ml-2" onClick={handleExportDataOfUser}>
            Export
          </button>

        </div>

      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
          <div className="bg-white rounded-lg p-8 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Day-wise Visitor Information</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4">Date</th>
                  <th className="p-4">Day</th>
                  <th className="p-4">Visitor Count</th>
                </tr>
              </thead>
              <tbody>
                {popupData.map((data, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-4">{data.date}</td>
                    <td className="p-4">{data.day}</td>
                    <td className="p-4 flex justify-center">{data.visitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600" onClick={() => setShowPopup(false)}>Close</button>
            <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-4 border-b-4 border-green-700 hover:border-green-500 rounded ml-2" onClick={handleExportData}>
              Export Data
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Page;
