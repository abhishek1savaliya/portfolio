import { useEffect, useState } from 'react';
import moment from 'moment';

const CountdownPage = () => {
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const countDownDuration = 10 * 60 * 1000;
        const countDownDate = moment().add(countDownDuration, 'milliseconds');

        const interval = setInterval(() => {
            const now = moment();
            const distance = moment.duration(countDownDate.diff(now));

            const minutes = distance.minutes();
            const seconds = distance.seconds();
            const countdownStr = `${minutes}m ${seconds}s`;

            setCountdown(countdownStr);

            if (distance.asMilliseconds() <= 0) {
                clearInterval(interval);
                setCountdown("EXPIRED");
            }
        }, 1000);

        const timer = setTimeout(() => {
            router.push('/login');
            localStorage.removeItem('token');
            clearInterval(interval); 
        }, countDownDuration);

        return () => {
            clearInterval(interval); 
            clearTimeout(timer); 
        };

    }, []); 

    return (

        <div className="bg-gray-50 rounded-lg shadow-lg px-4 py-2">
            <div className="flex flex-col gap-2 items-center justify-between">
                <span className="text-lg sm:text-sm font-semibold">{countdown}</span>
            </div>
        </div>
    );
};

export default CountdownPage;
