
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Phone, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/lib/user-context";
import { useApiMutation, useApiQuery } from "@/lib/use-api";
import { useQueryClient } from "@tanstack/react-query";

export default function PersonalInfo() {
  const { toast } = useToast();
  const { user, setUser } = useUser();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Load fresh profile values
  const { data: profile } = useApiQuery<any>(["profile"], "/profile");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobileNo: user.mobileNo,
  });

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  const updateProfileMutation = useApiMutation<any, typeof formData>(
    () => "/profile",
    {
      method: "PUT",
      onSuccess: (data) => {
        setUser({ ...user, name: data.name, email: data.email, mobileNo: data.mobileNo });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setIsEditing(false);
        toast({ title: "Profile Updated", description: "Your information has been saved." });
      },
      onError: (err: Error) => {
        toast({ title: "Update Failed", description: err.message, variant: "destructive" });
      }
    }
  );

  const updatePasswordMutation = useApiMutation<any, typeof pwData>(
    () => "/profile/password",
    {
      method: "PUT",
      onSuccess: () => {
        setPwData({ currentPassword: "", newPassword: "", confirm: "" });
        setShowPasswordSection(false);
        toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      },
      onError: (err: Error) => {
        toast({ title: "Failed", description: err.message, variant: "destructive" });
      }
    }
  );

  // Sync form whenever fresh profile loads
  if (profile && !isEditing && formData.name !== profile.name) {
    setFormData({ name: profile.name, email: profile.email, mobileNo: profile.mobileNo ?? "" });
  }

  const handleSaveProfile = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ title: "Validation", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handleSavePassword = () => {
    setPwError("");
    if (!pwData.currentPassword || !pwData.newPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (pwData.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwData.newPassword !== pwData.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    updatePasswordMutation.mutate(pwData);
  };

  // Shared input class — dark-mode aware
  const inputClass = "h-11 bg-background dark:bg-gray-900 border-gray-200 dark:border-gray-700 dark:text-white focus:border-primary disabled:opacity-60";
  const labelClass = "text-xs text-gray-500 dark:text-gray-400 font-medium";
  const cardClass = "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl shadow-sm";

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col bg-gray-50 dark:bg-gray-950 min-h-full">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/profile")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full -ml-2 transition-colors"
            >
              <ArrowLeft size={20} className="dark:text-white" />
            </button>
            <h1 className="font-bold text-lg dark:text-white">Personal Information</h1>
          </div>
          {!showPasswordSection && (
            <Button
              variant="ghost"
              size="sm"
              className="font-bold text-primary"
              disabled={updateProfileMutation.isPending}
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            >
              {updateProfileMutation.isPending
                ? <Loader2 className="animate-spin h-4 w-4" />
                : isEditing ? "Save" : "Edit"}
            </Button>
          )}
        </div>

        <div className="flex-1 p-4 space-y-5 overflow-y-auto pb-8">
          {/* Profile Info Section */}
          <div className={cardClass + " space-y-4"}>
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User size={18} className="text-gray-400" /> Personal Details
            </h2>

            <div className="space-y-1">
              <Label className={labelClass}>Full Name</Label>
              <Input
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <Label className={labelClass}>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                <Input
                  value={formData.email}
                  disabled={!isEditing}
                  type="email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass + " pl-9"}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className={labelClass}>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                <Input
                  value={formData.mobileNo}
                  disabled={!isEditing}
                  type="tel"
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  className={inputClass + " pl-9"}
                  placeholder="+254 712 345 678"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 rounded-xl dark:border-gray-700 dark:text-white"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user.name, email: user.email, mobileNo: user.mobileNo });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-10 rounded-xl font-bold"
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Save"}
                </Button>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className={cardClass}>
            <button
              className="w-full flex items-center justify-between"
              onClick={() => { setShowPasswordSection(!showPasswordSection); setPwError(""); }}
            >
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock size={18} className="text-gray-400" /> Change Password
              </h2>
              <span className="text-xs text-primary font-bold">{showPasswordSection ? "Cancel" : "Change"}</span>
            </button>

            {showPasswordSection && (
              <div className="space-y-4 mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                {/* Current password */}
                <div className="space-y-1">
                  <Label className={labelClass}>Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      value={pwData.currentPassword}
                      onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })}
                      className={inputClass + " pr-10"}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-1">
                  <Label className={labelClass}>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      value={pwData.newPassword}
                      onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                      className={inputClass + " pr-10"}
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div className="space-y-1">
                  <Label className={labelClass}>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={pwData.confirm}
                    onChange={(e) => setPwData({ ...pwData, confirm: e.target.value })}
                    className={inputClass}
                    placeholder="Re-enter new password"
                  />
                </div>

                {pwError && (
                  <p className="text-red-500 dark:text-red-400 text-xs font-medium">{pwError}</p>
                )}

                <Button
                  onClick={handleSavePassword}
                  disabled={updatePasswordMutation.isPending}
                  className="w-full h-11 rounded-xl font-bold"
                >
                  {updatePasswordMutation.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Update Password
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
