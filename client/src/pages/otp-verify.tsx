import { useState, useRef, useEffect } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Loader2, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useUser } from "@/lib/user-context";

export default function OtpVerify() {
    const [, setLocation] = useLocation();
    const { setUser } = useUser();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // userId stored in sessionStorage after login/register
    const userId = sessionStorage.getItem("pendingUserId");

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            setError("Please enter the complete 6-digit code.");
            return;
        }
        if (!userId) {
            setError("Session expired. Please go back and try again.");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: parseInt(userId), otp: code }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Verification failed");

            // Persist token + user data
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.removeItem("pendingUserId");

            // ✅ Update React context immediately so Home shows real name on first render
            const u = data.user;
            setUser({
                id: u.id,
                name: u.name,
                email: u.email,
                mobileNo: u.mobileNo ?? u.mobile_no ?? "",
                role: u.isSP ? "errander" : "customer",
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=7c3aed&color=fff&bold=true`,
            });

            // Redirect based on role
            setLocation(data.user.isSP ? "/errander/home" : "/customer/home");
        } catch (err: any) {
            setError(err.message);
            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!userId || cooldown > 0) return;
        setIsResending(true);
        setError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: parseInt(userId) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
            setCooldown(60);
            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <MobileLayout hideNav>
            <div className="p-6 h-full flex flex-col justify-center max-w-sm mx-auto w-full">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner">
                        <ShieldCheck className="text-primary" size={48} />
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground font-heading mb-2">Verify your email</h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        We sent a 6-digit code to your email address.<br />
                        It expires in <span className="font-semibold text-foreground">5 minutes</span>.
                    </p>
                </div>

                {/* OTP Boxes */}
                <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInput(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`
                w-12 h-14 text-center text-2xl font-bold rounded-2xl border-2 
                bg-card outline-none transition-all duration-200 select-none
                ${digit ? "border-primary text-primary bg-primary/5 shadow-sm shadow-primary/10"
                                    : "border-gray-200 dark:border-gray-700 text-foreground"}
                ${error ? "border-red-400 dark:border-red-600 animate-shake" : ""}
                focus:border-primary focus:bg-primary/5 focus:shadow-sm focus:shadow-primary/10
              `}
                        />
                    ))}
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-center text-sm text-red-500 font-medium mb-4 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}

                {/* Verify Button */}
                <Button
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 mb-4"
                    onClick={handleVerify}
                    disabled={isLoading || otp.join("").length !== 6}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Verify Code"}
                </Button>

                {/* Resend */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
                    <Button
                        variant="ghost"
                        className="text-primary font-semibold gap-2"
                        onClick={handleResend}
                        disabled={isResending || cooldown > 0}
                    >
                        {isResending ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <RefreshCw size={16} />
                        )}
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                    </Button>
                </div>

                {/* Email hint */}
                <div className="mt-8 flex items-center gap-2 bg-muted/50 p-3 rounded-xl">
                    <Mail size={16} className="text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Check your spam/junk folder if you don't see the email in your inbox.
                    </p>
                </div>
            </div>
        </MobileLayout>
    );
}
