import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Check, Loader2 } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [error, setError] = useState("");

  // Extract role from query string
  const searchParams = new URLSearchParams(window.location.search);
  const defaultRole = searchParams.get("role") || "customer";

  const redirectToOtp = (userId: number) => {
    sessionStorage.setItem("pendingUserId", String(userId));
    setLocation("/auth/verify-otp");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.requiresOtp) {
        redirectToOtp(data.userId);
      } else {
        // Fallback (no OTP) — direct login
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLocation(data.user.isSP ? "/errander/home" : "/customer/home");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          mobileNo,
          isSP: defaultRole === "errander"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      if (data.requiresOtp) {
        redirectToOtp(data.userId);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLocation(data.user.isSP ? "/errander/home" : "/customer/home");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout hideNav>
      <div className="p-6 h-full flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading text-primary mb-2">Errander</h1>
          <p className="text-gray-500">
            {defaultRole === "errander" ? "Join as an Errander" : "Get your errands done"}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-1 rounded-full h-12">
            <TabsTrigger
              value="login"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm h-10 transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm h-10 transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="h-12 rounded-xl border-input focus:border-primary focus:ring-primary bg-muted/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="h-12 rounded-xl border-input focus:border-primary focus:ring-primary bg-muted/50"
                  required
                />
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 mt-4"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="h-12 rounded-xl bg-muted/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="h-12 rounded-xl bg-muted/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone Number (M-Pesa)</Label>
                <Input
                  id="reg-phone"
                  placeholder="0712 345 678"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="h-12 rounded-xl bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-pass">Create Password</Label>
                <Input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="h-12 rounded-xl bg-muted/50"
                  required
                />
              </div>

              <div className="flex items-start gap-2 mt-4">
                <div className="h-5 w-5 rounded border border-gray-300 flex items-center justify-center mt-0.5 text-white bg-primary border-primary">
                  <Check size={12} />
                </div>
                <p className="text-xs text-gray-500 leading-tight">
                  By creating an account, I agree to the <span className="text-primary font-medium">Terms of Service</span> and <span className="text-primary font-medium">Privacy Policy</span>.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 mt-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">Or continue with</p>
          <div className="flex gap-4 justify-center mt-4">
            <Button variant="outline" className="w-12 h-12 rounded-full border-gray-200 p-0 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            </Button>
            <Button variant="outline" className="w-12 h-12 rounded-full border-gray-200 p-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
