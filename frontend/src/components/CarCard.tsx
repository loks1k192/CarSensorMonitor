"use client";

import { Car } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Calendar, Gauge, Fuel, MapPin } from "lucide-react";

function formatPrice(yen: number | null): string {
  if (yen === null) return "Price TBD";
  if (yen >= 10_000) {
    return `¥${(yen / 10_000).toFixed(1)}万`;
  }
  return `¥${yen.toLocaleString()}`;
}

function formatMileage(km: number | null): string {
  if (km === null) return "N/A";
  if (km >= 10_000) {
    return `${(km / 10_000).toFixed(1)}万km`;
  }
  return `${km.toLocaleString()}km`;
}

export default function CarCard({ car }: { car: Car }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/cars/${car.id}`)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary-300 transition-all duration-200 group"
    >
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={`${car.maker} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Fuel className="h-12 w-12" />
          </div>
        )}
        {car.body_type && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {car.body_type}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{car.maker}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
          {car.model}
        </h3>

        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(car.total_price_yen)}
          </span>
          {car.body_price_yen && car.body_price_yen !== car.total_price_yen && (
            <span className="text-xs text-gray-400">
              (body: {formatPrice(car.body_price_yen)})
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          {car.year && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              {car.year}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5 text-gray-400" />
            {formatMileage(car.mileage_km)}
          </div>
          {car.transmission && (
            <div className="flex items-center gap-1">
              <Fuel className="h-3.5 w-3.5 text-gray-400" />
              {car.transmission}
            </div>
          )}
          {car.dealer_location && (
            <div className="flex items-center gap-1 truncate">
              <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{car.dealer_location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
