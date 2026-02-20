import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, MessageSquare, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/lib/user-context";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useApiQuery<any[]>(
    ["notifications"],
    "/notifications"
  );

  const markOneMutation = useApiMutation<any, string>(
    (id: string) => `/notifications/${id}/read`,
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
  );

  const markAllMutation = useApiMutation<any, void>(
    () => "/notifications/read-all",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast({ description: "All notifications marked as read." });
      }
    }
  );

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("message") || t.includes("chat")) return <MessageSquare size={16} className="text-blue-500" />;
    if (t.includes("bid")) return <Clock size={16} className="text-orange-500" />;
    if (t.includes("complete") || t.includes("accept")) return <Check size={16} className="text-green-500" />;
    if (t.includes("promo") || t.includes("offer")) return <AlertCircle size={16} className="text-purple-500" />;
    return <Bell size={16} className="text-gray-500" />;
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString();
  };

  const backHref = user.role === "errander" ? "/errander/home" : "/customer/home";

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={backHref}>
              <button className="p-2 hover:bg-gray-100 rounded-full -ml-2">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="font-bold text-lg">Notifications</h1>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="text-xs text-primary font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell size={40} className="text-gray-400" />
              </div>
              <h2 className="font-bold text-xl text-gray-900">No notifications</h2>
              <p className="text-gray-500 max-w-[200px]">You're all caught up!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  {notifications.filter(n => !n.isRead).length} unread
                </span>
              </div>

              {notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markOneMutation.mutate(notif.id)}
                  className={`bg-white p-4 rounded-2xl border shadow-sm flex gap-3 cursor-pointer active:scale-[0.98] transition-all ${notif.isRead ? "border-gray-100 opacity-80" : "border-blue-100 ring-1 ring-blue-50"
                    }`}
                >
                  {!notif.isRead && (
                    <div className="absolute right-8 top-4 h-2 w-2 rounded-full bg-blue-500" />
                  )}
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? "bg-gray-100" : "bg-blue-50"}`}>
                    {getIcon(notif.type ?? "")}
                  </div>
                  <div className="flex-1 pr-4">
                    <h3 className={`text-sm ${notif.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                      {notif.message ?? notif.type?.split("\\")?.pop()?.replace(/([A-Z])/g, " $1").trim() ?? "Notification"}
                    </h3>
                    {notif.data?.errand_title && (
                      <p className="text-xs text-gray-500 mt-0.5">{notif.data.errand_title}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-2">{formatTime(notif.createdAt)}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
