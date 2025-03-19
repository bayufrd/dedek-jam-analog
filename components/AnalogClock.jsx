'use client';
import { useEffect, useState } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  if (!mounted) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-[300px] h-[300px] mb-6 rounded-full border-4 border-pink-400 bg-white"></div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-pink-700">Loading...</h2>
        </div>
      </div>
    );
  }

  const secondsRatio = time.getSeconds() / 60;
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + time.getHours()) / 12;

  const dayName = days[time.getDay()];
  const day = time.getDate();
  const month = months[time.getMonth()];
  const year = time.getFullYear();

  const hourPositions = [...Array(12)].map((_, i) => {
    const angle = i * 30 * Math.PI / 180;
    const top = Math.round((50 - 42 * Math.cos(angle)) * 100) / 100;
    const left = Math.round((50 + 42 * Math.sin(angle)) * 100) / 100;

    return { top, left, hour: i === 0 ? 12 : i };
  });

  return (
    <div className="flex flex-col items-center justify-center md:flex-row">
      {/* Analog Clock */}
      <div className="relative w-[300px] h-[300px] mb-6">
        <div className="relative w-full h-full rounded-full border-4 border-pink-400 bg-white shadow-lg">
          {hourPositions.map(({ top, left, hour }) => (
            <div
              key={hour}
              className="absolute font-bold text-lg text-pink-800"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {hour}
            </div>
          ))}

          <div
            className="absolute w-2.5 h-[25%] bg-pink-800 rounded-full"
            style={{
              transform: `rotate(${Math.round(hoursRatio * 360)}deg)`,
              transformOrigin: 'bottom center',
              left: 'calc(50% - 1.25px)',
              bottom: '50%',
            }}
          />

          <div
            className="absolute w-2 h-[35%] bg-pink-600 rounded-full"
            style={{
              transform: `rotate(${Math.round(minutesRatio * 360)}deg)`,
              transformOrigin: 'bottom center',
              left: 'calc(50% - 1px)',
              bottom: '50%',
            }}
          />

          <div
            className="absolute w-1 h-[40%] bg-red-500 rounded-full"
            style={{
              transform: `rotate(${Math.round(secondsRatio * 360)}deg)`,
              transformOrigin: 'bottom center',
              left: 'calc(50% - 0.5px)',
              bottom: '50%',
            }}
          />

          <div className="absolute w-4 h-4 bg-pink-700 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Date & Time */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-pink-700">{dayName}</h2>
        <p className="text-xl text-gray-700">{day} {month} {year}</p>
      </div>
    </div>
  );
}
