import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Phone, Mail, MapPin, Shield, FileText, CheckCircle, Upload } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function PersonalInfo() {
  const searchParams = new URLSearchParams(window.location.search);
  const role = searchParams.get('role') || "customer"; // customer or errander
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: role === 'customer' ? "Alex Kemboi" : "Errander Prime",
    email: role === 'customer' ? "alex.k@example.com" : "runner@example.com",
    phone: role === 'customer' ? "+254 712 345 678" : "+254 799 888 777",
    address: "Kilimani, Nairobi",
    gender: "Male",
    dob: "1995-05-15",
    
    // Errander Specific
    idNumber: "12345678",
    nextOfKin: "Jane Doe (+254 722 000 000)",
    
    // Business Info
    businessName: "Errander Prime Services",
    serviceType: "Individual",
    category: "Delivery",
    location: "Nairobi",
    
    goodConduct: {
      status: "verified", // verified, pending, expired
      expiry: "Dec 2025"
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved successfully.",
    });
  };

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-4 bg-white border-b shadow-sm sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile?role=${role}`}>
              <button className="p-2 hover:bg-gray-100 rounded-full -ml-2">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="font-bold text-lg">Personal Information</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="font-bold text-primary"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Personal Information Section */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <User size={18} className="text-gray-400" /> Personal Information
            </h2>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Full Name</Label>
                <Input 
                  value={formData.fullName} 
                  disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="h-10 bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <Input 
                    value={formData.email} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-10 pl-9 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <Input 
                    value={formData.phone} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-10 pl-9 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              
              {role === 'errander' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Gender</Label>
                      <Input 
                        value={formData.gender} 
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="h-10 bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Date of Birth</Label>
                      <Input 
                        type="date"
                        value={formData.dob} 
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        className="h-10 bg-gray-50 border-gray-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">National ID Number</Label>
                    <Input 
                      value={formData.idNumber} 
                      disabled={true} 
                      className="h-10 bg-gray-100 border-gray-200 text-gray-500"
                    />
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <CheckCircle size={10} className="text-green-500" /> Verified
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Next of Kin</Label>
                    <Input 
                      value={formData.nextOfKin} 
                      disabled={!isEditing}
                      onChange={(e) => setFormData({...formData, nextOfKin: e.target.value})}
                      className="h-10 bg-gray-50 border-gray-200"
                    />
                  </div>
                </>
              )}

              {role === 'customer' && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Address / Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <Input 
                      value={formData.address} 
                      disabled={!isEditing}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="h-10 pl-9 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Errander Business Information Section */}
          {role === 'errander' && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4 animate-in slide-in-from-bottom-5">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Shield size={18} className="text-blue-500" /> Business Information
              </h2>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Business Name</Label>
                  <Input 
                    value={formData.businessName} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="h-10 bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Service Type</Label>
                    <Input 
                      value={formData.serviceType} 
                      disabled={!isEditing}
                      className="h-10 bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Category</Label>
                    <Input 
                      value={formData.category} 
                      disabled={!isEditing}
                      className="h-10 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                 <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <Input 
                      value={formData.location} 
                      disabled={!isEditing}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="h-10 pl-9 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50">
                   <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-gray-500">Certificate of Good Conduct</Label>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        VERIFIED
                      </span>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white rounded-lg border flex items-center justify-center text-blue-500">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">Good_Conduct_Cert.pdf</p>
                          <p className="text-[10px] text-gray-400">Expires: {formData.goodConduct.expiry}</p>
                        </div>
                      </div>
                      {isEditing && (
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Upload size={12} className="mr-1" /> Update
                        </Button>
                      )}
                   </div>
                </div>

                <div className="pt-2 border-t border-gray-50">
                   <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-gray-500">Business Premises Photos</Label>
                      <Link href="/errander/business-photos">
                        <Button variant="link" size="sm" className="h-6 text-xs text-blue-600 px-0">
                          Manage
                        </Button>
                      </Link>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-200 aspect-video flex items-center justify-center relative overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1581578731117-104f2a417953?w=500&auto=format&fit=crop&q=60" alt="Business 1" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-200 aspect-video flex items-center justify-center relative overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60" alt="Business 2" className="w-full h-full object-cover rounded-lg opacity-50" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Pending</span>
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="pt-2 border-t border-gray-50">
                   <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-gray-500">Business Permit</Label>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white rounded-lg border flex items-center justify-center text-blue-500">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">Business_Permit_2025.pdf</p>
                          <p className="text-[10px] text-gray-400">Verified</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
