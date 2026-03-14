"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Fuel,
  MapPin,
  Cog,
  Paintbrush,
  Shield,
  Store,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCarById, isAuthenticated } from "@/lib/api";
import { CarDetail } from "@/lib/types";

function formatPrice(yen: number | null): string {
  if (yen === null) return "N/A";
  return `¥${yen.toLocaleString()}`;
}

function formatMileage(km: number | null): string {
  if (km === null) return "N/A";
  return `${km.toLocaleString()} km`;
}

export default function CarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const id = params.id as string;
    getCarById(id)
      .then(setCar)
      .catch(() => router.push("/cars"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (!car) return null;

  const specs = [
    { icon: Calendar, label: "Year", value: car.year?.toString() },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage_km) },
    { icon: Cog, label: "Engine", value: car.displacement_cc ? `${car.displacement_cc}cc` : null },
    { icon: Fuel, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
    { icon: Cog, label: "Drive Type", value: car.drive_type },
    { icon: Paintbrush, label: "Color", value: car.color || car.color_ja },
    { icon: Shield, label: "Inspection", value: car.inspection_expiry },
    { icon: Shield, label: "Repair History", value: car.repair_history },
    { icon: Cog, label: "Body Type", value: car.body_type },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to list
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {car.image_url ? (
              <img
                src={car.image_url}
                alt={`${car.maker} ${car.model}`}
                className="w-full aspect-[4/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <Fuel className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-primary-600 font-medium">{car.maker}</p>
              <h1 className="text-xl font-bold text-gray-900 mt-1">{car.model}</h1>
              {car.grade && <p className="text-sm text-gray-500 mt-1">{car.grade}</p>}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(car.total_price_yen)}
                  </span>
                  <span className="text-sm text-gray-400">total</span>
                </div>
                {car.body_price_yen && (
                  <p className="text-sm text-gray-500 mt-1">
                    Body price: {formatPrice(car.body_price_yen)}
                  </p>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-2.5">
                    <spec.icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">{spec.label}</p>
                      <p className="text-sm font-medium text-gray-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dealer info */}
        {(car.dealer_name || car.dealer_location) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Store className="h-4 w-4" /> Dealer
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              {car.dealer_name && (
                <p className="text-sm text-gray-700 font-medium">{car.dealer_name}</p>
              )}
              {car.dealer_location && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {car.dealer_location}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Price history */}
        {car.price_history.length > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h2 className="font-semibold text-gray-900 mb-4">Price History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">Date</th>
                    <th className="text-right py-2 text-gray-500 font-medium">Total Price</th>
                    <th className="text-right py-2 text-gray-500 font-medium">Body Price</th>
                  </tr>
                </thead>
                <tbody>
                  {car.price_history.map((ph, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 text-gray-700">
                        {new Date(ph.recorded_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-right text-gray-900 font-medium">
                        {formatPrice(ph.total_price_yen)}
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        {formatPrice(ph.body_price_yen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CarSensor link */}
        {car.detail_url && (
          <div className="mt-6 text-center">
            <a
              href={car.detail_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View on CarSensor <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
