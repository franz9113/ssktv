import type { Id } from '@convex/_generated/dataModel';
import RoomTimer from '@/components/dashboard/RoomTimer';
import RoomActions from '@/components/dashboard/RoomActions';
import { useEffect, useState } from 'react';

interface Room {
  _id: Id<"rooms">;
  name: string;
  status: string;
  startTime?: number;
  hourlyRate: number;
  isOpenTime?: boolean;
  currentSessionEnd?: number;
  foodTotal?: number;
}

interface RoomCardProps {
  room: Room;
  onStart: (id: Id<"rooms">, isOpenTime: boolean) => void;
  onEnd: (id: Id<"rooms">) => void;
  onExtend: (id: Id<"rooms">) => void;
  onAddFood: (id: Id<"rooms">, amount: number) => void;
  canEditSession?: boolean;
}

const RoomCard = (props: RoomCardProps) => {
  const { room } = props;
  const isOccupied = room.status === "occupied";
  
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (!isOccupied || !room.currentSessionEnd) {
      setIsCritical(false);
      return;
    }

    const checkTime = () => {
      const now = Date.now();
      const timeLeft = room.currentSessionEnd! - now;
      const tenMinutes = 10 * 60 * 1000;

      // Set true if between 0 and 10 minutes left
      setIsCritical(timeLeft > 0 && timeLeft < tenMinutes);
    };

    checkTime(); // Initial check
    const interval = setInterval(checkTime, 1000); // Check every second

    return () => clearInterval(interval);
  }, [isOccupied, room.currentSessionEnd]);
  return (
    <div className={`
  relative p-6 rounded-[2rem] border-2 transition-all duration-500
  ${isCritical 
    ? 'animate-flash-border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
    : 'border-slate-800 bg-slate-900'}
`}>
      {/* Header Info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-md font-black text-white uppercase tracking-tighter">
              {room.name} 
            </h3>
            <p className="text-slate-400 font-bold text-xs">₱{room.hourlyRate}/hr</p>
          </div>
          
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            room.status === 'available' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>
            {room.status}
          </span>
        </div>

      {/* Middle Section: Timer or Empty State */}
      <div className="min-h-[74px]">
        {isOccupied ? (
          <RoomTimer 
            startTime={room.startTime} 
            endTime={room.currentSessionEnd} 
            isOpenTime={!!room.isOpenTime} 
            status={room.status} 
          />
        ) : (
          <div className="h-[74px] flex items-center justify-center border-2 border-dashed border-emerald-200 rounded-lg bg-white/50">
            <p className="text-emerald-600 text-sm font-medium italic">Ready for guests</p>
          </div>
        )}
      </div>

      {/* Bottom Section: All Interactive Buttons */}
      <RoomActions 
        roomId={room._id}
        status={room.status}
        isOpenTime={room.isOpenTime}
        foodTotal={room.foodTotal || 0}
        canEditSession={props.canEditSession}
        onStart={props.onStart}
        onEnd={props.onEnd}
        onExtend={props.onExtend}
        onAddFood={props.onAddFood}
      />
    </div>
  );
};

export default RoomCard;