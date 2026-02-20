import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Loader2, Phone, MapPin, Briefcase, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState({ phone: "", locationId: "", areaId: "" });
  const [step2, setStep2] = useState({ businessName: "", businessLocation: "", serviceAreaId: "" });
  const [step3SelectedIds, setStep3SelectedIds] = useState<number[]>([]);

  // Load status so we can skip completed steps
  const { data: status } = useApiQuery<any>(["onboarding-status"], "/onboarding/status");

  // Load categories for step 3
  const { data: categories } = useApiQuery<any[]>(["categories"], "/tasks/categories", { enabled: step === 3 });

  // Step mutations
  const contactMutation = useApiMutation<any, any>(() => "/onboarding/contact", {
    onSuccess: () => { toast({ description: "Contact info saved." }); setStep(2); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const spInfoMutation = useApiMutation<any, any>(() => "/onboarding/sp-info", {
    onSuccess: () => { toast({ description: "Business info saved." }); setStep(3); },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const servicesMutation = useApiMutation<any, any>(() => "/onboarding/services", {
    onSuccess: () => {
      toast({ title: "Complete!", description: "Your profile is now set up." });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      setLocation("/errander/verification-pending");
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const toggleCategory = (id: number) => {
    setStep3SelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const progressPct = ((step - 1) / 3) * 100;

  const stepLabels = ["Contact Info", "Business Info", "Services"];

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3 sticky top-0 bg-white z-10">
          <Link href="/errander/home">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Complete Your Profile</h1>
            <p className="text-xs text-gray-500">Step {step} of 3 — {stepLabels[step - 1]}</p>
          </div>
          <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {Math.round(progressPct)}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* ── Step 1: Contact Info ─────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                Let's start with your contact details so customers can reach you.
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Phone size={14} /> Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+254 712 345 678"
                  className="h-12 rounded-xl"
                  value={step1.phone}
                  onChange={(e) => setStep1({ ...step1, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><MapPin size={14} /> City / Town</Label>
                <Input
                  placeholder="e.g. Nairobi"
                  className="h-12 rounded-xl"
                  value={step1.locationId}
                  onChange={(e) => setStep1({ ...step1, locationId: e.target.value })}
                />
                <p className="text-xs text-gray-400">Enter your city name (location ID lookup coming soon)</p>
              </div>

              <Button
                onClick={() => {
                  if (!step1.phone) {
                    toast({ description: "Please enter your phone number.", variant: "destructive" });
                    return;
                  }
                  contactMutation.mutate({ phone: step1.phone });
                }}
                disabled={contactMutation.isPending}
                className="w-full h-12 rounded-xl font-bold mt-4"
              >
                {contactMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Next Step →
              </Button>
            </div>
          )}

          {/* ── Step 2: Business Info ────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                Tell us about your business or trade.
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Briefcase size={14} /> Business / Trade Name</Label>
                <Input
                  placeholder="e.g. Clean Pro Services"
                  className="h-12 rounded-xl"
                  value={step2.businessName}
                  onChange={(e) => setStep2({ ...step2, businessName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><MapPin size={14} /> Business Location</Label>
                <Input
                  placeholder="e.g. Westlands, Nairobi"
                  className="h-12 rounded-xl"
                  value={step2.businessLocation}
                  onChange={(e) => setStep2({ ...step2, businessLocation: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    spInfoMutation.mutate({
                      businessName: step2.businessName,
                      businessLocation: step2.businessLocation,
                    });
                  }}
                  disabled={spInfoMutation.isPending}
                  className="flex-1 h-12 rounded-xl font-bold"
                >
                  {spInfoMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Next Step →
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Services ─────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                Select the service categories you offer. You can offer multiple.
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-3">
                {categories?.length ? categories.map((cat: any) => {
                  const selected = step3SelectedIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${selected
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                        }`}
                    >
                      {selected && <CheckCircle size={12} className="inline mr-1" />}
                      {cat.name}
                    </button>
                  );
                }) : (
                  // Static fallback if no categories endpoint
                  [
                    { id: 1, name: "Cleaning" },
                    { id: 2, name: "Delivery" },
                    { id: 3, name: "Repair & Maintenance" },
                    { id: 4, name: "Moving" },
                    { id: 5, name: "Beauty & Wellness" },
                    { id: 6, name: "Errands & Shopping" },
                  ].map((cat) => {
                    const selected = step3SelectedIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${selected
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                          }`}
                      >
                        {selected && <CheckCircle size={12} className="inline mr-1" />}
                        {cat.name}
                      </button>
                    );
                  })
                )}
              </div>

              {step3SelectedIds.length > 0 && (
                <p className="text-xs text-gray-500 text-center">
                  {step3SelectedIds.length} service{step3SelectedIds.length > 1 ? "s" : ""} selected
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl">
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (step3SelectedIds.length === 0) {
                      toast({ description: "Please select at least one service.", variant: "destructive" });
                      return;
                    }
                    servicesMutation.mutate({ categoryIds: step3SelectedIds });
                  }}
                  disabled={servicesMutation.isPending}
                  className="flex-1 h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white"
                >
                  {servicesMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Submit →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
