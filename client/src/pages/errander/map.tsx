import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Search, Filter, List, ArrowRight, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Mock Data for Map Pins
const ERRAND_PINS = [
  { id: 1, title: "Grocery Shopping", lat: "30%", lng: "45%", type: "delivery", price: "450", distance: "0.8km" },
  { id: 2, title: "Deliver Documents", lat: "50%", lng: "60%", type: "delivery", price: "300", distance: "2.1km" },
  { id: 3, title: "Fix Leaking Tap", lat: "65%", lng: "35%", type: "repair", price: "1,500", distance: "1.2km" },
  { id: 4, title: "House Cleaning", lat: "20%", lng: "70%", type: "cleaning", price: "2,000", distance: "3.5km" },
];

export default function ErranderMap() {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  const selectedErrand = ERRAND_PINS.find(p => p.id === selectedPin);

  return (
    <MobileLayout userType="errander">
      <div className="relative h-full min-h-[calc(100vh-140px)] bg-gray-100 overflow-hidden">
        
        {/* Map Background (Placeholder) */}
        <div className="absolute inset-0 bg-[url('/src/assets/images/map-placeholder.png')] bg-cover bg-center opacity-80" 
             onClick={() => setSelectedPin(null)}>
        </div>

        {/* Floating Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search area..." 
              className="pl-9 bg-white/90 backdrop-blur-sm border-0 shadow-md h-10 rounded-xl"
            />
          </div>
          <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-md rounded-xl h-10 w-10">
            <Filter size={18} />
          </Button>
        </div>

        {/* Map Pins */}
        {ERRAND_PINS.map((pin) => (
          <button
            key={pin.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              selectedPin === pin.id ? 'z-20 scale-125' : 'z-10 scale-100 hover:scale-110'
            }`}
            style={{ top: pin.lat, left: pin.lng }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPin(pin.id);
            }}
          >
            <div className={`
              flex items-center justify-center h-10 w-10 rounded-full shadow-lg border-2 border-white
              ${pin.type === 'delivery' ? 'bg-blue-500' : 
                pin.type === 'repair' ? 'bg-green-500' : 'bg-purple-500'}
            `}>
              {pin.type === 'delivery' ? <Navigation size={18} className="text-white" /> :
               pin.type === 'repair' ? <DollarSign size={18} className="text-white" /> :
               <Clock size={18} className="text-white" />}
            </div>
            {selectedPin === pin.id && (
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                KES {pin.price}
              </div>
            )}
          </button>
        ))}

        {/* User Location Marker (Demo) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-md animate-pulse"></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
        </div>

        {/* Selected Errand Card - Floating Bottom Sheet */}
        {selectedErrand && (
          <div className="absolute bottom-4 left-4 right-4 z-30 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Badge variant="secondary" className="mb-1 capitalize bg-blue-50 text-blue-600 hover:bg-blue-100 border-0">
                    {selectedErrand.type}
                  </Badge>
                  <h3 className="font-bold text-lg text-gray-900">{selectedErrand.title}</h3>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-lg text-gray-900">KES {selectedErrand.price}</span>
                  <span className="text-xs text-gray-500">Fixed</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Navigation size={14} /> {selectedErrand.distance} away
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} /> Kilimani
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl border-gray-200" onClick={() => setSelectedPin(null)}>
                  Dismiss
                </Button>
                <Link href={`/errander/errand/${selectedErrand.id}`}>
                  <Button className="w-full rounded-xl gap-2">
                    View Details <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* List View Toggle (when no pin selected) */}
        {!selectedErrand && (
          <div className="absolute bottom-4 right-4 z-20">
             <Link href="/errander/home">
              <Button className="rounded-full h-12 px-6 shadow-xl bg-gray-900 text-white hover:bg-gray-800 gap-2">
                <List size={18} /> List View
              </Button>
            </Link>
          </div>
        )}

      </div>
    </MobileLayout>
  );
}
