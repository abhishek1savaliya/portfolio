'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/navigation'
import { TailSpin } from 'react-loader-spinner';
import { FaEye } from "react-icons/fa";
import axios from 'axios';
import { ClipLoader } from "react-spinners";

const Profile = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [viewLoading, setViewLoading] = useState(true)
  const [visitors, setVisitors] = useState(0)

  const fetchData = async () => {
    try {
      const res = await axios.get("https://api.ipify.org/?format=json");
      const ip = res.data.ip;

      const response = await axios.post('/api/visitor', { ip }, { headers: { 'Content-Type': 'application/json' } });
      if (response) {
        setVisitors(response.data.totalVisitor);
        setViewLoading(false);
      }
    } catch (err) {
      setVisitors(0);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const infoLoader = (<>&nbsp;<ClipLoader color="#000000" size={18} /></>)

  const handleMessage = () => {
    setLoading(true)
    setTimeout(() => {
      router.push('/message')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="bg-green-500 min-h-screen p-4 md:p-8">
      <Head>
        <title>Abhishek Savaliya - MERN Stack Developer</title>
        <meta name="description" content="Abhishek Savaliya's profile as a MERN Stack Developer from Surat, Gujarat." />
        <meta property="og:title" content="Abhishek Savaliya - MERN Stack Developer" />
        <meta property="og:description" content="Seeking for an internship/job opportunity with a company that offers a positive atmosphere to implement new ideas or technological skills." />
        <meta property="og:image" content="https://i.ibb.co/rvcNTg4/SAVE-20230812-213425.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/profile" />

        <link rel="canonical" href="https://yourwebsite.com/profile" />
      </Head>

      <div className="bg-lime-200 p-4 md:p-6 rounded-lg shadow-md max-w-5xl mx-auto">

        <div className="flex">

          <div className="text-center items-center flex-1">
            <img
              src="https://i.ibb.co/rvcNTg4/SAVE-20230812-213425.jpg"
              alt="Abhishek Savaliya"
              className="w-32 h-32 rounded-full border-4 border-cyan-400 mx-auto shadow-lg transform hover:scale-105 hover:translate-y-1 transition-all duration-200 ease-in-out"
            />
          </div>

          <div className="inline-flex">
            <FaEye className="mr-2 mt-2" />
            <p className='mt-1'>{viewLoading ? infoLoader : visitors}</p>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-purple-600 mb-4">ABHISHEK SAVALIYA</h1>


        {/* <p className="text-lg text-red-600 font-semibold mb-2">MERN Stack Developer</p> */}
        <p className="text-sm text-green-700 font-semibold mb-4">Surat, Gujarat</p>



        <div className="mb-4">
          <p className="text-blue-600">
            <FontAwesomeIcon icon={faEnvelope} className="inline-block align-middle mr-2 text-sky-500" height={25} />
            <a href="mailto:abhisheksavaliya555@gmail.com" className="inline-block align-middle mr-2">
              abhisheksavaliya555@gmail.com
            </a>
          </p>

          <p className="text-blue-600">
            <FontAwesomeIcon icon={faPhone} height={25} className="text-base inline-block align-middle mr-2 text-blue-600" />  +91 8160059914
          </p>
          <p className="text-blue-600">
            <FontAwesomeIcon icon={faLinkedin} className="text-base inline-block align-middle mr-2" height={25} />
            <a href="https://linkedin.com/in/abhishek-savaliya-22547b200" target="_blank" rel="noopener noreferrer" className="text-blue-600">
              linkedin.com/in/abhishek-savaliya
            </a>
          </p>
          <p className="text-black-600">
            <FontAwesomeIcon icon={faGithub} className="text-base inline-block align-middle mr-2" height={25} />
            <a href="https://github.com/abhishek1savaliya" target="_blank" rel="noopener noreferrer" className="text-black-600">
              github.com/abhishek1savaliya
            </a>
          </p>
        </div>
        {/* <p className="text-yellow-800">
          Seeking for an internship/job opportunity with a company that offers a positive atmosphere
          to implement new ideas or technological skills for the betterment of the organization.
        </p> */}

        <h2 className="text-2xl font-semibold mt-6 text-red-600 mb-4">RELEVANT SKILLS</h2>
        <ul className="list-disc pl-5 text-green-600">
          <li>MERN Stack (MongoDB, Express.js, React.js,Node.js)</li>
          <li>Next.js</li>
          <li>Version Control: Git</li>
          <li>C, Java, Python (BASIC)</li>
          <li>CSS, HTML, JavaScript</li>
          <li>MongoDB, MySQL (Basic)</li>
        </ul>

        {/* <h2 className="text-2xl font-semibold mt-6 text-purple-600 mb-4">EDUCATION HISTORY</h2>
        <p className="text-yellow-600">Bachelor Of Engineering, Computer Engineering</p>
        <p className="text-yellow-600">Shri Swami Atmanand Saraswati Institute Of Technology - (GTU)</p>
        <p className="text-yellow-600">2020 - Pursuing 4th Year</p> */}

        {/* New */}
        <h2 className="text-2xl font-semibold mt-6 text-purple-700 mb-4">EDUCATION HISTORY</h2>
        <div className='mb-3'>
          <p className="text-blue-800">Bachelor Of Engineering, Computer Engineering</p>
          <p className="text-blue-800">Shri Swami Atmanand Saraswati Institute Of Technology - (GTU)</p>
          <p className="text-blue-800">2020 - Pursuing 4th Year</p>
        </div>

        <div className='mb-3'>
          <p className="text-green-800">Higher Secondary Certificate (HSC)</p>
          <p className="text-green-800">P.P. Savani Vidhya Bhavan(GSEB) 2020</p>
        </div>

        <div>
          <p className="text-purple-800">Secondary School Certificate (SSC)</p>
          <p className="text-purple-800">Ankur Vidhya Vihar (GSEB) 2018</p>
        </div>


        {/* <h2 className="text-2xl font-semibold mt-6 text-red-600 mb-4">WORK EXPERIENCE</h2>
        <p className="text-yellow-600"><strong>Logic Space, Surat, Gujarat</strong></p>
        <p className="text-teal-600 mb-2">July 2022 to Present</p>
        <ul className="list-disc pl-5 text-green-600">
          <li>Developed a salary management backend in Node.js, highlighting employee outstanding amounts.</li>
          <li>Created the backend for "Swasthya Mandir" patient diagnoses app using Node.js.</li>
          <li>Assisted frontend team as needed for integration and support.</li>
        </ul> */}

        <h2 className="text-2xl font-semibold mt-6 text-purple-600 mb-4">PROJECTS</h2>
        <ul className="list-disc pl-5 text-green-600">

          <li>Problem Solving: Word Counter (Frontend) <a href="https://abhishek1savaliya.github.io/react-textutil" target='_blank'> &#128279;</a> </li>


          <li>The Rick and Morty (Frontend) <a href="https://the-rickand-morty.vercel.app/" target='_blank'> &#128279;</a></li>


          <li>Note App (Full Stack)    <a href="https://frshfrontend.vercel.app" target="_blank" >&#128279;  </a> </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 text-red-600 mb-4">CERTIFICATION</h2>
        <p className="text-yellow-600"> <a href="https://drive.google.com/file/d/1RGoRkV0etHRgD-a7er9tvYqu0gKoHiRs" target="_blank" >Code Unnati: AI, IoT & ERP 2022-2023</a> </p>
        <p className="text-yellow-600"><a href="https://www.credly.com/badges/1c00d03d-5113-4dc1-973d-3f3d5937e367" target="_blank" >Getting Started with Web Development - Record of Achievement   </a></p>

        <div className="mt-6 flex justify-center items-center">
          <button
            className="bg-cyan-500 border-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 border-b-4  hover:border-cyan-900 rounded hover:shadow-2xl transform hover:scale-105 hover:rotate-1 hover:-translate-y-px w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 border-2 transition duration-300 ease-in-out"
            onClick={handleMessage}
          >
            {loading ? (
              <div className="flex justify-center">
                <TailSpin
                  visible={true}
                  height={35}
                  width={35}
                  color="#ffffff"
                  ariaLabel="tail-spin-loading"
                  radius={1}
                  wrapperStyle={{}}
                  wrapperClassName=""
                />
              </div>
            ) : (
              <>
                Message Me <span className="ml-1">😊</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>

  );
};

export default Profile;
