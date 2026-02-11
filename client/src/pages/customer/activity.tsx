import { MobileLayout } from "@/components/mobile-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, XCircle, ChevronRight, MapPin, Calendar, FileText } from "lucide-react";
import { Link } from "wouter";

export default function CustomerActivity() {
  return (
    <MobileLayout userType="customer">
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
          <h1 className="font-bold text-xl">My Activity</h1>
        </div>

        <div className="flex-1 p-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="active" className="rounded-lg text-xs font-bold">Active</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg text-xs font-bold">Completed</TabsTrigger>
              <TabsTrigger value="cancelled" className="rounded-lg text-xs font-bold">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <ActivityCard 
                status="in_progress"
                title="Grocery Shopping"
                date="Today, 2:30 PM"
                provider="David M."
                price="KES 550"
                id="123"
              />
              <ActivityCard 
                status="bidding"
                title="Fix Leaking Tap"
                date="Today, 4:00 PM"
                provider="3 Bids"
                price="Est. KES 1500"
                id="124"
              />
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <ActivityCard 
                status="completed"
                title="House Cleaning"
                date="May 28, 2025"
                provider="Sarah K."
                price="KES 2,000"
                id="101"
              />
              <ActivityCard 
                status="completed"
                title="Document Delivery"
                date="May 15, 2025"
                provider="John O."
                price="KES 300"
                id="98"
              />
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              <ActivityCard 
                status="cancelled"
                title="Moving Help"
                date="May 10, 2025"
                provider="-"
                price="KES 4,500"
                id="85"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
}

function ActivityCard({ status, title, date, provider, price, id }: any) {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'bidding': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (s: string) => {
    switch(s) {
      case 'in_progress': return 'In Progress';
      case 'bidding': return 'Bidding';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return s;
    }
  };

  const getIcon = (s: string) => {
    switch(s) {
      case 'in_progress': return <Clock size={14} />;
      case 'bidding': return <FileText size={14} />;
      case 'completed': return <CheckCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  // Determine link based on status
  const link = status === 'in_progress' ? `/customer/errand/${id}` : 
               status === 'bidding' ? `/customer/errand/${id}/bids` : '#';

  return (
    <Link href={link}>
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:scale-98 transition-transform cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide ${getStatusColor(status)}`}>
            {getIcon(status)}
            {getStatusText(status)}
          </div>
          <span className="font-bold text-gray-900">{price}</span>
        </div>
        
        <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Calendar size={12} /> {date}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Provider:</span> 
            <span className="font-medium text-gray-700">{provider}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
