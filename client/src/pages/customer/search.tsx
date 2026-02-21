import { MobileLayout } from "@/components/mobile-layout";
import { Input } from "@/components/ui/input";
import {
  Search as SearchIcon, MapPin, Star, ArrowRight,
  TrendingUp, Loader2, X, ArrowLeft, Tag, Wrench, User as UserIcon
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useApiQuery } from "@/lib/use-api";
import { apiFetch } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Suggestion {
  id?: number;
  text: string;
  type: "category" | "errand" | "provider";
}

interface SearchResult {
  categories: { id: number; name: string }[];
  errands: { id: number; name: string; categoryId: number; categoryName: string | null }[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CustomerSearch() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Categories always shown when idle
  const { data: categoriesRes } = useApiQuery<any>(["categories"], "/categories");
  const categories: any[] = categoriesRes?.data ?? categoriesRes ?? [];

  // Top providers — shown when idle
  const { data: topProviders, isLoading: loadingProviders } = useApiQuery<any[]>(
    ["top-providers"],
    "/Errander/top-providers?limit=4",
    { enabled: !submittedQuery }
  );

  // ── Debounced real-time suggestions ──────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await apiFetch<Suggestion[]>(
          `/search/suggestions?q=${encodeURIComponent(query.trim())}`
        );
        setSuggestions(data ?? []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // ── Submit search ─────────────────────────────────────────────────────────────
  const handleSearch = async (q = query.trim()) => {
    if (!q || q.length < 2) return;
    setSubmittedQuery(q);
    setShowSuggestions(false);
    setIsSearching(true);
    try {
      const data = await apiFetch<SearchResult>(
        `/search?q=${encodeURIComponent(q)}`
      );
      setSearchResult(data);
    } catch {
      setSearchResult({ categories: [], errands: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (s: Suggestion) => {
    setQuery(s.text);
    setShowSuggestions(false);
    // Navigate directly for categories, search for others
    if (s.type === "category" && s.id) {
      setLocation(`/customer/post?category=${encodeURIComponent(s.text)}`);
    } else {
      handleSearch(s.text);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
    setSearchResult(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const hasResults = !!submittedQuery && searchResult !== null;

  // Suggestion type badge colours
  const suggestionMeta: Record<Suggestion["type"], { icon: any; colour: string; label: string }> = {
    category: { icon: Tag, colour: "text-purple-500", label: "Category" },
    errand: { icon: Wrench, colour: "text-blue-500", label: "Errand" },
    provider: { icon: UserIcon, colour: "text-green-500", label: "Provider" },
  };

  return (
    <MobileLayout userType="customer">
      <div className="pb-8 bg-gray-50 dark:bg-gray-950 min-h-full">

        {/* ── Sticky Header ─────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 p-4 sticky top-0 z-20 border-b dark:border-gray-800 shadow-sm">
          {/* Title row with back button */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setLocation("/customer/home")}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors shrink-0"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>
            <h1 className="font-bold text-xl dark:text-white">Search</h1>
          </div>

          {/* Search input */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search errands, categories, providers…"
              className="pl-10 pr-10 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border-0 text-base"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Real-time suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-xl z-30 overflow-hidden">
              {suggestions.map((s, i) => {
                const meta = suggestionMeta[s.type];
                const Icon = meta.icon;
                return (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left border-b last:border-0 dark:border-gray-800 transition-colors"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    <Icon size={16} className={meta.colour + " shrink-0"} />
                    <span className="flex-1 text-sm font-medium dark:text-white truncate">{s.text}</span>
                    <span className={`text-xs ${meta.colour} font-medium shrink-0`}>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Search button */}
          {query.length > 1 && (
            <button
              onClick={() => handleSearch()}
              className="mt-3 w-full bg-primary text-primary-foreground rounded-xl h-11 font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {isSearching ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Searching…
                </span>
              ) : "Search"}
            </button>
          )}
        </div>

        <div className="p-4 space-y-6">

          {/* ── Search Results ─────────────────────────────────────────────────── */}
          {hasResults && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Results for <span className="text-foreground font-bold">"{submittedQuery}"</span>
              </p>

              {isSearching && (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              )}

              {/* Matching Categories */}
              {!isSearching && searchResult!.categories.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Tag size={14} className="text-purple-500" /> Matching Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {searchResult!.categories.map((cat) => (
                      <Link key={cat.id} href={`/customer/post?category=${encodeURIComponent(cat.name)}`}>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/50 transition-all">
                          <p className="font-bold text-gray-900 dark:text-white">{cat.name}</p>
                          <p className="text-xs text-primary font-medium mt-0.5 flex items-center gap-1">
                            <ArrowRight size={10} /> Post errand
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Errands */}
              {!isSearching && searchResult!.errands.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Wrench size={14} className="text-blue-500" />
                    {searchResult!.categories.length > 0 ? "Matching Errands" : `Errands for "${submittedQuery}"`}
                  </h3>
                  <div className="space-y-2">
                    {searchResult!.errands.map((errand) => (
                      <Link
                        key={errand.id}
                        href={`/customer/post?errandId=${errand.id}&category=${encodeURIComponent(errand.categoryName ?? "")}`}
                      >
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{errand.name}</p>
                            {errand.categoryName && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{errand.categoryName}</p>
                            )}
                          </div>
                          <div className="ml-3 shrink-0">
                            <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-full">
                              Post
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {!isSearching && searchResult!.categories.length === 0 && searchResult!.errands.length === 0 && (
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Nothing found for "{submittedQuery}"</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Try different keywords or browse categories below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Idle State: Popular Categories ────────────────────────────────── */}
          {!hasResults && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-gray-400" /> Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.length > 0 ? categories.map((cat: any) => (
                  <Link key={cat.id} href={`/customer/post?category=${encodeURIComponent(cat.name)}`}>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all">
                      <p className="font-bold text-gray-900 dark:text-white">{cat.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {cat.taskCount > 0 ? `${cat.taskCount} errands` : "Browse"}
                      </p>
                    </div>
                  </Link>
                )) : (
                  // Skeleton placeholders
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                      <div className="h-3 w-14 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Idle State: Top Rated Providers ──────────────────────────────── */}
          {!hasResults && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Top Rated Nearby</h3>
              {loadingProviders ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  {topProviders?.length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                      No providers available yet.
                    </p>
                  )}
                  {topProviders?.map((p: any) => (
                    <div
                      key={p.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-sm"
                    >
                      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                        <img
                          src={p.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=7c3aed&color=fff`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{p.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{p.specialty}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="flex items-center gap-1 justify-end text-xs font-bold text-yellow-500 mb-1">
                          <Star size={12} fill="currentColor" />
                          {p.averageRating > 0 ? p.averageRating.toFixed(1) : "New"}
                          <span className="text-gray-300 dark:text-gray-600 font-normal">({p.reviewCount})</span>
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
