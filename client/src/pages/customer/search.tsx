import { MobileLayout } from "@/components/mobile-layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Star, ArrowRight, History, TrendingUp, Loader2, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useApiQuery } from "@/lib/use-api";

export default function CustomerSearch() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  // Categories from API
  const { data: categories } = useApiQuery<any[]>(["categories"], "/categories");

  // Search results — only fires when submittedQuery is non-empty
  const { data: searchResults, isLoading: searching } = useApiQuery<any[]>(
    ["search", submittedQuery],
    `/tasks/search?q=${encodeURIComponent(submittedQuery)}`,
    { enabled: submittedQuery.length > 1 }
  );

  // Top providers from API
  const { data: topProviders, isLoading: loadingProviders } = useApiQuery<any[]>(
    ["top-providers"],
    "/Errander/top-providers?limit=4",
    { enabled: !submittedQuery }
  );

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed.length > 1) setSubmittedQuery(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
  };

  const hasResults = submittedQuery.length > 1;

  return (
    <MobileLayout userType="customer">
      <div className="pb-8 bg-gray-50 min-h-full">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
          <h1 className="font-bold text-xl mb-4">Search</h1>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you need help with?"
              className="pl-10 pr-10 h-12 rounded-xl bg-gray-100 border-0 text-base"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {query.length > 1 && (
            <button
              onClick={handleSearch}
              className="mt-2 w-full bg-primary text-primary-foreground rounded-xl h-10 font-bold text-sm"
            >
              Search
            </button>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Search Results */}
          {hasResults && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">
                Results for "{submittedQuery}"
              </h3>
              {searching ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : searchResults?.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-500">No results found for "{submittedQuery}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search term or browse categories below.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults?.map((task: any) => (
                    <Link key={task.id} href={`/customer/errand/${task.id}/bids`}>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              {task.categoryName}
                            </span>
                            {task.locationName && (
                              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <MapPin size={10} /> {task.locationName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-3 shrink-0">
                          <p className="font-bold text-gray-900 text-sm">KES {task.minBudget}–{task.maxBudget}</p>
                          <ArrowRight size={14} className="text-gray-300 ml-auto mt-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categories from API */}
          {!hasResults && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-gray-400" /> Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories?.map((cat: any) => (
                  <Link key={cat.id} href={`/customer/post?category=${cat.slug ?? cat.name.toLowerCase()}`}>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-primary/50 transition-all">
                      <p className="font-bold text-gray-900">{cat.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {cat.taskCount > 0 ? `${cat.taskCount} errands` : "Browse"}
                      </p>
                    </div>
                  </Link>
                )) ?? (
                    // Static fallback
                    [
                      { name: "Cleaning", count: "Browse" },
                      { name: "Moving", count: "Browse" },
                      { name: "Repairs", count: "Browse" },
                      { name: "Delivery", count: "Browse" },
                    ].map((cat, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-primary/50 transition-all">
                        <p className="font-bold text-gray-900">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.count}</p>
                      </div>
                    ))
                  )}
              </div>
            </div>
          )}

          {/* Top Rated Providers */}
          {!hasResults && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Top Rated Nearby</h3>
              {loadingProviders ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-3">
                  {topProviders?.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No providers available yet.</p>
                  ) : topProviders?.map((p: any) => (
                    <div key={p.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img
                          src={p.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=7c3aed&color=fff`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{p.name}</h4>
                        <p className="text-xs text-gray-500">{p.specialty}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-xs font-bold text-yellow-500 mb-1">
                          <Star size={12} fill="currentColor" />
                          {p.averageRating > 0 ? p.averageRating.toFixed(1) : "New"}
                          <span className="text-gray-300 font-normal">({p.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
