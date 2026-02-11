import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Upload, FileText, CheckCircle, User, Phone, 
  Briefcase, MapPin, Building, Calendar 
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    
    // Business Info
    businessName: "",
    serviceType: "",
    category: "",
    location: "",

    // Docs
    idNumber: "",
  });

  const handleSubmit = () => {
    // Simulate submission and go to pending state
    setLocation("/errander/verification-pending");
  };

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b flex items-center gap-3 sticky top-0 bg-white z-10">
          <Link href="/errander/home">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Complete Your Profile</h1>
            <p className="text-xs text-gray-500">Step {step} of 3</p>
          </div>
          <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {step === 1 && "Personal"}
            {step === 2 && "Business"}
            {step === 3 && "Docs"}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 leading-relaxed">
                Let's start with your personal details to verify your identity.
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    className="h-12 rounded-xl"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email"
                    placeholder="e.g. john@example.com" 
                    className="h-12 rounded-xl"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input 
                    type="tel"
                    placeholder="e.g. +254 712 345 678" 
                    className="h-12 rounded-xl"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(val) => setFormData({...formData, gender: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input 
                      type="date"
                      className="pl-10 h-12 rounded-xl"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <Label>Service Type</Label>
                   <Select onValueChange={(val) => setFormData({...formData, serviceType: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Service Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual / Freelancer</SelectItem>
                      <SelectItem value="business">Registered Business / Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.serviceType === 'business' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label>Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input 
                        placeholder="e.g. Acme Cleaning Services" 
                        className="pl-10 h-12 rounded-xl"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={() => setStep(2)} className="w-full h-12 rounded-xl font-bold mt-4">
                Next Step
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 leading-relaxed">
                Tell us about your expertise and where you operate.
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                   <Label>Primary Service Category</Label>
                   <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="repair">Repair & Maintenance</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="moving">Moving</SelectItem>
                      <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                 <div className="space-y-2">
                   <Label>Business Location</Label>
                   <Select onValueChange={(val) => setFormData({...formData, location: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                      <SelectItem value="nakuru">Nakuru</SelectItem>
                      <SelectItem value="eldoret">Eldoret</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                    Back
                 </Button>
                 <Button onClick={() => setStep(3)} className="flex-1 h-12 rounded-xl font-bold">
                    Next Step
                 </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
               <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 leading-relaxed">
                Final step! Upload your verification documents.
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                  <Label>National ID Number</Label>
                  <Input 
                    placeholder="12345678" 
                    className="h-12 rounded-xl"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">ID (Front)</Label>
                    <UploadBox label="Front" />
                  </div>
                   <div className="space-y-2">
                    <Label className="text-xs">ID (Back)</Label>
                    <UploadBox label="Back" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Full Photo (Selfie)</Label>
                  <UploadBox label="Upload Photo" icon={User} />
                </div>

                {formData.serviceType === 'business' && (
                  <>
                    <div className="space-y-2 animate-in fade-in">
                      <Label>Business Permit (Optional)</Label>
                      <UploadBox label="Upload Permit" icon={FileText} />
                    </div>
                  </>
                )}
                
                <div className="space-y-2 animate-in fade-in">
                  <Label>Business Premises Photos (Max 4)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <UploadBox label="Photo 1" icon={Building} />
                    <UploadBox label="Photo 2" icon={Building} />
                    <UploadBox label="Photo 3" icon={Building} />
                    <UploadBox label="Photo 4" icon={Building} />
                  </div>
                  <p className="text-[10px] text-gray-500">Showcase your work or premises. No contact details allowed.</p>
                </div>

                <div className="space-y-2">
                  <Label>Professional Certificate (Optional)</Label>
                  <UploadBox label="Upload Certificate" icon={FileText} />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl">
                    Back
                 </Button>
                 <Button onClick={handleSubmit} className="flex-1 h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20">
                    Submit Application
                 </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

function UploadBox({ label, icon: Icon = Upload }: any) {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-24">
      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm mb-1">
          <Icon size={16} className="text-blue-600" />
      </div>
      <p className="text-xs font-bold text-gray-700">{label}</p>
    </div>
  );
}
