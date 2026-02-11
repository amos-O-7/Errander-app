import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, MessageSquare, AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const role = searchParams.get('role') || "customer"; // customer or errander
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: "message", 
      title: "New Message", 
      message: "David M.: Hi, I'm on my way to pick up the package.", 
      time: "2 mins ago", 
      read: false 
    },
    { 
      id: 2, 
      type: "bid", 
      title: "New Bid Received", 
      message: "Sarah K. placed a bid on your 'House Cleaning' errand.", 
      time: "1 hour ago", 
      read: false 
    },
    { 
      id: 3, 
      type: "system", 
      title: "Errand Completed", 
      message: "Your delivery errand has been marked as completed.", 
      time: "Yesterday", 
      read: true 
    },
    { 
      id: 4, 
      type: "promo", 
      title: "Weekend Offer", 
      message: "Get 20% off all cleaning services this weekend!", 
      time: "2 days ago", 
      read: true 
    }
  ]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not Supported",
        description: "This browser does not support desktop notifications",
        variant: "destructive"
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast({
        title: "Notifications Enabled",
        description: "You will now receive push notifications for updates.",
      });
      
      // Send a test notification
      new Notification("Errander", {
        body: "Push notifications are now enabled!",
        icon: "/vite.svg"
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive"
      });
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      description: "All notifications marked as read",
    });
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'message': return <MessageSquare size={16} className="text-blue-500" />;
      case 'bid': return <Clock size={16} className="text-orange-500" />;
      case 'system': return <Check size={16} className="text-green-500" />;
      case 'promo': return <AlertCircle size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={role === "customer" ? "/customer/home" : "/errander/home"}>
              <button className="p-2 hover:bg-gray-100 rounded-full -ml-2">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="font-bold text-lg">Notifications</h1>
          </div>
          <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={requestPermission} className="text-blue-600">
               <Bell size={20} />
             </Button>
             <Button variant="ghost" size="icon" onClick={clearAll} className="text-red-500">
               <Trash2 size={20} />
             </Button>
          </div>
        </div>

        {/* Enable Banner */}
        {Notification.permission === 'default' && (
          <div className="bg-blue-50 p-4 m-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <Bell size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 text-sm">Enable Push Notifications</h3>
              <p className="text-xs text-blue-700 mt-1 mb-2">Don't miss out on important updates about your errands.</p>
              <Button size="sm" onClick={requestPermission} className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                Turn On
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            <>
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Recent</span>
                <button onClick={markAllRead} className="text-xs text-primary font-medium">Mark all read</button>
              </div>

              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`bg-white p-4 rounded-2xl border shadow-sm flex gap-3 relative overflow-hidden group transition-all ${notif.read ? 'border-gray-100 opacity-80' : 'border-blue-100 ring-1 ring-blue-50'}`}
                >
                  {!notif.read && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500"></div>
                  )}
                  
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-gray-100' : 'bg-blue-50'}`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 pr-4">
                    <h3 className={`text-sm ${notif.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>{notif.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{notif.time}</p>
                  </div>

                  {/* Swipe Actions (simulated with hover button for desktop/touch tap) */}
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="absolute right-0 top-0 bottom-0 w-12 bg-red-50 flex items-center justify-center text-red-500 translate-x-full group-hover:translate-x-0 transition-transform"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell size={40} className="text-gray-400" />
              </div>
              <h2 className="font-bold text-xl text-gray-900">No notifications</h2>
              <p className="text-gray-500 max-w-[200px]">You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
