import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { Star, Shield, MapPin, Briefcase, ChevronRight, X, Phone, MessageSquare, ImageIcon, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useState } from "react";
import { useApiQuery, useApiMutation } from "@/lib/use-api";

export default function CustomerBids() {
  const { id: taskId } = useParams();
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [, setLocation] = useLocation();
  const [showProfile, setShowProfile] = useState<any>(null);

  const { data: task, isLoading: loadingTask } = useApiQuery<any>(["task", taskId], `/tasks/${taskId}`);
  const { data: bids, isLoading: loadingBids } = useApiQuery<any[]>(["bids", taskId], `/tasks/${taskId}/bids`);

  const acceptBidMutation = useApiMutation<any, number>(
    (bidId: number) => `/tasks/${taskId}/bids/${bidId}/accept`,
    {
      onSuccess: () => {
        setLocation(`/customer/errand/${taskId}`);
      }
    }
  );

  const cancelTaskMutation = useApiMutation<any, void>(
    () => `/tasks/${taskId}/cancel`,
    {
      onSuccess: () => {
        setLocation("/customer/home");
      }
    }
  );

  const handleAcceptBid = () => {
    if (selectedBid) {
      acceptBidMutation.mutate(selectedBid.id);
    }
  };

  const handleCancelTask = () => {
    if (confirm("Are you sure you want to cancel this errand?")) {
      cancelTaskMutation.mutate();
    }
  };

  const handleViewProfile = (bid: any) => {
    setShowProfile(bid);
  };

  if (loadingTask || loadingBids) {
    return (
      <MobileLayout hideNav>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="font-bold text-xl">{bids?.length || 0} Bids Received</h1>
              <p className="text-sm text-gray-500">{task?.title}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelTask}
              disabled={cancelTaskMutation.isPending}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
            >
              {cancelTaskMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Cancel Errand"}
            </Button>
          </div>

          <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex gap-2">
            <Shield size={14} className="shrink-0 mt-0.5" />
            <p>Review provider profiles and ratings before accepting. Payment is secured until completion.</p>
          </div>
        </div>

        {/* Bids List */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {bids?.length === 0 ? (
            <div className="text-center p-8 text-gray-500">Waiting for runners to bid...</div>
          ) : (
            bids?.map((bid: any) => (
              <BidCard
                key={bid.id}
                id={bid.id}
                name={bid.providerName}
                rating={bid.providerRating || "0.0"}
                reviews={bid.providerReviewsCount || "0"}
                price={bid.amount}
                distance={`${bid.distance || "?"} km`}
                verified={bid.isProviderVerified}
                onSelect={() => setSelectedBid(bid)}
                isSelected={selectedBid?.id === bid.id}
                onViewProfile={() => handleViewProfile(bid)}
              />
            ))
          )}
        </div>

        {/* Action Footer */}
        {selectedBid && (
          <div className="p-4 bg-white border-t animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-500 text-sm">Total to pay</span>
                <p className="font-bold text-xl text-primary">KES {selectedBid.amount}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 text-xs">Payment Method</span>
                <p className="font-medium text-sm">M-Pesa</p>
              </div>
            </div>
            <Button
              onClick={handleAcceptBid}
              disabled={acceptBidMutation.isPending}
              className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              {acceptBidMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Accept Bid & Notify Runner"}
            </Button>
          </div>
        )}

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
              <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="font-bold text-lg">Provider Profile</h2>
                <button onClick={() => setShowProfile(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-0 pb-8 flex-1">
                {/* Profile Header */}
                <div className="p-6 text-center border-b border-gray-100">
                  <div className="h-24 w-24 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                    <img src={`https://ui-avatars.com/api/?name=${showProfile.name.replace(' ', '+')}&background=random`} alt={showProfile.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-xl flex items-center justify-center gap-1">
                    {showProfile.name}
                    {showProfile.verified && <Shield size={16} className="text-blue-500 fill-blue-500" />}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{showProfile.rating}</span>
                    <span>({showProfile.reviews} reviews)</span>
                  </div>
                </div>

                {/* Business Photos */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" /> Work Gallery
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1581578731117-104f2a417953?w=500&auto=format&fit=crop&q=60" alt="Work 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60" alt="Work 2" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1505798577917-a651a5d40318?w=500&auto=format&fit=crop&q=60" alt="Work 3" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">Photos are verified by Errander</p>
                </div>

                {/* Stats */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">142</p>
                      <p className="text-xs text-gray-500">Jobs</p>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <p className="text-xl font-bold text-gray-900">98%</p>
                      <p className="text-xs text-gray-500">Reliable</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">1 yr</p>
                      <p className="text-xs text-gray-500">Exp</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-white">
                <Button onClick={() => { setSelectedBid(showProfile.id); setShowProfile(null); }} className="w-full h-12 rounded-xl font-bold">
                  Select This Provider
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

function BidCard({ id, name, rating, reviews, price, distance, verified, onSelect, isSelected, onViewProfile }: any) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isSelected ? 'border-primary ring-1 ring-primary shadow-md' : 'border-gray-100 shadow-sm hover:border-primary/50'}`}
    >
      {verified && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
          <Shield size={10} fill="currentColor" /> VERIFIED
        </div>
      )}

      <div className="flex gap-4">
        <div className="h-14 w-14 rounded-full bg-gray-100 overflow-hidden shrink-0">
          <img src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`} alt={name} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{name}</h3>
            <span className="font-bold text-lg text-gray-900">KES {price}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <span className="flex items-center gap-0.5 text-yellow-500 font-bold">
              <Star size={14} fill="currentColor" /> {rating}
            </span>
            <span className="text-gray-300">•</span>
            <span>{reviews} reviews</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
            <MapPin size={12} />
            <span>{distance} away</span>
            <span className="text-gray-300">•</span>
            <span>{id === 1 ? 'Can start immediately' : 'Starts in 30 mins'}</span>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t flex gap-3">
          <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" onClick={(e) => { e.stopPropagation(); }}>
            <MessageSquare size={14} className="mr-1" /> Chat
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" onClick={(e) => { e.stopPropagation(); onViewProfile(); }}>
            <Briefcase size={14} className="mr-1" /> View Profile
          </Button>
        </div>
      )}
    </div>
  );
}

