import { useState, useEffect } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      // EU AI Act deadline: February 2, 2026
      const deadline = new Date('2026-02-02T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 text-center">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-red-600 tabular-nums">
            {String(timeRemaining.days).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm font-semibold text-gray-600 mt-1">Days</div>
        </div>
        <div className="text-3xl md:text-4xl font-bold text-gray-400">:</div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-red-600 tabular-nums">
            {String(timeRemaining.hours).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm font-semibold text-gray-600 mt-1">Hours</div>
        </div>
        <div className="text-3xl md:text-4xl font-bold text-gray-400">:</div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-red-600 tabular-nums">
            {String(timeRemaining.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm font-semibold text-gray-600 mt-1">Minutes</div>
        </div>
        <div className="text-3xl md:text-4xl font-bold text-gray-400">:</div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold text-red-600 tabular-nums">
            {String(timeRemaining.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm font-semibold text-gray-600 mt-1">Seconds</div>
        </div>
      </div>
    </div>
  );
}
