import { useEffect } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import heroImage from "@/assets/images/hero-runner.png";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setLocation(user.isSP ? "/errander/home" : "/customer/home");
      } catch {
        // corrupt data — clear and stay on landing
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col min-h-full">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-heading text-primary tracking-tighter">Errander</h1>
          <Link href="/auth">
            <Button variant="ghost" className="font-medium text-foreground hover:bg-transparent hover:text-primary">
              Log In
            </Button>
          </Link>
        </header>

        {/* Hero */}
        <div className="px-6 flex-1 flex flex-col justify-center">
          <div className="relative mb-8">
            <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>

            <img
              src={heroImage}
              alt="Errand Runner"
              className="w-full h-auto drop-shadow-xl animate-in fade-in zoom-in duration-700"
            />
          </div>

          <h2 className="text-4xl font-heading leading-tight mb-4 text-gray-900">
            Get <span className="text-primary">Anything</span><br />Done.
          </h2>

          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Connect with trusted local runners for errands, delivery, cleaning, and more. Fast & secure.
          </p>

          <div className="space-y-4">
            <Link href="/auth?role=customer">
              <Button className="w-full h-14 rounded-full text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                I need an Errand run
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/auth?role=errander">
              <Button variant="outline" className="w-full h-14 rounded-full text-lg font-medium border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-gray-600">
                I want to earn money
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="p-6 mt-8 grid grid-cols-3 gap-4 text-center border-t border-gray-50 bg-gray-50/50">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-white rounded-full shadow-sm text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Top Rated</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-white rounded-full shadow-sm text-blue-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Verified</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-white rounded-full shadow-sm text-green-500">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-600">Fast</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
