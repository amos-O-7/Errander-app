import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Calendar, Banknote, Camera, Check, X, Wrench, Home, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  categoryId: string;
  errandId: string;
  description: string;
  serviceTypeId: string;
  locationId: string;
  areaId: string;
  budget: string;
  preferredStartDateTime: string;
  isUrgent: boolean;
}

export default function PostTask() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    categoryId: "",
    errandId: "",
    description: "",
    serviceTypeId: "indoor",
    locationId: "",
    areaId: "",
    budget: "",
    preferredStartDateTime: "",
    isUrgent: false
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => step > 1 ? setStep(step - 1) : setLocation("/customer/home");

  const updateForm = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const createTaskMutation = useApiMutation<any, any>("/tasks", {
    onSuccess: (data) => {
      toast({
        title: "Errand Posted!",
        description: "Your errand is now live and accepting bids.",
      });
      setLocation(`/customer/errand/${data.id}/bids`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post errand",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handlePost = () => {
    createTaskMutation.mutate({
      errandId: parseInt(formData.errandId),
      description: formData.description,
      locationId: parseInt(formData.locationId),
      areaId: parseInt(formData.areaId),
      serviceTypeId: formData.serviceTypeId === "indoor" ? 1 : formData.serviceTypeId === "workshop" ? 2 : 3,
      preferredStartDateTime: formData.isUrgent ? new Date().toISOString() : formData.preferredStartDateTime || null,
      budget: parseFloat(formData.budget)
    });
  };

  return (
    <MobileLayout hideNav>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10">
          <button onClick={prevStep} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-heading font-bold text-lg">
              {step === 1 && "What do you need?"}
              {step === 2 && "Where & How?"}
              {step === 3 && "Budget & Time"}
              {step === 4 && "Review Errand"}
            </h1>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 1 && <StepDetails formData={formData} updateForm={updateForm} />}
          {step === 2 && <StepLocation formData={formData} updateForm={updateForm} />}
          {step === 3 && <StepBudget formData={formData} updateForm={updateForm} />}
          {step === 4 && <StepReview formData={formData} />}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t">
          <Button
            disabled={createTaskMutation.isPending || (step === 1 && !formData.errandId) || (step === 2 && !formData.areaId)}
            onClick={step === 4 ? handlePost : nextStep}
            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
          >
            {createTaskMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : step === 4 ? (
              "Post Errand & Wait for Bids"
            ) : (
              "Next Step"
            )}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

function StepDetails({ formData, updateForm }: { formData: FormData; updateForm: (updates: Partial<FormData>) => void }) {
  const { data: categories, isLoading: loadingCats } = useApiQuery<any[]>(["categories"], "/categories");
  const { data: errands, isLoading: loadingErrands } = useApiQuery<any[]>(
    ["errands", formData.categoryId],
    `/categories/${formData.categoryId}/errands`,
    { enabled: !!formData.categoryId }
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Service Errand Category <span className="text-red-500">*</span></Label>
        <select
          className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4"
          value={formData.categoryId}
          onChange={(e) => updateForm({ categoryId: e.target.value, errandId: "" })}
        >
          <option value="">{loadingCats ? "Loading categories..." : "Select Errand Category"}</option>
          {categories?.map(c => (
            <option key={c.id} value={c.id.toString()}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Select Errand <span className="text-red-500">*</span></Label>
        <select
          className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4"
          value={formData.errandId}
          disabled={!formData.categoryId}
          onChange={(e) => updateForm({ errandId: e.target.value })}
        >
          <option value="">{loadingErrands ? "Loading errands..." : "Select an errand"}</option>
          {errands?.map(e => (
            <option key={e.id} value={e.id.toString()}>{e.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Description</Label>
        <Textarea
          placeholder="Describe what you need help with"
          className="min-h-[120px] rounded-xl border-gray-200 resize-none p-4"
          value={formData.description}
          onChange={(e) => updateForm({ description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Add Photos (Optional)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
            <Camera size={24} />
          </div>
          <p className="text-sm font-medium text-gray-900">Upload a file or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}

function StepLocation({ formData, updateForm }: { formData: FormData; updateForm: (updates: Partial<FormData>) => void }) {
  const { data: locations, isLoading: loadingLocs } = useApiQuery<any[]>(["locations"], "/locations");
  const { data: areas, isLoading: loadingAreas } = useApiQuery<any[]>(
    ["areas", formData.locationId],
    `/locations/${formData.locationId}/areas`,
    { enabled: !!formData.locationId }
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Service Type <span className="text-red-500">*</span></Label>
        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={() => updateForm({ serviceTypeId: "workshop" })}
            className={`border p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-colors ${formData.serviceTypeId === 'workshop' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
          >
            <Wrench size={20} className={formData.serviceTypeId === 'workshop' ? 'text-primary' : 'text-gray-400'} />
            <span className={`text-xs font-bold text-center ${formData.serviceTypeId === 'workshop' ? 'text-primary' : 'text-gray-600'}`}>Workshop Only</span>
          </div>
          <div
            onClick={() => updateForm({ serviceTypeId: "indoor" })}
            className={`border p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-colors ${formData.serviceTypeId === 'indoor' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
          >
            <Home size={20} className={formData.serviceTypeId === 'indoor' ? 'text-primary' : 'text-gray-400'} />
            <span className={`text-xs font-bold text-center ${formData.serviceTypeId === 'indoor' ? 'text-primary' : 'text-gray-600'}`}>Indoor Only</span>
          </div>
          <div
            onClick={() => updateForm({ serviceTypeId: "outfield" })}
            className={`border p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-colors ${formData.serviceTypeId === 'outfield' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
          >
            <MapPin size={20} className={formData.serviceTypeId === 'outfield' ? 'text-primary' : 'text-gray-400'} />
            <span className={`text-xs font-bold text-center ${formData.serviceTypeId === 'outfield' ? 'text-primary' : 'text-gray-600'}`}>Outfield</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Location <span className="text-red-500">*</span></Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <select
            className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-10 pr-4 appearance-none"
            value={formData.locationId}
            onChange={(e) => updateForm({ locationId: e.target.value, areaId: "" })}
          >
            <option value="">{loadingLocs ? "Loading locations..." : "Select Location"}</option>
            {locations?.map(l => (
              <option key={l.id} value={l.id.toString()}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Area <span className="text-red-500">*</span></Label>
        <select
          className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4"
          value={formData.areaId}
          disabled={!formData.locationId}
          onChange={(e) => updateForm({ areaId: e.target.value })}
        >
          <option value="">{loadingAreas ? "Loading areas..." : "Select Area"}</option>
          {areas?.map(a => (
            <option key={a.id} value={a.id.toString()}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Fake Map */}
      <div className="h-32 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm z-10">Map Preview</span>
      </div>
    </div>
  );
}

function StepBudget({ formData, updateForm }: { formData: FormData; updateForm: (updates: Partial<FormData>) => void }) {
  const [isRecurring, setIsRecurring] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-4">
        <Label className="text-base font-semibold">When do you need this?</Label>

        {/* Type Toggle */}
        <div className="bg-gray-100 p-1 rounded-xl flex mb-4">
          <button
            onClick={() => setIsRecurring(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isRecurring ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            One-time
          </button>
          <button
            onClick={() => setIsRecurring(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRecurring ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
          >
            Recurring
          </button>
        </div>

        {isRecurring ? (
          <div className="bg-blue-50 p-4 rounded-xl space-y-4 border border-blue-100">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-blue-800 uppercase">Frequency</Label>
              <select className="w-full h-10 rounded-lg border-blue-200 bg-white px-3 text-sm">
                <option>Daily</option>
                <option>Weekly (Every Friday)</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-blue-800 uppercase">Start Date</Label>
                <Input type="date" className="h-10 bg-white border-blue-200" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-blue-800 uppercase">Time</Label>
                <Input type="time" className="h-10 bg-white border-blue-200" />
              </div>
            </div>
            <div className="flex gap-2 items-center text-xs text-blue-600 font-medium">
              <Calendar size={14} />
              <span>Repeats for 4 occurrences</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => updateForm({ isUrgent: true })}
              className={`border-2 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all ${formData.isUrgent ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
            >
              <span className={`font-bold ${formData.isUrgent ? 'text-primary' : 'text-gray-700'}`}>ASAP</span>
              <span className="text-xs text-center text-gray-600">Urgent (+ KES 100)</span>
            </div>
            <div
              onClick={() => updateForm({ isUrgent: false })}
              className={`border p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 relative overflow-hidden group transition-all ${!formData.isUrgent && formData.preferredStartDateTime ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}
            >
              <input
                type="datetime-local"
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={formData.preferredStartDateTime}
                onChange={(e) => updateForm({ preferredStartDateTime: e.target.value, isUrgent: false })}
              />
              <span className={`font-bold transition-all ${!formData.isUrgent && formData.preferredStartDateTime ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>Schedule</span>
              <span className="text-xs text-center text-gray-500">
                {formData.preferredStartDateTime ? new Date(formData.preferredStartDateTime).toLocaleDateString() : "Pick date & time"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Your Budget (KES)</Label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 font-bold text-gray-500">KES</span>
          <Input
            type="number"
            placeholder="500"
            className="pl-14 h-12 rounded-xl border-gray-200 text-lg font-bold"
            value={formData.budget}
            onChange={(e) => updateForm({ budget: e.target.value })}
          />
        </div>
        <p className="text-xs text-gray-500">Suggested: KES 400 - 600 based on distance.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Payment Method</Label>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 border border-primary bg-primary/5 px-4 py-2 rounded-full cursor-pointer">
            <div className="h-4 w-4 rounded-full border border-primary bg-primary" />
            <span className="text-sm font-bold text-gray-800">M-Pesa</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full cursor-pointer hover:border-gray-300">
            <div className="h-4 w-4 rounded-full border border-gray-300" />
            <span className="text-sm text-gray-600">Cash</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Errand Budget</span>
          <span className="font-medium">KES {formData.budget || "0"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service Fee</span>
          <span className="font-medium">KES 50</span>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">KES {parseInt(formData.budget || "0") + 50}</span>
        </div>
      </div>
    </div>
  );
}

function StepReview({ formData }: { formData: FormData }) {
  const { data: categories } = useApiQuery<any[]>(["categories"], "/categories");
  const { data: errands } = useApiQuery<any[]>(
    ["errands", formData.categoryId],
    `/categories/${formData.categoryId}/errands`,
    { enabled: !!formData.categoryId }
  );
  const { data: locations } = useApiQuery<any[]>(["locations"], "/locations");
  const { data: areas } = useApiQuery<any[]>(
    ["areas", formData.locationId],
    `/locations/${formData.locationId}/areas`,
    { enabled: !!formData.locationId }
  );

  const categoryName = categories?.find(c => c.id.toString() === formData.categoryId)?.name;
  const errandName = errands?.find(e => e.id.toString() === formData.errandId)?.name;
  const locationName = locations?.find(l => l.id.toString() === formData.locationId)?.name;
  const areaName = areas?.find(a => a.id.toString() === formData.areaId)?.name;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3 items-center">
        <div className="bg-green-100 p-2 rounded-full text-green-600">
          <Check size={16} />
        </div>
        <div>
          <h3 className="font-bold text-green-800 text-sm">Ready to post!</h3>
          <p className="text-xs text-green-600">Runners nearby will see this immediately.</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{categoryName || "Errand Category"}</span>
          <h3 className="font-bold text-lg">{errandName || "Errand Name"}</h3>
          <p className="text-gray-600 text-sm mt-1">{formData.description || "No description provided."}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 items-center text-sm text-gray-600">
            {formData.serviceTypeId === 'workshop' ? <Wrench size={16} /> : formData.serviceTypeId === 'indoor' ? <Home size={16} /> : <MapPin size={16} />}
            <span className="capitalize">{formData.serviceTypeId}</span>
          </div>
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <Calendar size={16} />
            <span>{formData.isUrgent ? "ASAP" : formData.preferredStartDateTime ? new Date(formData.preferredStartDateTime).toLocaleString() : "Not scheduled"}</span>
          </div>
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <Banknote size={16} />
            <span>KES {parseInt(formData.budget || "0") + 50}</span>
          </div>
        </div>

        <div className="flex gap-2 items-center text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg w-fit">
          <Check size={14} />
          <span className="font-bold text-xs">Paying via M-Pesa</span>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="h-8 w-px bg-gray-200" />
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="text-xs text-gray-400 block">From</span>
                <span className="font-medium">{areaName ? `${areaName}, ${locationName}` : "Location not selected"}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Current Status</span>
                <span className="font-medium">Ready to be published</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
