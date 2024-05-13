import Profile from './profile/page';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata = {
  title: 'Abhishek Savalia',
  description: "Abhishek Savaliya's profile as a MERN Stack intern from Surat, Gujarat.",
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
