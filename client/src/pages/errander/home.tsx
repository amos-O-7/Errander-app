import { MobileLayout } from "@/components/mobile-layout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, Navigation, Clock, Banknote, Star,
  Briefcase, CheckCircle, Wallet, Image as ImageIcon, MessageSquare,
  Settings, Filter, ChevronDown, Bell, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/user-context";
import { useApiQuery } from "@/lib/use-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function ErranderHome() {
  const { user } = useUser();
  const [isOnline, setIsOnline] = useState(true);
  const [specialty, setSpecialty] = useState<string>("all");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const { data: dashboard, isLoading: loadingDashboard } = useApiQuery<any>(["errander", "dashboard"], "/Errander/dashboard");
  const { data: jobs, isLoading: loadingJobs } = useApiQuery<any[]>(["errander", "jobs", specialty], `/Errander/jobs?category=${specialty}`);
  const { data: myServices } = useApiQuery<any[]>(["errander", "services"], "/Errander/services");
  const { data: myBids, isLoading: loadingMyBids } = useApiQuery<any[]>(["errander", "myBids"], "/Errander/bids");

  const categories = [
    { id: "all", name: "All Categories" },
    ...(myServices?.map(s => ({ id: s.slug, name: s.categoryName })) || [])
  ];

  return (
    <MobileLayout userType="errander">
      <div className="pb-8 bg-muted/20 min-h-full">
        {/* Header - Status Toggle */}
        <div className="bg-background p-4 sticky top-0 z-10 border-b border-border shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 bg-muted rounded-full overflow-hidden">
                <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            </div>
            <div>
              <h1 className="font-bold text-sm text-foreground">{user?.name}</h1>
              <div
                className="flex items-center gap-1 text-xs text-blue-600 font-medium cursor-pointer"
                onClick={() => setShowCategoryModal(true)}
              >
                {categories.find(c => c.id === specialty)?.name || "Select Specialty"}
                <ChevronDown size={12} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notifications?role=errander">
              <Button size="icon" variant="ghost" className="relative text-foreground hover:bg-muted rounded-full h-9 w-9">
                <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-background z-10"></div>
                <Bell size={20} />
              </Button>
            </Link>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>
        </div>

        {/* Category Selection Modal */}
        <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Your Specialty</DialogTitle>
              <DialogDescription>
                Choose the category of errands you want to receive.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              {categories.map((cat: any) => (
                <Button
                  key={cat.id}
                  variant={specialty === cat.id ? "default" : "outline"}
                  className={`justify-start ${specialty === cat.id ? "bg-blue-600 font-bold" : ""}`}
                  onClick={() => {
                    setSpecialty(cat.id);
                    setShowCategoryModal(false);
                  }}
                >
                  {cat.name}
                  {specialty === cat.id && <CheckCircle className="ml-auto h-4 w-4" />}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Content */}
        <div className="p-4 space-y-6">
          {!isOnline ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Navigation size={40} className="text-muted-foreground" />
              </div>
              <h2 className="font-bold text-xl text-foreground">You are offline</h2>
              <p className="text-muted-foreground max-w-[200px]">Go online to start receiving errand requests nearby.</p>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-3">
                <StatsCard icon={Star} label="Bids Submitted" value={dashboard?.stats.bidsSubmitted || "0"} color="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
                <StatsCard icon={Briefcase} label="Pending Errands" value={dashboard?.stats.pendingTasks || "0"} color="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
                <StatsCard icon={CheckCircle} label="Completed" value={dashboard?.stats.completedTasks || "0"} color="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" />
                <StatsCard icon={Wallet} label="Earnings" value={`KES ${dashboard?.stats.totalEarnings?.toLocaleString() || "0"}`} color="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" />
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3 active:scale-95 transition-transform cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Messages</p>
                      <p className="text-[10px] text-muted-foreground">View conversations</p>
                    </div>
                  </div>

                  <Link href="/errander/business-photos">
                    <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3 active:scale-95 transition-transform cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Portfolio</p>
                        <p className="text-[10px] text-muted-foreground">Add Business Photos</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Errands & Bids Tabs */}
              <Tabs defaultValue="available" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted p-1 rounded-xl">
                  <TabsTrigger value="available" className="rounded-lg text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground">Available Errands</TabsTrigger>
                  <TabsTrigger value="bids" className="rounded-lg text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground">Submitted Bids</TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-base text-foreground">Recent Available</h2>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                        {categories.find((c: any) => c.id === specialty)?.name} Only
                      </Badge>
                    </div>
                    <Button variant="link" className="text-xs h-auto p-0 text-primary">View All</Button>
                  </div>

                  {loadingJobs ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : jobs && jobs.length > 0 ? (
                    jobs.map((job: any) => (
                      <JobCard
                        key={job.id}
                        id={job.id}
                        title={job.title}
                        location={job.location}
                        distance={job.distance}
                        price={job.price}
                        urgent={job.urgent}
                        type="available"
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 bg-card rounded-2xl border border-dashed border-border">
                      <Briefcase className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="font-bold text-foreground">No errands found</h3>
                      <p className="text-sm text-muted-foreground px-4">
                        There are no available errands in the <strong>{categories.find((c: any) => c.id === specialty)?.name}</strong> category right now.
                      </p>
                      <Button variant="link" onClick={() => setShowCategoryModal(true)} className="mt-2 text-blue-600">
                        Change Specialty
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="bids" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center px-1 mb-2">
                    <h2 className="font-bold text-base text-foreground">My Bids</h2>
                    <Button variant="link" className="text-xs h-auto p-0 text-primary">View All</Button>
                  </div>

                  {loadingMyBids ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : myBids && myBids.length > 0 ? (
                    myBids.map((bid: any) => (
                      <JobCard
                        key={bid.id}
                        id={bid.taskId}
                        title={bid.taskTitle}
                        location={bid.locationName}
                        distance={`${bid.distance || "?"} km`}
                        price={bid.amount}
                        urgent={false}
                        type="bid"
                        bidStatus={bid.statusName}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 bg-card rounded-2xl border border-dashed border-border text-muted-foreground">
                      No bids submitted yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

function StatsCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex flex-col gap-2">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

function JobCard({ id, title, location, distance, price, urgent, type, bidStatus }: any) {
  const isAvailable = type === 'available';

  return (
    <div className="bg-card p-4 rounded-2xl shadow-sm border border-border hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden">
      {urgent && isAvailable && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
          URGENT
        </div>
      )}

      {type === 'bid' && bidStatus && (
        <div className={`absolute top-0 right-0 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg ${bidStatus === 'Pending' ? 'bg-orange-400' : bidStatus === 'Accepted' ? 'bg-green-500' : 'bg-muted-foreground'}`}>
          {bidStatus.toUpperCase()}
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="block font-bold text-xl text-foreground">KES {price}</span>
          <span className="text-xs text-muted-foreground">Fixed Price</span>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground mb-4 bg-muted/50 p-3 rounded-xl">
        <div className="flex items-center gap-1.5">
          <Navigation size={14} className="text-blue-500" />
          <span className="font-medium">{distance} away</span>
        </div>
        <div className="w-px h-4 bg-muted-foreground/30" />
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-orange-500" />
          <span className="font-medium">Est. 45 mins</span>
        </div>
      </div>

      {isAvailable ? (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-xl h-10 border-border hover:bg-muted text-muted-foreground">
            Decline
          </Button>
          <Link href={`/errander/errand/${id}`}>
            <Button className="w-full rounded-xl h-10 font-bold shadow-md shadow-primary/20">
              Submit Bid
            </Button>
          </Link>
        </div>
      ) : (
        <Button variant="outline" className="w-full rounded-xl h-10 border-border text-muted-foreground" disabled>
          Bid Submitted
        </Button>
      )}
    </div>
  );
}

