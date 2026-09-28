"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardChartProps {
  data: {
    category: string;
    products: number;
    stock: number;
  }[];
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products by Category</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No product data for this period.
            </p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="products"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
