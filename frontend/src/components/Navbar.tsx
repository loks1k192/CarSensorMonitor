"use client";

import { useRouter, usePathname } from "next/navigation";
import { Car, LogOut, LayoutDashboard } from "lucide-react";
import { logout, isAuthenticated } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, [pathname]);

  if (!authed) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary-600" />
            <span
              className="text-lg font-bold text-gray-900 cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              CarSensor Monitor
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => router.push("/dashboard")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 inline-block mr-1.5" />
              Dashboard
            </button>
            <button
              onClick={() => router.push("/cars")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/cars")
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Car className="h-4 w-4 inline-block mr-1.5" />
              Cars
            </button>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden border-t border-gray-100 px-4 py-2 flex gap-2">
        <button
          onClick={() => router.push("/dashboard")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-center ${
            pathname === "/dashboard"
              ? "bg-primary-50 text-primary-700"
              : "text-gray-600"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push("/cars")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-center ${
            pathname.startsWith("/cars")
              ? "bg-primary-50 text-primary-700"
              : "text-gray-600"
          }`}
        >
          Cars
        </button>
      </div>
    </nav>
  );
}
