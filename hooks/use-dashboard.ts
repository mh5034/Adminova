"use client";

import { useQuery } from "@tanstack/react-query";

import type { DashboardData } from "@/types/dashboard";

export type DashboardRange = "7d" | "30d" | "90d" | "all";

export function useDashboard(range: DashboardRange) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", range],

    queryFn: async () => {
      const response = await fetch(`/api/dashboard?range=${range}`);

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
      }

      return response.json();
    },
  });
}
