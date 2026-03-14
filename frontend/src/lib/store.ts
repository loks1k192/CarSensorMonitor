import { create } from "zustand";
import { CarFilters } from "./types";

interface FilterStore {
  filters: CarFilters;
  setFilter: (key: keyof CarFilters, value: string | number | undefined) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

const DEFAULT_FILTERS: CarFilters = {
  page: 1,
  per_page: 20,
  sort_by: "created_at",
  sort_order: "desc",
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value || undefined,
        page: key === "page" ? (value as number) : 1,
      },
    })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
  setPage: (page) =>
    set((state) => ({ filters: { ...state.filters, page } })),
}));
