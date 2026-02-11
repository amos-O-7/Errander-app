import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Calendar, Banknote, Camera, Check, X, Wrench, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function PostTask() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useLocation();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => step > 1 ? setStep(step - 1) : setLocation("/customer/home");

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
          {step === 1 && <StepDetails />}
          {step === 2 && <StepLocation />}
          {step === 3 && <StepBudget />}
          {step === 4 && <StepReview />}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t">
          <Button 
            onClick={step === 4 ? () => setLocation("/customer/errand/123/bids") : nextStep} 
            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
          >
            {step === 4 ? "Post Errand & Wait for Bids" : "Next Step"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

function StepDetails() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Service Errand Category <span className="text-red-500">*</span></Label>
        <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4">
          <option>Select Errand Category</option>
          <option>Cleaning</option>
          <option>Delivery</option>
          <option>Shopping</option>
          <option>Repair</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Select Errand <span className="text-red-500">*</span></Label>
        <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4">
          <option>Select an errand</option>
          <option>Standard Cleaning</option>
          <option>Deep Cleaning</option>
          <option>Move-in/Move-out</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Description</Label>
        <Textarea 
          placeholder="Describe what you need help with" 
          className="min-h-[120px] rounded-xl border-gray-200 resize-none p-4"
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

function StepLocation() {
  const [serviceType, setServiceType] = useState("indoor");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Service Type <span className="text-red-500">*</span></Label>
        <div className="grid grid-cols-3 gap-2">
          <div 
            onClick={() => setServiceType("workshop")}
            className={`border p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-colors ${serviceType === 'workshop' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
          >
            <Wrench size={20} className={serviceType === 'workshop' ? 'text-primary' : 'text-gray-400'} />
            <span className={`text-xs font-bold text-center ${serviceType === 'workshop' ? 'text-primary' : 'text-gray-600'}`}>Workshop Only</span>
          </div>
          <div 
            onClick={() => setServiceType("indoor")}
            className={`border p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-colors ${serviceType === 'indoor' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
          >
            <Home size={20} className={serviceType === 'indoor' ? 'text-primary' : 'text-gray-400'} />
            <span className={`text-xs font-bold text-center ${serviceType === 'indoor' ? 'text-primary' : 'text-gray-600'}`}>Indoor Only</span>
          </div>
          <div 
            onClick={() => setServiceType("outfield")}
            className={`border p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-colors ${serviceType === 'outfield' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
          >
            <MapPin size={20} className={serviceType === 'outfield' ? 'text-primary' : 'text-gray-400'} />
            <span className={`text-xs font-bold text-center ${serviceType === 'outfield' ? 'text-primary' : 'text-gray-600'}`}>Outfield</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Location <span className="text-red-500">*</span></Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <select className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-10 pr-4 appearance-none">
            <option>Select Location</option>
            <option>Nairobi</option>
            <option>Mombasa</option>
            <option>Kisumu</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Area <span className="text-red-500">*</span></Label>
        <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4">
          <option>Select Area</option>
          <option>Kilimani</option>
          <option>Westlands</option>
          <option>CBD</option>
          <option>Karen</option>
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

function StepBudget() {
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
            <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer">
              <span className="font-bold text-primary">ASAP</span>
              <span className="text-xs text-center text-gray-600">Urgent (+ KES 100)</span>
            </div>
            <div className="border border-gray-200 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 relative overflow-hidden group">
               <input type="datetime-local" className="absolute inset-0 opacity-0 cursor-pointer" />
               <span className="font-bold text-gray-700 group-hover:text-primary">Schedule</span>
               <span className="text-xs text-center text-gray-500">Pick date & time</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Your Budget (KES)</Label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 font-bold text-gray-500">KES</span>
          <Input type="number" placeholder="500" className="pl-14 h-12 rounded-xl border-gray-200 text-lg font-bold" />
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
          <span className="font-medium">KES 500</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service Fee</span>
          <span className="font-medium">KES 50</span>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">KES 550</span>
        </div>
      </div>
    </div>
  );
}

function StepReview() {
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
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Errand</span>
          <h3 className="font-bold text-lg">Pick up package from CBD</h3>
          <p className="text-gray-600 text-sm mt-1">Need a small box picked up from I&M building reception and delivered to Westlands.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <Home size={16} />
            <span>In-House</span>
          </div>
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <Calendar size={16} />
            <span>ASAP</span>
          </div>
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <Banknote size={16} />
            <span>KES 550</span>
          </div>
        </div>
        
        <div className="flex gap-2 items-center text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg w-fit">
          <Check size={14} />
          <span className="font-bold text-xs">Paying via M-Pesa</span>
        </div>

        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border-none">
             Add to Google Calendar
           </Button>
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
                 <span className="font-medium">I&M Building, CBD</span>
               </div>
               <div>
                 <span className="text-xs text-gray-400 block">To</span>
                 <span className="font-medium">Westlands Square</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
