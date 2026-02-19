import { MobileLayout } from "@/components/mobile-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Truck, Sparkles, ShoppingBag, Hammer, ArrowRight, Package, Clock, CheckCircle, List, ArrowUpRight, Bell, Star, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/lib/user-context";
import { useApiQuery } from "@/lib/use-api";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

// Images from assets
import cleaningImg from "@/assets/images/House_cleaning_1770118941873.jpg";
import movingImg from "@/assets/images/House_moving-Heavy_lifting_1770118941874.jpg";
import repairImg from "@/assets/images/Laptop_repair_1770118941873.jpg";
import tvMountingImg from "@/assets/images/TV_mounting_1770118941872.jpg";

// Ad Images
import cleaningAd from "@/assets/images/ads/cleaning-ad.jpg";
import deliveryAd from "@/assets/images/ads/delivery-ad.jpg";
import repairAd from "@/assets/images/ads/repair-ad.jpg";
import referralAd from "@/assets/images/ads/referral-ad.jpg";

export default function CustomerHome() {
  const { user } = useUser();
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const { data: categories, isLoading: loadingCats } = useApiQuery<any[]>(["categories"], "/categories");
  const { data: activeTasks, isLoading: loadingTasks } = useApiQuery<any[]>(["tasks", "active"], "/tasks?filter=active");
  const { data: allTasks } = useApiQuery<any[]>(["tasks", "all"], "/tasks");

  const stats = {
    total: allTasks?.length || 0,
    active: activeTasks?.length || 0,
    completed: allTasks?.filter((t: any) => t.statusId === 3).length || 0
  };

  return (
    <MobileLayout userType="customer">
      <div className="pb-8">
        {/* Header */}
        <div className="bg-primary pt-12 pb-8 px-6 rounded-b-[2rem] shadow-lg shadow-primary/10 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-primary-foreground/80 font-medium text-sm">Good morning,</p>
              <h1 className="text-2xl font-bold text-primary-foreground font-heading">{user?.name}</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
              <Link href="/profile?role=customer">
                <button className="w-8 h-8 rounded-full bg-white/90 border-2 border-white flex items-center justify-center text-primary font-bold relative overflow-hidden">
                  <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                </button>
              </Link>
              <Link href="/notifications?role=customer">
                <button className="w-8 h-8 rounded-full bg-white/90 border-2 border-white flex items-center justify-center text-primary font-bold relative">
                  <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full z-10"></div>
                  <Bell size={16} />
                </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <Search size={20} />
            </div>
            <Input
              placeholder="Search errands, services, or users..."
              className="pl-10 h-12 rounded-2xl bg-background border-0 shadow-sm text-base placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Advertisement Carousel */}
        <div className="px-6 mb-8">
          <Carousel
            plugins={[plugin.current]}
            className="w-full rounded-2xl overflow-hidden shadow-sm"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                  <img src={cleaningAd} alt="Cleaning Offer" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 text-white">
                    <span className="text-xs font-bold uppercase bg-primary text-primary-foreground px-2 py-1 rounded w-fit mb-2">Limited Offer</span>
                    <h3 className="font-bold text-xl leading-tight mb-1">Get 20% Off</h3>
                    <p className="text-sm opacity-90">First home cleaning service</p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                  <img src={deliveryAd} alt="Delivery" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent flex flex-col justify-center px-6 text-white">
                    <h3 className="font-bold text-xl leading-tight mb-1">Fast Delivery</h3>
                    <p className="text-sm opacity-90 mb-3">Anywhere in Nairobi within 2 hours</p>
                    <Button size="sm" variant="secondary" className="h-8 w-fit text-xs font-bold">Book Now</Button>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                  <img src={referralAd} alt="Referral" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-transparent flex flex-col justify-center px-6 text-white">
                    <h3 className="font-bold text-xl leading-tight mb-1">Refer & Earn</h3>
                    <p className="text-sm opacity-90">Get KES 500 for every friend</p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        {/* Dashboard Stats */}
        <div className="px-6 mb-8">
          <div className="bg-card p-4 rounded-2xl shadow-sm border border-border grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Total Errands</p>
            </div>
            <div className="text-center border-l border-border">
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Active</p>
            </div>
            <div className="text-center border-l border-border">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Completed</p>
            </div>
          </div>
        </div>

        {/* Location Pill */}
        <div className="px-6 mb-6 flex justify-center">
          <button className="flex items-center gap-2 bg-muted/50 text-foreground/80 px-4 py-2 rounded-full text-sm font-medium hover:bg-muted transition-colors">
            <MapPin size={14} className="text-primary" />
            <span>Kilimani, Nairobi</span>
          </button>
        </div>

        {/* Popular Services Horizontal Scroll (New with Images) */}
        <div className="pl-6 mb-8">
          <div className="flex justify-between items-center pr-6 mb-4">
            <h2 className="text-lg font-bold text-foreground">Popular Services</h2>
            <button className="text-sm text-primary font-medium hover:text-primary/80">See all</button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pr-6 hide-scrollbar">
            <ServiceCard
              image={cleaningImg}
              title="House Cleaning"
              category="Cleaning"
            />
            <ServiceCard
              image={movingImg}
              title="Moving Helper"
              category="Logistics"
            />
            <ServiceCard
              image={tvMountingImg}
              title="TV Mounting"
              category="Installation"
            />
            <ServiceCard
              image={repairImg}
              title="Electronics Repair"
              category="Repair"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="px-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-foreground">Categories</h2>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {loadingCats ? (
              <div className="col-span-4 flex justify-center py-4"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              categories?.map((cat: any) => {
                let Icon = Package;
                let color = "bg-gray-100 text-gray-600";

                if (cat.name.toLowerCase().includes("cleaning")) { Icon = Sparkles; color = "bg-purple-100 text-purple-600"; }
                else if (cat.name.toLowerCase().includes("delivery")) { Icon = Truck; color = "bg-blue-100 text-blue-600"; }
                else if (cat.name.toLowerCase().includes("shopping")) { Icon = ShoppingBag; color = "bg-orange-100 text-orange-600"; }
                else if (cat.name.toLowerCase().includes("repair")) { Icon = Hammer; color = "bg-green-100 text-green-600"; }

                return (
                  <CategoryItem
                    key={cat.id}
                    icon={Icon}
                    label={cat.name}
                    color={color}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Top Rated Providers Nearby (Replaced Recent & Top Errands) */}
        <div className="px-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-foreground">Top Rated Nearby</h2>
            <button className="text-sm text-primary font-medium hover:text-primary/80">View All</button>
          </div>

          <div className="space-y-3">
            <ProviderCard
              name="Sarah K."
              role="Professional Cleaner"
              rating="4.9"
              reviews="124"
              distance="0.8 km"
            />
            <ProviderCard
              name="John O."
              role="Handyman & Repair"
              rating="4.8"
              reviews="89"
              distance="1.2 km"
            />
          </div>
        </div>

        {/* Active Errands Section */}
        <div className="px-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Active Errands ({activeTasks?.length || 0})</h2>

          {loadingTasks ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
          ) : activeTasks?.length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-card rounded-2xl border border-border">No active errands</div>
          ) : (
            activeTasks?.map((task: any) => (
              <Link key={task.id} href={task.statusId === 1 ? `/customer/errand/${task.id}/bids` : `/customer/errand/${task.id}`}>
                <div className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-3 cursor-pointer active:scale-95 transition-transform">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <p className="text-xs text-muted-foreground">{task.locationName}</p>
                      </div>
                    </div>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      {task.statusId === 1 ? "Bidding" : "In Progress"}
                    </span>
                  </div>

                  <div className="w-full bg-muted h-1.5 rounded-full mb-3 overflow-hidden">
                    <div className={`bg-primary h-full rounded-full ${task.statusId === 1 ? "w-1/3" : "w-2/3"}`}></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Runner: <span className="text-foreground font-medium">{task.providerName || "Finding runner..."}</span></span>
                    <button className="text-primary font-medium text-xs flex items-center gap-1">
                      Details <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Recent Activity / Promo */}
        <div className="px-6">
          <div className="bg-primary rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="relative z-10">
              <h3 className="font-bold text-primary-foreground text-lg mb-2">Invite a friend</h3>
              <p className="text-sm text-primary-foreground/90 mb-4 max-w-[70%]">Get KES 200 off your next errand when you invite friends.</p>
              <Button size="sm" variant="secondary" className="rounded-full h-9 font-bold text-primary">
                Invite Now
              </Button>
            </div>
            <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-0 right-0 h-16 w-16 bg-white/5 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function CategoryItem({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <Link href={`/customer/post?category=${label.toLowerCase()}`}>
      <div className="flex flex-col items-center gap-2 cursor-pointer group">
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${color}`}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-medium text-foreground text-center leading-tight">{label}</span>
      </div>
    </Link>
  );
}

function ServiceCard({ image, title, category }: { image: string, title: string, category: string }) {
  return (
    <div className="min-w-[140px] rounded-xl overflow-hidden relative aspect-[3/4] group cursor-pointer shadow-sm">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
        <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">{category}</span>
        <h3 className="text-white font-bold text-sm leading-tight">{title}</h3>
      </div>
    </div>
  )
}

function ProviderCard({ name, role, rating, reviews, distance }: any) {
  return (
    <div className="bg-card p-3 rounded-xl border border-border flex items-center gap-3 shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0">
        <img src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 justify-end text-xs font-bold text-yellow-500 mb-1">
          <Star size={12} fill="currentColor" /> {rating} <span className="text-muted-foreground font-normal">({reviews})</span>
        </div>
        <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
          <MapPin size={10} /> {distance}
        </div>
      </div>
    </div>
  );
}
