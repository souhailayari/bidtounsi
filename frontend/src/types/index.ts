export type UserType = 'vendeur' | 'acheteur' | 'admin';

export interface CreateUserRequest {
  companyName: string;
  email: string;
  phone: string;
  userType: Exclude<UserType, 'admin'>;
}

export interface User {
  id: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
  userType: UserType;
  profilePhoto?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  title: string;
  description: string;
  vehicleType: 'voiture' | 'utilitaire' | 'camion';
  startingPrice: number;
  currentHighestBid?: number;
  images: string[];
  sellerId: string;
  sellerName: string;
  status: 'active' | 'ended' | 'sold';
  endDate: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  vehicleId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}