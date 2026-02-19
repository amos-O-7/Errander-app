import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import OtpVerify from "@/pages/otp-verify";
import CustomerHome from "@/pages/customer/home";
import PostTask from "@/pages/customer/post-task";
import CustomerBids from "@/pages/customer/bids";
import TaskStatus from "@/pages/customer/task-status";
import CustomerSearch from "@/pages/customer/search";
import CustomerActivity from "@/pages/customer/activity";
import ErranderHome from "@/pages/errander/home";
import ErranderMap from "@/pages/errander/map";
import Wallet from "@/pages/errander/wallet";
import ErranderTaskDetails from "@/pages/errander/task-details";
import BusinessPhotos from "@/pages/errander/business-photos";
import VerificationPending from "@/pages/errander/verification-pending";
import CompleteProfile from "@/pages/errander/complete-profile";
import * as React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import Profile from "@/pages/profile";
import Chat from "@/pages/chat";
import Notifications from "@/pages/notifications";
import PersonalInfo from "@/pages/account/personal-info";
import { UserProvider } from "@/lib/user-context";

// Add global styles for hide-scrollbar utility
const GlobalStyles = () => (
  <style>{`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/auth/verify-otp" component={OtpVerify} />

      {/* Customer Routes */}
      <Route path="/customer/home" component={CustomerHome} />
      <Route path="/customer/post" component={PostTask} />
      <Route path="/customer/errand/:id/bids" component={CustomerBids} />
      <Route path="/customer/errand/:id" component={TaskStatus} />
      <Route path="/customer/search" component={CustomerSearch} />
      <Route path="/customer/activity" component={CustomerActivity} />

      {/* Errander Routes */}
      <Route path="/errander/home" component={ErranderHome} />
      <Route path="/errander/verification-pending" component={VerificationPending} />
      <Route path="/errander/complete-profile" component={CompleteProfile} />
      <Route path="/errander/business-photos" component={BusinessPhotos} />
      <Route path="/errander/errand/:id" component={ErranderTaskDetails} />
      <Route path="/errander/map" component={ErranderMap} />
      <Route path="/errander/wallet" component={Wallet} />
      <Route path="/profile" component={Profile} />
      <Route path="/account/personal-info" component={PersonalInfo} />

      {/* Shared Routes */}
      <Route path="/chat" component={Chat} />
      <Route path="/notifications" component={Notifications} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GlobalStyles />
          <Toaster />
          <Router />
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
