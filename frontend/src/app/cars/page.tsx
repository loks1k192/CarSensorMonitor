"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import CarCardSkeleton from "@/components/CarCardSkeleton";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import { getCars, isAuthenticated } from "@/lib/api";
import { useFilterStore } from "@/lib/store";
import { Car } from "@/lib/types";
import { SearchX } from "lucide-react";

export default function CarsPage() {
  const router = useRouter();
  const { filters, setPage } = useFilterStore();
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    setLoading(true);
    getCars(filters)
      .then((data) => {
        setCars(data.items);
        setTotal(data.total);
        setPages(data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <FilterSidebar />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                Cars {!loading && <span className="text-gray-400 font-normal text-base">({total})</span>}
              </h1>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                <Pagination
                  page={filters.page || 1}
                  pages={pages}
                  total={total}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <SearchX className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No cars found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
