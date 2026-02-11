import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, RefreshCw } from "lucide-react";

export default function Wallet() {
  return (
    <MobileLayout userType="errander">
      <div className="p-6 space-y-8">
        <h1 className="font-heading text-2xl font-bold">My Wallet</h1>

        {/* Balance Card */}
        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
            <h2 className="text-4xl font-bold mb-6 font-heading">KES 4,500</h2>
            
            <div className="flex gap-3">
              <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white border-none rounded-xl h-10 font-bold">
                <ArrowDownLeft size={16} className="mr-2" /> Withdraw
              </Button>
              <Button variant="outline" className="flex-1 border-gray-700 hover:bg-gray-800 text-white rounded-xl h-10">
                <RefreshCw size={16} className="mr-2" /> History
              </Button>
            </div>
          </div>
          
          {/* Abstract background shapes */}
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-secondary rounded-full blur-3xl opacity-20"></div>
        </div>

        {/* M-Pesa Integration Hint */}
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3">
          <div className="bg-white p-1 rounded-full shadow-sm">
            {/* Simple M-Pesa colored text/icon placeholder */}
            <span className="font-bold text-green-600 text-xs px-1">M</span>
          </div>
          <div>
            <p className="text-sm font-bold text-green-900">M-Pesa Connected</p>
            <p className="text-xs text-green-700">Withdrawals are instant to +254 712***678</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <Transaction 
              title="Grocery Shopping Errand" 
              date="Today, 10:30 AM" 
              amount="+ KES 450" 
              type="credit" 
            />
            <Transaction 
              title="Withdrawal to M-Pesa" 
              date="Yesterday, 4:15 PM" 
              amount="- KES 2,000" 
              type="debit" 
            />
             <Transaction 
              title="Delivery Errand" 
              date="Yesterday, 2:00 PM" 
              amount="+ KES 300" 
              type="credit" 
            />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function Transaction({ title, date, amount, type }: any) {
  const isCredit = type === "credit";
  return (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex gap-3 items-center">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
          {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
        </div>
        <div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <span className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
        {amount}
      </span>
    </div>
  );
}
