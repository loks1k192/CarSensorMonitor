"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, DollarSign, Factory, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import CarCardSkeleton from "@/components/CarCardSkeleton";
import { getCars, getStats, isAuthenticated } from "@/lib/api";
import { Car as CarType, CarStats } from "@/lib/types";

function formatYen(yen: number): string {
  if (yen >= 10_000) {
    return `¥${(yen / 10_000).toFixed(0)}万`;
  }
  return `¥${yen.toLocaleString()}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<CarStats | null>(null);
  const [recentCars, setRecentCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    Promise.all([
      getStats(),
      getCars({ page: 1, per_page: 8, sort_by: "created_at", sort_order: "desc" }),
    ])
      .then(([statsData, carsData]) => {
        setStats(statsData);
        setRecentCars(carsData.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-50 rounded-lg">
                <Car className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Cars</p>
                {stats ? (
                  <p className="text-2xl font-bold text-gray-900">{stats.total_cars.toLocaleString()}</p>
                ) : (
                  <div className="h-8 w-20 skeleton mt-1" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Price</p>
                {stats ? (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatYen(stats.average_price_yen)}
                  </p>
                ) : (
                  <div className="h-8 w-24 skeleton mt-1" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 rounded-lg">
                <Factory className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Makers</p>
                {stats ? (
                  <p className="text-2xl font-bold text-gray-900">{stats.makers_count}</p>
                ) : (
                  <div className="h-8 w-12 skeleton mt-1" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent cars */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recently Added</h2>
          <button
            onClick={() => router.push("/cars")}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : recentCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Loader2 className="h-8 w-8 text-gray-300 mx-auto mb-3 animate-spin" />
            <p className="text-gray-500">Scraping in progress... Cars will appear shortly.</p>
          </div>
        )}
      </main>
    </div>
  );
}
