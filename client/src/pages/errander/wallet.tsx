import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useApiQuery } from "@/lib/use-api";

export default function Wallet() {
  const { data: dashboard, isLoading } = useApiQuery<any>(
    ["errander", "dashboard"],
    "/Errander/dashboard"
  );

  const { data: bids } = useApiQuery<any[]>(["errander", "bids"], "/Errander/bids");

  // Build transaction list from completed bids
  const completedBids = bids?.filter((b: any) => b.taskStatusId === 3) ?? [];
  const totalEarnings = dashboard?.stats?.totalEarnings ?? 0;

  return (
    <MobileLayout userType="errander">
      <div className="p-6 space-y-8">
        <h1 className="font-heading text-2xl font-bold">My Wallet</h1>

        {/* Balance Card */}
        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
            {isLoading ? (
              <div className="h-10 mb-6 flex items-center">
                <Loader2 className="animate-spin text-gray-400" />
              </div>
            ) : (
              <h2 className="text-4xl font-bold mb-6 font-heading">
                KES {totalEarnings.toLocaleString()}
              </h2>
            )}

            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs text-gray-400">Completed</p>
                <p className="font-bold text-lg">{dashboard?.stats?.completedTasks ?? "—"}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs text-gray-400">Pending</p>
                <p className="font-bold text-lg">{dashboard?.stats?.pendingTasks ?? "—"}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs text-gray-400">Rating</p>
                <p className="font-bold text-lg">{dashboard?.stats?.averageRating > 0 ? `★ ${dashboard.stats.averageRating}` : "New"}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white border-none rounded-xl h-10 font-bold">
                <ArrowDownLeft size={16} className="mr-2" /> Withdraw
              </Button>
            </div>
          </div>

          {/* Background blobs */}
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary rounded-full blur-3xl opacity-20" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-secondary rounded-full blur-3xl opacity-20" />
        </div>

        {/* M-Pesa integration note */}
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3">
          <div className="bg-white p-1 rounded-full shadow-sm">
            <span className="font-bold text-green-600 text-xs px-1">M</span>
          </div>
          <div>
            <p className="text-sm font-bold text-green-900">M-Pesa Connected</p>
            <p className="text-xs text-green-700">Withdrawals are sent to your registered phone number</p>
          </div>
        </div>

        {/* Recent completed tasks = earnings */}
        <div>
          <h3 className="font-bold text-lg mb-4">Earnings History</h3>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : completedBids.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No earnings yet.</p>
              <p className="text-xs mt-1">Complete errands to see your earnings here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedBids.map((bid: any) => (
                <TransactionRow
                  key={bid.id}
                  title={bid.taskTitle}
                  date={bid.createdAt ? new Date(bid.createdAt).toLocaleDateString() : ""}
                  amount={`+ KES ${bid.amount?.toLocaleString() ?? bid.minAmount?.toLocaleString()}`}
                  type="credit"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

function TransactionRow({ title, date, amount, type }: any) {
  const isCredit = type === "credit";
  return (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex gap-3 items-center">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCredit ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
          {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
        </div>
        <div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <span className={`font-bold text-sm ${isCredit ? "text-green-600" : "text-gray-900"}`}>
        {amount}
      </span>
    </div>
  );
}
