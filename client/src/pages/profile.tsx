import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { 
  User, Moon, Sun, LogOut, Settings, Bell, 
  Shield, CreditCard, HelpCircle, ChevronRight, Briefcase, Camera
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/lib/user-context";

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const { user, updateAvatar, switchRole } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sync local state with context if needed, but context is source of truth
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MobileLayout userType={user.role}>
      <div className="pb-8">
        {/* Profile Header */}
        <div className="bg-primary pt-12 pb-8 px-6 rounded-b-[2rem] shadow-lg shadow-primary/10 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md mb-4 relative overflow-hidden">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <div className="absolute bottom-4 right-0 bg-white p-1.5 rounded-full shadow-sm z-10">
                <Camera className="text-gray-600" size={14} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-primary-foreground font-heading">
              {user.name}
            </h1>
            <p className="text-primary-foreground/80 font-medium text-sm mb-4">
              {user.role === 'customer' ? '+254 712 345 678' : 'Top Rated Runner'}
            </p>
            
            <div className="flex gap-4 w-full justify-center">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
                <p className="text-xs text-primary-foreground/70 uppercase font-bold">Rating</p>
                <p className="text-xl font-bold text-white">4.9</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
                <p className="text-xs text-primary-foreground/70 uppercase font-bold">
                  {user.role === 'customer' ? 'Errands' : 'Jobs'}
                </p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings size={18} /> App Settings
            </h3>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Easier on the eyes</p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
              />
            </div>

             {/* Demo Only: Switch User Type */}
             <div className="flex items-center justify-between py-2 border-t border-gray-50 dark:border-gray-700 mt-2 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Switch View</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Currently: {user.role === 'customer' ? 'Customer' : 'Errander'}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={switchRole}>
                Switch
              </Button>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 px-2">Account</h3>
            
            <Link href={`/account/personal-info?role=${user.role}`}>
              <ProfileMenuItem icon={User} label="Personal Information" />
            </Link>
            
            <ProfileMenuItem icon={CreditCard} label="Payment Methods" />
            <ProfileMenuItem icon={Bell} label="Notifications" />
            <ProfileMenuItem icon={Shield} label="Privacy & Security" />
            <ProfileMenuItem icon={HelpCircle} label="Help & Support" />
          </div>

          <Button variant="outline" className="w-full h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 dark:border-red-900/30 dark:bg-red-900/10">
            <LogOut size={18} className="mr-2" /> Log Out
          </Button>

           <div className="text-center text-xs text-gray-400 py-4">
            v1.0.2 • Errander Inc.
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function ProfileMenuItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
        <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
}
