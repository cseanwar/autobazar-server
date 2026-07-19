export interface CarItem {
  _id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  images: string[];
  make: string;
  model: string;
  year: number;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  mileage: number;
  transmission: "manual" | "automatic";
  condition: "new" | "used";
  color: string;
  location: string;
  sellerId: string;
  status: "available" | "sold" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export interface AIGenerateDescriptionInput {
  make: string;
  model: string;
  year: number;
  condition: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  features?: string[];
  tone: "professional" | "enthusiast" | "luxury";
  length: "short" | "medium" | "long";
}

export interface AIAnalysisInput {
  data: Record<string, unknown>[];
  analysisType: "trend" | "summary" | "kpi";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
