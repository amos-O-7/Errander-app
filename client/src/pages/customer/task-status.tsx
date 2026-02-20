import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, CheckCircle2, Loader2, ArrowLeft, Star } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useState } from "react";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskStatus() {
  const { id: taskId } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { data: task, isLoading } = useApiQuery<any>(
    ["task", taskId],
    `/tasks/${taskId}`
  );

  const completeMutation = useApiMutation<any, void>(
    () => `/tasks/${taskId}/complete`,
    {
      method: "PATCH",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        setShowRating(true);
      }
    }
  );

  const rateMutation = useApiMutation<any, { rating: number; comment: string }>(
    () => `/tasks/${taskId}/rate`,
    {
      onSuccess: () => {
        setLocation("/customer/home");
      }
    }
  );

  const handleComplete = () => {
    if (confirm("Mark this errand as completed?")) {
      completeMutation.mutate();
    }
  };

  const handleSubmitRating = () => {
    if (ratingValue === 0) return;
    rateMutation.mutate({ rating: ratingValue, comment });
  };

  if (isLoading) {
    return (
      <MobileLayout hideNav>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  const provider = task?.acceptedProvider;
  const isInProgress = task?.statusId === 2;
  const isCompleted = task?.statusId === 3;

  return (
    <MobileLayout hideNav>
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/customer/activity">
            <button className="h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600">
              <ArrowLeft size={20} />
            </button>
          </Link>
        </div>

        {/* Map Background */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:24px_24px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {isInProgress && (
                <div className="h-24 w-24 bg-primary/20 rounded-full animate-ping" />
              )}
              {isCompleted ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-green-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
              ) : (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full shadow-lg border-2 border-white" />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Card */}
        <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 z-20">

          {/* Rating Modal */}
          {showRating && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold">Errand Complete!</h2>
                <p className="text-gray-500 text-sm mt-1">How was your experience with {provider?.name ?? "your provider"}?</p>
              </div>

              <div className="flex justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRatingValue(star)}
                    className="transition-transform active:scale-110"
                  >
                    <Star
                      size={36}
                      className={`transition-colors ${star <= (hoverRating || ratingValue)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"}`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Leave a comment (optional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <Button
                onClick={handleSubmitRating}
                disabled={ratingValue === 0 || rateMutation.isPending}
                className="w-full h-12 rounded-xl font-bold"
              >
                {rateMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Submit Rating"}
              </Button>

              <button onClick={() => setLocation("/customer/home")} className="w-full text-center text-sm text-gray-400 py-2">
                Skip for now
              </button>
            </div>
          )}

          {!showRating && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{task?.title}</h2>
                  <p className={`font-medium text-sm mt-0.5 ${isCompleted ? "text-green-600" : "text-primary"}`}>
                    {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Waiting for bids"}
                  </p>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                  #{task?.id}
                </div>
              </div>

              {/* Provider Info */}
              {provider && (
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                  <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name ?? "SP")}&background=7c3aed&color=fff&bold=true`} alt={provider.name} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{provider.name}</h3>
                    <p className="text-xs text-gray-500">KES {provider.amount} agreed</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/messages/${task?.id}`}>
                      <button className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary shadow-sm">
                        <MessageSquare size={18} />
                      </button>
                    </Link>
                    {provider.phone && (
                      <a href={`tel:${provider.phone}`}>
                        <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                          <Phone size={18} />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {task?.description && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{task.description}</p>
              )}

              {isInProgress && (
                <Button
                  onClick={handleComplete}
                  disabled={completeMutation.isPending}
                  className="w-full h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white"
                >
                  {completeMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Mark as Completed"}
                </Button>
              )}

              {isCompleted && !showRating && (
                <Button
                  onClick={() => setShowRating(true)}
                  className="w-full h-12 rounded-xl font-bold"
                >
                  <Star size={16} className="mr-2" />
                  Rate Your Provider
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
