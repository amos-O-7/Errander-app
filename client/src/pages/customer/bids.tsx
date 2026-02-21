import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import {
  Star, Shield, MapPin, Briefcase, X, MessageSquare,
  ImageIcon, Loader2, ArrowLeft, Home, Clock, Calendar,
  CheckCircle2, Hourglass
} from "lucide-react";
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
    (bidId: number) => `/tasks/${taskId}/accept-bid/${bidId}`,
    { onSuccess: () => setLocation(`/customer/errand/${taskId}`) }
  );

  const cancelTaskMutation = useApiMutation<any, void>(
    () => `/tasks/${taskId}/cancel`,
    { onSuccess: () => setLocation("/customer/activity") }
  );

  const handleAcceptBid = () => {
    if (selectedBid) acceptBidMutation.mutate(selectedBid.id);
  };

  const handleCancelTask = () => {
    if (confirm("Are you sure you want to cancel this errand?")) {
      cancelTaskMutation.mutate();
    }
  };

  if (loadingTask || loadingBids) {
    return (
      <MobileLayout hideNav>
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading errand details…</p>
        </div>
      </MobileLayout>
    );
  }

  const bidCount = bids?.length ?? 0;

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-950">

        {/* ── Sticky Header ───────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 p-4 sticky top-0 z-10 border-b dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Back → Activity */}
            <button
              onClick={() => setLocation("/customer/activity")}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>

            <div className="text-center flex-1">
              <h1 className="font-bold text-base dark:text-white truncate px-2">
                {task?.title ?? "Your Errand"}
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {bidCount === 0 ? "Waiting for runners…" : `${bidCount} bid${bidCount !== 1 ? "s" : ""} received`}
              </p>
            </div>

            {/* Go Home shortcut */}
            <Link href="/customer/home">
              <button className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Home size={20} className="text-foreground" />
              </button>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">

          {/* ── Errand Detail Card ─────────────────────────────────────────────── */}
          <div className="m-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Status Banner */}
            <div className="bg-primary/10 dark:bg-primary/20 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Hourglass size={16} className="animate-pulse" />
                Open — Accepting Bids
              </div>
              <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-full">
                {bidCount} {bidCount === 1 ? "Bid" : "Bids"}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Title + Category */}
              <div>
                <h2 className="text-xl font-bold dark:text-white">{task?.title}</h2>
                {task?.categoryName && (
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {task.categoryName}
                  </span>
                )}
              </div>

              {/* Description */}
              {task?.description && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{task.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {task?.locationName && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-start gap-2">
                    <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">Location</p>
                      <p className="text-sm font-semibold dark:text-white">{task.locationName}</p>
                    </div>
                  </div>
                )}

                {task?.preferredStartDateTime && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-start gap-2">
                    <Calendar size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">Preferred Date</p>
                      <p className="text-sm font-semibold dark:text-white">
                        {new Date(task.preferredStartDateTime).toLocaleDateString("en-KE", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {task?.serviceTypeName && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">Service Type</p>
                      <p className="text-sm font-semibold dark:text-white">{task.serviceTypeName}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-start gap-2">
                  <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">Posted</p>
                    <p className="text-sm font-semibold dark:text-white">
                      {task?.createdAt
                        ? new Date(task.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short" })
                        : "Just now"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancel */}
              <button
                onClick={handleCancelTask}
                disabled={cancelTaskMutation.isPending}
                className="w-full text-red-500 text-sm font-medium py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {cancelTaskMutation.isPending
                  ? <Loader2 className="animate-spin h-4 w-4" />
                  : "Cancel this errand"}
              </button>
            </div>
          </div>

          {/* ── Info Banner ────────────────────────────────────────────────────── */}
          <div className="mx-4 mb-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs p-3 rounded-xl flex gap-2">
            <Shield size={14} className="shrink-0 mt-0.5" />
            <p>Review provider profiles and ratings before accepting. Payment is secured until completion.</p>
          </div>

          {/* ── Bids Section ───────────────────────────────────────────────────── */}
          <div className="mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Bids Received
                <span className="ml-2 text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                  {bidCount}
                </span>
              </h3>
            </div>

            {bidCount === 0 ? (
              /* ── Empty State ── */
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Hourglass size={28} className="text-primary" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">0 Bids So Far</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Your errand is live! Runners in your area are being notified. Bids will appear here as they come in.
                </p>
                <div className="flex gap-3 mt-6 justify-center">
                  <Link href="/customer/activity">
                    <Button variant="outline" className="rounded-xl dark:border-gray-700 dark:text-white">
                      View Activity
                    </Button>
                  </Link>
                  <Link href="/customer/home">
                    <Button className="rounded-xl font-bold">
                      <Home size={16} className="mr-2" /> Go Home
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Bid Cards ── */
              <div className="space-y-4">
                {bids?.map((bid: any) => (
                  <BidCard
                    key={bid.id}
                    id={bid.id}
                    name={bid.bidderName}
                    rating={bid.bidderRating || "New"}
                    reviews={bid.bidderReviews || 0}
                    price={bid.minAmount}
                    distance={`${bid.distance || "?"} km`}
                    verified={bid.isProviderVerified}
                    onSelect={() => setSelectedBid(bid)}
                    isSelected={selectedBid?.id === bid.id}
                    onViewProfile={() => setShowProfile(bid)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Accept Bid Footer ────────────────────────────────────────────────── */}
        {selectedBid && (
          <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Total to pay</span>
                <p className="font-bold text-xl text-primary">KES {selectedBid.amount}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 dark:text-gray-400 text-xs">Payment Method</span>
                <p className="font-medium text-sm dark:text-white">M-Pesa</p>
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

        {/* ── Provider Profile Modal ───────────────────────────────────────────── */}
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
              <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h2 className="font-bold text-lg dark:text-white">Provider Profile</h2>
                <button
                  onClick={() => setShowProfile(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X size={20} className="dark:text-white" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {/* Avatar + Name */}
                <div className="p-6 text-center border-b dark:border-gray-800">
                  <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4 overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(showProfile.bidderName ?? showProfile.name ?? "")}&background=7c3aed&color=fff&bold=true`}
                      alt={showProfile.bidderName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-xl dark:text-white">
                    {showProfile.bidderName ?? showProfile.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold dark:text-white">
                      {showProfile.bidderRating || showProfile.rating || "New"}
                    </span>
                    <span className="dark:text-gray-400">
                      ({showProfile.bidderReviews ?? showProfile.reviews ?? 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Work Gallery */}
                <div className="p-6 border-b dark:border-gray-800">
                  <h4 className="font-bold dark:text-white mb-4 flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" /> Work Gallery
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "https://images.unsplash.com/photo-1581578731117-104f2a417953?w=300&auto=format&fit=crop&q=60",
                      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=60",
                      "https://images.unsplash.com/photo-1505798577917-a651a5d40318?w=300&auto=format&fit=crop&q=60",
                    ].map((src, i) => (
                      <div key={i} className={`aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden ${i === 2 ? "col-span-2 aspect-video" : ""}`}>
                        <img src={src} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">Photos verified by Errander</p>
                </div>

                {/* Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="text-center">
                      <p className="text-xl font-bold dark:text-white">142</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Jobs</p>
                    </div>
                    <div className="text-center border-x dark:border-gray-700">
                      <p className="text-xl font-bold dark:text-white">98%</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Reliable</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold dark:text-white">1 yr</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Exp</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
                <Button
                  onClick={() => { setSelectedBid(showProfile); setShowProfile(null); }}
                  className="w-full h-12 rounded-xl font-bold"
                >
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

// ── BidCard ────────────────────────────────────────────────────────────────────

function BidCard({ id, name, rating, reviews, price, distance, verified, onSelect, isSelected, onViewProfile }: any) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white dark:bg-gray-900 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden
        ${isSelected
          ? "border-primary ring-1 ring-primary shadow-md"
          : "border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/50"
        }`}
    >
      {verified && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
          <Shield size={10} fill="currentColor" /> VERIFIED
        </div>
      )}

      <div className="flex gap-4">
        <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&bold=true`}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg dark:text-white truncate">{name}</h3>
            <span className="font-bold text-lg text-gray-900 dark:text-white shrink-0 ml-2">KES {price}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span className="flex items-center gap-0.5 text-yellow-500 font-bold">
              <Star size={14} fill="currentColor" /> {rating}
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span>{reviews} reviews</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-1">
            <MapPin size={12} />
            <span>{distance} away</span>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t dark:border-gray-800 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1 h-9 text-xs dark:border-gray-700 dark:text-white">
            <MessageSquare size={14} className="mr-1" /> Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9 text-xs dark:border-gray-700 dark:text-white"
            onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
          >
            <Briefcase size={14} className="mr-1" /> View Profile
          </Button>
        </div>
      )}
    </div>
  );
}
