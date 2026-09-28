"use client";

import { AlertTriangle, Boxes, CircleCheck, DollarSign } from "lucide-react";

import { useDashboard } from "@/hooks/use-dashboard";

import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { StatusChart } from "@/components/dashboard/status-chart";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import type { DashboardRange } from "@/hooks/use-dashboard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function DashboardPage() {
  const [range, setRange] = useState<DashboardRange>("30d");

  const { data, isLoading, isError, refetch } = useDashboard(range);
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-4 text-center">
        <div>
          <h2 className="font-semibold">Unable to load dashboard</h2>

          <p className="text-sm text-muted-foreground">
            Something went wrong while loading the dashboard data.
          </p>
        </div>

        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <p className="text-sm text-muted-foreground">
          Overview of your product inventory.
        </p>
      </div>

      <Select
        value={range}
        onValueChange={(value) => {
          if (
            value === "7d" ||
            value === "30d" ||
            value === "90d" ||
            value === "all"
          ) {
            setRange(value);
          }
        }}
      >
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>

          <SelectItem value="30d">Last 30 days</SelectItem>

          <SelectItem value="90d">Last 90 days</SelectItem>

          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={data.metrics.totalProducts}
          description="Products in your catalog"
          icon={Boxes}
        />

        <StatCard
          title="Active Products"
          value={data.metrics.activeProducts}
          description="Currently active"
          icon={CircleCheck}
        />

        <StatCard
          title="Inventory Value"
          value={`$${data.metrics.inventoryValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          description="Total inventory value"
          icon={DollarSign}
        />

        <StatCard
          title="Low Stock"
          value={data.metrics.lowStockProducts}
          description="10 units or fewer"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart data={data.categories} />
        </div>

        <StatusChart data={data.statuses} />
      </div>
    </div>
  );
}
