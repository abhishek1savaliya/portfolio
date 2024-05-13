import { Inter } from 'next/font/google'
import Head from 'next/head'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Abhishek Savaliya',
  description: "Abhishek Savaliya's profile as a MERN Stack intern from Surat, Gujarat.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content="Seeking for an internship/job opportunity with a company that offers a positive atmosphere to implement new ideas or technological skills." />
        <meta property="og:image" content="https://i.ibb.co/rvcNTg4/SAVE-20230812-213425.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/profile" />
        <link rel="canonical" href="https://yourwebsite.com/profile" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
