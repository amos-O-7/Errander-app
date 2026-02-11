import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Phone, Shield, FileText, UserCheck } from "lucide-react";
import { Link } from "wouter";

export default function VerificationPending() {
  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-white">
        {/* Header Image/Icon */}
        <div className="bg-blue-600 text-white p-8 pt-12 rounded-b-[40px] text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
               <Shield size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading mb-2">Application Received</h1>
            <p className="text-blue-100 text-sm">Thank you for signing up to be an Errander!</p>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
             <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          {/* Status Card */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-start gap-4">
            <Clock className="text-orange-500 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-orange-900 text-lg mb-1">Pending Verification</h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                We've received your profile details. Our team is currently reviewing your documents.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-lg">What Happens Next?</h3>
            
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:h-full before:w-[2px] before:bg-gray-100">
              
              <div className="relative">
                <div className="absolute -left-8 top-0 bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center border-2 border-white ring-2 ring-green-50">
                   <CheckCircle size={12} />
                </div>
                <h4 className="font-bold text-gray-900">Sign Up Completed</h4>
                <p className="text-xs text-gray-500 mt-1">Basic details received.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-0 bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center border-2 border-white ring-2 ring-green-50">
                   <FileText size={12} />
                </div>
                <h4 className="font-bold text-gray-900">Documents Submitted</h4>
                <p className="text-xs text-gray-500 mt-1">ID and certificates uploaded.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-0 bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center border-2 border-white ring-2 ring-blue-50 animate-pulse">
                   <span className="text-[10px] font-bold">3</span>
                </div>
                <h4 className="font-bold text-gray-900">Manual Vetting</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Our team will verify your documents manually.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-0 bg-gray-200 text-gray-500 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">
                   <Phone size={12} />
                </div>
                <h4 className="font-bold text-gray-900">Phone Interview</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We will call you on <strong>+254 7XX XXX XXX</strong> to confirm your details.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-center">
             <p className="text-xs text-gray-500 mb-2">Have questions?</p>
             <Button variant="link" className="text-blue-600 h-auto p-0 font-bold">Contact Support</Button>
          </div>

        </div>

        {/* Demo Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-[10px] text-gray-400 mb-2">FOR PROTOTYPE DEMO ONLY</p>
          <Link href="/errander/home">
            <Button variant="outline" className="w-full">
              Simulate "Approved" (Skip to Dashboard)
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}
