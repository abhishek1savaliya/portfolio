import Profile from './profile/page';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'Abhishek Savaliya',
  description: "Abhishek Savaliya's profile as a MERN Stack intern from Surat, Gujarat.",
  name: 'ABHISHEK SAVALIYA',
  location: 'Surat, Gujarat',
  email: 'abhisheksavaliya555@gmail.com',
  linkedin: 'https://linkedin.com/in/abhishek-savaliya-22547b200',
  github: 'github.com/abhishek1savaliya',
  skills: [
    'MERN Stack (MongoDB, Express.js, React.js, Node.js)',
    'Next.js framework',
    'Version Control: Git',
    'C, Java, Python (BASIC)',
    'CSS, HTML, JavaScript',
    'MongoDB, MySQL (Basic)'
  ],
  education: [
    {
      degree: 'Master of Information Technology',
      institution: 'RMIT University',
      year: 'Feb 2024 - Dec 2026'
    },
    {
      degree: 'Bachelor Of Engineering, Computer Engineering',
      institution: 'Shri Swami Atmanand Saraswati Institute Of Technology - (GTU)',
      year: '2020 - Pursuing 4th Year'
    },
    {
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'P.P. Savani Vidhya Bhavan(GSEB)',
      year: '2020'
    },
    {
      degree: 'Secondary School Certificate (SSC)',
      institution: 'Ankur Vidhya Vihar (GSEB)',
      year: '2018'
    }
  ],
  projects: [
    'Problem Solving: Word Counter (Frontend)',
    'The Rick and Morty (Frontend)',
    'Note App (Full Stack)'
  ],
  certifications: [
    'Code Unnati: AI, IoT & ERP 2022-2023',
    'Getting Started with Web Development - Record of Achievement'
  ]
}

export default function Home() {
  return (
    <>
      <SpeedInsights />
      <Profile />
      <Analytics />

    </>
  );
}
