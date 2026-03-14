"use client";

import { useEffect, useState } from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import { getMakers } from "@/lib/api";
import { useFilterStore } from "@/lib/store";

export default function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useFilterStore();
  const [makers, setMakers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getMakers().then(setMakers).catch(() => {});
  }, []);

  const hasActiveFilters = !!(
    filters.maker ||
    filters.year_min ||
    filters.year_max ||
    filters.price_min ||
    filters.price_max ||
    filters.mileage_max ||
    filters.transmission ||
    filters.search
  );

  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Search</label>
        <input
          type="text"
          placeholder="Model, maker..."
          value={filters.search || ""}
          onChange={(e) => setFilter("search", e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Maker */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Maker</label>
        <select
          value={filters.maker || ""}
          onChange={(e) => setFilter("maker", e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
        >
          <option value="">All makers</option>
          {makers.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Year range */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Year</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.year_min || ""}
            onChange={(e) => setFilter("year_min", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <input
            type="number"
            placeholder="To"
            value={filters.year_max || ""}
            onChange={(e) => setFilter("year_max", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Price (¥)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.price_min || ""}
            onChange={(e) => setFilter("price_min", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.price_max || ""}
            onChange={(e) => setFilter("price_max", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Mileage */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Max Mileage (km)</label>
        <input
          type="number"
          placeholder="e.g. 100000"
          value={filters.mileage_max || ""}
          onChange={(e) => setFilter("mileage_max", e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Transmission</label>
        <select
          value={filters.transmission || ""}
          onChange={(e) => setFilter("transmission", e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
        >
          <option value="">All</option>
          <option value="AT">AT</option>
          <option value="MT">MT</option>
          <option value="CVT">CVT</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Sort by</label>
        <select
          value={`${filters.sort_by || "created_at"}_${filters.sort_order || "desc"}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split("_");
            setFilter("sort_by", by);
            setFilter("sort_order", order as "asc" | "desc");
          }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
        >
          <option value="created_at_desc">Newest first</option>
          <option value="created_at_asc">Oldest first</option>
          <option value="total_price_yen_asc">Price: Low to High</option>
          <option value="total_price_yen_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest</option>
          <option value="year_asc">Year: Oldest</option>
          <option value="mileage_km_asc">Mileage: Low to High</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
      >
        <Filter className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
          {content}
        </div>
      </aside>
    </>
  );
}
