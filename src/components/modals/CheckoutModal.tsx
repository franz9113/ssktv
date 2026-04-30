import { Check, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  billDetails: {
    roomName: string;
    total: number;
    roomCharge: number;
    foodCharge: number;
  } | null;
}

const CheckoutModal = ({ isOpen, onClose, onConfirm, billDetails }: CheckoutModalProps) => {
  if (!isOpen || !billDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="bg-emerald-600 p-6 text-center text-white relative">
          <button 
            onClick={onClose} // CANCEL ACTION
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition"
          >
            <X size={20} />
          </button>
          
          <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Payment Summary</h2>
          <p className="text-emerald-100 text-sm font-medium">{billDetails.roomName}</p>
        </div>
        
        {/* Bill Details Section */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Room Usage</span>
              <span className="font-bold text-slate-900 font-mono">₱{billDetails.roomCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm pb-4 border-b border-slate-100">
              <span>Food & Drinks</span>
              <span className="font-bold text-slate-900 font-mono">₱{billDetails.foodCharge.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-bold text-slate-400 uppercase">Total to Pay</span>
            <span className="text-3xl font-black text-emerald-600 font-mono">
              ₱{billDetails.total.toLocaleString()}
            </span>
          </div>
          
          <button 
            onClick={onConfirm} // FINAL CLEAR ACTION
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition-all mt-4 shadow-lg shadow-slate-200"
          >
            Done & Clear Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;