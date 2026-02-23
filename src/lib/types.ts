export type UserRole = "customer" | "restaurant" | "courier" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine?: string | null;
  rating?: number | null;
  deliveryFee?: number | null;
  etaMinutes?: number | null;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  price: number;
  available?: boolean;
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
};

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "placed"
  | "accepted_by_restaurant"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus;
  restaurantId: string;
  customerId: string;
  items: Array<{ menuItemId: string; name: string; price: number; quantity: number }>;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type NotificationMessage = {
  id: string;
  type: "order_status" | "system" | "chat";
  title: string;
  body: string;
  createdAt: string;
  orderId?: string;
};
