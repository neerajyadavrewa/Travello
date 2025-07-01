// components/BookingCard.tsx
'use client';
import { useRouter } from 'next/navigation';
export default function BookingCard({ 
  packageId,
  lastEntryDate,
  price
}: { 
  packageId: string;
  lastEntryDate: string;
  price: string;
}) {
  const router = useRouter();

  const handleBooking = () => {
    router.push(`/book-now?packageId=${packageId}`);
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950 backdrop-blur-sm rounded-2xl p-6 border border-purple-900/30 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-3xl font-bold text-stone-400">₹{price}</div>
          <div className="text-sm text-gray-400">per person</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Booking Date:</div>
          <div className="font-medium text-purple-300">
            {new Date(lastEntryDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>

      <button 
        onClick={handleBooking}
        className="w-full py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        Book Now
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div className="mt-6 space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm text-gray-400">Free cancellation up to 48 hours before departure</p>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm text-gray-400">Instant confirmation with e-ticket</p>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm text-gray-400">24/7 customer support</p>
        </div>
      </div>
    </div>
  );
}