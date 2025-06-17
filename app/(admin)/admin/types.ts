export interface ApiError extends Error {
  status?: number;
}

export interface ProductVariantResponse {
  id: string;
  name: string;
  stock: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  category?: {
    id: string;
    name: string;
  };
  variant?: ProductVariantResponse[];
  createdAt: string;
  _count?: {
    products: number;
  };
}

export interface CategoryResponse {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    products: number;
  };
}
