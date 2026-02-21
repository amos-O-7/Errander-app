import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Calendar, Camera, Check, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  categoryId: string;
  errandId: string;
  serviceTypeId: string;
  locationId: string;
  areaId: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  termsAccepted: boolean;
}

export default function PostTask() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    categoryId: "",
    errandId: "",
    serviceTypeId: "",
    locationId: "",
    areaId: "",
    description: "",
    preferredDate: "",
    preferredTime: "",
    termsAccepted: false,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => (step > 1 ? setStep(step - 1) : setLocation("/customer/home"));

  const updateForm = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const createTaskMutation = useApiMutation<any, any>("/tasks", {
    onSuccess: (data) => {
      toast({ title: "Errand Posted!", description: "Your errand is now live and accepting bids." });
      setLocation(`/customer/errand/${data.id}/bids`);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to post errand", description: error.message, variant: "destructive" });
    },
  });

  const handlePost = () => {
    const preferredStartDatetime =
      formData.preferredDate && formData.preferredTime
        ? `${formData.preferredDate}T${formData.preferredTime}:00`
        : null;

    createTaskMutation.mutate({
      errandId: parseInt(formData.errandId),
      description: formData.description || "No description",
      locationId: parseInt(formData.locationId),
      areaId: parseInt(formData.areaId),
      serviceTypeId: parseInt(formData.serviceTypeId),
      preferredStartDateTime: preferredStartDatetime,
    });
  };

  const canProceedStep1 = !!formData.errandId && !!formData.serviceTypeId;
  const canProceedStep2 = !!formData.areaId && !!formData.preferredDate && !!formData.preferredTime;
  const canProceedStep3 = formData.termsAccepted;

  return (
    <MobileLayout hideNav>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-4 bg-background sticky top-0 z-10 dark:border-gray-800">
          <button onClick={prevStep} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-heading font-bold text-lg">
              {step === 1 && "What do you need?"}
              {step === 2 && "Where & When?"}
              {step === 3 && "Review & Submit"}
            </h1>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 w-10 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 1 && <StepDetails formData={formData} updateForm={updateForm} />}
          {step === 2 && <StepLocation formData={formData} updateForm={updateForm} />}
          {step === 3 && <StepReview formData={formData} updateForm={updateForm} isPosting={createTaskMutation.isPending} onPost={handlePost} />}
        </div>

        {/* Footer — hidden on step 3 since StepReview has its own submit */}
        {step < 3 && (
          <div className="p-4 bg-background border-t dark:border-gray-800">
            <Button
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
              }
              onClick={nextStep}
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
            >
              Next Step
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

// ─── Step 1: Category → Errand → Service Type ─────────────────────────────────

function StepDetails({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (u: Partial<FormData>) => void;
}) {
  const { data: categoriesRes, isLoading: loadingCats } = useApiQuery<any>([
    "categories",
  ], "/categories");

  const { data: errandsRes, isLoading: loadingErrands } = useApiQuery<any>(
    ["errands", formData.categoryId],
    `/categories/${formData.categoryId}/errands`,
    { enabled: !!formData.categoryId }
  );

  const { data: serviceTypes, isLoading: loadingST } = useApiQuery<any[]>(
    ["service-types"],
    "/servicetypes"
  );

  const categories: any[] = (categoriesRes as any)?.data ?? [];
  const errands: any[] = (errandsRes as any)?.errands ?? [];

  const selectClass =
    "w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-900 dark:text-white transition-all px-4 focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Category */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Service Errand Category <span className="text-red-500">*</span>
        </Label>
        <select
          className={selectClass}
          value={formData.categoryId}
          onChange={(e) => updateForm({ categoryId: e.target.value, errandId: "", serviceTypeId: "" })}
        >
          <option value="">{loadingCats ? "Loading categories..." : "Select Errand Category"}</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id.toString()}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Errand */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Select Errand <span className="text-red-500">*</span>
        </Label>
        <select
          className={selectClass}
          value={formData.errandId}
          disabled={!formData.categoryId}
          onChange={(e) => updateForm({ errandId: e.target.value })}
        >
          <option value="">{loadingErrands ? "Loading errands..." : "Select an errand"}</option>
          {errands.map((e: any) => (
            <option key={e.id} value={e.id.toString()}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {/* Service Type — loaded from DB, same as web app */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Service Type <span className="text-red-500">*</span>
        </Label>
        {loadingST ? (
          <p className="text-sm text-gray-500">Loading service types...</p>
        ) : (
          <div className="space-y-2">
            {(serviceTypes ?? []).map((st: any) => (
              <label key={st.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="service_type_id"
                  value={st.id.toString()}
                  checked={formData.serviceTypeId === st.id.toString()}
                  onChange={() => updateForm({ serviceTypeId: st.id.toString() })}
                  className="text-primary border-gray-300 focus:ring-primary dark:border-gray-600"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{st.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Location → Area → Description → Date & Time ─────────────────────

function StepLocation({
  formData,
  updateForm,
}: {
  formData: FormData;
  updateForm: (u: Partial<FormData>) => void;
}) {
  const { data: locations, isLoading: loadingLocs } = useApiQuery<any[]>(
    ["locations"],
    "/locations"
  );

  const { data: areas, isLoading: loadingAreas } = useApiQuery<any[]>(
    ["areas", formData.locationId],
    `/locations/${formData.locationId}/areas`,
    { enabled: !!formData.locationId }
  );

  const selectClass =
    "w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-900 dark:text-white transition-all px-4 focus:outline-none focus:ring-2 focus:ring-primary/50";

  const inputClass =
    "w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Location */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Location <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
          <select
            className={`${selectClass} pl-10`}
            value={formData.locationId}
            onChange={(e) => updateForm({ locationId: e.target.value, areaId: "" })}
          >
            <option value="">{loadingLocs ? "Loading locations..." : "Select Location"}</option>
            {(locations ?? []).map((l: any) => (
              <option key={l.id} value={l.id.toString()}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Area */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Area <span className="text-red-500">*</span>
        </Label>
        <select
          className={selectClass}
          value={formData.areaId}
          disabled={!formData.locationId}
          onChange={(e) => updateForm({ areaId: e.target.value })}
        >
          <option value="">{loadingAreas ? "Loading areas..." : "Select Area"}</option>
          {(areas ?? []).map((a: any) => (
            <option key={a.id} value={a.id.toString()}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Description</Label>
        <Textarea
          placeholder="Describe what you need help with"
          className="min-h-[100px] rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white resize-none p-4"
          value={formData.description}
          onChange={(e) => updateForm({ description: e.target.value })}
        />
      </div>

      {/* Preferred Date & Time — matches web app, two separate fields */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Preferred Start Date & Time <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500 uppercase font-bold">Date</Label>
            <Input
              type="date"
              className={inputClass}
              value={formData.preferredDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateForm({ preferredDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500 uppercase font-bold">Time</Label>
            <Input
              type="time"
              className={inputClass}
              value={formData.preferredTime}
              onChange={(e) => updateForm({ preferredTime: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Photo + Terms + Review ───────────────────────────────────────────

function StepReview({
  formData,
  updateForm,
  isPosting,
  onPost,
}: {
  formData: FormData;
  updateForm: (u: Partial<FormData>) => void;
  isPosting: boolean;
  onPost: () => void;
}) {
  const { data: categoriesRes } = useApiQuery<any>(["categories"], "/categories");
  const { data: errandsRes } = useApiQuery<any>(
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
  const { data: serviceTypes } = useApiQuery<any[]>(["service-types"], "/servicetypes");

  const categories: any[] = (categoriesRes as any)?.data ?? [];
  const errands: any[] = (errandsRes as any)?.errands ?? [];

  const categoryName = categories.find((c) => c.id.toString() === formData.categoryId)?.name ?? "—";
  const errandName = errands.find((e) => e.id.toString() === formData.errandId)?.name ?? "—";
  const locationName = (locations ?? []).find((l) => l.id.toString() === formData.locationId)?.name ?? "—";
  const areaName = (areas ?? []).find((a) => a.id.toString() === formData.areaId)?.name ?? "—";
  const serviceTypeName = (serviceTypes ?? []).find((s) => s.id.toString() === formData.serviceTypeId)?.name ?? "—";
  const scheduledAt =
    formData.preferredDate && formData.preferredTime
      ? `${new Date(`${formData.preferredDate}T${formData.preferredTime}`).toLocaleString()}`
      : "Not set";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Summary card */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-4 shadow-sm bg-background">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{categoryName}</span>
          <h3 className="font-bold text-lg">{errandName}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{formData.description || "No description provided."}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 block">Service Type</span>
            <span className="font-medium">{serviceTypeName}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-400 block">Location</span>
            <span className="font-medium">{areaName}, {locationName}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-400 block flex items-center gap-1"><Calendar size={12} /> Scheduled</span>
            <span className="font-medium">{scheduledAt}</span>
          </div>
        </div>
      </div>

      {/* Photo upload (optional) */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Add Photo (Optional)</Label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900 cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Camera size={20} />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload a file or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => updateForm({ termsAccepted: e.target.checked })}
          className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          I agree to the <span className="text-primary font-semibold">Terms & Conditions</span> and confirm the details above are correct.
        </span>
      </label>

      {/* Submit */}
      <Button
        disabled={!formData.termsAccepted || isPosting}
        onClick={onPost}
        className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
      >
        {isPosting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</>
        ) : (
          <><Check className="mr-2 h-4 w-4" /> Post Errand & Wait for Bids</>
        )}
      </Button>
    </div>
  );
}
