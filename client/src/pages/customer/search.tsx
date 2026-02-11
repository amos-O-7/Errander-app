import { MobileLayout } from "@/components/mobile-layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Star, ArrowRight, History, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function CustomerSearch() {
  const recentSearches = [
    "House cleaning",
    "Plumber near Kilimani",
    "Grocery delivery"
  ];

  const popularCategories = [
    { name: "Cleaning", count: "120+ pros" },
    { name: "Moving", count: "80+ pros" },
    { name: "Repairs", count: "200+ pros" },
    { name: "Delivery", count: "500+ runners" }
  ];

  return (
    <MobileLayout userType="customer">
      <div className="pb-8 bg-gray-50 min-h-full">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
          <h1 className="font-bold text-xl mb-4">Search</h1>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <Input 
              placeholder="What do you need help with?" 
              className="pl-10 h-12 rounded-xl bg-gray-100 border-0 text-base"
              autoFocus
            />
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Recent Searches */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <History size={16} className="text-gray-400" /> Recent
            </h3>
            <div className="space-y-2">
              {recentSearches.map((term, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <SearchIcon size={14} />
                    </div>
                    <span className="text-gray-700">{term}</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-gray-400" /> Popular Categories
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {popularCategories.map((cat, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-primary/50 transition-all">
                  <p className="font-bold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Providers Nearby */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Top Rated Nearby</h3>
            <div className="space-y-3">
              <ProviderCard 
                name="Sarah K." 
                role="Professional Cleaner" 
                rating="4.9" 
                reviews="124" 
                distance="0.8 km"
              />
              <ProviderCard 
                name="John O." 
                role="Handyman & Repair" 
                rating="4.8" 
                reviews="89" 
                distance="1.2 km"
              />
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function ProviderCard({ name, role, rating, reviews, distance }: any) {
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
        <img src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`} alt={name} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 justify-end text-xs font-bold text-yellow-500 mb-1">
          <Star size={12} fill="currentColor" /> {rating} <span className="text-gray-300 font-normal">({reviews})</span>
        </div>
        <div className="flex items-center gap-1 justify-end text-xs text-gray-400">
          <MapPin size={10} /> {distance}
        </div>
      </div>
    </div>
  );
}
