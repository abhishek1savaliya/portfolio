import Profile from './profile/page';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <>
      <Profile />
      <Analytics />
    </>
  );
}
