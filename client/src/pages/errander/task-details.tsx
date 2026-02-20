import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Banknote, Clock, CheckCircle, Lock, Phone, Mail, MessageSquare, AlertCircle, Loader2, Smartphone, ShieldAlert } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useUser } from "@/lib/user-context";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ErranderTaskDetails() {
  const { id } = useParams();
  const [step, setStep] = useState<"view" | "bid" | "submitted" | "accepted_locked" | "accepted_unlocked">("view");
  const [, setLocation] = useLocation();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { toast } = useToast();

  // Real verification status should come from user context, simplified for now
  const isVerified = true;

  const { data: task, isLoading: loadingTask } = useApiQuery<any>(["tasks", id], `/tasks/${id}`);
  const { user } = useUser();

  useEffect(() => {
    if (task?.bids && user?.id) {
      // Check if the logged-in SP already has a bid on this task
      const alreadyBid = task.bids.some((b: any) => b.userId === user.id && b.statusId !== 3);
      if (alreadyBid) setStep("submitted");
    }
  }, [task, user?.id]);

  const handleBidClick = () => {
    if (!isVerified) {
      setShowVerificationDialog(true);
    } else {
      setStep("bid");
    }
  };

  const submitBidMutation = useApiMutation<any, any>((vars) => `/Errander/jobs/${id}/bid`, {
    onSuccess: () => {
      toast({
        title: "Bid Submitted!",
        description: "Your proposal has been sent to the customer.",
      });
      setStep("submitted");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit bid",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleBidSubmit = (bidData: any) => {
    submitBidMutation.mutate(bidData);
  };

  const simulateCustomerAcceptance = () => {
    setStep("accepted_locked");
  };

  if (loadingTask) {
    return (
      <MobileLayout hideNav>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </MobileLayout>
    );
  }

  if (!task) {
    return (
      <MobileLayout hideNav>
        <div className="p-4 flex flex-col items-center justify-center h-full">
          <p className="text-gray-500 mb-4">Errand not found.</p>
          <Button onClick={() => setLocation("/errander/home")}>Go Back</Button>
        </div>
      </MobileLayout>
    );
  }

  // Find this SP's own bid from the task
  const myBid = task?.bids?.find((b: any) => b.statusId !== 3) ?? null;

  if (step === "accepted_unlocked") {
    return <AcceptedUnlockedView task={task} />;
  }

  if (step === "accepted_locked") {
    return <AcceptedLockedView task={task} onUnlock={() => setStep("accepted_unlocked")} />;
  }

  if (step === "submitted") {
    return <BidSubmittedView task={task} bid={myBid || submitBidMutation.data} onSimulateAccept={simulateCustomerAcceptance} />;
  }

  if (step === "bid") {
    return <BidFormView task={task} onBack={() => setStep("view")} onSubmit={handleBidSubmit} isLoading={submitBidMutation.isPending} />;
  }

  // Default view: Viewing the potential task
  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm flex items-center gap-3">
          <Link href="/errander/home">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="font-bold text-lg">Errand Details</h1>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-1">{task.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Posted: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ""}
            </p>

            <div className="aspect-video w-full rounded-xl bg-gray-100 mb-4 overflow-hidden relative">
              <img src={task.image} alt="Errand" className="object-cover w-full h-full" />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                1 Photo
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-1">Preferred Start</h3>
                <p className="text-sm text-gray-600">{task.preferredStart}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t">
          <Button onClick={handleBidClick} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
            Submit Bid
          </Button>
        </div>

        {/* Verification Required Dialog */}
        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <ShieldAlert className="text-blue-600" size={24} />
              </div>
              <DialogTitle className="text-center">Verification Required</DialogTitle>
              <DialogDescription className="text-center pt-2">
                To maintain a trusted community, you must complete your profile verification before submitting bids.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button onClick={() => setLocation("/errander/complete-profile")} className="w-full rounded-xl font-bold">
                Complete Profile
              </Button>
              <Button variant="ghost" onClick={() => setShowVerificationDialog(false)} className="w-full rounded-xl">
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
}

function BidFormView({ task, onBack, onSubmit, isLoading }: any) {
  const [minPrice, setMinPrice] = useState(task.minBudget || "");
  const [maxPrice, setMaxPrice] = useState(task.maxBudget || "");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit({
      minAmount: parseFloat(minPrice),
      maxAmount: parseFloat(maxPrice),
      estimatedHours: parseInt(duration) || 1,
      proposalMessage: note,
      startDate: new Date().toISOString()
    });
  };

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b flex items-center gap-3 sticky top-0 bg-white z-10">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">Submit Your Bid</h1>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 leading-relaxed">
            You are bidding on <strong>{task.title}</strong>. Provide a competitive range and accurate time estimate to win this errand.
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Your Bid Range (KES)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 font-bold">KES</span>
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="400"
                    className="pl-12 h-12 rounded-xl text-lg font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Maximum Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 font-bold">KES</span>
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="900"
                    className="pl-12 h-12 rounded-xl text-lg font-bold"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Suggested budget: KES {task.minBudget} - {task.maxBudget}</p>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-lg">Estimated Duration (Hours)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-500" size={20} />
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2"
                className="pl-10 h-12 rounded-xl"
              />
            </div>
            <p className="text-xs text-gray-500">How many hours will this take you to complete?</p>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-lg">Add a Note (Optional)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I have the tools for this..."
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="p-4 border-t">
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Submit Proposal"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

function BidSubmittedView({ task, bid, onSimulateAccept }: any) {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">Bidding</span>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">Bid {bid?.statusName || "Pending"}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">Your Bid</p>
              <p className="text-green-600 font-bold text-lg">KES {bid?.minAmount || bid?.minPrice || "0"} - {bid?.maxAmount || bid?.maxPrice || "0"}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 mb-1">Bid Status</h3>
              <p className="text-sm text-gray-500">Your bid is {bid?.statusName || "pending"}</p>
            </div>

            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Errand Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium text-gray-900">{task.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-900">{task.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted:</span>
                  <span className="font-medium text-gray-900">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">Errand Timeline</h3>
              <div className="space-y-4 relative pl-4 border-l-2 border-gray-100 ml-1">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white ring-1 ring-green-100"></div>
                  <p className="text-xs text-gray-500 mb-0.5">Posted on {new Date(task.createdAt).toLocaleString()}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white ring-1 ring-blue-100"></div>
                  <p className="text-sm font-medium text-gray-900">You bid (KES): {bid?.minAmount || bid?.minPrice || "0"} - {bid?.maxAmount || bid?.maxPrice || "0"}</p>
                  {bid?.createdAt && <p className="text-xs text-gray-500">on {new Date(bid.createdAt).toLocaleString()}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            {task.image && (
              <>
                <h3 className="font-bold text-gray-900 mb-2">Errand Image</h3>
                <div className="rounded-xl overflow-hidden h-48 bg-gray-100">
                  <img src={task.image} alt="Errand" className="w-full h-full object-cover" />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setLocation("/errander/home")}
              variant="outline"
              className="flex-1 bg-white border-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function AcceptedLockedView({ task, onUnlock }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");

  const handlePayment = () => {
    if (!phoneNumber) return;
    setPaymentStatus("processing");

    // Simulate STK Push delay
    setTimeout(() => {
      setPaymentStatus("success");
      // Simulate success delay before unlock
      setTimeout(() => {
        onUnlock();
      }, 1500);
    }, 2500);
  };

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-4 bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle size={20} fill="currentColor" className="text-green-100" />
            <span className="font-bold">Bid Accepted!</span>
          </div>
          <h1 className="font-bold text-lg text-gray-900">{task.title}</h1>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 w-full max-w-sm relative overflow-hidden">
            {/* Blur Overlay Effect */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="bg-white p-4 rounded-full shadow-xl">
                <Lock size={32} className="text-gray-400" />
              </div>
            </div>

            {/* Blurred contact info - unlocked on payment */}
            <div className="opacity-50 blur-[1px]">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-1">
                {task.acceptedProvider?.name ?? "Customer Name"}
              </h3>
              <p className="text-gray-500 mb-4">+254 7XX XXX XXX</p>
              <div className="flex gap-4 justify-center">
                <Button size="icon" variant="outline" className="rounded-full"><Phone size={18} /></Button>
                <Button size="icon" variant="outline" className="rounded-full"><MessageSquare size={18} /></Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-w-xs w-full">
            <h2 className="font-bold text-xl text-gray-900">Unlock Contact Details</h2>
            <p className="text-sm text-gray-500">
              To view the customer's phone number and start the errand, please pay the platform fee.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-green-800">Platform Fee</span>
                <span className="font-bold text-green-900 text-lg">KES 50</span>
              </div>
              <div className="text-[10px] text-green-600 text-left font-medium uppercase tracking-wide">
                Via M-Pesa
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label>M-Pesa Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  className="pl-10 h-12 rounded-xl"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={paymentStatus !== "idle"}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t space-y-3">
          {paymentStatus === "processing" ? (
            <div className="w-full h-12 flex items-center justify-center gap-2 bg-gray-100 text-gray-500 rounded-xl font-bold animate-pulse">
              <Loader2 size={20} className="animate-spin" />
              Processing STK Push...
            </div>
          ) : paymentStatus === "success" ? (
            <div className="w-full h-12 flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-xl font-bold">
              <CheckCircle size={20} />
              Payment Confirmed!
            </div>
          ) : (
            <Button
              onClick={handlePayment}
              disabled={!phoneNumber || phoneNumber.length < 10}
              className="w-full h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
            >
              Pay KES 50 with M-Pesa
            </Button>
          )}

          <p className="text-xs text-center text-gray-400">
            You will receive an M-Pesa prompt on your phone.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}

function AcceptedUnlockedView({ task }: any) {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-4 bg-green-600 text-white shadow-sm sticky top-0 z-10 rounded-b-3xl mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 p-1.5 rounded-full">
              <CheckCircle size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">Errand Started</span>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <div className="h-12 w-12 rounded-full bg-white text-green-600 flex items-center justify-center font-bold text-lg">
              {(task.acceptedProvider?.name ?? "C").charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">{task.acceptedProvider?.name ?? "Customer"}</h2>
              <p className="text-green-100 text-sm">Customer</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/messages/${task.id}`}>
                <Button size="icon" className="rounded-full bg-white text-green-600 hover:bg-gray-100 shadow-sm">
                  <MessageSquare size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Customer Details Card */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={16} className="text-gray-400" /> Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Mobile</span>
                <span className="font-medium text-gray-900">
                  {task.acceptedProvider?.phone ?? "Contact unlocked"}
                </span>
              </div>


            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-2">{task.title}</h2>
            <div className="flex gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                {task.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{task.description}</p>

            <div className="bg-gray-50 p-3 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600">
                Remember to confirm the payment method (Cash or M-Pesa) with <strong>{task.customer.name}</strong> before starting the work.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setLocation("/errander/home")}
            className="w-full h-12 rounded-xl font-bold bg-gray-900 text-white mt-4"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
