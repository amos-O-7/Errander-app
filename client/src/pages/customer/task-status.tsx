import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, MapPin, User, Loader2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function TaskStatus() {
  const [status, setStatus] = useState("searching"); // searching, assigned, progress, completed
  const [, setLocation] = useLocation();

  // Simulate status progression
  useEffect(() => {
    const timer1 = setTimeout(() => setStatus("assigned"), 3000);
    return () => clearTimeout(timer1);
  }, []);

  return (
    <MobileLayout hideNav>
      <div className="relative h-full flex flex-col">
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/customer/home">
            <button className="h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600">
              <ArrowLeft size={20} />
            </button>
          </Link>
        </div>

        {/* Map Background (simulated) */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:24px_24px]"></div>
          
          {/* Pulsing Dot in Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
               <div className={`h-24 w-24 bg-primary/20 rounded-full animate-ping ${status === 'searching' ? 'opacity-100' : 'opacity-0'}`}></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full shadow-lg border-2 border-white"></div>
             </div>
          </div>
        </div>

        {/* Bottom Card */}
        <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 z-20 animate-in slide-in-from-bottom-10 duration-500">
          
          {status === "searching" ? (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
              <div>
                <h2 className="text-xl font-bold">Finding the perfect errander...</h2>
                <p className="text-gray-500">We're notifying providers near Kilimani.</p>
              </div>
              <Button variant="outline" className="rounded-full border-gray-200">Cancel Request</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">David is on the way</h2>
                  <p className="text-primary font-medium">Arriving in 12 mins</p>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                  #ER-8821
                </div>
              </div>

              {/* Runner Profile */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=David+M&background=random" alt="Runner" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base">David M.</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="text-yellow-500">★ 4.9</span>
                    <span>• 142 errands</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/chat?role=customer">
                    <button className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary shadow-sm">
                      <MessageSquare size={18} />
                    </button>
                  </Link>
                  <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                    <Phone size={18} />
                  </button>
                </div>
              </div>

              {/* Errand Summary */}
              <div className="space-y-2 pb-4">
                 <div className="flex gap-3 items-start">
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                    <p className="text-sm text-gray-600 leading-tight">Pick up package from CBD</p>
                 </div>
                 <div className="flex gap-3 items-start">
                    <div className="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                    <p className="text-sm text-gray-600 leading-tight">Deliver to Westlands</p>
                 </div>
              </div>

              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
                <div className="bg-primary w-1/4 h-full rounded-full"></div>
              </div>
              
              <Button 
                onClick={() => setLocation("/customer/home")} 
                className="w-full h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Completed
              </Button>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
