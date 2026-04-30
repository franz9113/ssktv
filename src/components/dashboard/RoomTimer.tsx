import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface RoomTimerProps {
  startTime?: number;
  endTime?: number;
  isOpenTime: boolean;
  status: string;
}

const RoomTimer = ({ startTime, endTime, isOpenTime, status }: RoomTimerProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let interval: any;
    if (status === "occupied") {
      // Immediate update to prevent the 1-second "frozen" look
      setNow(Date.now());
      
      interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, endTime, startTime, isOpenTime]);

  const formatTime = () => {
    if (status !== "occupied" || !startTime) return "00:00:00";

    let diff: number;
    if (isOpenTime) {
      // COUNT UP: Current time minus when they started
      diff = now - startTime;
    } else {
      // COUNT DOWN: End time minus current time
      if (!endTime) return "00:00:00";
      diff = endTime - now;
    }

    const totalMs = Math.max(0, diff);
    const totalSeconds = Math.floor(totalMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
      <div className="flex items-center text-indigo-600 gap-2 mb-1">
        <Clock size={16} />
        <span className="text-sm font-semibold">
          {isOpenTime ? "Open Time (Elapsed)" : "Time Remaining"}
        </span>
      </div>
      <div className="text-2xl font-mono font-bold text-gray-700 tabular-nums">
        {formatTime()}
      </div>
    </div>
  );
};

export default RoomTimer;