export interface DashboardData {
  metrics: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    inventoryValue: number;
  };

  categories: {
    category: string;
    products: number;
    stock: number;
  }[];

  statuses: {
    status: string;
    count: number;
  }[];
}
