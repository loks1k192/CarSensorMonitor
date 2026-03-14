export interface Car {
  id: string;
  carsensor_id: string;
  maker: string;
  maker_ja: string | null;
  model: string;
  model_ja: string | null;
  grade: string | null;
  body_type: string | null;
  year: number | null;
  mileage_km: number | null;
  total_price_yen: number | null;
  body_price_yen: number | null;
  displacement_cc: number | null;
  transmission: string | null;
  fuel_type: string | null;
  drive_type: string | null;
  color: string | null;
  color_ja: string | null;
  inspection_expiry: string | null;
  repair_history: string | null;
  dealer_name: string | null;
  dealer_location: string | null;
  image_url: string | null;
  detail_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  total_price_yen: number | null;
  body_price_yen: number | null;
  recorded_at: string;
}

export interface CarDetail extends Car {
  price_history: PriceHistory[];
}

export interface CarListResponse {
  items: Car[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface CarFilters {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  maker?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  transmission?: string;
  body_type?: string;
  search?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface CarStats {
  total_cars: number;
  average_price_yen: number;
  makers_count: number;
}
