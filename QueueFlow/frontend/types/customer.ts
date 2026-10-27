export type CustomerStatus = "active" | "inactive" | "suspended";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
  createdAt: string;
}

export interface CustomersResponse {
  data: Customer[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
