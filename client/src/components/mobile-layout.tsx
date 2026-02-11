import { Link, useLocation } from "wouter";
import { Home, Search, PlusCircle, Clock, User, Briefcase, Map, Wallet, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  userType?: "customer" | "errander";
  hideNav?: boolean;
}

export function MobileLayout({ children, userType = "customer", hideNav = false }: LayoutProps) {
  const [location] = useLocation();

  const isCustomer = userType === "customer";

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-0 md:p-4 font-sans">
      <div className="w-full max-w-md bg-background h-[100dvh] md:h-[850px] md:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-black/5">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto hide-scrollbar pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-2 flex justify-between items-center h-16 z-50 rounded-b-3xl">
            {isCustomer ? (
              <>
                <NavItem href="/customer/home" icon={Home} label="Home" active={location === "/customer/home"} />
                <NavItem href="/customer/search" icon={Search} label="Search" active={location === "/customer/search"} />
                
                <div className="relative -top-5">
                  <Link href="/customer/post">
                    <button className="bg-primary text-primary-foreground h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                      <PlusCircle size={28} />
                    </button>
                  </Link>
                </div>

                <NavItem href="/customer/activity" icon={Clock} label="Activity" active={location === "/customer/activity"} />
                <NavItem href="/profile?role=customer" icon={User} label="Profile" active={location.startsWith("/profile")} />
              </>
            ) : (
              <>
                <NavItem href="/errander/home" icon={LayoutGrid} label="Dashboard" active={location === "/errander/home"} />
                <NavItem href="/errander/map" icon={Map} label="Map" active={location === "/errander/map"} />
                <NavItem href="/errander/wallet" icon={Wallet} label="Wallet" active={location === "/errander/wallet"} />
                <NavItem href="/profile?role=errander" icon={User} label="Profile" active={location.startsWith("/profile")} />
              </>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href}>
      <button className={cn(
        "flex flex-col items-center justify-center gap-1 w-12 transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    </Link>
  );
}
