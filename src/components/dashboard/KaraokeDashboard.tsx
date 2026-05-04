import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import RoomCard from "@/components/dashboard/RoomCard";
import CheckoutModal from '@/components/modals/CheckoutModal';
import { useState } from "react";
import LoadingState from "../layout/LoadingState";

export default function KaraokeDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState<any>(null);
  const rooms = useQuery(api.rooms.getRooms);

  const startSession = useMutation(api.rooms.startSession);
  const endSession = useMutation(api.rooms.endSession);
  const extendSession = useMutation(api.rooms.extendSession);
  const addFood = useMutation(api.rooms.addFoodOrder);

  const recordSale = useMutation(api.sales.recordSale);

  if (!rooms) return <LoadingState message="REFRESHING ROOM STATUS" />;

  const handleEndSession = async (roomId: string, roomName: string) => {
    const room = rooms.find(r => r._id === roomId);
    if (!room) return;

    const now = Date.now();
    const duration = (now - (room.startTime || now)) / (1000 * 60 * 60);
    const roomCharge = Math.ceil(duration) * room.hourlyRate;
    const foodCharge = room.foodTotal || 0;

    setCurrentBill({
      roomId, 
      roomName,
      total: roomCharge + foodCharge,
      roomCharge,
      foodCharge,
    });
    setIsModalOpen(true);
  };

  const confirmClear = async () => {
  if (currentBill?.roomId) {
    await recordSale({
      roomName: currentBill.roomName,
      roomCharge: currentBill.roomCharge,
      foodCharge: currentBill.foodCharge,
      totalAmount: currentBill.total,
      duration: currentBill.duration || 1, 
      paymentMethod: "Cash",
      completedAt: Date.now(),
    });
    
    await endSession({ id: currentBill.roomId });
    
    setIsModalOpen(false);
    setCurrentBill(null);
  }
};

  return (
    <div className="p-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard 
            key={room._id} 
            room={room} 
            onStart={(id, isOpenTime) => startSession({ id, isOpenTime })}
            onAddFood={(id, amount) => addFood({ id, amount })} 
            onEnd={(id) => handleEndSession(id, room.name)}
            onExtend={(id) => extendSession({ id })}
          />
        ))}
      </div>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setCurrentBill(null);
        }} 
        onConfirm={confirmClear} 
        billDetails={currentBill} 
      />
    </div>
  );
}