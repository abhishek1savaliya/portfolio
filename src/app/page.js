import Profile from './profile/page';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <>
      <SpeedInsights />
      <Profile />
      <Analytics />

    </>
  );
}
