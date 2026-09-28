"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

export function StatusChart({ data }: StatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No status data for this period.
            </p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
