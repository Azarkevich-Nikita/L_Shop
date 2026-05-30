export interface ApiErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  hashed_password: string;
  created_at: string;
}

export type UserInfo = Pick<User, 'id' | 'name' | 'email' | 'phone' | 'created_at'>;

export interface UserInfoResponse {
  userInfo: UserInfo;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  created_from: string;
  is_stock: boolean;
  weight: number;
  created_date: string;
  property: string[];
  image_url: string[];
}

export type CatalogItem = Pick<Product, 'id' | 'title' | 'price' | 'image_url' | 'weight'>;

export type CreatedFromResponse = string[];

export interface Banner {
  id: number;
  image_url: string;
  link: string;
  title: string;
}

export interface BasketItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: number;
  weight: number;
}

export interface Basket {
  user_id: number;
  items: BasketItem[];
  deliveryPrice?: number;
  deliveryType?: 'pickup' | 'courier';
  postalCode?: string;
  address?: string;
}

export interface TotalPriceResponse {
  total: number;
}

export interface ProductIdRequest {
  productId: number;
}

export interface DeliveryRequest {
  type: 'pickup' | 'courier';
  postalCode?: string;
  address?: string;
}

export interface BuyRequest {
  address: string;
  phone: string;
  email: string;
  changeFrom: number | null;
}
