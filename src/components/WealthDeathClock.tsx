import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const WealthDeathClock: React.FC = () => {
  const [time, setTime] = useState({
    years: 47,
    months: 4,
    weeks: 3,
    days: 5,
    hours: 12,
    minutes: 23,
    seconds: 45
  });

  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        let newDays = prev.days;
        let newWeeks = prev.weeks;
        let newMonths = prev.months;
        let newYears = prev.years;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }
        if (newDays < 0) {
          newDays = 6;
          newWeeks -= 1;
        }
        if (newWeeks < 0) {
          newWeeks = 3;
          newMonths -= 1;
        }
        if (newMonths < 0) {
          newMonths = 11;
          newYears -= 1;
        }

        return {
          years: newYears,
          months: newMonths,
          weeks: newWeeks,
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });

      // Trigger pulse animation every second
      setPulse(true);
      setTimeout(() => setPulse(false), 200);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-4 transition-all duration-200 ${pulse ? 'scale-105 border-red-300' : ''}`}>
      <div className="flex items-center gap-2 mb-4 justify-center">
        <Clock className={`w-5 h-5 text-red-500 transition-all duration-200 ${pulse ? 'scale-110' : ''}`} />
        <span className="text-red-600 font-bold text-base">Wealth Death Clock</span>
      </div>
      <p className="text-red-700 text-sm mb-4 text-center font-medium">
        Most families' wealth disappears in:
      </p>
      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div className={`bg-red-100 rounded-xl p-2 transition-all duration-200 ${pulse ? 'bg-red-200' : ''}`}>
          <div className="text-red-800 text-lg font-bold">{time.years}</div>
          <div className="text-red-600 text-xs font-medium">Years</div>
        </div>
        <div className={`bg-red-100 rounded-xl p-2 transition-all duration-200 ${pulse ? 'bg-red-200' : ''}`}>
          <div className="text-red-800 text-lg font-bold">{time.months}</div>
          <div className="text-red-600 text-xs font-medium">Months</div>
        </div>
        <div className={`bg-red-100 rounded-xl p-2 transition-all duration-200 ${pulse ? 'bg-red-200' : ''}`}>
          <div className="text-red-800 text-lg font-bold">{time.weeks}</div>
          <div className="text-red-600 text-xs font-medium">Weeks</div>
        </div>
        <div className={`bg-red-100 rounded-xl p-2 transition-all duration-200 ${pulse ? 'bg-red-200' : ''}`}>
          <div className="text-red-800 text-lg font-bold">{time.days}</div>
          <div className="text-red-600 text-xs font-medium">Days</div>
        </div>
        <div className={`bg-red-100 rounded-xl p-2 transition-all duration-200 ${pulse ? 'bg-red-200' : ''}`}>
          <div className="text-red-800 text-lg font-bold">{time.hours}</div>
          <div className="text-red-600 text-xs font-medium">Hours</div>
        </div>
        <div className={`bg-red-100 rounded-xl p-2 transition-all duration-200 ${pulse ? 'bg-red-200' : ''}`}>
          <div className="text-red-800 text-lg font-bold">{time.minutes}</div>
          <div className="text-red-600 text-xs font-medium">Minutes</div>
        </div>
      </div>
      <p className="text-red-700 text-sm text-center font-medium">
        But you are about to take action.
      </p>
      <p className="text-red-700 text-sm text-center font-medium">
        You're about to be different. Be Prepared.
      </p>
    </div>
  );
};

export default WealthDeathClock;