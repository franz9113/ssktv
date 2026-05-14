import { useState } from 'react';
import { Play, Clock, Plus, Square, Utensils, Check, X } from 'lucide-react';
import type { Id } from '@convex/_generated/dataModel';

interface RoomActionsProps {
  roomId: Id<"rooms">;
  status: string;
  isOpenTime?: boolean;
  foodTotal: number;
  onStart: (id: Id<"rooms">, isOpenTime: boolean) => void;
  onEnd: (id: Id<"rooms">) => void;
  onExtend: (id: Id<"rooms">) => void;
  onAddFood: (id: Id<"rooms">, amount: number) => void;
  canEditSession?: boolean;
}

const RoomActions = ({ 
  roomId, status, isOpenTime, foodTotal, onStart, onEnd, onExtend, onAddFood, canEditSession 
}: RoomActionsProps) => {
  const isOccupied = status === "occupied";
  
  // Custom Food Amount
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [amount, setAmount] = useState("");

  // Keep confirmation ONLY for Extend (since it has no Modal)
  const [showExtendConfirm, setShowExtendConfirm] = useState(false);

  const handleAddFood = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      onAddFood(roomId, val);
      setAmount("");
      setIsAddingFood(false);
    }
  };

  if (!isOccupied) {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button onClick={() => onStart(roomId, false)} className="flex flex-col items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold transition text-xs">
          <Play size={16} /> Fixed
        </button>
        <button onClick={() => onStart(roomId, true)} className="flex flex-col items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold transition text-xs">
          <Clock size={16} /> Open Time
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {/* --- FOOD SECTION --- */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-slate-500">
            <Utensils size={12} />
            <span className="text-[10px] font-bold uppercase">Food Tab</span>
          </div>
          <span className="text-sm font-bold text-emerald-600">₱{foodTotal.toLocaleString()}</span>
        </div>
        
        {isAddingFood ? (
          <div className="flex gap-1 animate-in slide-in-from-top-1 duration-200">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 text-xs border border-slate-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddFood()}
            />
            <button onClick={handleAddFood} className="bg-emerald-500 text-white p-1 rounded hover:bg-emerald-600 transition">
              <Check size={16}/>
            </button>
            <button onClick={() => setIsAddingFood(false)} className="bg-slate-200 text-slate-600 p-1 rounded hover:bg-slate-300 transition">
              <X size={16}/></button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingFood(true)}
            className="w-full text-[10px] font-bold py-2 border-2 border-dashed border-slate-200 rounded text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
          >
            + Add Order (Food/Drinks)
          </button>
        )}
      </div>

      {/* --- SESSION ACTIONS --- */}
      <div className="grid grid-cols-2 gap-2 relative">
        {/* EXTEND BUTTON (Still uses double-tap for safety) */}
        {!isOpenTime && canEditSession && (
          showExtendConfirm ? (
            <button 
              onClick={() => { onExtend(roomId); setShowExtendConfirm(false); }} 
              className="bg-indigo-600 text-white py-2 rounded-lg font-bold text-[10px] uppercase animate-pulse"
            >
              Confirm +1hr?
            </button>
          ) : (
            <button 
              onClick={() => setShowExtendConfirm(true)} 
              className="flex items-center justify-center gap-2 bg-white border border-indigo-200 text-indigo-600 py-2 rounded-lg font-semibold text-xs hover:bg-indigo-50 transition"
            >
              <Plus size={16} /> +1 Hr
            </button>
          )
        )}

        {/* END BUTTON */}
        <button 
          onClick={() => onEnd(roomId)} 
          className={`flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-semibold text-xs transition shadow-sm shadow-rose-200 ${isOpenTime ? 'col-span-2' : ''}`}
        >
          <Square size={16} /> End Session
        </button>

        {/* "X" button */}
        {showExtendConfirm && (
          <button 
            onClick={() => setShowExtendConfirm(false)} 
            className="absolute -top-2 left-1/2 -translate-x-full bg-slate-800 text-white rounded-full p-1 shadow-lg z-10"
          >
            <X size={8}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomActions;